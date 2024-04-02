const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/completions', async (req, res) => {
    try {
        const fetch = await import('node-fetch');

        const messages = req.body.history.map(message => ({ role: message.role, content: message.content }));
        messages.push({ role: "user", content: req.body.message });

        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`, // Use OPENAI_API_KEY here
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4-1106-preview",
                messages: messages,
                max_tokens: 2000,
            })
        };

        const response = await fetch.default('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;

        const fetch = await import('node-fetch');
        
        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`, // Use OPENAI_API_KEY here
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                model: "dall-e-3"
            })
        };

        const response = await fetch.default('https://api.openai.com/v1/images/generations', options);
        const data = await response.json();
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error generating DALL·E 3 image:', error);
        res.status(500).send({ error: 'Internal Server Error with Image Generation' });
    }
});

app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT)); 









