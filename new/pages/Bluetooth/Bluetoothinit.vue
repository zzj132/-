<template>
	<view>
		<h5>附近蓝牙设备</h5>
		<scroll-view scroll-y class="box">
			<view class="item" v-for="item in blueDeviceList" @click="connect(item)">
				<view>
					<text>蓝牙id: {{ item.deviceId }}</text>
				</view>
				<view>
					<text>蓝牙名称: {{ item.name }}</text>
				</view>
			</view>
		</scroll-view>
		<h5>已连接蓝牙设备</h5>
		<scroll-view scroll-y class="box1">
			<view class="item1" v-for="item in blueConnectedDeviceList">
				<view>
					<text>已连接蓝牙id: {{ item.deviceId }}</text>
				</view>
				<view>
					<text>已连接蓝牙名称: {{ item.name }}</text>
				</view>
			</view>
		</scroll-view>
		<view>
			<button class="button" @click="discovery">搜索附近蓝牙设备</button>
		</view>

	</view>
</template>
​
<script setup>
	import {
		ref
	} from "vue"

	/* 
	 变量依次为：
	 所获取的蓝牙列表
	 设备id
	 服务id
	 特征值
	 指令
	 */

	const blueDeviceList = ref([])
	const blueConnectedDeviceList = ref([])
	const bleDeviceid = ref('')
	const bleServiceid = ref('0000FFE0-0000-1000-8000-00805F9B34FB')
	const bleCharacteristicId = ref('0000FFE1-0000-1000-8000-00805F9B34FB')
	const code = ref('')

	//监测连接状态
	function getConnectionState() {
		uni.onBLEConnectionStateChange(res => {
			if (res.connected) {
				console.log(res.deviceId, ":蓝牙设备连接正常")
			} else {
				console.log("蓝牙连接断开")
			}
		})
	}

	//初始化蓝牙
	function initBlue() {
		uni.openBluetoothAdapter({
			success(res) {
				console.log(res, '初始化蓝牙成功')
			},
			fail(err) {
				uni.showToast({
					title: "请开启蓝牙",
					icon: "none",
				})
			}
		})
	}


	//开始搜寻附近设备
	function discovery() {

		initBlue()
		uni.startBluetoothDevicesDiscovery({
			success(res) {

				console.log(res, '开始搜索附近蓝牙设备')
				// 开启监听回调
				uni.onBluetoothDeviceFound(found)
			},
			fail(err) {
				console.log(err, '蓝牙设备搜索失败')
			}
		})
	}

	//找到新设备就触发该方法
	function found(res) {
		res.devices.forEach(device => {
		    if (!blueDeviceList.value.some(existingDevice => existingDevice.deviceId === device.deviceId)) {
		      blueDeviceList.value.push(res.devices[0])
		      console.log(res.devices)
		    }
		  });

		

	}


	//蓝牙连接
	function connect(data) {
		getConnectionState()
		bleDeviceid.value = data.deviceId

		uni.createBLEConnection({
			deviceId: bleDeviceid.value,
			success(res) {
				blueConnectedDeviceList.value.push(data)
				console.log(res, "蓝牙连接成功")
				// 停止搜索
				stopDiscovery()
				//开启监听
				notify()
			},
			fail(err) {
				console.log(err, '蓝牙连接失败')
			}
		})
	}

	//停止扫描
	function stopDiscovery() {
		uni.stopBluetoothDevicesDiscovery({
			success(res) {
				console.log(res, "扫描关闭成功")
			},
			fail(err) {
				console.log(err, "扫描关闭失败")
			}
		})
	}


	//开启监听
	function notify() {
		uni.notifyBLECharacteristicValueChange({
			state: true,
			deviceId: bleDeviceid.value,
			serviceId: bleServiceid.value,
			characteristicId: bleCharacteristicId.value,
			success(res) {
				console.log(res, "特征值监听开启")
			},
			fail(err) {
				console.log(err, '特征值监听失败')
			}

		})
	}


	//发送信息
	function send(code) {
		// 向蓝牙设备发送一个16进制数据
		let noSpaceCode = code.replace(/\s+/g, '');
		const buffer = new ArrayBuffer(noSpaceCode.length / 2);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < noSpaceCode.length; i += 2) {
			view[i / 2] = parseInt(noSpaceCode.substring(i, i + 2), 16);
		}

		uni.writeBLECharacteristicValue({
			deviceId: bleDeviceid.value,
			serviceId: bleServiceid.value,
			characteristicId: bleCharacteristicId.value,
			value: view,
			success(res) {
				console.log(res, '数据发送成功')
			},
			fail(err) {
				console.error(err, '数据发送异常')
			}
		})
	}
</script>

<style>
	h5 {
		color: #ccc;
	}

	.box {
		width: 100%;
		height: 600rpx;
		box-sizing: border-box;
		margin-bottom: 150rpx;
		border: 2px solid dodgerblue;
	}

	.box1 {

		width: 100%;
		height: 150rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		border: 2px solid dodgerblue;
	}

	.item {
		box-sizing: border-box;
		padding: 10rpx;
		border-bottom: 4px solid #ccc;

	}

	.item1 {

		height: 150rpx;
		box-sizing: border-box;
		padding: 10rpx;
		display: flex;
		justify-content: center;
		/* 水平居中 */

	}

	.item:active {
		background-color: #66afe9;
	}

	/* 基础按钮样式 */
	.button {
		position: absolute;
		bottom: 150;
		/* 将按钮放置在底部 */

		margin: 5% 10% 5% 10%;

		padding: 10px 80px;
		font-size: 16px;

		text-align: center;
		text-decoration: none;
		outline: none;
		color: #fff;
		border: none;
		border-radius: 8px;
		background-color: #66afe9;


	}



	/* 按钮按下效果 */
	.button:active {
		background-color: #66afe9;
		box-shadow: 0 5px #666;
	}
</style>