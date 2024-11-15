// import { useEffect, useState, useRef } from 'react';
// import SockJS from 'sockjs-client';
// import { Client, Message } from '@stomp/stompjs';

// // Define the Notification type
// interface Notification {
//   sender: string;
//   receiver: string;
//   message: string;
// }

// const useNotifications = (user: string) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const stompClient = useRef<Client | null>(null); // Store stompClient in a ref

//   useEffect(() => {
//     // Create the WebSocket connection using SockJS
//     const socket = new SockJS('http://localhost:8080/ws');
//     stompClient.current = new Client({
//       brokerURL: 'ws://localhost:8080/ws', // WebSocket URL
//       connectHeaders: {
//         // any necessary headers, e.g. authentication token
//       },
//       debug: (str) => console.log(str),
//       onConnect: () => {
//         // Subscribe to notifications after a successful connection
//         stompClient.current?.subscribe('/topic/notifications', (message: Message) => {
//           const notification: Notification = JSON.parse(message.body);
//           if (notification.receiver === user) {
//             setNotifications((prev) => [...prev, notification]);
//           }
//         });
//       },
//       onDisconnect: () => {
//         console.log('Disconnected');
//       },
//     });

//     // Connect to the WebSocket server
//     stompClient.current.activate();

//     // Cleanup function to disconnect on unmount
//     return () => {
//       if (stompClient.current) {
//         stompClient.current.deactivate();
//       }
//     };
//   }, [user]);

//   // Function to send notifications
//   const sendNotification = (notification: Notification) => {
//     if (stompClient.current) {
//       stompClient.current.send('/app/sendNotification', {}, JSON.stringify(notification));
//     }
//   };

//   return { notifications, sendNotification };
// };

// export default useNotifications;
