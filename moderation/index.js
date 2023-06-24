const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());


// app.get('/posts', (req, res) => {
//   res.send(posts);
// });

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  // console.log(data);

  if (type === "CommentCreated") {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        ...data,
        status,
      }
    }).catch(e => console.log(e));
  }

  console.log("Received event", req.body.type);

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});