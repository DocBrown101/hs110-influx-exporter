import Config from './config';
import betterLogging from 'better-logging';
import TplinkClient from './tplinkClient';

const config = new Config();
const client = new TplinkClient(config);

betterLogging(console);

config.logSettings();
client.startCollectingMetrics();
