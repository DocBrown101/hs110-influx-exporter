import {hostname} from 'os';

class Config {
  constructor() {
    this.hostname = process.env.HOSTNAME || hostname();
    this.influxHost = process.env.INFLUX_HOST || "localhost";
    this.influxHostPort = process.env.INFLUX_PORT || "8086";
    this.influxDatabase = process.env.INFLUX_DB || "hs110";
    this.influxUsername = process.env.INFLUX_USERNAME || "root";
    this.influxPassword = process.env.INFLUX_PASSWORD || "root";
    this.intervalInMilliseconds = process.env.INTERVAL_MS || 10000;
    this.isDebug = process.env.DEBUG || false;
  }
  logSettings() {
    console.info("- Setting -");
    console.info("hostname: ", this.hostname);
    console.info("influxHost: ", this.influxHost);
    console.info("influxHostPort: ", this.influxHostPort);
    console.info("influxDatabase: ", this.influxDatabase);
    console.info("intervalInMilliseconds: ", this.intervalInMilliseconds);
    console.info("isDebug: ", this.isDebug);
    console.info("- Setting -");
    console.info("Version: 1.1.0");
  }
}

export default Config;