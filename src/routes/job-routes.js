import { Router } from 'express'
import { getCronJob, changeCronJob } from '../controllers/job-controller.js'

const jobRouter = Router()

jobRouter.get('/', getCronJob)
jobRouter.post('/', changeCronJob)

export default jobRouter