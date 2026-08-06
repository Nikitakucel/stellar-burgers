import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorIngredient = TIngredient & { id: string };

type BurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавляем prepare для генерации id ДО попадания в редьюсер
    addIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) => {
      const { id, direction } = action.payload;
      const index = state.ingredients.findIndex((item) => item.id === id);
      if (index !== -1) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < state.ingredients.length) {
          const [removed] = state.ingredients.splice(index, 1);
          state.ingredients.splice(newIndex, 0, removed);
        }
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredients,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
