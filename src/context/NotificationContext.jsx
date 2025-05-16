import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useUser } from "./UserContext";
import API_BASE_URL from "../apiConfig";
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unseen, setUnseen] = useState(0);

  useEffect(() => {
    let socket;
    if (user) {
      axios
        .get(`${API_BASE_URL}/api/notifications`, { withCredentials: true })
        .then((res) => {
          setNotifications(res.data);
          setUnseen(res.data.length);
        });
      socket = io(`${API_BASE_URL}`, { withCredentials: true });
      socket.on("new_post", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnseen((prev) => prev + 1);
      });
      socket.on("new_notification", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnseen((prev) => prev + 1);
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  const markSeen = async () => {
    await axios.patch(
      `${API_BASE_URL}/api/notifications/mark-seen`,
      {},
      { withCredentials: true }
    );
    setUnseen(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unseen, markSeen }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
