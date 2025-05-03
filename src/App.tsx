import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Colecao from './pages/Colecao';
import Loja from './pages/Loja';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import ProductPage from './pages/ProductPage';
import AdminNovoProduto from './pages/AdminNovoProduto';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 min-h-screen bg-pampa-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colecao" element={<Colecao />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/novo-produto" element={<AdminNovoProduto />} />
        </Routes>
      </div>
    </Router>
  );
}
