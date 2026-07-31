import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { FeedUI } from '@ui-pages';

export const Feed = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.feed);

  useEffect(() => {
    // Вместо wsConnect просто вызываем обычный get-запрос
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    // При нажатии на кнопку обновления вызываем тот же экшен
    dispatch(fetchFeed());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
