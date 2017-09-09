const express         = require('express');
const lodash          = require('lodash');
const app             = express();
const PORT            = 3001

app.use(express.static('public'));

app.listen(PORT, ()=>console.log('Movie app listening on port', PORT));
