
export interface IMessagesListener {
    newMessage(message: string, roomId: number, username: string): Promise<void>;
}