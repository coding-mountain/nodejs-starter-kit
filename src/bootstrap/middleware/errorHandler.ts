import { NextFunction, Request, Response } from 'express';
import Log from '@app/bootstrap/logger';

const logMessage = (errorMessage: string, err: any, req: Request) => {
  const { ip, hostname, originalUrl, token } = req;
  const requestData: any = {
    stack: err.stack,
    status: err.status,
    ip,
    url: hostname + originalUrl,
  };

  if (token) {
    requestData.userUid = token.uid;
  }

  requestData.data = {};

  if (req.body) {
    requestData.data.body = req.body;
  }

  if (req.query) {
    requestData.data.query = req.query;
  }

  Log.error(`requestData ${errorMessage} ${err.stack}`, requestData);
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || (err.errors && err.errors[0].message) || 'Internal Server Error';
  if (status === 500) {
    logMessage(message, err, req);
  }
  return res.status(status).json({
    message,
    status: 'error',
  });
};

process.on('unhandledRejection', (err: Error) => {
  Log.error(`unhandledRejection: ${err.message} ${err.stack}`);
  process.exit();
});

process.on('uncaughtException', (err: Error) => {
  Log.error(`unhandledRejection: ${err.message} ${err.stack}`);
  process.exit();
});

export default errorHandler;
