import Http500Error from "../errors/http-500-error.js"
import CronJobDao from "../database/dao/cron-job-dao.js"
import { startJob } from "../util/scheduler.js"
import { checkNewReleases } from './../api/spotify.js';

const cronJobDao = new CronJobDao()

export const getCronJob = async (req, res, next) => {
    try {
        const cronjob = await cronJobDao.getCronJob()

        res.json({ cronjob })

    } catch (error) {
        console.error('[ERROR][job-controller.get]', error)
        return next(new Http500Error(error))
    }
}

export const changeCronJob = async (req, res, next) => {
    try {
        const { cronjob } = req.body

        await cronJobDao.putCronJob(cronjob)

        startJob(cronjob, checkNewReleases)

        res.json(cronjob)

    } catch (error) {
        console.error('[ERROR][job-controller.change]', error)
        return next(new Http500Error(error))
    }
}