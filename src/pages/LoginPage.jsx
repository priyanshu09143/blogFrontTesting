import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import API_BASE_URL from "../apiConfig";
function LoginPage() {
  const { setUser } = useUser();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form, { withCredentials: true });
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 400 }}>
      <Card.Body>
        <h3 className="mb-3">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={form.username} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" value={form.password} onChange={handleChange} required />
          </Form.Group>
          <Button type="submit" className="w-100 mb-2">Login</Button>
        </Form>
        <Button variant="secondary" className="w-100" onClick={handleGoogle}>
          Login with Google
        </Button>
      </Card.Body>
    </Card>
  );
}

export default LoginPage;