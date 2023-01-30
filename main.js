const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;
const topicRouter = require("./routes/topic");
const indexRouter = require("./routes/index");
const helmet = require("helmet");

app.use(helmet());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.get("*", (request, response, next) => {
    fs.readdir("./data", (error, filelist) => {
        request.list = filelist;
        next();
    });
});

app.use("/", indexRouter);

app.use("/topic", topicRouter);

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
