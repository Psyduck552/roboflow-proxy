const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.text({ type: "*/*" })); // Accepts raw base64

const PORT = process.env.PORT || 3001;

app.post('/analyse', async (req, res) => {
    const roboflowUrl = `https://serverless.roboflow.com/mould-project-new-9emon/1?api_key=${process.env.ROBOFLOW_API_KEY}&confidence=0.3&overlap=0.2`;

    try {
        const rfRes = await fetch(roboflowUrl, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: req.body
        });

        const result = await rfRes.json();
        res.json(result);
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Failed to fetch from Roboflow." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
