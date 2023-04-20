const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');

const zoomApiKey = "OWY3qI3gSbWPgxIyyjxn_A";
const zoomApiSecret = "1BOJ9agAAmYVMsYr3eEFpbrCLdEEXlvHFdwZ";
const userId = 'programa.proexcelencia@gmail.com';
const oneDriveAccessToken = 'YOUR_ONEDRIVE_ACCESS_TOKEN';

const payload = {
    iss: zoomApiKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, zoomApiSecret);

async function listRecordings(from, to) {
    console.log(`+++++++++++++++++++ Listando grabaciones desde ${from} hasta ${to} +++++++++++++++++++`)
    const response = await axios.get(`https://api.zoom.us/v2/users/${userId}/recordings?from=${from}&to=${to}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.meetings;
}

async function downloadRecording(recording, topic) {
    try {
        console.log("Descargando: " + topic)
        const response = await axios.get(recording.download_url, {
            responseType: 'stream',
            timeout: 60000,// 60 seconds
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Descarga Finalizada de: " + topic)

        const folder = 'videos';
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        const writer = fs.createWriteStream(`${folder}/${topic}.mp4`);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const stats = fs.statSync(`${folder}/${topic}.mp4`);
        if (stats.size !== recording.file_size) {
            console.error(`Downloaded file size does not match expected size for recording ${recording.id}`);
            // retry download
            await downloadRecording(recording, topic);
        }

    } catch (error) {
        console.error(`Error downloading recording ${recording.id}: ${error.message}`);
        // retry download
        await downloadRecording(recording, topic);
    }
}


async function uploadToOneDrive(filePath) {
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);
    const fileSize = fs.statSync(filePath).size;
    const response = await axios.put(`https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`, fileStream, {
        headers: {
            'Authorization': `Bearer ${oneDriveAccessToken}`,
            'Content-Length': fileSize
        }
    });
    return response.data;
}

async function main() {
    let from = new Date('2020-01-01');
    let to = new Date(from);
    to.setMonth(to.getMonth() + 1);
    while (from < new Date()) {
        const recordings = await listRecordings(from.toISOString().split('T')[0], to.toISOString().split('T')[0]);
        for (const recording of recordings) {
            for (const file of recording.recording_files) {
                if (file.file_type === 'MP4') {
                    const filePath = `videos/${recording.topic}.mp4`;
                    await downloadRecording(file, recording.topic);
                    // await deleteRecording(file.id);
                    // await uploadToOneDrive(filePath);
                }
            }
        }
        from.setMonth(from.getMonth() + 1);
        to.setMonth(to.getMonth() + 1);
    }
}
async function deleteRecording(recordingId) {
    await axios.delete(`https://api.zoom.us/v2/recordings/${recordingId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}


(async () => {
    await main()
})();