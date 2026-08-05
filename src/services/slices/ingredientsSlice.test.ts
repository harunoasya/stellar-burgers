import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'image',
    image_large: 'image-large',
    image_mobile: 'image-mobile'
  },
  {
    _id: '2',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 5,
    fat: 5,
    carbohydrates: 10,
    calories: 50,
    price: 20,
    image: 'image',
    image_large: 'image-large',
    image_mobile: 'image-mobile'
  }
];

describe('ingredientsSlice', () => {
  test('должен вернуть initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('fetchIngredients.pending', () => {
    const state = reducer(undefined, fetchIngredients.pending('requestId'));

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('fetchIngredients.fulfilled', () => {
    const state = reducer(
      undefined,
      fetchIngredients.fulfilled(ingredients, 'requestId')
    );

    expect(state).toEqual({
      ingredients,
      isLoading: false,
      error: null
    });
  });

  test('fetchIngredients.rejected', () => {
    const state = reducer(
      undefined,
      fetchIngredients.rejected(new Error('Ошибка'), 'requestId')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
