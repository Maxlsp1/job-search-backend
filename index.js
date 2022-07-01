const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const app = express();
const db = require('./src/models/index');
const cors = require('cors');
const authRoute = require("./src/routes/user");

try {
  app.use(cors())
  app.use(bodyParser.json());

  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  db.sequelize.sync();

  app.get('/', (req, res) => {
    res.json({'message': 'ok'});
  });

  app.use('/auth', authRoute);

  /* Error handler middleware */
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
    
    return;
  });

  // const server = https.createServer({
  //   key: fs.readFileSync('./cert/192.168.0.34+1-key.pem'),
  //   cert: fs.readFileSync('./cert/192.168.0.34+1.pem')
  // }, app);

  // server.listen(8000);

  app.listen(8000, '127.0.0.1', () =>{
    console.log('api listenning at http://127.0.0.1:8000')
})
  
} catch (error) {
  console.log('error : ', error);
}