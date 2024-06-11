const express = require('express');
const router = express.Router();
const comments = require('../data/comments.js');

//GET route to get all comments data
router.get('/', (req, res) => {
  const links = [
    {
      href: 'comments/:id',
      rel: ':id',
      type: 'GET',
    },
  ];

  res.json({ comments, links });
});

// GET route to get a comments by ID
router.get('/:id', (req, res, next) => {
  // Using the Array.find method to find the user with the same id as the one sent with the request
  const comment = comments.find((c) => c.id == req.params.id);

  const links = [
    {
      href: `/${req.params.id}`,
      rel: '',
      type: 'PATCH',
    },
    {
      href: `/${req.params.id}`,
      rel: '',
      type: 'DELETE',
    },
  ];

  if (comment) res.json({ comment, links });
  else next();
});

// POST Create a Comment
router.post('/', (req, res) => {
  // Within the POST request we will create a new comment.
  // The client will pass us data and we'll push that data into our psots array.
  // the comment data that we want to create is inside the req.body
  if (req.body.userId && req.body.postId && req.body.body) {
    // If the code gets to this point, we are good to create the post
    const comment = {
      id: comments.length + 1,
      userId: req.body.userId,
      postId: req.body.postId,
      body: req.body.body,
    };

    comments.push(comment);
    res.json(comment);
  } else {
    res.status(400).json({ error: 'Insufficient Data' });
  }
});

//PATCH Update a Comment
router.patch('/:id', (req, res, next) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing user in the database.
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      for (const key in req.body) {
        // Applying the updates within the req.body to the in-memory post
        comments[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (comment) {
    res.json(comment);
  } else {
    next();
  }
});

// DELETE Delete a comment
router.delete('/:id', (req, res) => {
  // The DELETE request route simply removes a resource.
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      comments.splice(i, 1);
      return true;
    }
  });

  if (comment) res.json(comment);
  else next();
});

module.exports = router;