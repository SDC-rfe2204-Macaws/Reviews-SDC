const express = require('express');
const path = require('path');
const { reviews, helpful, report, insert } = require('./route.js');


const app = express();
var port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

app.get('/reviews', reviews);
app.put('/reviews/*/helpful', helpful);
app.put('/reviews/*/report', report);
app.post('/reviews', insert);

console.log("Listening on PORT: ", port);
app.listen(port);
