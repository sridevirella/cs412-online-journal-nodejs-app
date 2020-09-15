const http = require('http');
const fs = require('fs');
const path = require('path');

(function (){
    http.createServer((req, res) => {

        let filepath = '.' + req.url;
        if( filepath === './' ) {
            filepath = './public/views/index.html'
        }

        let contentTypes = {
            '.html': "text/html",
            '.js': "text/javascript",
            '.css': "text/css",
            '.jpg': "image/jpg"
        }

        if ( !fs.existsSync( filepath)) {
            res.writeHead( 404)
            res.end()
        }
        else{
            fs.readFile( filepath, function (error, content){
                if( error ){
                    res.writeHead(500)
                    res.end()
                }
                else{
                    let contentType = contentTypes[path.extname(filepath)];
                    res.setHeader('Content-Type', contentType)
                    res.writeHead(200)
                    res.end(content, 'utf-8')
                }
            })
        }
    }).listen(3000, () => console.log('localhost server is running on port 3000...'))
})()