var http = require('http');
var fs = require('fs');


http.createServer((request,response)=>{

    // console.log('request ', request.url);

    let url = request.url;
    let filePosition = ['','build','public','test'];
    let html;

    for(let i =0; i < filePosition.length; i++){

        let file_src = `./${filePosition[i]}${url}`
        try{
            html = fs.readFileSync(file_src);
            response.writeHead(200, {'Conten-Type':'text/html','Access-Control-Allow-Origin':'*'});
            response.end(html);
            break
        }catch(e){
            
        }
    }
    if(!html){
        response.writeHead(400, {'Conten-Type':'text/plain'});
        response.end('');
    }

}).listen(8888);

console.log('http sever start ...')


