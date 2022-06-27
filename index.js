const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const authRoute = require("./src/routes/user");

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/auth', authRoute);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

app.listen(8080, '127.0.0.1', () =>{
    console.log('api listenning at http://localhost:8000')
})