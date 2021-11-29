import { SpotifyDaoSingleton } from '../database/dao/spotify-dao.js';
import LatestReleaseDao from './../database/dao/latest-release-dao.js';
import { sendNotification } from './alertzy.js';

const spotifyDao = SpotifyDaoSingleton.getInstance()
const latestReleaseDao = new LatestReleaseDao()

export const checkNewReleases = async () => {
    try {
        // El token dura 1h, seguramente este caducado entre checks
        await spotifyDao.refreshAccessToken()

        // Recuperamos todos los artistas seguidos de spotify
        const myArtists = await spotifyDao.getMyArtists()

        let skippedReleasesCount = 0

        // Comprobamos los artistas que tienen nuevos lanzamientos
        const artistsWithNewReleases = []
        for (const artist of myArtists) {
            const {name: latestReleaseName, releaseDate: latestReleaseDateOnSpotify} = await spotifyDao.getLatestReleaseDateFromArtist(artist.id)
            const latestReleaseDateChecked = await latestReleaseDao.getLatestRelease(artist.id)

            if (!latestReleaseDateChecked || latestReleaseDateOnSpotify.isAfter(latestReleaseDateChecked)) {
                await latestReleaseDao.putLatestRelease(artist.id, latestReleaseDateOnSpotify)
                if (latestReleaseDateChecked) {
                    artistsWithNewReleases.push(`${artist.name}: ${latestReleaseName}`)
                } else {
                    skippedReleasesCount++
                }
            }
        }

        console.log(`Found new releases for ${artistsWithNewReleases.length} artists, ${skippedReleasesCount} releases where skipped`);

        if (artistsWithNewReleases.length !== 0) {
            sendNotification(artistsWithNewReleases.join('\n'), `Notifyme Spotify: ${artistsWithNewReleases.length} new releases`)
        }

    } catch (error) {
        console.log('ERROR checknewreleases', error);
    }
}