const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getTasks, createTask, updateTask } = require('../controllers/task.controller');
const { taskValidator } = require('../validators/task.validator');

router.get('/', auth, getTasks);
router.post('/', auth, taskValidator, createTask);
router.put('/:id', auth, updateTask);

module.exports = router;