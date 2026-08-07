import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';

import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'img',
  image_large: 'img-large',
  image_mobile: 'img-mobile'
};

const main: TIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  price: 20,
  image: 'img',
  image_large: 'img-large',
  image_mobile: 'img-mobile'
};

describe('burgerConstructorSlice', () => {
  test('должен вернуть initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('setBun', () => {
    const state = reducer(undefined, setBun(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  test('addIngredient', () => {
    const state = reducer(undefined, addIngredient(main));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('removeIngredient', () => {
    let state = reducer(undefined, addIngredient(main));

    const id = state.ingredients[0].id;

    state = reducer(state, removeIngredient(id));

    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredient вверх', () => {
    let state = reducer(undefined, addIngredient(main));
    state = reducer(
      state,
      addIngredient({ ...main, _id: '3', name: 'Вторая' })
    );

    const firstId = state.ingredients[0].id;
    const secondId = state.ingredients[1].id;

    state = reducer(
      state,
      moveIngredient({
        index: 1,
        direction: 'up'
      })
    );

    expect(state.ingredients[0].id).toBe(secondId);
    expect(state.ingredients[1].id).toBe(firstId);
  });

  test('moveIngredient вниз', () => {
    let state = reducer(undefined, addIngredient(main));
    state = reducer(
      state,
      addIngredient({ ...main, _id: '3', name: 'Вторая' })
    );

    const firstId = state.ingredients[0].id;
    const secondId = state.ingredients[1].id;

    state = reducer(
      state,
      moveIngredient({
        index: 0,
        direction: 'down'
      })
    );

    expect(state.ingredients[0].id).toBe(secondId);
    expect(state.ingredients[1].id).toBe(firstId);
  });

  test('clearConstructor', () => {
    let state = reducer(undefined, setBun(bun));
    state = reducer(state, addIngredient(main));

    state = reducer(state, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
