require('dotenv').config();

const express = require('express');
const cors = require('cors');

const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');
const investmentsRouter = require('./routes/investments');
const dashboardRouter = require('./routes/dashboard');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/investments', investmentsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`FinancialIQ backend listening on port ${PORT}`);
});
