import { ApiState } from './apiState';
import { PipelineState } from './pipelineState';
import { CurrentSessionTicketState } from './currentSessionTicketState';

export interface RootState {
  pipelineState: PipelineState
  apiState: ApiState
  currentSessionTicketState: CurrentSessionTicketState
}
