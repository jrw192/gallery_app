require('dotenv').config();
const express = require('express');
const app = express();

const galleryModel = require('./galleryModel');

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/', (req, res) => {
  galleryModel.getUsers()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.get('/names', (req, res) => {
  galleryModel.getUserNames()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  galleryModel.getUserByName(id)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(error);
  })
})

app.post('/users', (req, res) => {
  galleryModel.createUser(req.body)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((err) => {
    res.status(500).send(err);
  })
})

app.listen(5000, () => console.log('Server running on port 5000'));