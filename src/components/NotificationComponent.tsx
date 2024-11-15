import { useState } from 'react';
import useNotifications from '../hooks/useNotification';

interface Notification {
  sender: string;
  receiver: string;
  message: string;
}

interface NotificationComponentProps {
  user: string;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ user }) => {
  const { notifications, sendNotification } = useNotifications(user);
  const [message, setMessage] = useState<string>('');

  const handleSendNotification = () => {
    const notification: Notification = { sender: user, receiver: 'jewel', message };
    sendNotification(notification);
    setMessage('');
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter notification message"
      />
      <button onClick={handleSendNotification}>Send Notification</button>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>
            {notif.sender} says: {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
