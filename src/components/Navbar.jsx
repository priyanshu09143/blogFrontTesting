import {
  Navbar,
  Nav,
  Container,
  Badge,
  Dropdown,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useNotifications } from "../context/NotificationContext";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
function AppNavbar() {
  const { user, setUser } = useUser();
  const { notifications, unseen, markSeen } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar bg="black" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/new">
              New Post
            </Nav.Link>
            <Nav.Link as={Link} to="/subscriptions">
              Subscriptions
            </Nav.Link>
          </Nav>
          <Nav>
            {user && (
              <Dropdown align="end" onToggle={(open) => open && markSeen()}>
                <Dropdown.Toggle
                  variant="link"
                  className="text-white position-relative"
                  style={{
                    boxShadow: "none",
                    border: "none",
                    background: "none",
                  }}
                >
                  <i className="bi bi-bell" style={{ fontSize: 22 }}></i>
                  {unseen > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {unseen}
                    </Badge>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: 300 }}>
                  {notifications.length === 0 && (
                    <Dropdown.Item className="clr-black-ft">
                      No notifications
                    </Dropdown.Item>
                  )}
                  {notifications.slice(0, 5).map((n, i) => (
                    <Dropdown.Item
                      className="clr-black-ft"
                      as={Link}
                      to={
                        n.type === "subscription"
                          ? "#"
                          : `/post/${n.postId?._id || n.postId}`
                      }
                      key={i}
                    >
                      <div>
                        {n.type === "subscription" ? (
                          <>
                            <strong>New Subscriber</strong>
                            <div style={{ fontSize: 12 }}>{n.message}</div>
                          </>
                        ) : (
                          <>
                            <strong>{n.title || n.postId?.title}</strong>
                            <div style={{ fontSize: 12 }}>
                              {n.author ||
                                n.postId?.author?.displayName ||
                                n.postId?.author?.username}{" "}
                              &middot;{" "}
                              {n.createdAt
                                ? new Date(n.createdAt).toLocaleString()
                                : ""}
                            </div>
                          </>
                        )}
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
            {user ? (
              <>
                <span className="me-2">
                  {user.displayName || user.username}
                </span>
                {user.profilePic && (
                  <Image
                    src={user.profilePic}
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2"
                  />
                )}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
