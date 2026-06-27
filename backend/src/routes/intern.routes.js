const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  getInterns,
  getInternById,
  createIntern,
  updateIntern,
  deleteIntern,
  updateAttendance,
} = require('../controllers/intern.controller');
const { internValidator } = require('../validators/intern.validator');

router.get('/', auth, getInterns);
router.get('/:id', auth, getInternById);
router.post('/', auth, internValidator, createIntern);
router.put('/:id', auth, internValidator, updateIntern);
router.delete('/:id', auth, deleteIntern);
router.put('/:id/attendance', auth, updateAttendance);

module.exports = router;