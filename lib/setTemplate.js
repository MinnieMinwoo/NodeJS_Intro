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

module.exports = setTemplate;
