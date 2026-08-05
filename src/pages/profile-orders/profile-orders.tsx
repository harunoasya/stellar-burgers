import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/ordersSlice';
import { getOrders } from '../../services/selectors/ordersSelectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getOrders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
