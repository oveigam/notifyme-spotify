import AlertzyDao from "../database/dao/alertzy-dao.js"
import Http500Error from "../errors/http-500-error.js"

const alertzyDao = new AlertzyDao()

export const getAccountKey = async (req, res, next) => {
    try {
        const accountKey = await alertzyDao.getAccountKey()

        res.json({ accountKey })
    } catch (error) {
        console.error('[ERROR][alertzy-controller.getAccountKey]', error)
        return next(new Http500Error(error))
    }
}

export const changeAccountKey = async (req, res, next) => {
    try {
        const { accountKey } = req.body

        await alertzyDao.putAccountKey(accountKey)

        res.json({ accountKey })

    } catch (error) {
        console.error('[ERROR][alertzy-controller.changeAccountKey]', error)
        return next(new Http500Error(error))
    }
}