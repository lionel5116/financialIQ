const express = require('express');
const {
  listInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} = require('../controllers/investmentsController');

const router = express.Router();

router.get('/', listInvestments);
router.post('/', createInvestment);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

module.exports = router;
