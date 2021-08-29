import InfluxClient from './influxClient';
import {Client} from 'tplink-smarthome-api';

class TplinkClient {
  constructor(config) {
    this.config = config;
    this.intervalInMilliseconds = this.config.intervalInMilliseconds;

    this.influxClient = new InfluxClient(this.config);
    this.tplinkApi = new Client();
  }

  startCollectingMetrics() {
    this.influxClient.checkDatabase()
      .then(() => this.tplinkApi.startDiscovery()
        .on('device-new', dev => this.deviceFound(dev)));
  }

  deviceFound(device) {
    device.getSysInfo().then(sysInfo => {
      console.info("device found: " + sysInfo.alias, sysInfo);
      setInterval(() => {
        this.queryRealtimeMetric(device)
          .then(realtimeMetric => this.cleanUpRealtimeMetric(realtimeMetric))
          .then(realtimeMetric => this.influxClient.sendMetrics(realtimeMetric, sysInfo));
      }, this.intervalInMilliseconds);
    });
  }

  queryRealtimeMetric(device) {
    // TODO
    /* device.emeter.getMonthStats(2021).then(currentPeriodStats => {
      console.warn("XXX: ", currentPeriodStats);
    }); */

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
