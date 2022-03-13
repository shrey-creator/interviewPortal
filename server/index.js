const express = require('express')
const firebase=require('../config');
const app = express()
const port = 3000
const path = require('path');

app.use(express.static('client'));
app.get('/', (req, res) => {
// // var path=
//   console.log();
//    res.sendFile(path.join(__dirname, '../client/index.html'));
// res.send("hello")
});

app.listen(process.env.PORT||3000, () => {
  console.log(`Example app listening on port ${port}`)
});