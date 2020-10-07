const http = require('http');
const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status-codes');
const mimeType = require('mime-types');

const port = 3000;
const routes = {
    '/' : './public/views/index.html',
    '/about': './public/views/about.html'
};

(function (){
    http.createServer((req, res) => {

        let route = routes[req.url]
        if( !route )
            route = '.' + req.url;

        if ( !fs.existsSync( route )) {
            res.writeHead( httpStatus.NOT_FOUND)
            res.end()
        }
        else{
            fs.readFile( route, function (error, content){
                if( error ){
                    res.writeHead(httpStatus.INTERNAL_SERVER_ERROR)
                    res.end()
                }
                else{
                    res.setHeader('Content-Type', mimeType.lookup(route))
                    res.writeHead(httpStatus.OK)
                    res.end(content, 'utf-8')
                }
            })
        }
    }).listen(port, () => console.log(`localhost server is running on port ${port}`))
})()