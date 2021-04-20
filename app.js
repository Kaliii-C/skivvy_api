const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
console.log(chalk.blue('Initializing Middleware...'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(morgan('dev'));

app.use('/auth', require('./src/routes/auth'));
app.use('/user', require('./src/routes/users'));
app.use('/group', require('./src/routes/groups'));
app.use('/plan', require('./src/routes/plans'));
app.use('/list', require('./src/routes/lists'));
app.use('/task', require('./src/routes/tasks'));

//Connection to MongoDB
console.log(chalk.blue('Establishing Database Connection...'));

mongoose
  .connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(
      PORT,
      console.log(chalk.black.bgYellow(`✔︎ Server started on port ${PORT}`))
    );
  })
  .catch(err => {
    console.log(err);
    console.log(chalk.red('Shutting down Skivvy Server'));
  });

//DB Connection events
const { connection } = mongoose;
connection.on('connected', () => {
  console.log(
    chalk.black.bgGreen(`✔︎ Connected to Database: ${process.env.MongoURI}`)
  );
});
connection.on('error', err => {
  console.log(chalk.black.bgRed(`✘ Database Error: ${err}`));
});
connection.on('disconnected', () => {
  console.log(chalk.black.bgRed('✘ Disconnected from Database'));
});
connection.on('reconnected', () => {
  console.log(
    chalk.black.bgGreen(`✔︎ Reconnected to Database: ${process.env.MongoURI}`)
  );
});
