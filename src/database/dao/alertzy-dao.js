import DAO from "./dao.js";

class AlertzyDao extends DAO {

    constructor() {
        super()

        this.key = 'alertzyaccountkey'
    }

    async getAccountKey() {
        return await super.get(this.key)
    }

    async putAccountKey(value) {
        return await super.put(this.key, value)
    }

}

export default AlertzyDao