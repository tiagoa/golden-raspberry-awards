const app = require('./app');

const port = process.env.PORT || 3000;
app.start('movies.csv', ':memory:');
app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);