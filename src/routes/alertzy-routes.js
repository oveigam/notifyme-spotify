import { Router } from 'express'
import { getAccountKey, changeAccountKey } from '../controllers/alertzy-controller.js'

const alertzyRouter = Router()

alertzyRouter.get('/', getAccountKey)
alertzyRouter.post('/', changeAccountKey)

export default alertzyRouter