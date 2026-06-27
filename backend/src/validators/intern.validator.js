const { body } = require('express-validator');

exports.internValidator = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('department').notEmpty().withMessage('Department is required.'),
  body('joining_date').notEmpty().isDate().withMessage('Valid joining date is required.'),
];