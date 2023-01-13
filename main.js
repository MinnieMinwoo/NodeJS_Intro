const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const qs = require("querystring");
const sanitizeHtml = require("sanitize-html");
const templateList = require("./lib/templateList.js");
const setTemplate = require("./lib/setTemplate.js");

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
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(
                    `data/${filteredId}`,
                    "utf8",
                    (err, description) => {
                        const title = queryData.id;
                        const sanitizedTitle = sanitizeHtml(title);
                        const sanitizedDescription = sanitizeHtml(description);
                        const template = setTemplate(
                            sanitizedTitle,
                            list,
                            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                            `<a href="/update?id=${sanitizedTitle}">update</a>
                            <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${sanitizedTitle}">
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
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
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
                var filteredId = path.parse(queryData.id).base;
                fs.unlink(`data/${filteredId}`, (err) => {
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
