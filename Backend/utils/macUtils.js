// utils/macUtils.js

const { execSync } = require('child_process');
const os = require('os');

function getConnectedWifiMac() {
  try {
    const output = execSync('netsh wlan show interfaces', { encoding: 'utf-8' });
    const match = output.match(/BSSID\s+:\s+([0-9a-fA-F:-]{17})/);
    return match ? match[1].toLowerCase().trim() : null;
  } catch (error) {
    console.error("❌ Failed to fetch WiFi MAC:", error.message);
    return null;
  }
}

function getLocalDeviceMac() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.mac.toLowerCase();
      }
    }
  }
  return null;
}

module.exports = {
  getConnectedWifiMac,
  getLocalDeviceMac,
};
