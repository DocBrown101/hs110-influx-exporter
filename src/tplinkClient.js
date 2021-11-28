import InfluxClient from './influxClient';
import {Client} from 'tplink-smarthome-api';

class TplinkClient {
  constructor(config) {
    this.config = config;
    this.intervalInMilliseconds = this.config.intervalInMilliseconds;

    this.influxClient = new InfluxClient(this.config);
    this.tplinkApi = new Client();
  }

  async startCollectingMetrics() {
    await this.influxClient.checkingDatabaseConnectionWithPing();

    this.tplinkApi.startDiscovery().on('device-new', device => this.deviceFound(device));
  }

  deviceFound(device) {
    device.getSysInfo().then(sysInfo => {
      console.info("device found: " + sysInfo.alias + " - rssi: " + sysInfo.rssi);
      setInterval(() => {
        device.emeter.getRealtime()
          .then(realtimeMetric => this.influxClient.sendMetrics(realtimeMetric, sysInfo))
          .catch(err => console.error(this.constructor.name, err));
      }, this.intervalInMilliseconds);
    });
  }
}

export default TplinkClient;
