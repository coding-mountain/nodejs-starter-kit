import https from 'https';
import http from 'http';
import { URL } from 'url';

class Request {
  get(url: string, headers?: any) {
    return this.request(url, 'GET', undefined, headers);
  }

  post(url: string, data: any, headers?: any) {
    return this.request(url, 'POST', data, headers);
  }

  parseUrl(url: string) {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.replace(':', '');

    return {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      protocol,
    };
  }

  request(url: string, method: string = 'GET', data?: any, headers?: any) {
    const parsedUrl = this.parseUrl(url);
    const protocal = parsedUrl.protocol === 'https' ? https : http;
    const postData = data ? JSON.stringify(data) : undefined;
    const body: Buffer[] = [];

    return new Promise((resolve, reject) => {
      const options = {
        host: parsedUrl.host,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method,
        headers,
      };

      if (method === 'POST') {
        options.headers['Content-Type'] = 'application/json';
      }

      if (postData) {
        if (headers) {
          options.headers['content-length'] = postData.length;
        } else {
          options.headers = { 'content-length': postData.length };
        }
      }
      const req = protocal.request(options, (res) => {
        res.on('data', (chunk: Buffer) => {
          body.push(chunk);
        });
      });

      req.on('error', (e: any) => {
        reject(e);
      });

      req.on('end', () => {
        resolve(Buffer.concat(body).toString());
      });

      // post data
      if (postData) {
        req.write(Buffer.from(postData, 'utf8'));
      }

      req.end();
    });
  }
}

export default new Request();
