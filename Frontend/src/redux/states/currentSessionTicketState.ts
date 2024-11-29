// Define the ticket type structure
export interface Ticket {
  ticketId: string;
  orgId: string;
  repId: string;
  pipeId: string;
  pipeName: string | undefined;
  exeId: string;
}

// Update the CurrentSessionTicketState to use the Ticket type
export interface CurrentSessionTicketState {
  notStartedTickets: Ticket[];
  startedTickets: Ticket[];
  finishedTickets: Ticket[];
}

// Function to delete tickets based on pipeline ID or name
export const deletePipelineTickets = (
  state: CurrentSessionTicketState,
  pipelineIdentifier: { id?: string; name?: string }
): CurrentSessionTicketState => {
  const { id, name } = pipelineIdentifier;

  const filterTickets = (tickets: Ticket[]) =>
    tickets.filter((ticket) => !(ticket.pipeId === id || ticket.pipeName === name));

  return {
    ...state,
    notStartedTickets: filterTickets(state.notStartedTickets),
    startedTickets: filterTickets(state.startedTickets),
    finishedTickets: filterTickets(state.finishedTickets),
  };
};