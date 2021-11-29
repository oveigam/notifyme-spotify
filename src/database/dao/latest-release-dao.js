import dayjs from "dayjs";

import DAO from "./dao.js";

class LatestReleaseDao extends DAO {

    constructor() {
        super()
    }

    async getLatestRelease(artistId) {
        const date = await this.get(artistId)
        return date ? dayjs(date) : undefined
    }

    async putLatestRelease(artistId, date) {
        return this.put(artistId, dayjs(date).format('YYYY-MM-DD'))
    }

}

export default LatestReleaseDao