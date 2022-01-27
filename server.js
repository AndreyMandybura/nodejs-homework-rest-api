const app = require('./app')

const {PORT = 3000} = process.env

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
})

const mongoose = require('mongoose');

const { DB_HOST } = process.env;

mongoose.connect(DB_HOST)
  .then(() => console.log('data base connect success'))
.catch(error => console.log(error.message))