// http://localhost:3000/api?api-key=perscholas

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const userRouter = require('./routes/users.js');
const postRouter = require('./routes/posts.js');
const commentRouter = require('./routes/comments.js');

// Body parser middlware
// we have access to the parsed data within our routes.
// The parsed data will be located in "req.body".
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// New logging middleware to help us keep track of
// requests during testing!
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log('Containing the data:');
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Valid API Keys.
const apiKeys = ['perscholas', 'ps-example', 'hJAsknw-L198sAJD-l3kasx'];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use('/api', function (req, res, next) {
  var key = req.query['api-key'];

  // Check for the absence of a key.
  if (!key) {
    res.status(400);
    return res.json({ error: 'API Key Required' });
  }

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) {
    res.status(401);
    return res.json({ error: 'Invalid API Key' });
  }

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// API Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);

app.get('/', (req, res) => {
  res.json({
    links: [
      {
        href: '/api',
        rel: 'api',
        type: 'GET',
      },
    ],
  });
});

// Adding some HATEOAS links.
app.get('/api', (req, res) => {
  res.json({
    links: [
      {
        href: 'api/users',
        rel: 'users',
        type: 'GET',
      },
      {
        href: 'api/users',
        rel: 'users',
        type: 'POST',
      },
      {
        href: 'api/posts',
        rel: 'posts',
        type: 'GET',
      },
      {
        href: 'api/posts',
        rel: 'posts',
        type: 'POST',
      },
      {
        href: 'api/comments',
        rel: 'comments',
        type: 'GET',
      },
      {
        href: 'api/comments',
        rel: 'comments',
        type: 'POST',
      },
    ],
  });
});

// Creating a new User using forms
app.get('/users/new', (req, res) => {
  res.send(`
    <div>
      <h1>Create A User</h1>
      <form action="/api/users?api-key=perscholas" method="POST">
        Name: <input type="text" name="name" /> <br/>
        UserName: <input type="text" name="username" /> <br/>
        Email: <input type="text" name="email" /> <br/><br/>
        <input type="submit" value="Create User" /> 
      </form>
    </div>
    `)
})

// The only way this middlware runs is if a route handler function runs the "next()" function
app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Resource Not Found' });
});

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT);
});