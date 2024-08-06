const DiamSdk = require('diamante-sdk-js');
const server = new DiamSdk.Horizon.Server('https://diamtestnet.diamcircle.io');

const fetch = async () => {
  const asset = server.assets(
    'GDLTWSQEYSFSJNJJ35ZVCWT7DIMED2C56HRSUGR3CKT4UPD45CPUZBZ7'
  );
  const newAsset = new DiamSdk.Asset(
    'REALMEUSD',
    'GDLTWSQEYSFSJNJJ35ZVCWT7DIMED2C56HRSUGR3CKT4UPD45CPUZBZ7'
  );
  console.log(newAsset)
  const data = await asset.call();
  // await server.friendbot('GDWNNGJIIDJC7A5TOZUGEYRO3RJKJ2IMKY7VQX3GCB6S2J3JG64KAKE');
  // const acc = await server.loadAccount('GDWNNGJIIDJC7A5TOZUGEYRO3RJKJ2IMKY7VQX3GCB6S2J3JG64KAKE6')
  // console.log(acc.balances)
  console.log(data);
};

fetch();
