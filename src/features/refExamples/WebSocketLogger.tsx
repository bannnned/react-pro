import { useEffect, useRef } from 'react';
import styles from './RefExamples.module.css';

export function WebSocketLogger() {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('wss://echo.websocket.org');
    socketRef.current = socket;

    const handleOpen = () => {
      socket.send('Соединение установлено');
    };

    const handleMessage = (event: MessageEvent<string>) => {
      console.log(`WebSocket: ${event.data}`);
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('message', handleMessage);
      socket.close();
      socketRef.current = null;
    };
  }, []);

  return (
    <article className={styles.card}>
      <p className={styles.number}>05</p>
      <h2>WebSocket logger</h2>
      <p className={styles.description}>
        Соединение открывается при загрузке страницы, а входящие сообщения выводятся в
        консоль.
      </p>
      <p className={styles.status}>Подключение запускается автоматически</p>
    </article>
  );
}
