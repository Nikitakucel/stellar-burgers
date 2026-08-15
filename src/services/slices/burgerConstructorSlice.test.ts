import burgerConstructorReducer, {
  addIngredients,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient } from '../../utils/types';

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('неизвестный экшен возвращает initialState', () => {
    expect(burgerConstructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('addIngredients добавляет булку (bun)', () => {
    const mockIngredient: TIngredient = {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'test.jpg',
      image_mobile: 'test_mobile.jpg',
      image_large: 'test_large.jpg'
    };
    const action = addIngredients(mockIngredient);
    const state = burgerConstructorReducer(initialState, action);
    expect(state.bun).toEqual({ ...mockIngredient, id: expect.any(String) });
  });

  test('addIngredients добавляет начинку (ингредиент)', () => {
    const mockIngredient: TIngredient = {
      _id: '2',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce',
      proteins: 50,
      fat: 22,
      carbohydrates: 40,
      calories: 300,
      price: 80,
      image: 'sauce.jpg',
      image_mobile: 'sauce_mobile.jpg',
      image_large: 'sauce_large.jpg'
    };
    const action = addIngredients(mockIngredient);
    const state = burgerConstructorReducer(initialState, action);
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({ ...mockIngredient, id: expect.any(String) });
  });

  test('removeIngredient удаляет ингредиент по id', () => {
    // ИСПОЛЬЗУЕМ as any, чтобы TypeScript не ругался на неполные объекты в тестах
    const mockState = {
      bun: null,
      ingredients: [{ _id: '2', id: 'abc-123' } as any]
    };
    const action = removeIngredient('abc-123');
    const state = burgerConstructorReducer(mockState as any, action);
    expect(state.ingredients).toHaveLength(0);
  });

  test('clearConstructor очищает бургер', () => {
    const filledState = {
      bun: { _id: '1', id: 'bun-id' } as any,
      ingredients: [{ _id: '2', id: 'ing-id' } as any]
    };
    const action = clearConstructor();
    const state = burgerConstructorReducer(filledState as any, action);
    expect(state).toEqual(initialState);
  });

  test('moveIngredient перемещает ингредиент вверх', () => {
    const mockState = {
      bun: null,
      ingredients: [{ id: '1' } as any, { id: '2' } as any]
    };
    const action = moveIngredient({ id: '2', direction: 'up' });
    const state = burgerConstructorReducer(mockState as any, action);
    expect(state.ingredients[0].id).toBe('2');
  });

  test('moveIngredient перемещает ингредиент вниз', () => {
    const mockState = {
      bun: null,
      ingredients: [{ id: '1' } as any, { id: '2' } as any]
    };
    const action = moveIngredient({ id: '1', direction: 'down' });
    const state = burgerConstructorReducer(mockState as any, action);
    expect(state.ingredients[1].id).toBe('1');
  });
});
