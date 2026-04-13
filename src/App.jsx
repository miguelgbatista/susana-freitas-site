import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { cn } from './utils';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function Layout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin sem Navbar/Footer */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Site público com Layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/catalogo" element={<Layout><CatalogPage /></Layout>} />
      </Routes>
    </Router>
  );
}
