const express = require('express');
const bodyParser = require('body-parser');
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

  app.listen(8000, 'localhost', () =>{
    console.log('api listenning at http://localhost:8000')
})
  
} catch (error) {
  console.log('error : ', error);
}