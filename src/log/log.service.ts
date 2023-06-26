import { Logger, ILogObj } from 'tslog';
import { ILogService } from './log.service.interface';

export class LogService implements ILogService {
    private logger: Logger<ILogObj>;

    constructor() {
        this.logger = new Logger({
            hideLogPositionForProduction: true,
            prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{mm}} {{logLevelName}} ',
            prettyLogTimeZone: 'local',
        })
    }

    public info(...arg: unknown[]): void {
        this.logger.info(...arg);
    }

    public warn(...arg: unknown[]): void {
        this.logger.warn(...arg);
    }

    public error(...arg: unknown[]): void {
        this.logger.error(...arg);
    }

    public fatal(...arg: unknown[]): void {
        this.logger.fatal(...arg);
    }
}