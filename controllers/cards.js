const Card = require('../models/card');
const NotFound = require('../errors/errors');
const STATUS_CODE = require('../errors/errorCodes');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_CODE.successCreate).send(card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_CODE.success).send(cards);
    })
    .catch(() => {
      res.status(STATUS_CODE.serverError).send({
        message: 'Произошла ошибка на сервере.',
      });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else if (e.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные удаления.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else if (e.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные для постановки лайка. ',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else if (e.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные для снятия лайка. ',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
