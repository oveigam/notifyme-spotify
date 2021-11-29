import cron from 'node-cron'
import dayjs from 'dayjs';

let scheduledJob

export const startJob = (expression, job) => {
    if (scheduledJob) {
        scheduledJob.stop()
        console.log('Previous schduled job was stopped');
    }

    scheduledJob = cron.schedule(expression, async () => {
        console.log('Starting scheduled job', dayjs().format('YYYY-MM-DD HH:mm:ss'));
        await job()
        console.log('Scheduled job finished', dayjs().format('YYYY-MM-DD HH:mm:ss'));
    })

    console.log('Scheduled job for cron expression', expression);
}