const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const STATUS_CODE = require('./errors/errorCodes');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '62f63e76e8f520786e458fd1', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_CODE.notFound).send({
    message: 'Страница не найдена',
  });
});

app.listen(PORT);

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });
