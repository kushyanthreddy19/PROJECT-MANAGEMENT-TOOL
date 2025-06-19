const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'; // Endpoint
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function generateUserStories(projectDescription) {
  try {
    const prompt = `Generate 3 user stories in this format: 
As a [role], I want to [action], so that [benefit].
Project details: ${projectDescription}`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192', // Groq model
        messages: [
          { role: 'system', content: 'You are a helpful product manager.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;

    // Split by line and filter for user stories
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.toLowerCase().startsWith('as a'));
  } catch (error) {
    console.error('❌ Error calling Groq API:', error.response?.data || error.message);
    throw new Error('Groq API failed');
  }
}

module.exports = { generateUserStories };
