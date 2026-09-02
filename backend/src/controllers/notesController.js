const { getDb } = require('../config/mongo');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function searchNotes(req, res, next) {
  try {
    const title = typeof req.query.title === 'string' ? req.query.title.trim() : '';
    const filter = title ? { Title: { $regex: escapeRegex(title), $options: 'i' } } : {};

    const db = await getDb();
    const notes = await db.collection('notes').find(filter).sort({ Title: 1 }).toArray();
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

module.exports = { searchNotes };
