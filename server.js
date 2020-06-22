var http = require('http');
var fs = require('fs');
var request = require('request');


http.createServer((request,response)=>{

    // console.log('request ', request.url);

    let url = request.url;
    url = decodeURIComponent(url);
    console.log('url',url);
    let filePosition = ['','build','public','test','test/Redux_files'];

    let get = false;

    for(let i =0; i < filePosition.length; i++){

        let file_src = `./${filePosition[i]}${url}`
        if(fs.existsSync(file_src)){
            get = true;

            // console.log(file_src, '存在')
            // 跨域
            response.writeHead(200,{
                "Access-Control-Allow-Origin":"*"
            })
            fs.createReadStream(file_src).pipe(response);
            break;
        }else{
            // console.log(file_src, '不存在')
            continue;
        }

    }

    if(!get){
        response.writeHead(404,{
            "Access-Control-Allow-Origin":"*"
        })
    }
    
}).listen(8888);

console.log('http sever start ...')


