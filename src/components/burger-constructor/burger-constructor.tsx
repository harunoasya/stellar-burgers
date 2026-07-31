import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import {
  getConstructorBun,
  getConstructorIngredients
} from '../../services/selectors/burgerConstructorSelectors';

import { useSelector, useDispatch } from '../../services/store';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';

import {
  getOrderLoading,
  getOrderNumber
} from '../../services/selectors/orderSelectors';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const bun = useSelector(getConstructorBun);

  const ingredients = useSelector(getConstructorIngredients);

  const constructorItems = {
    bun,
    ingredients
  };

  const orderRequest = useSelector(getOrderLoading);

  const orderNumber = useSelector(getOrderNumber);

  const orderModalData = orderNumber ? { number: orderNumber } : null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredients)).then(() => {
      dispatch(clearConstructor());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
