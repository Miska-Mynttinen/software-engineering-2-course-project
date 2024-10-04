import { Reducer, combineReducers } from "redux"
import nodeReducer from "./pipelineSlice"
import apiReducer from "./apiSlice"
import pipelineReducer from "./pipelineSlice"
import currentSessionTicketReducer from "./currentSessionTicketSlice"
import { RootState } from "../states"

const rootReducer: Reducer<RootState> = combineReducers({
    apiState: apiReducer,
    pipelineState: pipelineReducer,
    currentSessionTicketState: currentSessionTicketReducer,
})

export default rootReducer
