import { Application } from 'express';
import winston from 'winston';
declare const logger: winston.Logger;
declare const app: Application;
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export { app, server, logger };
//# sourceMappingURL=index.d.ts.map