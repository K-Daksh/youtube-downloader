const express = require('express');
const ytdlp = require('ytdlp-nodejs');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');

const app = express();
const PORT = 4567; // Use a less common port

async function downloadVideo(url, quality = "1080p", filter = "mergevideo", name = "downloaded_video") {
    try {
        const outputDir = path.join(__dirname);

        // Ensure the downloads directory exists
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir);
        }

        return new Promise((resolve, reject) => {
            ytdlp.download(url, {
                filter: filter,
                quality: quality,
                output: {
                    fileName: `${name}.mp4`,
                    outDir: outputDir,
                },
            })
                .on("error", (data) => {
                    reject({ status: false, message: data });
                })
                .on("finished", () => {
                    resolve({ status: true, message: `Video downloaded successfully as ${name}.mp4` });
                });
        });
    } catch (error) {
        return { status: false, message: error.message };
    }
}


app.get('/download', async (req, res) => {
    const { url, quality, filter, name } = req.query;

    if (!url) {
        return res.status(400).json({ status: false, message: "URL is required" });
    }

    try {
        const result = await downloadVideo(url, quality, filter, name);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
