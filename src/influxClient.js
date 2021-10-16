import {InfluxDB, FieldType} from 'influx';

class InfluxClient {
  constructor(config) {
    this.config = config;
    this.influxDB = new InfluxDB({
      host: config.influxHost,
      port: config.influxHostPort,
      database: config.influxDatabase,
      username: config.influxUsername,
      password: config.influxPassword,
      schema: [
        {
          measurement: "power_consumption",
          tags: [
            "host", "alias"
          ],
          fields: {
            current: FieldType.FLOAT,
            voltage: FieldType.FLOAT,
            total: FieldType.FLOAT,
            power: FieldType.FLOAT,
          }
        }
      ]
    });
  }

  async checkDatabase() {
    console.log("Check influx database ...");
    try {
      const names = await this.influxDB.getDatabaseNames();
      if (!names.includes(this.config.influxDatabase)) {
        try {
          console.log("No database found, try to create ...");
          await this.influxDB.createDatabase(this.config.influxDatabase);
        } catch (err) {
          console.error(this.constructor.name, "Error creating Influx database!");
        }
      }
    } catch (err) {
      console.error(this.constructor.name, "Connection to the influx database could not be established!");
    }
  }

  async sendMetrics(metrics, sysInfo) {
    try {
      await this.influxDB.writePoints([
        {
          measurement: "power_consumption",
          tags: {
            host: this.config.hostname,
            alias: sysInfo.alias
          },
          fields: metrics,
        }
      ]);
    }
    catch (e) {
      console.error(this.constructor.name, e);
    }
  }
}

export default InfluxClient;