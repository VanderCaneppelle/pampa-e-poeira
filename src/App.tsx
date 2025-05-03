import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Colecao from './pages/Colecao';
import Loja from './pages/Loja';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';

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
        </Routes>
      </div>
    </Router>
  );
}
