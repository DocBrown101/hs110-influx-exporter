import {InfluxDB, Point} from '@influxdata/influxdb-client';
import {PingAPI} from '@influxdata/influxdb-client-apis';

const timeout = 10 * 1000; // timeout for ping
var flushCounter = 0;

class InfluxClient {
  constructor(config) {
    const url = `http://${config.influxHost}:${config.influxHostPort}`;
    const bucket = config.influxDatabase;

    this.config = config;
    this.influxDB = new InfluxDB({url, timeout});
    this.writeApi = this.influxDB.getWriteApi('home', bucket, 'ms');
    this.writeApi.useDefaultTags({host: this.config.hostname});
  }

  async checkingDatabaseConnectionWithPing() {
    console.log("Check influxdb connection ...");
    const pingAPI = new PingAPI(this.influxDB);

    await pingAPI.getPing()
      .then(() => {
        console.log('Ping SUCCESS');
      })
      .catch(error => {
        console.error(error);
        console.error(this.constructor.name, "Connection to the influxdb could not be established!");
      });
  }

  async sendMetrics(metrics, sysInfo) {
    const point = new Point('power_consumption')
      .tag('alias', sysInfo.alias)
      .floatField('current', metrics.current)
      .floatField('voltage', metrics.voltage)
      .floatField('total', metrics.total)
      .floatField('power', metrics.power);
    this.writeApi.writePoint(point);

    if (++flushCounter >= 3) {
      flushCounter = 0;

      await this.writeApi.flush()
        .then(() => {
          console.debug('FLUSH FINISHED');
        })
        .catch(e => {
          console.error(this.constructor.name, e);
        });
    }
  }
}

export default InfluxClient;