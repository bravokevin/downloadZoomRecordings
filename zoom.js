const zoomAPI = require('zoom-api');
const fs = require('fs');
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPV1kzcUkzZ1NiV1BneEl5eWp4bl9BIiwiZXhwIjoxNjc3NTIwNzUzMzU0fQ.nzMjyOVNZHwObKuxA3d0lly7II968/lCHRu8qWu9RWI';

const api = new zoomAPI({ jwtToken });

async function downloadRecordings() {
    const meetings = await api.listMeetings();
    for (let meeting of meetings) {
        const recordings = await api.listRecordings(meeting.id);
        for (let recording of recordings) {
            const fileStream = fs.createWriteStream(`./${recording.id}.mp4`);
            await api.downloadRecording(recording.download_url, fileStream);
        }
    }
}

downloadRecordings();



