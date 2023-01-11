const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

function setTemplate(title, description, list) {
    const template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
    return template;
}

const app = http.createServer(function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let list = `<ul>`;
    fs.readdir("./data", function (error, filelist) {
        for (let i = 0; i < filelist.length; i++) {
            list =
                list +
                `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list = list + "</ul>";
        if (pathname === "/") {
            if (queryData.id === undefined) {
                const title = "Welcome";
                const description = "Hello, Node.js";
                const template = setTemplate(title, description, list);
                response.writeHead(200);
                response.end(template);
            } else {
                `nodejs/${queryData.id}`,
                    "utf8",
                    (err, description) => {
                        const title = queryData.id;
                        const template = setTemplate(title, description, list);
                        response.writeHead(200);
                        response.end(template);
                    };
            }
        } else {
            response.writeHead(404);
            response.end("Not found");
        }
    });
});
app.listen(3000);
