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

    // New reducer: Delete tickets by pipeline ID or name
    deletePipelineTickets: (
      state,
      action: PayloadAction<{ id?: string; name?: string }>
    ) => {
      const { id, name } = action.payload;

      const filterTickets = (tickets: Ticket[]) =>
        tickets.filter(ticket => !(ticket.pipeId === id || ticket.pipeName === name));

      state.notStartedTickets = filterTickets(state.notStartedTickets);
      state.startedTickets = filterTickets(state.startedTickets);
      state.finishedTickets = filterTickets(state.finishedTickets);
    },
  },
});

  
export const { 
  addNewNotStartedTicket, 
  addNewStartedTicket,
  addNewFinishedTicket,
  deleteTicket,
  clearTickets,
  deletePipelineTickets, // Export the new reducer
} = currentSessionTicketSlice.actions;

export default currentSessionTicketSlice.reducer;
