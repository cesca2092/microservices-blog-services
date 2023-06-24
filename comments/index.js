const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());


const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const commentId = randomBytes(4).toString('hex');

    const comments = commentsByPostId[id] || [];

    comments.push({ id: commentId, content, status: 'pending' })
    commentsByPostId[id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: id,
        status: 'pending'
      }
    })

    res.status(201).send(comments);
  } catch (error) {
    res.status(400).send("error")
  }

});

app.post('/events', (req, res) => {
  console.log("Received event", req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, status, id } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find(el => el.id === id);

    comment.status = status;

    axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data
    }).catch(e => console.log(e));
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});