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
    wx.showLoading({
      title: '加载中...',
    })
    api.getTripInfoByID({
      query: {
        tripId: id,
      },
      success: (res) => {
        const result = res.data.result;
        self.setData({
          trip: result.trip,
          days: result.days
        })
      },
      complete: () => {
        wx.hideLoading()
      }
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
