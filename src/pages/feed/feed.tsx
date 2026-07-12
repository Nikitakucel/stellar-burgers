import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { FeedUI } from '@ui-pages';

export const Feed = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch({
      type: 'feed/connect',
      payload: 'wss://norma.nomoreparties.space/orders/all'
    });
    return () => {
      dispatch({ type: 'feed/disconnect' });
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch({
      type: 'feed/connect',
      payload: 'wss://norma.nomoreparties.space/orders/all'
    });
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
