import Config from './config';
import betterLogging from 'better-logging';
import TplinkClient from './tplinkClient';

const config = new Config();
const client = new TplinkClient(config);

betterLogging(console, {
  format: ctx => `${ctx.time24} ${ctx.date} ${ctx.type} ${ctx.msg}`
});

config.logSettings();
client.startCollectingMetrics();
