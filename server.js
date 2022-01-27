const app = require('./app')
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config()

const {PORT = 3000} = process.env

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
})

const { DB_HOST } = process.env;

mongoose.connect(DB_HOST)
  .then(() => console.log('data base connect success'))
  .catch(error => console.log(error.message))


