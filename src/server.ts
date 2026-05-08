import { env } from "./config/env.js";
import { createServer } from "./app.js";

const main = async () => {
  try {
    const server = createServer();

    server.listen(env.PORT, () => {
      global.console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      global.console.log(`📝 Environment: ${env.NODE_ENV}`);
    });

    // TODO: graceful shutdown for SIGTERM, SIGINT
  } catch (err) {
    // TODO: add log error
    process.exit(1);
  }
};
main();
