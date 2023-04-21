
const main = async () => {
    let fromWhitNoFormat = new Date('2020-01-01');
    let toWhitNoFormat = new Date(fromWhitNoFormat);
    to.setMonth(to.getMonth() + 1);

    const now = new Date();

    while (from < now) {
        const from = fromWhitNoFormat.toISOString().split('T')[0]
        const to = toWhitNoFormat.toISOString().split('T')[0]

        const recordings = await listRecordings('2023-04-01', '2023-05-01', false);
        if (recordings.length === 0) {
            console.log(YELLOW_LOG_COLOR, `+++++++++++++++++++ No se encontraron grabaciones en el rango +++++++++++++++++++ \n`)
        }
        else {
            console.log(CYAN_LOG_COLOR, `+++++++++++++++++++ Se encontraron ${recordings.length} grabaciones en el rango +++++++++++++++++++ \n`)
            return;
        }

        recordings.forEach(recording = async () => {
            const files = recording.recording_files
            const name = recording.topic
            const fileType = file.file_type;

            if (files.length === 0) {
                console.log(YELLOW_LOG_COLOR, `+++++++++++++++++++ No se encontraron archivos en ${name} +++++++++++++++++++ \n`)
            }
            else {
                if (fileType === 'MP4') {
                    await downloadRecording(file, recording.topic);
                    const filePath = `videos/${recording.topic}.mp4`;
                    await uploadToOneDrive(filePath);
                }
            }
            // const filesInSys = fs.readdirSync("videos");
            // const fileNames = filesInSys.map(file => path.parse(file).name)        
            // if (fileNames.includes(recording.topic)) {
            // }
            // else{
            //     console.log("No se pudo descargar el archivo")
            // }
            await deleteRecording(recording.uuid);

        })
        //add 1 month to "to" and "from" to start 
        from.setMonth(from.getMonth() + 1);
        to.setMonth(to.getMonth() + 1);

    }
}

(async () => {
    await main()
})();