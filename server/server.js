const express = require('express');
const path = require('path');
const app = express();
const api = require('./routes/api');

app.use(express.json());
app.use('/api', api);
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
