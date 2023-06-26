
export interface ILogService {
    info(...arg: unknown[]): void;
    warn(...arg: unknown[]): void;
    error(...arg: unknown[]): void;
    fatal(...arg: unknown[]): void;
}