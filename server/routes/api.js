const express = require('express');
const router = express.Router();
const openai = require('../services/openai');

router.post('/ai/analyze', async (req, res) => {
  try{
    const { text } = req.body;
    const result = await openai.analyze(text);
    res.json(result);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'analysis_error' });
  }
});

module.exports = router;
