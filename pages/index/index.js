// pages/wxml/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // time: (new Date()).toString
    SSID: "天空",
    password: "gewailan!@#147",
    BSSID: "",
    endError: "", //连接最后的提示
    startError: "", //初始化错误提示
    networkType: "", //网络状态
    iswifi: null,
  },
  onLoad(options) {
    if (options.wifi && options.psd) {
      this.setData({
        SSID: options.wifi,
        password: options.psd,
      });
    }
    console.log("SSID", options.wifi);
    console.log("password", options.psd);

    wx.getSystemInfo({
      success: function (res) {
        var system = "";
        if (res.platform == "android") system = parseInt(res.system.substr(8));
        if (res.platform == "ios") system = parseInt(res.system.substr(4));
        if (res.platform == "android" && system < 6) {
          wx.showToast({
            title: "手机版本不支持",
            icon: "none",
          });
          return;
        }
        if (res.platform == "ios" && system < 11.2) {
          wx.showToast({
            title: "手机版本不支持",
            icon: "none",
          });
          return;
        }
      },
    });
  },
  // 初始化WiFi模块
  startwifi: function () {
    var that = this;
    wx.startWifi({
      success: function () {
        console.log("startwifi suc");
        that.Connected();
      },
    });
  },
  Connected: function () {
    var that = this;
    wx.connectWifi({
      SSID: this.data.SSID,
      password: this.data.password,
      BSSID: this.data.BSSID,
      forceNewApi: true,
      //   maunal:true,
      success: function (res) {
        // 获取网络类型
        wx.getNetworkType({
          success: function (res) {
            console.log("resss", res);
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res.networkType;
            that.setData({
              networkType: networkType,
            });

            console.log("networkType", that.data.networkType);

            if (that.data.networkType == "wifi") {
              that.setData({
                iswifi: true,
                endError: "wifi连接成功",
              });
            } else {
              that.setData({
                iswifi: false,
                endError: res.errMsg,
              });
            }
          },
        });
      },
      fail: function (err) {
        console.log("connectWifi fail", err);
      },
    });
  },
});
