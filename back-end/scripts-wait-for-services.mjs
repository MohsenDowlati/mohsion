import net from 'node:net';
import logger from "./src/utils/logger.js";

const services = [
  {
    name: 'PostgreSQL',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: Number(process.env.POSTGRES_PORT || 5432),
  },
  {
    name: 'Redis',
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
  },
];

const timeoutMs = Number(process.env.SERVICE_WAIT_TIMEOUT_MS || 60_000);
const retryDelayMs = Number(process.env.SERVICE_WAIT_RETRY_MS || 1_000);

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function canConnect(host, port, connectTimeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const done = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(connectTimeout);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));

    socket.connect(port, host);
  });
}

async function waitForService({ name, host, port }) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const ok = await canConnect(host, port);
    if (ok) {
      logger.success(`${name} is ready at ${host}:${port}`);
      return;
    }

    logger.debug(`Waiting for ${name} at ${host}:${port}...`);
    await wait(retryDelayMs);
  }

  throw new Error(`Timed out waiting for ${name} at ${host}:${port} after ${timeoutMs}ms`);
}

(async function main() {
  for (const service of services) {
    await waitForService(service);
  }
  logger.info('All required services are ready.');
})().catch((error) => {
  logger.error(`${error.message}`);
  process.exit(1);
});
