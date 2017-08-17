const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;
const app = getApp();
Page({
  data: {
    waypoint: null,
    replies: {
      recommender_count: 0,
      recommenders: [],
      comments: [],
      comment_count: 0,
    },
    title: '',
    windowWidth: 0,
    visiable: false,
    focus: false
  },
  onReady() {
    const self = this;
    wx.setNavigationBarTitle({
      title: self.data.title,
    });
  },
  onLoad(options) {
    const self = this;
    const waypointId = options.waypointId;
    self.setData({
      windowWidth: app.systemInfo.windowWidth,
    });
    this.getWaypointDetail(waypointId);
  },
  getWaypointDetail(waypointId) {
    wx.showLoading({
      title: '加载中...',
    })
    const self = this;
    api.getWaypointInfoByID({
      query: {
        waypointId,
      },
      success: (res) => {
        const waypoint = res.data.result;
        self.setData({
          title: waypoint.trip_name,
          waypoint,
          replies: {
            recommender_count: waypoint.recommender_count,
            comment_count: waypoint.comment_count,
            comments: waypoint.comments,
            recommenders: waypoint.recommenders
          }
        });
      },
      complete: () => {
        wx.hideLoading()
      }
    });
  },
  gotoUser(e) {
    const userId = e.target.dataset.id;
    wx.navigateTo({
      url: `../user/user?id=${userId}`,
    });
  },
  previewImage(e) {
    const url = e.currentTarget.dataset.src;
    wx.previewImage({
      current: url,
      urls: [url],
    });
  },
  add_replies(e) {
    const self = this;
    const waypoint_id = e.currentTarget.dataset.waypointid
    wx.getStorage({
      key: 'session_id',
      success: function (res) {
        self.add_user_or_replies(waypoint_id, res.data)
      },
      fail: function (res) {
      }
    })
  },
  add_user_or_replies(id, sessionid) {
    let param = {
      query: {
        waypointid: id,
        sessionid: sessionid,
      },
      success: (res) => {
        if (res.data.code == 0) {
          this.getWaypointDetail(id);
        }
      }
    }
    api.addNewLivePerson(param)
  },
  setComment: function () {
    this.setData({
      visiable: true,
      focus: true
    })
  },
  cancleComment: function () {
    this.setData({
      visiable: false,
      focus: false
    })
  },
  submitComment: function (e) {
    const self = this
    const waypointid = self.data.waypoint.id
    const text = e.detail.value.textarea

    wx.getStorage({
      key: 'session_id',
      success: function (res) {
        self.add_user_comment(waypointid, res.data, text)
      },
      fail: function (res) {

      }
    })
  },
  add_user_comment(waypointid, sessionid, text) {
    let param = {
      data: {
        waypointid,
        sessionid,
        text
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 0) {
          this.getWaypointDetail(waypointid);
        }
      }, complete: () => {
        this.setData({
          visiable: false,
          focus: false
        })
      }
    }
    api.add_user_comment(param)
  }
});
