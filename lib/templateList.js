function templateList(filelist) {
    let list = `<ul>`;
    for (let i = 0; i < filelist.length; i++) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list += "</ul>";
    return list;
}

module.exports = templateList;
