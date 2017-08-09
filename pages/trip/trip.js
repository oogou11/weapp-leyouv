const api = require('../../utils/api.js');

const app = getApp();
Page({
  data: {
    trip: {},
    days: [],
    options: null,
    windowWidth: 0,
  },
  onReady() {
    const self = this;
    wx.setNavigationBarTitle({
      title: self.data.options.name,
    });
  },
  onLoad(options) {
    const self = this;
    const id = options.id;    
    self.setData({
      options,
      windowWidth: app.systemInfo.windowWidth,
    });
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000,
    });
    api.getTripInfoByID({
      query: {
        tripId: id,
      },
      success: (res) => {
        const result = res.data.result;
        self.setData({
          trip: result.trip,
          days: result.days
        }); 
        wx.hideToast();
      },
    }
    );
  },
  viewWaypoint(e) {
    const self = this;
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../waypoint/waypoint?waypointId=${ds.waypoint}`,
    });
  },
  gotoUser(e) {
    const userId = e.target.dataset.id;
    wx.navigateTo({
      url: `../user/user?id=${userId}`,
    });
  },
});
