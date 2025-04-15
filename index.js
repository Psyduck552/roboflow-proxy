const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.text({ type: "*/*" })); // Accept raw base64 string

app.post('/analyse', async (req, res) => {
    try {
        const base64Data = req.body;
        console.log("⬅️ Received base64 data, length:", base64Data.length);

        if (!base64Data || base64Data.length < 1000) {
            return res.status(400).json({ error: "Missing or invalid base64 image data." });
        }

        const roboflowUrl = `https://serverless.roboflow.com/mould-project-new-9emon/1?api_key=${process.env.ROBOFLOW_API_KEY}&confidence=0.3&overlap=0.2`;

        const roboflowRes = await fetch(roboflowUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: base64Data
        });

        const text = await roboflowRes.text();

        // Try to parse JSON, fallback to raw text if failed
        try {
            const json = JSON.parse(text);
            return res.json(json);
        } catch (e) {
            console.error("❌ Roboflow returned non-JSON:\n", text);
            return res.status(502).json({ error: "Unexpected response from Roboflow", raw: text });
        }

    } catch (error) {
        console.error("❌ Proxy error:", error);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
