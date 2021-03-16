var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path')
var request = require('request');

const listener = (request, response) => {

    // console.log('request ', request.url);

    let url = request.url;
    url = decodeURIComponent(url);
    console.log('url', url);
    let filePosition = ['', 'build', 'public', 'test', 'test/Redux_files'];

    let get = false;

    for (let i = 0; i < filePosition.length; i++) {

        let file_src = `./${filePosition[i]}${url}`
        if (fs.existsSync(file_src)) {
            get = true;

            // console.log(file_src, '存在')
            // 跨域
            let head = {
                "Access-Control-Allow-Origin": "*"
            }

            // console.log(url.substr(-3), url.substr(-3)==='.js')
            if (url.substr(-3) === '.js') {
                head['content-type'] = 'application/javascript; charset=utf-8'
            }

            response.writeHead(200, head)
            fs.createReadStream(file_src).pipe(response);
            break;
        } else {
            // console.log(file_src, '不存在')
            continue;
        }

    }

    if (!get) {
        response.writeHead(404, {
            "Access-Control-Allow-Origin": "*"
        })
    }

}

const options = {
    key: fs.readFileSync(path.join(__dirname, './server.key')),
    cert: fs.readFileSync(path.join(__dirname, './server.crt'))
}

http.createServer(listener).listen(8080);
https.createServer(options, listener).listen(8443);

console.log('http sever start (8080) ...')
console.log('https sever start (8443) ...')


