const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile("message.txt", { encoding: 'utf8' }, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            console.log(data);
            res.write("<html><body>" + data + "</body></html>");
            res.write("<html><body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Submit</button></form></body></html>");
    });
    if (req.url === '/message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.writeFile("message.txt", body, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                }
            });
        });
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Message received');
    }}
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});