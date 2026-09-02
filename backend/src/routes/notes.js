const express = require('express');
const { searchNotes } = require('../controllers/notesController');

const router = express.Router();

router.get('/', searchNotes);

module.exports = router;
