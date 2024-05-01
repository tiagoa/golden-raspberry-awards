const app = require('./app');
const db = require('./db');
const port = process.env.PORT || 3000;
db.start('movielist.csv', ':memory:');
app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);