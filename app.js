const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// OpenAI Configuration
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.post('/generate', async (req, res) => {
  const topic = req.body.topic;
  try {
    const prompt = `Give me 3 unique startup ideas in the field of ${topic}. Present each idea with a name and a short description.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    const ideasText = response.choices[0].message.content;
    res.render('index', { ideas: ideasText });
  } catch (error) {
    console.error(error);
    res.render('index', { ideas: 'Error generating ideas. Try again.' });
  }
});

// Home Route
app.get('/', (req, res) => {
  res.render('index', { ideas: null });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

