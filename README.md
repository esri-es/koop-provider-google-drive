# Koop Provider Google Drive for Spreadsheets
This provider is not finished yet, please [read the TODO list](https://github.com/esri-es/koop-provider-google-drive/issues/1).

Right now it works returning a GeoJSON of [this spreadsheet](http://bit.ly/3v3nt0s)

Live demo:
1. [Google Spreadsheet interface](http://bit.ly/3v3nt0s)
2. [Google Spreadsheet JSON](http://bit.ly/3v3nt0s_1)
3. [Feature Service](http://80.85.87.124:8080/google-drive/FeatureServer/0/query)
4. [ArcGIS Web Map](http://arcg.is/1XXfnv)

## Test it out
Run server:
- `npm install`
- `npm start`

Example API Query:
- `curl localhost:8080/google-drive/FeatureServer/0/query?returnCountOnly=true`

Browser:
- `localhost:8080/google-drive/FeatureServer/0/query`

Tests:
- `npm test`

## Publish to npm
- run `npm init` and update the fields
  - Choose a name like `koop-provider-google-drive`
- run `npm publish`
