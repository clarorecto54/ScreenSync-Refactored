const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
/* ---- PRODUCTION BUILD ---- */
const dev = process.env.NODE_ENV === 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
/* ----- HTTPS HANDLING ----- */
const httpsOptions = {
    key: fs.readFileSync('./SSL/server.key'), // Replace with your private key file path
    cert: fs.readFileSync('./SSL/server.crt'), // Replace with your certificate file path
};
/* --------- ROUTING -------- */
app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('Server running on https://localhost:3000');
    });
});
