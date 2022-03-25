import 'dotenv/config';
import { APP_PORT } from '@app/config';
import App from '@app/app';
import Log from '@app/bootstrap/logger';

(async () => {
  const app = await App();
  app.listen(APP_PORT, async () => {
    Log.info(`listening at port:${APP_PORT}`);
    if (process.send) {
      process.send('ready');
    }
  });
})();
