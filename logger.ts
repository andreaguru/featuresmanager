/**
 *
 * Just a few words about the logger:
 * We decided to use pino, as it claims to be a very fast nodejs logger with little overhead and
 * and an easy http logging possibility in express via pino-http (https://www.npmjs.com/package/pino-http).
 *
 * Basically we handle the logging on production quite different than for local development.
 * In both cases, we log to stdout. On production, we log in json format (the standard of pino) which pino
 * claims to be the fastest option. Another service, independent to our service, run by infrastructure reads the stdout
 * of every pod and writes it to prometheus. Once in prometheus, it can be easily evaluated in Kibana.
 * On local environments we use an easier readable log format "time - loglevel - host - initiator - message"
 * For further pino settings, see: https://getpino.io/
 *
 * The logger can be configure via 2 env variables:
 * - LOG_LEVEL: One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'
 * - LOG_PRETTY : true/false (false should be the default on production once json format is supported)
 *
 */
import pino from "pino";

const isDev: boolean = process.env.NODE_ENV === "development";
const doPrettyPrint: boolean = !!(process.env.LOG_PRETTY || isDev);
const pinoOptions = {
    // One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'
    level: process.env.LOG_LEVEL || (isDev ? "trace" : "info"),
    formatters: {
        // the level-function changes the log-level from numbers to "readable" strings
        level: (label: string) => ({ level: label }),
    },
    // we want to have utc-time
    timestamp: pino.stdTimeFunctions.isoTime, // pino.stdTimeFunctions.epochTime
    // switch from json format to easy readable format
    transport: doPrettyPrint
        ? {
              target: "pino-pretty",
              options: {
                  messageFormat: "{msg} {res.statusCode} {req.url}",
                  ignore: "req,res,responseTime",
              },
          }
        : false,
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const logger = pino(pinoOptions);
export default logger;

logger.debug("created logger instance");
