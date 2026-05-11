import { createContext, useState, useEffect, useContext } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { getNotifications } from "../services/notificationService";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { token, isLoggedIn } = useContext(AuthContext);
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load initial notifications from database
  useEffect(() => {
    if (isLoggedIn) {
      getNotifications().then(data => {
        const notifs = data || [];
        setNotifications(notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setUnreadCount(notifs.filter(n => !n.isRead).length);
      }).catch(console.error);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLoggedIn]);

  // Manage SignalR Connection
  useEffect(() => {
    if (isLoggedIn && token) {
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5052/hubs/notifications", {
          accessTokenFactory: () => token,
        })
        .configureLogging(LogLevel.Warning)
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    } else {
      if (connection) {
        connection.stop();
        setConnection(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token]);

  // Listen to Events
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("Connected to Notification Hub");

          const handleNotification = (data) => {
            toast.success(data.message, { icon: "🔔" });
            const newNotif = {
              id: Date.now(), // Temporary ID until fetched from DB
              message: data.message,
              createdAt: new Date().toISOString(),
              isRead: false
            };
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
          };

          connection.on("NewAdoptionRequest", handleNotification);
          connection.on("AdoptionRequestAccepted", handleNotification);
          connection.on("AdoptionRequestRejected", handleNotification);
          connection.on("NewPetRequest", handleNotification);
          connection.on("PetApproved", handleNotification);
          connection.on("PetRejected", handleNotification);
          connection.on("NewUserRequest", handleNotification);
        })
        .catch(e => console.error("SignalR Connection Error: ", e));

      return () => {
        connection.off("NewAdoptionRequest");
        connection.off("AdoptionRequestAccepted");
        connection.off("AdoptionRequestRejected");
        connection.off("NewPetRequest");
        connection.off("PetApproved");
        connection.off("PetRejected");
        connection.off("NewUserRequest");
        connection.stop();
      };
    }
  }, [connection]);

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    // Backend marks as read automatically upon fetching GET /notifications, 
    // so here we just update local state.
  };

  return (
    <SocketContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </SocketContext.Provider>
  );
}
