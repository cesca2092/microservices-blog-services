const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};


app.post('/posts/create', async (req, res) => {
  try {
    const { title } = req.body;
    const id = randomBytes(4).toString('hex');

    posts[id] = {
      id, title
    };

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: { id, title }
    })

    res.status(201).send(posts[id]);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }

});

app.post('/events', (req, res) => {
  console.log("Received event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("v55");
  console.log("Listening on 4000");
});