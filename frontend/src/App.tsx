import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Colecao from './pages/Colecao';
import Loja from './pages/Loja';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import ProductPage from './pages/ProductPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProdutos from './pages/AdminProdutos';
import AdminGerenciarPedidos from './pages/AdminGerenciarPedidos';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import PedidoSucesso from './pages/PedidoSucesso';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RegistroConfirmacao from './pages/RegistroConfirmacao';
import AuthRoute from './components/AuthRoute';
import { CartProvider } from './contexts/CartContext';
import AdminNovoProduto from './pages/AdminNovoProduto';
import AdminGerenciarProdutos from './pages/AdminGerenciarProdutos';
import AdminEditarProduto from './pages/AdminEditarProduto';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colecao" element={<Colecao />} />
              <Route path="/loja" element={<Loja />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/checkout" element={<AuthRoute><Checkout /></AuthRoute>} />
              <Route path="/pedido/sucesso/:orderId" element={<AuthRoute><PedidoSucesso /></AuthRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/registro/confirmacao" element={<RegistroConfirmacao />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/produtos" element={<ProtectedRoute><AdminProdutos /></ProtectedRoute>} />
              <Route path="/admin/gerenciar-pedidos" element={<ProtectedRoute><AdminGerenciarPedidos /></ProtectedRoute>} />
              <Route path="/admin/novo-produto" element={<ProtectedRoute><AdminNovoProduto /></ProtectedRoute>} />
              <Route path="/admin/gerenciar-produtos" element={<ProtectedRoute><AdminGerenciarProdutos /></ProtectedRoute>} />
              <Route path="/admin/editar-produto/:id" element={<ProtectedRoute><AdminEditarProduto /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
