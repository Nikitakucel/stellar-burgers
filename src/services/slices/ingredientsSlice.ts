// src/services/slices/ingredientsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Импортируем ВЕРНЫЙ тип из папки utils (а не types)
import { TIngredient } from '../../utils/types'; 
import { getIngredientsApi } from '../../utils/burger-api';

interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (err) {
      return rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ingredientsSlice.reducer;
