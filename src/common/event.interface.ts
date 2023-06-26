
export interface IEvent {
    ev: string;
    description?: string;
    listener(...args: unknown[]): Promise<void>;
}