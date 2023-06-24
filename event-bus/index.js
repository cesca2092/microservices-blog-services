const express = require('express');
// const cors = require('cors');
const { randomBytes } = require('crypto');
const { default: axios } = require('axios');

const app = express();
// app.use(cors());
app.use(express.json());

const events = [];

app.get('/events', (req, res) => {
  res.send(events);
});

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);
  axios.post('http://posts-clusterip-srv:4000/events', event).catch(e => console.log('Error en servicio Posts'));
  axios.post('http://comments-srv:4001/events', event).catch(e => console.log('Error en servicio Comments'));
  axios.post('http://query-srv:4002/events', event).catch(e => console.log('Error en servicio Query'));
  axios.post('http://moderation-srv:4003/events', event).catch(e => console.log('Error en servicio Moderation'));

  res.send({ status: 'ok' });

});

app.listen(4005, () => {
  console.log("Listening on 4005");
});