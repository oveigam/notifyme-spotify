import DAO from "./dao.js";

class CronJobDao extends DAO {

    constructor() {
        super()

        this.key = 'cronjob'
    }

    async getCronJob() {
        return await super.get(this.key)
    }

    async putCronJob(value) {
        return await super.put(this.key, value)
    }

}

export default CronJobDao