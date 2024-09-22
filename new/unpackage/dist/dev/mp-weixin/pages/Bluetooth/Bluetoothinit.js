"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "Bluetoothinit",
  setup(__props) {
    const blueDeviceList = common_vendor.ref([]);
    const blueConnectedDeviceList = common_vendor.ref([]);
    const bleDeviceid = common_vendor.ref("");
    const bleServiceid = common_vendor.ref("0000FFE0-0000-1000-8000-00805F9B34FB");
    const bleCharacteristicId = common_vendor.ref("0000FFE1-0000-1000-8000-00805F9B34FB");
    common_vendor.ref("");
    function getConnectionState() {
      common_vendor.index.onBLEConnectionStateChange((res) => {
        if (res.connected) {
          console.log(res.deviceId, ":蓝牙设备连接正常");
        } else {
          console.log("蓝牙连接断开");
        }
      });
    }
    function initBlue() {
      common_vendor.index.openBluetoothAdapter({
        success(res) {
          console.log(res, "初始化蓝牙成功");
        },
        fail(err) {
          common_vendor.index.showToast({
            title: "请开启蓝牙",
            icon: "none"
          });
        }
      });
    }
    function discovery() {
      initBlue();
      common_vendor.index.startBluetoothDevicesDiscovery({
        success(res) {
          console.log(res, "开始搜索附近蓝牙设备");
          common_vendor.index.onBluetoothDeviceFound(found);
        },
        fail(err) {
          console.log(err, "蓝牙设备搜索失败");
        }
      });
    }
    function found(res) {
      res.devices.forEach((device) => {
        if (!blueDeviceList.value.some((existingDevice) => existingDevice.deviceId === device.deviceId)) {
          blueDeviceList.value.push(res.devices[0]);
          console.log(res.devices);
        }
      });
    }
    function connect(data) {
      getConnectionState();
      bleDeviceid.value = data.deviceId;
      common_vendor.index.createBLEConnection({
        deviceId: bleDeviceid.value,
        success(res) {
          blueConnectedDeviceList.value.push(data);
          console.log(res, "蓝牙连接成功");
          stopDiscovery();
          notify();
        },
        fail(err) {
          console.log(err, "蓝牙连接失败");
        }
      });
    }
    function stopDiscovery() {
      common_vendor.index.stopBluetoothDevicesDiscovery({
        success(res) {
          console.log(res, "扫描关闭成功");
        },
        fail(err) {
          console.log(err, "扫描关闭失败");
        }
      });
    }
    function notify() {
      common_vendor.index.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: bleDeviceid.value,
        serviceId: bleServiceid.value,
        characteristicId: bleCharacteristicId.value,
        success(res) {
          console.log(res, "特征值监听开启");
        },
        fail(err) {
          console.log(err, "特征值监听失败");
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(blueDeviceList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.deviceId),
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => connect(item))
          };
        }),
        b: common_vendor.f(blueConnectedDeviceList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.deviceId),
            b: common_vendor.t(item.name)
          };
        }),
        c: common_vendor.o(discovery)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/86131/Desktop/new/pages/Bluetooth/Bluetoothinit.vue"]]);
wx.createPage(MiniProgramPage);
