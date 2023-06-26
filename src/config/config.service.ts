import { config, DotenvParseOutput } from 'dotenv';
import { IConfigService } from './config.service.interface';

export class ConfigService implements IConfigService {
    private parsed: DotenvParseOutput;

    constructor() {
        const { parsed, error } = config();
        // Проверка на ошибку
        if (error || !parsed)
            throw new Error('Не удалось прочитать файл .env');
        
        this.parsed = parsed;
    }

    public get(key: string) {
        const cfgValue = this.parsed[key];
        // Выкидываем ошибку если константы из env не найдено
        if (cfgValue === undefined)
            throw new Error('Не сущ. константа');
            
        return cfgValue;
    }
}