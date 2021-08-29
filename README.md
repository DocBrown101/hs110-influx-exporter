# hs110-influx-exporter

> A TP-link hs110 smart plug exporter for influxDB

# Install
```bash
git clone https://github.com/DocBrown101/hs110-influx-exporter.git
npm i
```
# Usage
npm start
or
docker-compose up -d

## These are all environment variables and their default values:
> INFLUX_HOST || "localhost";
> INFLUX_PORT || "8086";
> INFLUX_DB || "hs110";
> INFLUX_USERNAME || "root";
> INFLUX_PASSWORD || "root";
> INTERVAL_MS || 10000;
