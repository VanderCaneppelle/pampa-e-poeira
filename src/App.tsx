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
import AuthRoute from './components/AuthRoute';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import PedidoSucesso from './pages/PedidoSucesso';
import { CartProvider } from './contexts/CartContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RegistroConfirmacao from './pages/RegistroConfirmacao';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Navbar />
        <div className="pt-16 min-h-screen bg-pampa-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/colecao" element={<Colecao />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <AuthRoute>
                  <Checkout />
                </AuthRoute>
              }
            />
            <Route
              path="/pedido/sucesso/:orderId"
              element={
                <AuthRoute>
                  <PedidoSucesso />
                </AuthRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registro/confirmacao" element={<RegistroConfirmacao />} />
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
      </CartProvider>
    </Router>
  );
}
