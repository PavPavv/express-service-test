import http from "http"
import { env } from "./config/env.js";
import { createServer } from "./app.js";
import { prisma } from "./config/db.js";
import { logger } from './config/logger.js';

const main = async () => {
  try {
    // Проверка подключения БД
    await prisma.$connect();
    logger.info('Database connected');

    // Вот такой костыль нужен с express,
    // чтобы получить доступ к событиям сервера и обработать их
    const expressApp = createServer();
    const server = http.createServer(expressApp);

    server.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });

    // Обработка "выключения",
    // чтобы после завершения работы программы, база не соталась висеть подключенной
    const shutdown = (signal: string) => {
      logger.warn(`\n${signal} received`);

      server.close(async () => {
        logger.info('Сервер остановлен.');
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));


    // Обработка критических ошибок,
    // чтобы после сбоя программы, база не соталась висеть подключенной
    process.on("uncaughtException", (err) => {
      logger.fatal({ error: err }, 'Критический сбой.');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(1);
      });
    });

    // Тоже самое, но для промисов, если какой-то из них не отловлен
    process.on("unhandledRejection", (err) => {
      logger.fatal({ error: err }, 'Критический сбой при обработке промиса.');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(1);
      });
    });
  } catch (err) {
    logger.fatal({ error: err }, 'Критический сбой.');
    await prisma.$disconnect();
    process.exit(1);
  }
};
main();
