// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var options = {　　　　　　　
    method: 'get',
    url: 'http://qzone-music.qq.com/fcg-bin/cgi_playlist_xml.fcg?uin=1043110319&json=1&g_tk=1916754934',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  request(options, function(err, res, body) {
    if (err) {
      console.log(err)
    } else {
      console.log(body);
      return body
    }
  })
}