import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import API_BASE_URL from "../apiConfig";
function PostEditorPage() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE_URL}/api/posts/${id}`)
        .then(res => setForm({
          title: res.data.title,
          content: res.data.content,
          tags: res.data.tags.join(', ')
        }));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    if (id) {
      await axios.put(`${API_BASE_URL}/api/posts/${id}`, payload, { withCredentials: true });
    } else {
      await axios.post(`${API_BASE_URL}/api/posts`, payload, { withCredentials: true });
    }
    navigate('/');
  };

  if (!user) return <div>Please login to create or edit posts.</div>;

  return (
    <Card className="mx-auto" style={{ maxWidth: 600 }}>
      <Card.Body>
        <h3>{id ? 'Edit Post' : 'New Post'}</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={form.title} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" name="content" value={form.content} onChange={handleChange} rows={6} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control name="tags" value={form.tags} onChange={handleChange} />
          </Form.Group>
          <Button type="submit">{id ? 'Update' : 'Create'}</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PostEditorPage;