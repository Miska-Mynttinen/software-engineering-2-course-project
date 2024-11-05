import { RootState } from "../states";

export const getOrganizations = (state: RootState) => state.apiState.organizations
export const getRepositories = (state: RootState) => state.apiState.repositories
export const getResources = (state: RootState) => state.apiState.resources
export const getUsers = (state: RootState) => state.apiState.users
export const getUserGroups = (state: RootState) => state.apiState.userGroups