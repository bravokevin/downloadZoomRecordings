const fs = require('fs');
const path = require('path');


const writeInFileSys = async (file) => {
    const folder = 'videos';
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    try {
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
    }

    catch (e) {

    }

}
