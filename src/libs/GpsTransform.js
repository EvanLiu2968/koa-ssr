/*
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的互转
 * Created by Evanliu on 18/02/27. 
 */

var pi = 3.1415926535897932384626;
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
            + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}  

function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
            * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
            * pi)) * 2.0 / 3.0;
    return ret
}
function transform(lat, lon) {
  // if (outOfChina(lat, lon)) {
  //     return [lat,lon];
  // }
  var dLat = transformLat(lon - 105.0, lat - 35.0);
  var dLon = transformLon(lon - 105.0, lat - 35.0);
  var radLat = lat / 180.0 * pi;
  var magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  var sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
  var mgLat = lat + dLat;
  var mgLon = lon + dLon;
  return [mgLat,mgLon]
}
function outOfChina(lat, lon){
  if (lon < 72.004 || lon > 137.8347)
      return true;
  if (lat < 0.8293 || lat > 55.8271)
      return true;
  return false;
}

//百度坐标系转原始坐标系(谷歌坐标系)
function bd09_To_gps84(lat, lon){
  var gcj02 = bd09_To_Gcj02(lat, lon);
  var gps84 = gcj02_To_Gps84(gcj02[0], gcj02[1]);
  return gps84;
}
//百度坐标系转GCJ－02坐标系
function bd09_To_Gcj02(lat, lon) {
  var x = lon - 0.0065, y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var tempLon = z * Math.cos(theta);
  var tempLat = z * Math.sin(theta);
  return [tempLat,tempLon]
}
//GCJ－02坐标系转原始坐标系(谷歌坐标系)
function gcj02_To_Gps84(lat, lon){
  var gps = transform(lat, lon);
  var lontitude = lon * 2 - gps[1];
  var latitude = lat * 2 - gps[0];
  return [latitude, lontitude]
}
//GCJ－02坐标系转原始坐标系(谷歌坐标系)
function gcj02_To_Bd09(lat, lon){
  var x = lon, y = lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  var tempLon = z * Math.cos(theta) + 0.0012; //origin 0.0065
  var tempLat = z * Math.sin(theta) + 0.009; //origin 0.006
  var gps = [tempLat,tempLon];
  return gps;
}
//原始坐标系(谷歌坐标系)转百度坐标系
function gps84_To_Gcj02(lat, lon){
  // if (outOfChina(lat, lon)) {
  //   return [lat,lon];
  // }
  var dLat = transformLat(lon - 105.0, lat - 35.0);
  var dLon = transformLon(lon - 105.0, lat - 35.0);
  var radLat = lat / 180.0 * pi;
  var magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  var sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
  var mgLat = lat + dLat;
  var mgLon = lon + dLon;
  return [mgLat, mgLon];
}
//原始坐标系(谷歌坐标系)转百度坐标系
function gps84_To_bd09(lat, lon){
  var gcj02 = gps84_To_Gcj02(lat,lon);
  var bd09 = gcj02_To_Bd09(gcj02[0],gcj02[1]);
  return bd09;
}

module.exports = {
  bd09_To_gps84,
  gps84_To_bd09
}