const fs = require("fs");
const path = require("path");
const template = require("./lib/template.js");
const qs = require("querystring");
const express = require("express");
const sanitizeHtml = require("sanitize-html");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.get("*", (request, response, next) => {
    fs.readdir("./data", (error, filelist) => {
        request.list = filelist;
        next();
    });
});

app.get("/", (request, response) => {
    const title = "Welcome";
    const description = "Hello, Node.js";
    let list = template.list(request.list);
    let html = template.HTML(
        title,
        list,
        `<h2>${title}</h2>${description}
        <img src="/images/hello.jpeg" style="width:300px; display:block; margin-top: 10px;">`,
        `<a href="/create">create</a>`
    );
    response.send(html);
});

app.get("/page/:pageId", (request, response, next) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
        if (err) {
            next(err);
        } else {
            var title = request.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ["h1"],
            });
            var list = template.list(request.list);
            var html = template.HTML(
                sanitizedTitle,
                list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/create">create</a>
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`
            );
            response.send(html);
        }
    });
});

app.get("/create", (request, response) => {
    var title = "WEB - create";
    var list = template.list(request.list);
    var html = template.HTML(
        title,
        list,
        `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,
        ""
    );
    response.send(html);
});

app.post("/create_process", (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, "utf8", (err) => {
        response.redirect(`/page/${title}`);
    });
});

app.get("/update/:pageId", (request, response) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.HTML(
            title,
            list,
            `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.send(html);
    });
});

app.post("/update_process", (request, response) => {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, (error) => {
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {
            response.redirect(`/page/${title}`);
        });
    });
});

app.post("/delete_process", (request, response) => {
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
        response.redirect("/");
    });
});

app.use((request, response, next) => {
    response.status(404).send("not found");
});

app.use((err, request, response, next) => {
    console.error(err.stack);
    response.status(500).send("Internal error");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
