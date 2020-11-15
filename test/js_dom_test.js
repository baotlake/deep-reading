const fs = require('fs');
const DOMParser = require('dom-parser');

let path = "C:\\Users\\baotlake\\Desktop\\LearnReact\\wordreadingpro\\example.html"
let text = fs.readFileSync(path,'utf-8');

// console.log(text);



var parser = new DOMParser();
var htmlDoc = parser.parseFromString(text,"text/xml");

// console.log(htmlDoc)

console.log(htmlDoc.innerHTML)


// // XML DOC
// var xmlDoc = loadXMLString(text);
// let childs = xmlDoc.documentElement.childNodes;
// for(i=0;i<childs.length;i++){
//     console.log(childs[i])

//     console.log('\n\n --------------- \n\n')
// }