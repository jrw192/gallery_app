require('dotenv').config();
const express = require('express');
const app = express();

const userService = require('./user_service.js');
const s3Service = require('./s3_service.ts');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});


// user api
app.get('/', (req, res) => {
  userService.getUsers()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.get('/names', (req, res) => {
  userService.getUserNames()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  userService.getUserByName(id)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.post('/users', (req, res) => {
  userService.createUser(req.body)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(err);
  })
})


// image api
app.get('/images', async (req, res) => {
  s3Service.getAllImages()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(err);
  })
});

app.post('/saveimage/:id', (req, res) => {
  const id = req.params.id;
  s3Service.saveImage(id, req.body)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(err);
  })
});

app.listen(5000, () => console.log('Server running on port 5000'));