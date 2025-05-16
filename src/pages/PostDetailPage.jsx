import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import API_BASE_URL from "../apiConfig";

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/posts/${id}`)
      .then(res => setPost(res.data));
  }, [id]);

  const handleDelete = async () => {
    await axios.delete(`${API_BASE_URL}/api/posts/${id}`, { withCredentials: true });
    navigate('/');
  };

  if (!post) return <div>Loading...</div>;

  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <Link to={`/author/${post.author?._id}`}>{post.author?.displayName || post.author?.username}</Link>
          {" | "}
          {post.tags && post.tags.map(t => (
            <span key={t} className="badge bg-secondary ms-1">{t}</span>
          ))}
        </Card.Subtitle>
        <Card.Text>{post.content}</Card.Text>
        {isAuthor && (
          <>
            <Button as={Link} to={`/edit/${post._id}`} className="me-2">Edit</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default PostDetailPage;