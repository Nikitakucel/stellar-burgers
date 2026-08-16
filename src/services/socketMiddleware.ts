// src/services/socketMiddleware.ts
import { Middleware } from 'redux';

export type WsActions = {
  wsConnect: string;
  wsDisconnect: string;
  wsConnecting: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export const socketMiddleware =
  (wsActions: WsActions): Middleware =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      const { dispatch } = store;
      // TypeScript считает, что action - это unknown, поэтому мы проверяем поле type через приведение типов
      const { type, payload } = action as { type: string; payload?: any };
      const {
        wsConnect,
        wsDisconnect,
        wsConnecting,
        onOpen,
        onClose,
        onError,
        onMessage
      } = wsActions;

      if (type === wsConnect) {
        const url = payload as string;
        socket = new WebSocket(url);
        dispatch({ type: wsConnecting });
      }

      if (socket) {
        socket.onopen = () => {
          dispatch({ type: onOpen });
        };

        socket.onerror = (event) => {
          dispatch({ type: onError, payload: event });
        };

        socket.onmessage = (event) => {
          const { data } = event;
          const parsedData = JSON.parse(data);
          dispatch({ type: onMessage, payload: parsedData });
        };

        socket.onclose = (event) => {
          dispatch({ type: onClose, payload: event });
        };

        if (type === wsDisconnect) {
          socket.close();
          socket = null;
        }
      }

      next(action);
    };
  };
