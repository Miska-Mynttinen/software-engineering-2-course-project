import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentSessionTicketState } from '../states/currentSessionTicketState';

export const initialState: CurrentSessionTicketState = {
  tickets: []
};

const currenSessionTicketSlice = createSlice({
  name: 'tickets',
  initialState: initialState,
  reducers: {
    addNewTicket: (state, { payload }: PayloadAction<string>) => {
      state.tickets.push(payload);
    },
    deleteTicket: (state, { payload }: PayloadAction<string>) => {
      state.tickets = state.tickets.filter((ticket: string) => ticket !== payload);
    },
  },
});

export const { 
  addNewTicket, 
  deleteTicket, 
} = currenSessionTicketSlice.actions;

export default currenSessionTicketSlice.reducer;