const express = require('express');
const {
  listRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  logRecurringExpense,
  logAllDue,
} = require('../controllers/recurringExpensesController');

const router = express.Router();

router.get('/', listRecurringExpenses);
router.post('/', createRecurringExpense);
router.put('/:id', updateRecurringExpense);
router.delete('/:id', deleteRecurringExpense);
router.post('/:id/log', logRecurringExpense);
router.post('/log-all', logAllDue);

module.exports = router;
