import { createSlice } from '@reduxjs/toolkit';

const exampleSlice = createSlice({
  name: 'example',
  initialState: {
    value: 0,
    messages: []
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  }
});

export const { increment, addMessage } = exampleSlice.actions;
export default exampleSlice.reducer;