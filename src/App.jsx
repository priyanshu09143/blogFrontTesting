// filepath: real-time-blog/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PostDetailPage from './pages/PostDetailPage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import PostEditorPage from './pages/PostEditorPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import RegisterPage from "./pages/RegisterPage";

import './theme.css';

function App() {
  return (
    <Router>
      <div className="bg-black min-vh-100 text-white">
        <Navbar />
        <Container className="pt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/author/:id" element={<AuthorProfilePage />} />
            <Route path="/edit/:id" element={<PostEditorPage />} />
            <Route path="/new" element={<PostEditorPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;