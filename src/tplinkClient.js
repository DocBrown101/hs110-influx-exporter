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
    await this.influxClient.checkDatabase();

    this.tplinkApi.startDiscovery().on('device-new', device => this.deviceFound(device));

    // console.info("test");
  }

  deviceFound(device) {
    device.getSysInfo().then(sysInfo => {
      console.info("device found: " + sysInfo.alias + " - rssi: " + sysInfo.rssi);
      setInterval(() => {
        try {
          this.queryRealtimeMetric(device)
            .then(realtimeMetric => this.cleanUpRealtimeMetric(realtimeMetric))
            .then(realtimeMetric => this.influxClient.sendMetrics(realtimeMetric, sysInfo));
        }
        catch (e) {
          console.error(this.constructor.name, e);
        }
      }, this.intervalInMilliseconds);
    });
  }

  queryRealtimeMetric(device) {
    return device.emeter.getRealtime();
  }

  cleanUpRealtimeMetric(raw) {
    delete raw.err_code;
    delete raw.current_ma;
    delete raw.power_mw;
    delete raw.total_wh;
    delete raw.voltage_mv;
    return raw;
  }
}

export default TplinkClient;
