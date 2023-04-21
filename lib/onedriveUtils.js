const oneDriveAccessToken = 'YOUR_ONEDRIVE_ACCESS_TOKEN';

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
