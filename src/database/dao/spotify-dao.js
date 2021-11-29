import dayjs from "dayjs"
import SpotifyWebApi from "spotify-web-api-node"
import wait from "../../util/wait.js"
import DAO from "./dao.js"


class SpotifyDao extends DAO {

    constructor() {
        super()

        this.clientIdKey = 'spotifyclientid'
        this.clientSecretKey = 'spotifyclientsecret'
        this.redirectUrlKey = 'spotifyredirecturl'
        this.refreshTokenKey = 'spotifyrefreshtoken'

        this.api = new SpotifyWebApi()

        Promise.all([
            super.get(this.clientIdKey),
            super.get(this.clientSecretKey),
            super.get(this.redirectUrlKey),
            super.get(this.refreshTokenKey)
        ]).then(([clientId, clientSecret, redirectUrl, refreshToken]) => {
            this.api.setClientId(clientId)
            this.api.setClientSecret(clientSecret)
            this.api.setRedirectURI(redirectUrl)
            this.api.setRefreshToken(refreshToken)
        })
    }

    async getConfig() {
        const [clientId, clientSecret, redirectUrl, refreshToken] = await Promise.all([
            super.get(this.clientIdKey),
            super.get(this.clientSecretKey),
            super.get(this.redirectUrlKey),
            super.get(this.refreshTokenKey)
        ])
        return { clientId, clientSecret, redirectUrl, refreshToken }
    }

    async putApiConfig(clientId, clientSecret, redirectUrl) {
        this.api.setClientId(clientId)
        this.api.setClientSecret(clientSecret)
        this.api.setRedirectURI(redirectUrl)

        return await Promise.all([
            super.put(this.clientIdKey, clientId),
            super.put(this.clientSecretKey, clientSecret),
            super.put(this.redirectUrlKey, redirectUrl)
        ])
    }

    async putRefreshToken(refreshToken) {
        this.api.setRefreshToken(refreshToken)
        return await super.put(this.refreshTokenKey, refreshToken)
    }

    async refreshAccessToken() {
        const { body: { access_token } } = await this.api.refreshAccessToken()
        this.api.setAccessToken(access_token)
    }

    async getMyArtists() {
        const allArtists = []

        const { body: { artists: { items, total, cursors } } } = await this.api.getFollowedArtists({ limit: 50 })

        allArtists.push(...items.map(a => ({ id: a.id, name: a.name })))

        const totalArtists = total
        let after = cursors.after

        while (allArtists.length < totalArtists) {
            const { body: { artists: { items: items, cursors } } } = await this.api.getFollowedArtists({ limit: 50, after: after })

            allArtists.push(...items.map(a => ({ id: a.id, name: a.name })))

            after = cursors.after
        }

        return allArtists
    }

    async getLatestReleaseDateFromArtist(artistId) {
        try {
            const responses = await Promise.all([
                this.api.getArtistAlbums(artistId, { limit: 5, include_groups: 'album' }),
                this.api.getArtistAlbums(artistId, { limit: 5, include_groups: 'single' }),
                this.api.getArtistAlbums(artistId, { limit: 5, include_groups: 'appears_on' })
            ])

            let latestReleaseDate
            let latestReleaseName

            for (const res of responses) {
                for (const album of res.body.items) {
                    // Ignoro las recopilaciones
                    if (album.album_type === 'compilation') continue

                    // Si no esta disponible en mi mercardo lo ignoro
                    // TODO poner el mercado configurable a traves del cliente
                    if (!album.available_markets.includes('ES')) continue

                    // Comprobamos que el artista realmente este en el album (basicamente evitar la mierda de Various Artists)
                    let actuallyFromArtist = false
                    for (const artist of album.artists) {
                        if (artistId.includes(artist.id)) {
                            actuallyFromArtist = true
                            break
                        }
                    }
                    if (!actuallyFromArtist) continue

                    const albumReleaseDate = dayjs(album.release_date)
                    if (!latestReleaseDate || albumReleaseDate.isAfter(latestReleaseDate)) {
                        latestReleaseDate = albumReleaseDate
                        latestReleaseName = album.name
                    }
                }
            }

            return {
                name: latestReleaseName,
                releaseDate: latestReleaseDate || dayjs()
            }
        } catch (error) {
            if (error.statusCode === 429) {
                const retryAfter = Number(error.headers['retry-after'])
                await wait(retryAfter + 1)
                return this.getLatestReleaseDateFromArtist(artistId)
            } else {
                throw error
            }
        }
    }

}

export class SpotifyDaoSingleton {
    constructor() {
        throw new Error('Use SpotifyDaoFactory.getInstance()')
    }

    static getInstance() {
        if (!SpotifyDaoSingleton.instance) {
            SpotifyDaoSingleton.instance = new SpotifyDao()
        }
        return SpotifyDaoSingleton.instance;
    }
}

export default SpotifyDao