import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { getFeedOrders } from '../../services/selectors/feedSelectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getFeedOrders);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
