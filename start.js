var http = require('http');
var geoip = require('geoip-lite');


function getDevice(req) {
    let type = (req.headers['user-agent'] || "").toLowerCase();

    if (type.indexOf('android') > -1 || type.indexOf('okhttp') > -1) {
        return "android"; //dalvik/2.1.0 (linux; u; android 9; asus_z01rd build/ppr1.180610.009)
    } else if (type.indexOf("ios") > -1 || type.indexOf("cfnetwork") > -1) {
        return "ios"; //fitclient/2.1.18.6 (com.besta.app.inhouse.fitclient; build:1; ios 12.3.1) alamofire/4.2.0
        //fitclient/2 cfnetwork/1120 darwin/19.0.0
    } else if (type.indexOf("windows") > -1) {
        return "windows"; //mozilla/5.0 (windows nt 6.3; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/77.0.3865.90 safari/537.36
    } else if (type.indexOf("mac os x") > -1) {
        return "mac"; //mozilla/5.0 (macintosh; intel mac os x 10_15_0) applewebkit/537.36 (khtml, like gecko) chrome/77.0.3865.90 safari/537.36
    } else if (type.indexOf("postman") > -1) {
        return "postman"; //postmanruntime/7.17.1
    } else if (type.indexOf("garmin") > -1) {
        return "garmin"; //postmanruntime/7.17.1
    } else {
        //mozilla/5.0 (iphone; cpu iphone os 13_0 like mac os x) applewebkit/605.1.15 (khtml, like gecko) version/13.0 mobile/15e148 safari/604.1
        console.log("user-agent:" + type);
        return "unknown";
    }
}


function getIp(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }

    ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);

    return ip;
}

http.createServer(function (request, response) {
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    let device = getDevice(request);
    let ip = getIp(request);

    var geo = geoip.lookup(ip);
    console.log(geo);

    let info = "Let me guess you info...\r\n";
    if(device) info += 'Device:' + device + "\r\n";
    if(ip)info += 'IP:' + ip + "\r\n";
    if(geo)info += 'county:' + geo.country + "\t" + "region:" + geo.region + "\r\rn";

    response.end(info);
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
