import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  test('неизвестный экшен возвращает initialState', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('fetchIngredients.pending устанавливает loading: true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  test('fetchIngredients.fulfilled устанавливает данные и loading: false', () => {
    const mockData = [{ _id: '1', name: 'Булка' }];
    const action = { type: fetchIngredients.fulfilled.type, payload: mockData };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockData);
  });

  test('fetchIngredients.rejected устанавливает error', () => {
    const action = { type: fetchIngredients.rejected.type, error: { message: 'Ошибка' } };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
