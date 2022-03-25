import YAML from 'yamljs';
import { connector } from 'swagger-routes-express';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { APP_ENV } from '@app/config';
import * as OpenApiValidator from 'express-openapi-validator';
import { JWT } from '@app/bootstrap/middleware/jwt';
import controllers from '@app/controllers';
import { admin, user } from '@app/bootstrap/middleware/roleMiddleware';
import logRequest from './logRequest';

export const YAML_FILE: string = './src/bootstrap/swagger.yml';

const swagger = async (app: Application) => {
  const apiDefinition = YAML.load(YAML_FILE);

  // swagger End point for api doc
  if (APP_ENV === 'development') {
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(apiDefinition));
  }

  // validation
  app.use(
    OpenApiValidator.middleware({
      apiSpec: YAML_FILE,
      validateRequests: true,
      //  validateResponses: true,
      validateSecurity: true,
    })
  );

  app.use(logRequest);
  const connect = connector(controllers, apiDefinition, {
    security: {
      JWT,
    },
    middleware: {
      admin,
      user,
    },
  });

  connect(app);
};

export default swagger;
