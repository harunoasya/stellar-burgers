import { RootState } from '../store';

export const getConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const getConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
