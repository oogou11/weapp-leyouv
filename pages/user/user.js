const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    trips: [],
    user_info: null,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onLoad(options) {
    const self = this;
    const userId = options.id || self.data.userId;
    console.log(userId)
    api.getUserInfoByID({
      query: {
        userId,
      },
      success: (res) => { 
        const result = res.data.result; 
        self.setData({
          trips: result.trips,
          userId: userId,
          user_info: result.user,
        });
        wx.setNavigationBarTitle({
          title: res.data.user_info.name,
        });
      },
    });
  },
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
});
