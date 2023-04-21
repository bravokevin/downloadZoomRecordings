const jwt = require('jsonwebtoken');
const axios = require('axios');

const ZOOM_API_KEY = "OWY3qI3gSbWPgxIyyjxn_A";
const ZOOM_API_SECRET = "1BOJ9agAAmYVMsYr3eEFpbrCLdEEXlvHFdwZ";
const USER_ID = 'programa.proexcelencia@gmail.com';

const payload = {
    iss: ZOOM_API_KEY,
    exp: ((new Date()).getTime() + 5000)
};

const ZOOM_ACCESS_TOKEN = jwt.sign(payload, ZOOM_API_SECRET);

// Ten minute timeout
const DOWNLOAD_TIMEOUT = 600000

const deleteRecording = async (recordingId, recordingName) => {
    console.log(`Borrando grabacion: ${recordingName} de la nube de zoom...`)
    try {
        await axios.delete(`https://api.zoom.us/v2/meetings/${recordingId}/recordings?action=delete`, {
            headers: {
                'Authorization': `Bearer ${ZOOM_ACCESS_TOKEN}`
            }
        });
        console.log(`Grabacion: ${recordingName} borrada de la nube de zoom...`)
    }
    catch (error) {
        console.log(`Problema al borrar la grabacion: ${error.message}`)
    }
}

const listRecordings = async (from, to, listTrash) => {
    console.log(CYAN_LOG_COLOR, `+++++++++++++++++++ Listando grabaciones desde ${from} hasta ${to} +++++++++++++++++++`)
    try {
        const response = await axios.get(`https://api.zoom.us/v2/users/${USER_ID}/recordings?from=${from}&to=${to}&trash=${listTrash}`, {
            headers: {
                'Authorization': `Bearer ${ZOOM_ACCESS_TOKEN}`
            }
        });
        if (response.status === 404) {
            console.log(RED_LOG_COLOR, `Error - codigo 404, meeting no encontrado  \n`)
        }
        else if (response.status === 200) {
            return response.data.meetings;
        }
    }
    catch (e) {
        console.log(RED_LOG_COLOR, `Ocurrio un error inesperado - ${e}\n`)
    }
}


const downloadRecording = async (url, topic) => {
    try {
        console.log(CYAN_LOG_COLOR, `Descargando: ${topic} \n`)
        const response = await axios.get(url, {
            responseType: 'stream',
            timeout: DOWNLOAD_TIMEOUT,
            headers: {
                'Authorization': `Bearer ${ZOOM_ACCESS_TOKEN}`
            }
        });
        console.log(GREEN_LOG_COLOR, `Grabacion: ${topic} descargada exitosamente \n`)
        return response;

    }
    catch (e) {
        console.error(`Error descargando la grabacion: ${topic} - ${e.message}`);
    }
}
