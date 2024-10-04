import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentSessionTicketState, Ticket } from '../states/currentSessionTicketState';

export const initialState: CurrentSessionTicketState = {
  notStartedTickets: [],
  startedTickets: [],
  finishedTickets: []
};

const currentSessionTicketSlice = createSlice({
  name: 'tickets',
  initialState: initialState,
  reducers: {
    // Add new ticket to the `notStartedTickets`
    addNewNotStartedTicket: (state, { payload }: PayloadAction<Ticket>) => {
      state.notStartedTickets.push(payload);
    },

    // Add new ticket to the `startedTickets`
    addNewStartedTicket: (state, { payload }: PayloadAction<Ticket>) => {
      state.startedTickets.push(payload);
    },

    // Add new ticket to the `finishedTickets`
    addNewFinishedTicket: (state, { payload }: PayloadAction<Ticket>) => {
      state.finishedTickets.push(payload);
    },
    
    // Delete ticket from all lists
    deleteTicket: (state, { payload }: PayloadAction<Ticket>) => {
      state.notStartedTickets = state.notStartedTickets.filter(ticket => ticket.ticketId !== payload.ticketId);
      state.startedTickets = state.startedTickets.filter(ticket => ticket.ticketId !== payload.ticketId);
      state.finishedTickets = state.finishedTickets.filter(ticket => ticket.ticketId !== payload.ticketId);
    },

    // Clear all tickets from all categories
    clearTickets: (state) => {
      state.notStartedTickets = [];
      state.startedTickets = [];
      state.finishedTickets = [];
    },
  },
});

export const { 
  addNewNotStartedTicket, 
  addNewStartedTicket,
  addNewFinishedTicket,
  deleteTicket,
  clearTickets
} = currentSessionTicketSlice.actions;

export default currentSessionTicketSlice.reducer;
