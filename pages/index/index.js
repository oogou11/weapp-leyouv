const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    trips: [],
    start: 0,
    loading: false,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onLoad() {
    wx.getUserInfo({
      success: function (res) {
        wx.login({
          success: function (lg_res) {
            let param = {
              success: (res) => {
                console.log(res)
                wx.setStorage({
                  key: "session_id",
                  data: res.data.result
                })
              }, method: "POST", "data": { "code": lg_res.code, "encryptedData": res.encryptedData, "iv": res.iv, "userInfo": res.userInfo }
            }
            if (lg_res.code) {
              api.addNewUser(param)
            }
          }
        })
      }
    })
    this.loadMore();
  },
  onPullDownRefresh() {
    this.loadMore(null, true);
  },
  loadMore(e, needRefresh) {
    const self = this;
    const loading = self.data.loading;
    const data = {
      next_start: self.data.start,
    };
    if (loading) {
      return;
    }
    self.setData({
      loading: true,
    });
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
          start: nextStart,
          loading: false,
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
