import { IPersistenceService } from './..';
import { ILogger } from '@baseline-protocol/types';
import { Logger } from 'mongodb';

class MongodbLogger implements ILogger {

  private logger: Logger;

  constructor() {
    this.logger = new Logger('MongodbLogger');
  }

  debug(msg: string): void {
    if (this.logger.isDebug()) {
      // extend ILogger interface with args:any?
      this.logger.debug(msg, {});
    }
  }

  info(msg: string): void {
    if (this.logger.isInfo()) {
      // extend ILogger interface with args:any?
      this.logger.info(msg, {});
    }
  }

  warn(msg: string): void {
    if (this.logger.isWarn()) {
      // extend ILogger interface with args:any?
      // Logger of mongodb has no warning level logging
      this.logger.error(msg, {});
    }
  }

  error(msg: string): void {
    if (this.logger.isError()) {
      // extend ILogger interface with args:any?
      this.logger.console.error(msg, {});
    }
  }
}

export class Mongodb implements IPersistenceService {

  private config: any;
  private logger: MongodbLogger;
  private connectionUrl: string;
  private databaseName: string;
  private collectionName: string;

  constructor(config: any) {
      this.config = config;
      this.logger = new MongodbLogger();

      this.connectionUrl = config.url;
      this.databaseName = config.database;
      this.collectionName = config.collection;
  }

  alert(params: any): Promise<any> {
    throw new Error('not implemented');
  }

  subscribe(params: any): Promise<any> {
    throw new Error('not implemented');
  }

  unsubscribe(params: any): Promise<any> {
    throw new Error('not implemented');
  }

  publish(params: any): Promise<any> {
    throw new Error("not implemented");
  }
}

export async function sapServiceFactory(
  config?: any,
): Promise<Mongodb> {
  return new Mongodb(config);
}
