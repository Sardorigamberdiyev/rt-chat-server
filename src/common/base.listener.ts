import { Server, Socket } from 'socket.io';
import { IEvent } from './event.interface';
import { ILogService } from '../log/log.service.interface';
import { DatabaseError } from 'pg';

export abstract class BaseListener {
    private _socket: Socket;
    private _io: Server;
    private _userId: number;
    protected log: ILogService;

    constructor(
        socket: Socket,
        io: Server,
        log: ILogService
    ) {
        this._socket = socket;
        this._io = io;
        this._userId = socket.handshake.auth.userId;
        this.log = log;
    }

    protected get socket(): Socket {
        return this._socket;
    }

    protected get io(): Server {
        return this._io;
    }

    protected get userId(): number {
        return this._userId;
    }

    protected attachListeners(events: IEvent[]) {
        for (const event of events) {
            const { ev, listener } = event;
            this._socket.on(ev, this.catchHandler(listener.bind(this)));
        }
    }

    private catchHandler(listener: IEvent['listener']) {
        return async (...args: unknown[]) => {
            try {
                await listener(...args);
            } catch (e) {
                if (e instanceof Error || e instanceof DatabaseError)
                    this.log.fatal(`[ERROR-LISTENER]: ${e.message}`);
            }
        }
    }

    public abstract registerListeners(): void;
}