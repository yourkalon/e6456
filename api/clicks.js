import axios from 'axios';

const API_KEY = 'sk_tzIuIbEx726kD8uL'; // 🔑 Server-side only

export default async function handler(req, res) {
  const { linkId } = req.query;
  if (!linkId) return res.status(400).json({ error: 'Missing linkId' });

  try {
    const response = await axios.get(`https://api-v2.short.io/statistics/link/${linkId}`, {
      params: { period: 'total' },
      headers: { accept: '*/*', authorization: API_KEY }
    });

    const data = response.data;
    const humanClicks = data.humanClicks || 0;
    const countries = (data.country || []).map(c => ({ ...c, score: c.humanScore || c.score }));

    res.status(200).json({ humanClicks, countries });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}
