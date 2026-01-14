import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
const cors = require("cors")
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errors';

async function startServer() {
  const app = express();
  const port = process.env.PORT || 4000;

 
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      logger.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
        extensions: {
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        },
      };
    },
  });

  
  await server.start();


  app.use(cors());
  app.use(express.json());
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        requestId: req.headers['x-request-id'] || Date.now().toString(),
      }),
    })
  );

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

 
  app.use(errorHandler);

  app.listen(port, () => {
    logger.info(`🚀 Server running at http://localhost:${port}/graphql`);
  });
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});