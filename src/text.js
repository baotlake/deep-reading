var fs = require('fs');


function getText(){    

    var text;

    text = fs.readFileSync('./test/google-wiki.html');


    return text
}


export default getText;