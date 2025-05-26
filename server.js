const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`UTMS-Backend app listening on port ${port}`)
})