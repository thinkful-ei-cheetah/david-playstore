const express = require('express');
const morgan = require('morgan');
const store = require('./playstore');
const cors = require('cors');
const app = express();


app
  .use(morgan('dev'))
  .use(cors());


app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  let results = store;

  if (sort) {
    if (!['rating', 'app'].includes(sort)) {
      return res
        .status(400)
        .send('sort must be one of rating or app');
    }
  }
  else if (sort === 'app') {
    results = results.sort((a, b) => {
      const x = a.app.toLowerCase();
      const y = b.app.toLowerCase();
      return x[sort] > y[sort] ? -1 : x[sort] < y[sort] ? 1 : 0;
    })
  }
  else if (sort === 'rating') {
    results = results.sort((a, b) => {
      return a['rating'] < b['rating'] ? 1 : a['rating'] > b['rating'] ? -1 : 0;
    })
  }

  if (genres) {
    if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres.toLowerCase())) {
      return res.status(400).send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade or Card');
    }
    results = results.filter(app => {
      return app.Genres.toLowerCase() === genres.toLowerCase();
    });
  }


  return res.send(results);

});
  app.listen(8000, () => {
  console.log('server started on port 8000');
});

