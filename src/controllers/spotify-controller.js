import SpotifyWebApi from "spotify-web-api-node"
import Http500Error from "../errors/http-500-error.js"
import HttpError from "../errors/http-error.js"
import { SpotifyDaoSingleton } from "../database/dao/spotify-dao.js"

const spotifyDao = SpotifyDaoSingleton.getInstance()

export const status = async (req, res, next) => {
    try {
        const { clientId, clientSecret, redirectUrl, refreshToken } = await spotifyDao.getConfig()

        const status = (clientId && clientSecret && redirectUrl && refreshToken) ? true : false

        res.json({ status, clientId, clientSecret, redirectUrl })

    } catch (error) {
        console.error('[ERROR][spotify-controller.status]', error)
        return next(new Http500Error(error))
    }
}

export const setSecrets = async (req, res, next) => {
    try {
        const { clientId, clientSecret, redirectUrl } = req.body

        await spotifyDao.putApiConfig(clientId, clientSecret, redirectUrl)

        res.json({ redirectUrl, clientId, clientSecret, redirectUrl })

    } catch (error) {
        console.error('[ERROR][spotify-controller.setSecrets]', error)
        return next(new Http500Error(error))
    }
}

export const login = async (req, res, next) => {
    try {
        const { code } = req.body

        const { clientId, clientSecret, redirectUrl } = await spotifyDao.getConfig()

        if (!clientId || !clientSecret) {
            return next(new HttpError(404, 'ClientId or ClientSecret not found'))
        }

        const spotyClient = new SpotifyWebApi({ clientId, clientSecret, redirectUri: redirectUrl })

        const authData = await spotyClient.authorizationCodeGrant(code)

        const { refresh_token, expires_in } = authData.body

        await spotifyDao.putRefreshToken(refresh_token)

        res.json({ refresh_token, expires_in })

    } catch (error) {
        console.error('[ERROR][spotify-controller.login]', error)
        return next(new Http500Error(error))
    }
}