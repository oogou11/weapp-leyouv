const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    trips: [],
    start: 0,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onLoad() {
    api.addNewUser();
    this.loadMore();
  },
  onPullDownRefresh() {
    this.loadMore(null, true);
  },
  loadMore(e, needRefresh) {
    wx.showLoading({
      title: '加载中...',
    })
    const self = this;
    const data = {
      next_start: self.data.start,
    };
    api.getHotTripList({
      data,
      success: (res) => {
        let newList = res.data.result.data;
        if (needRefresh) {
          wx.stopPullDownRefresh();
        } else {
          newList = self.data.trips.concat(newList);
        }
        self.setData({
          trips: newList
        });
        const nextStart = res.data.result.next_start;
        self.setData({
          start: nextStart
        }); 
      },
      complete: () => {
        wx.hideLoading()
      }
    });
  },
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
});
