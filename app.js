import express from 'express'
import cors from 'cors'

import handleUnknownRoute from './src/middleware/handleUnknownRoute.js'
import handleErrors from './src/middleware/error-handler.js'
import jobRouter from './src/routes/job-routes.js'
import spotifyRouter from './src/routes/spotify-routes.js'
import alertzyRouter from './src/routes/alertzy-routes.js'
import CronJobDao from './src/database/dao/cron-job-dao.js'
import { checkNewReleases } from './src/api/spotify.js';
import { startJob } from './src/util/scheduler.js'

const app = express()
app.setMaxListeners(0)
app.use(cors())
app.use(express.json())

app.use(express.static('public'))

// Rutas
app.use('/api/cronjob', jobRouter)
app.use('/api/spotify', spotifyRouter)
app.use('/api/alertzy', alertzyRouter)

// Servir la webapp
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

// Middlewares de rutas desconocidas y errores
app.use(handleUnknownRoute)
app.use(handleErrors)

app.listen(5000, async () => {
    console.log('Listening on port', 5000);
    const cronJob = await new CronJobDao().getCronJob()
    if (cronJob) {
        startJob(cronJob, checkNewReleases)
    }
})