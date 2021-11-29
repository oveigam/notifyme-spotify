import  level from'level'
const db = level('./data')

class DAO {

    async get(key) {
        try {
            const value = await db.get(key)
            return value
        } catch (error) {
            return undefined
        }
    }

    async put(key, value) {
        await db.put(key, value)
    }

    async delete(key) {
        await db.del(key)
    }

}

export default DAO