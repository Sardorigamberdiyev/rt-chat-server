
export interface IRommsListener {
    joinRoom(roomId: number): Promise<void>;
    leaveRoom(roomId: number): Promise<void>;
}