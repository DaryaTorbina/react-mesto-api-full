require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const usersRouter = require('./routes/users');
// const cardsRouter = require('./routes/cards');
const cors = require('./middlewares/cors');
const { createUser, login } = require('./controllers/users');
const {
  valCreateUser,
  valLogin,
} = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const handelError = require('./middlewares/handelError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signup', valCreateUser, createUser);
app.post('/signin', valLogin, login);


app.use(auth);
// app.use(usersRouter);
// app.use(cardsRouter);
app.use(routes);

app.use(errorLogger);

app.use(errors());


app.use(handelError);

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//  // useNewUrlParser: true,
// });
// app.listen(PORT, () => {});

mongoose.connect('mongodb://localhost:27017/mestodb1', () => {
  console.log('Connection successful');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
