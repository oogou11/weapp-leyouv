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
          replies:{
            recommender_count: waypoint.recommender_count,
            comment_count: waypoint.comment_count,
            comments: waypoint.comments,
            recommenders: waypoint.recommenders
          }
        }); 
      },  
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
});
