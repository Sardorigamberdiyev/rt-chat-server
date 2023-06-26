
export interface IUsersListener {
    userState(state: boolean): Promise<void>;
}