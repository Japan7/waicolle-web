#!/bin/sh -ex

cd $(dirname $0)

http --check-status :3000/api/waifus < waicolle_export_waifus.json
http --check-status :3000/api/daily < waicolle_export_daily.json
http --check-status :3000/api/pools < waicolle_export_pools.json

echo Success.
