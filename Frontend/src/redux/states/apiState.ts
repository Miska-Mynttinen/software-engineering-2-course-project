export interface ApiState {
    organizations: Organization[],
    repositories: Repository[],
    resources: Resource[],
    users: User[],
    userGroups: UserGroup[]
}

export interface Organization {
    name: string,
    id: string
    apiUrl: string
}

export interface Repository {
    id: string,
    name: string,
    organizationId: string
}

export interface Resource {
    id: string,
    name: string,
    organizationId: string,
    repositoryId: string,
    type: string
}

export interface User {
    userId: string,
    username: string,
    password: string,
    email: string,
    userType: string,
    userGroups: string[],
    organizationId: string
}

export interface UserGroup {
    id: string,
    name: string,
    organizationId: string
}