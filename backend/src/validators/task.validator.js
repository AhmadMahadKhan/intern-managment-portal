const { body } = require('express-validator');

exports.taskValidator = [
  body('intern_id').notEmpty().isInt().withMessage('Valid intern ID is required.'),
  body('title').notEmpty().withMessage('Task title is required.'),
];