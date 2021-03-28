var fs = require('fs')

function getText(){    

    var text;

    text = fs.readFileSync('./test/google-wiki.html');


    return text
}


// export default getText;


async function main() {
    console.log('----b----')
    try{
        let a = await fetch({url:'https://fackbook.com', method:"get", timeout: 100000000})
        console.log('a.status:', a.status)
    }catch(e){
        console.log('catch error:', e)
    }
}

main()


