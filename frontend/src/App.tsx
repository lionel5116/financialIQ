import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Accounts from './pages/Accounts';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import RecurringExpenses from './pages/RecurringExpenses';
import Transactions from './pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-slate-900">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/recurring" element={<RecurringExpenses />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
