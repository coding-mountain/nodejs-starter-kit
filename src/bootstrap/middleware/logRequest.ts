import { NextFunction, Request, Response } from 'express';
import Log from '@app/bootstrap/logger';
import { APP_ENV, ENV } from '@app/config';

const skip = ['/images', '/videos', '/api-doc'];

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const { ip, originalUrl, token } = req;

  if (!originalUrl || skip.some((url) => originalUrl.includes(url))) {
    next();
    return;
  }

  const requestData: any = {
    ip,
    method: req.method,
    url: originalUrl,
    headers: req.headers,
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

  if (req.files && req.files.length) {
    requestData.data.files = [...(req.files as Array<any>)].map((f: any) => ({
      ...f,
      buffer: '',
    }));
  }

  requestData.method = req.method;
  if (APP_ENV === ENV.DEV) {
    Log.info(`requestData: ${JSON.stringify(requestData)}`);
  }
  next();
};

export default logRequest;
