const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;

const knex = require('knex')(
  require('./knexfile.js')[process.env.NODE_ENV || 'development']
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/movies', async (req, res) => {
  const movies = await knex('movies').select('*');
  res.status(200).json(movies);
});

app.post('/movies', async (req, res) => {
  const movie = req.body;
  if (movie === undefined) {
    return res.status(400).json({ error: 'movie is required' });
  }
  if (!movie.title) {
    return res.status(400).json({ error: 'title is required' });
  }
  await knex('movies').insert(movie);
  const movies = await knex('movies').select('*');
  res.status(200).json(movies);
});

app.get('/search', async (req, res) => {
  const query = req.query;
  console.log('query:', query);
  const movies = await knex('movies')
    .select('*')
    .where('title', 'ilike', `%${query.title}%`);
  res.status(200).json(movies);
});

app.delete('/movies/:id', async (req, res) => {
  const id = req.params.id;
  await knex('movies').where('id', id).del();
  const movies = await knex('movies').select('*');
  res.sendStatus(204);
});

// TODO: implement handling of watch/to_watch changes

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
