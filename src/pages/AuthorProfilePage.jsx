import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import API_BASE_URL from "../apiConfig";

function AuthorProfilePage() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/authors/${id}`)
      .then(res => setAuthor(res.data));
    axios.get(`${API_BASE_URL}/api/posts?author=${id}`)
      .then(res => setPosts(res.data));
    if (user) {
      axios.get(`${API_BASE_URL}/api/subscriptions`, { withCredentials: true })
        .then(res => {
          setSubscribed(res.data.some(sub => sub.targetUserId._id === id));
        });
    }
  }, [id, user]);

  const handleSubscribe = async () => {
    await axios.post(`${API_BASE_URL}/api/subscriptions/${id}`, {}, { withCredentials: true });
    setSubscribed(true);
  };

  const handleUnsubscribe = async () => {
    await axios.delete(`${API_BASE_URL}/api/subscriptions/${id}`, { withCredentials: true });
    setSubscribed(false);
  };

  if (!author) return <div>Loading...</div>;

  const isSelf = user && user._id === id;

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        {/* Profile Picture */}
        {author.profilePic && (
          <Image
            src={author.profilePic}
            roundedCircle
            width={64}
            height={64}
            alt="Profile"
            className="me-3"
          />
        )}
        <h2 className="mb-0">{author.displayName || author.username}</h2>
      </div>
      <div className="mb-3">
        Total Posts: {posts.length}
        {!isSelf && user && (
          subscribed
            ? <Button variant="secondary" size="sm" className="ms-3" onClick={handleUnsubscribe}>Unsubscribe</Button>
            : <Button variant="light" size="sm" className="ms-3" onClick={handleSubscribe}>Subscribe</Button>
        )}
      </div>
      <h4 className="mb-3">{isSelf ? "Your Blogs" : "Blogs"}</h4>
      {posts.length === 0 && <div>No blogs found.</div>}
      {posts.map(post => (
        <Card key={post._id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content.slice(0, 100)}...</Card.Text>
            <a href={`/post/${post._id}`}>Read more</a>
            {isSelf && (
              <div className="mt-2">
                <a href={`/edit/${post._id}`} className="btn btn-sm btn-outline-light me-2">Edit</a>
                <a href={`/post/${post._id}`} className="btn btn-sm btn-outline-danger">Delete</a>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default AuthorProfilePage;