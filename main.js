const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const qs = require("querystring");

function setTemplate(title, list, body, control) {
    return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <a href="/create">create</a>
          ${control}
          ${body}
        </body>
        </html>
        `;
}

function templateList(filelist) {
    let list = `<ul>`;
    for (let i = 0; i < filelist.length; i++) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list += "</ul>";
    return list;
}

const app = http.createServer(function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    fs.readdir("./data", function (error, filelist) {
        const list = templateList(filelist);
        if (pathname === "/") {
            if (queryData.id === undefined) {
                const title = "Welcome";
                const description = "Hello, Node.js";
                const template = setTemplate(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`,
                    ""
                );
                response.writeHead(200);
                response.end(template);
            } else {
                fs.readFile(
                    `data/${queryData.id}`,
                    "utf8",
                    (err, description) => {
                        const title = queryData.id;
                        const template = setTemplate(
                            title,
                            list,
                            `<h2>${title}</h2>${description}`,
                            `<a href="/update?id=${title}">update</a>
                            <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" value="delete">
                            </form>`
                        );
                        response.writeHead(200);
                        response.end(template);
                    }
                );
            }
        } else if (pathname === "/create") {
            const title = "WEB - create";
            const template = setTemplate(
                title,
                list,
                `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>`,
                ""
            );
            response.writeHead(200);
            response.end(template);
        } else if (pathname === "/create_process") {
            let body = "";
            request.on("data", function (data) {
                body += data;
            });
            request.on("end", function () {
                const post = qs.parse(body);
                const title = post.title;
                const description = post.description;
                fs.writeFile(`data/${title}`, description, (err) => {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end("success");
                });
            });
        } else if (pathname === "/update") {
            fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
                const title = queryData.id;
                const template = setTemplate(
                    title,
                    list,
                    `<form action="/update_process" method="post">
                    <input type="hidden", name="id", value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>`,
                    `<a href="/update">update</a>`
                );
                response.writeHead(200);
                response.end(template);
            });
        } else if (pathname === "/update_process") {
            let body = "";
            request.on("data", function (data) {
                body += data;
            });
            request.on("end", function () {
                const post = qs.parse(body);
                const id = post.id;
                const title = post.title;
                const description = post.description;
                fs.rename(`data/${id}`, `data/${title}`, (err) => {
                    fs.writeFile(`data/${title}`, description, (err) => {
                        response.writeHead(302, { Location: `/?id=${title}` });
                        response.end("success");
                    });
                });
            });
        } else if (pathname === "/delete_process") {
            let body = "";
            request.on("data", function (data) {
                body += data;
            });
            request.on("end", function () {
                const post = qs.parse(body);
                const id = post.id;
                fs.unlink(`data/${id}`, (err) => {
                    response.writeHead(302, { location: "/" });
                    response.end();
                });
            });
        } else {
            response.writeHead(404);
            response.end("Not found");
        }
    });
});
app.listen(3000);
