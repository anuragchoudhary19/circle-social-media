import React, { useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ id, children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    let isMounted = true;
    let socketConnection;
    if (isMounted && id !== '') {
      socketConnection = io(process.env.REACT_APP_API_SOCKET_IO_URL, {
        transports: ['websocket', 'polling', 'flashsocket'],
        credentials: true,
        query: { id },
      });
      setSocket(socketConnection);
    }
    return () => {
      setSocket(null);
    };
  }, [id]);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
