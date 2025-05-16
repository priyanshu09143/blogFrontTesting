import { useEffect, useState } from "react";
import { Row, Col, Card, ListGroup, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import API_BASE_URL from "../apiConfig";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useUser();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/posts`)
      .then((res) => setPosts(res.data));
    if (user) {
      axios
        .get(`${API_BASE_URL}/api/authors/authors`, {
          withCredentials: true,
        })
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [user]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.tags &&
        post.tags.join(" ").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Row>
      {user && (
        <Col md={2}>
          <ListGroup>
            <ListGroup.Item active>Active Users</ListGroup.Item>
            {users.map((u) => (
              <ListGroup.Item
                key={u._id}
                as={Link}
                to={`/author/${u._id}`}
                action
                className="d-flex align-items-center"
              >
                {u.profilePic ? (
                  <Image
                    src={u.profilePic}
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2"
                    alt={u.displayName || u.username}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 28,
                      width: 32,
                      height: 32,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "0.5rem",
                    }}
                    className="me-2"
                  >
                    👤
                  </span>
                )}
                <span className="clr-black-ft">
                  {u.displayName || u.username}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      )}
      <Col md={user ? 8 : 12}>
        <Form.Control
          type="text"
          placeholder="Search posts..."
          className="mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredPosts.map((post) => (
          <Card key={post._id} className="mb-3">
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                <Link to={`/author/${post.author?._id}`}>
                  {post.author?.displayName || post.author?.username}
                </Link>
                {" | "}
                {post.tags &&
                  post.tags.map((t) => (
                    <span key={t} className="badge bg-secondary ms-1">
                      {t}
                    </span>
                  ))}
              </Card.Subtitle>
              <Card.Text>{post.content.slice(0, 100)}...</Card.Text>
              <Link to={`/post/${post._id}`}>Read more</Link>
            </Card.Body>
          </Card>
        ))}
      </Col>
      {user && <Col md={2}></Col>}
    </Row>
  );
}

export default HomePage;
