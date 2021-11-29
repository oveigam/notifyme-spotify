import axios from 'axios'
import FormData from 'form-data'

import AlertzyDao from '../database/dao/alertzy-dao.js'

const alertzyDao = new AlertzyDao()

export const sendNotification = async (msg, title) => {

    const accountKey = await alertzyDao.getAccountKey()

    const formData = new FormData()
    formData.append("accountKey", accountKey)
    formData.append("title", title)
    formData.append("message", msg.length > 2000 ? msg.substr(0, 2000) : msg);

    const { data } = await axios.post('https://alertzy.app/send', formData, { headers: formData.getHeaders() })

    console.log('Notification sent, status:', data.response);
}