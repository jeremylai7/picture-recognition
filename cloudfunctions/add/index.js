// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var httptype = "https://";
  var url = "springboot-cv01-1668851-1300949732.ap-shanghai.run.tcloudbase.com";
  return await request(httptype + url + "/holiday/all")
    .then(function(res){
      return res;
    })
    .catch(function(err) {
      return {};
    })
}