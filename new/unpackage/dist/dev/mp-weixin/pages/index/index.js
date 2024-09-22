"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      imageSrc: "",
      captureInterval: null
    };
  },
  onLoad() {
  },
  methods: {
    openCarmera() {
      const cameraContext = common_vendor.index.createCameraContext(this);
      const fileSystemManager = common_vendor.wx$1.getFileSystemManager();
      const fileName = `${common_vendor.wx$1.env.USER_DATA_PATH}/captured_image_${Date.now()}.jpg`;
      this.captureInterval = setInterval(() => {
        cameraContext.takePhoto({
          quality: "high",
          success: (res) => {
            this.imageSrc = res.tempImagePath;
            console.info(this.imageSrc);
            fileSystemManager.copyFile({
              srcPath: this.imageSrc,
              destPath: fileName,
              success: (res2) => {
                console.log("文件保存成功:", fileName);
              },
              fail: (err) => {
                console.log("文件保存失败");
              }
            });
          },
          fail: (err) => {
            console.error(err);
          }
        });
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => _ctx.onCameraError && _ctx.onCameraError(...args)),
    b: common_vendor.o((...args) => _ctx.onCameraStop && _ctx.onCameraStop(...args)),
    c: common_vendor.o((...args) => $options.openCarmera && $options.openCarmera(...args)),
    d: $data.imageSrc
  }, $data.imageSrc ? {
    e: $data.imageSrc
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/86131/Desktop/new/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
