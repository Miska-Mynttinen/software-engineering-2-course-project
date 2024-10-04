// Define the ticket type structure
export interface Ticket {
  ticketId: string;
  orgId: string;
  repId: string;
  pipeId: string;
  exeId: string;
}

// Update the CurrentSessionTicketState to use the Ticket type
export interface CurrentSessionTicketState {
  notStartedTickets: Ticket[];
  startedTickets: Ticket[];
  finishedTickets: Ticket[];
}