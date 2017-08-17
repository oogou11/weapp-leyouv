const apiURL = 'https://api.leyouv.com';

const wxRequest = (params, url) => {
  wx.request({
    url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    success(res) {
      if (res.data.code == 0) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};

const getHotTripList = (params) => {
  wxRequest(params, `${apiURL}/v1/trips/index`);
};
const getTripInfoByID = (params) => {
  wxRequest(params, `${apiURL}/v1/trip/${params.query.tripId}/waypoints`);
};

const getExplorePlaceList = (params) => {
  wxRequest(params, `${apiURL}/destination/v3/`);
};
const getPlaceInfoByID = (params) => {
  wxRequest(params, `${apiURL}/destination/place/${params.query.type}/${params.query.id}/`);
};
const getPlacePOIByID = (params) => {
  wxRequest(params, `${apiURL}/destination/place/${params.query.type}/${params.query.id}/pois/${params.query.poiType}/`);
};

const getPlaceTripByID = (params) => {
  wxRequest(params, `${apiURL}/destination/place/${params.query.type}/${params.query.id}/trips/`);
};
const getUserInfoByID = (params) => {
  wxRequest(params, `${apiURL}/v1/users/${params.query.userId}`);
};
const getWaypointInfoByID = (params) => {
  wxRequest(params, `${apiURL}/v1/waypoint/detail/${params.query.waypointId}`);
};

const addNewUser = () => {
  let params = {}
  wx.getUserInfo({
    success: function (res) {
      wx.login({
        success: function (lg_res) {
          if (lg_res.code) {
            params = {
              success: (res) => {
                wx.setStorage({
                  key: "session_id",
                  data: res.data.result
                })
              },
              method: "POST",
              data: { "code": lg_res.code, "encryptedData": res.encryptedData, "iv": res.iv, userInfo: res.userInfo }
            }
            wxRequest(params, `${apiURL}/v1/users/pauli?m=info`);
          }
        }
      })
    }
  })
}
const addNewLivePerson = (params) => {
  wxRequest(params, `${apiURL}/v1/users/certify/${params.query.waypointid}/${params.query.sessionid}`)
}
const add_user_comment = (params) => {
  console.log(params.method,params.data)
  wxRequest(params,`${apiURL}/v1/users/addcommnet?mdinfo=vx_cen_zn`)
}

module.exports = {
  getHotTripList,
  getExplorePlaceList,
  getPlaceInfoByID,
  getPlacePOIByID,
  getTripInfoByID,
  getPlaceTripByID,
  getUserInfoByID,
  getWaypointInfoByID,
  addNewUser,
  addNewLivePerson,
  add_user_comment
};
