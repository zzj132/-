<template>
	<camera 
	      id="myCamera" 
	      device-position="front" 
	      flash="off" 
	      style="width: 100%; height: 300px;"
	      @error="onCameraError"
	      @stop="onCameraStop"
	    />
	<button @click="openCarmera">开始获取视频帧</button>
	<image v-if="imageSrc" :src="imageSrc" style="width: 100%; height: auto;" />
</template>

<script>
	export default {
		data() {
			return {
				imageSrc: '',
				captureInterval: null
			}
		},
		onLoad() {

		},
		methods: {
			openCarmera() {
				const cameraContext = uni.createCameraContext(this);
				const fileSystemManager = wx.getFileSystemManager();
				const fileName = `${wx.env.USER_DATA_PATH}/captured_image_${Date.now()}.jpg`;
				this.captureInterval = setInterval(() => {
					cameraContext.takePhoto({
					  quality: 'high',
					  success: (res) => {
						this.imageSrc = res.tempImagePath;// 立即保存
						console.info(this.imageSrc);
						fileSystemManager.copyFile({
							srcPath: this.imageSrc,
							destPath: fileName,
							success: (res) => {
								console.log('文件保存成功:', fileName);
							},
							fail: (err) => {
								console.log("文件保存失败")
							}
						});
					  },
					  fail: (err) => {
						console.error(err);
					  }
					});
				}, 1000); // 每秒捕获一次
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>

