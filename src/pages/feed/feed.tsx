import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui'; // Добавили импорт прелоадера

export const Feed = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  // Пока идет загрузка - показываем прелоадер, а не пустой экран
  if (loading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
