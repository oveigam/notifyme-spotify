import { Router } from 'express'
import { login, status, setSecrets } from '../controllers/spotify-controller.js'

const spotifyRouter = Router()

spotifyRouter.get('/', status)

spotifyRouter.post('/', setSecrets)

spotifyRouter.post('/login', login)

export default spotifyRouter