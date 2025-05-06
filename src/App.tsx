import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Colecao from './pages/Colecao';
import Loja from './pages/Loja';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import ProductPage from './pages/ProductPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminNovoProduto from './pages/AdminNovoProduto';
import AdminGerenciarProdutos from './pages/AdminGerenciarProdutos';
import AdminEditarProduto from './pages/AdminEditarProduto';
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route
            path="/admin/novo-produto"
            element={
              <ProtectedRoute>
                <AdminNovoProduto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gerenciar-produtos"
            element={
              <ProtectedRoute>
                <AdminGerenciarProdutos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/editar-produto/:id"
            element={
              <ProtectedRoute>
                <AdminEditarProduto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
