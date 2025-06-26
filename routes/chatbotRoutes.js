import express from 'express';
import axios from 'axios';

const router = express.Router();

const systemPrompt = `
You are the official AI assistant for Tagad Platforms LLP.
Only answer questions using the information below. If you do not know the answer from this information, respond with: "I'm sorry, I can only answer questions about Tagad Platforms LLP and its services."
---
Company: Tagad Platforms LLP
About: We are a forward-thinking software technology company dedicated to transforming businesses through innovative digital solutions.
Services: Custom Software, Mobile Applications, Digital marketing, Erp Solutions, Saleforce, E commerce Development, Buisness Softwares.
Core Values: Innovation, Security, Reliability, Passion.
Team: Aniket Baswade (CEO & Founder, Business Strategy & Leadership).
Vision: To be the global leader in software technology services, recognized for innovation, quality, and commitment to client success and serve to 1 billion people daily.
Experience: 2025 Build year, 100% success projects, 3 core members.
---
Remember: If the answer is not in the information above, say: "I'm sorry, I can only answer questions about Tagad Platforms LLP and its services."
`;

router.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('DeepSeek error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
});

export default router;
