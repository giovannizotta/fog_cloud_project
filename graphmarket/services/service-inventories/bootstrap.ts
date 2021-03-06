import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { buildGraphQLService } from '@libs/helpers';
import { entitiesList } from '@libs/entities';
import { config } from './config';
import { logger } from './logger';

// Bootstrap
async function bootstrap() {
  // Database
  useContainer(Container);
  initializeTransactionalContext();
  await createConnection({
    type: 'postgres',
    url: config.database.url,
    ssl: config.database.ssl,
    synchronize: config.database.synchronize,
    logging: config.database.logging,
    entities: entitiesList,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
  logger.info('Database connected');

  // Build GraphQL service
  const service = await buildGraphQLService({
    schema: (await import('./graphql')).schema,
    path: config.graphql.path,
    playground: config.graphql.playground,
  });
  logger.info('Service built');

  // Start service
  const serviceUrl = await service.listen(config.node.port, '0.0.0.0');
  logger.info(`Service running on ${serviceUrl + config.graphql.path}`);
}

bootstrap()
  .then(() => {
    logger.info('Bootstrap successful');
  })
  .catch((error) => {
    logger.info(`Bootstrap error: ${error}`);
    process.exit(1);
  });
