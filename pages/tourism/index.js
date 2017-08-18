const App = getApp(); 
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    schedule: [],
    start: 0,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onLoad() {
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
    api.getScheduleList({
      data,
      success: (res) => {
        let scheduleList = res.data.result.data;
        if (needRefresh) {
          wx.stopPullDownRefresh();
        } else {
          scheduleList = self.data.schedule.concat(scheduleList);
        }
        self.setData({
          schedule: scheduleList
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
})