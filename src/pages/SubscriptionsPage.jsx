import { useEffect, useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from "../apiConfig";
function SubscriptionsPage() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/subscriptions`, { withCredentials: true })
      .then(res => setSubs(res.data));
  }, []);

  const handleUnsubscribe = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/subscriptions/${id}`, { withCredentials: true });
    setSubs(subs.filter(sub => sub.targetUserId._id !== id));
  };

  return (
    <div>
      <h3>Subscriptions</h3>
      <ListGroup>
        {subs.map(sub => (
          <ListGroup.Item key={sub.targetUserId._id} className="d-flex justify-content-between align-items-center">
            <Link className='clr-black-ft' to={`/author/${sub.targetUserId._id}`}>
              {sub.targetUserId.displayName || sub.targetUserId.username}
            </Link>
            <Button variant="danger" size="sm" onClick={() => handleUnsubscribe(sub.targetUserId._id)}>
              Unsubscribe
            </Button>
          </ListGroup.Item>
        ))}
        {subs.length === 0 && <ListGroup.Item>No subscriptions yet.</ListGroup.Item>}
      </ListGroup>
    </div>
  );
}

export default SubscriptionsPage;