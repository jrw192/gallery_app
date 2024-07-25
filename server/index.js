require('dotenv').config();
const express = require('express');
const app = express();

const galleryService = require('./gallery_service');
const s3Service = require('./s3_service.ts');

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});


// user api
app.get('/', (req, res) => {
  galleryService.getUsers()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.get('/names', (req, res) => {
  galleryService.getUserNames()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  galleryService.getUserByName(id)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.post('/users', (req, res) => {
  galleryService.createUser(req.body)
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
    console.log('response: ', response);
    res.status(200).send(response);
  })
  .catch((err) => {
    console.log('err: ', err);
    res.status(500).send(err);
  })
});

app.listen(5000, () => console.log('Server running on port 5000'));