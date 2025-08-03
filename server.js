const express = require('express');
const app = express();
const PORT = 3000;

// Allow CORS so frontend can access this
const cors = require('cors');
app.use(cors());

app.use(express.json());

app.get('/weather', (req, res) => {
    const sampleData = {
        city: 'Chennai',
        temperature: 32,
        description: 'Sunny'
    };
    res.json(sampleData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
