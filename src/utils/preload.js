"use strict";
exports.__esModule = true;
main();
function main() {
    var arr = [];
    walkSync('./src/assets', arr);
    arr = arr.filter(function (e) { return e.search('.png') !== -1; });
    console.log("found " + arr.length + " keys in the assets folder.");
    var obj = createObjectConstant(arr);
    var content = "let PRELOADED_KEYS = " + JSON.stringify(obj) + ";\nexport { PRELOADED_KEYS }";
    var fs = require('fs');
    fs.writeFile(__dirname + '/dist/preloadedKeyObject.ts', content, function () { return console.warn("still not fully tested. exporting constant only into file in " + (__dirname + '/dist')); });
}
// List all files in a directory in Node.js recursively in a synchronous fashion
function walkSync(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'), files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
}
exports.walkSync = walkSync;
;
function createObjectConstant(arr) {
    var obj = {};
    arr.forEach(function (element) {
        var preloadedObject = {};
        var key = element.replace('.png', '').slice(element.lastIndexOf('/') + 1);
        preloadedObject['key'] = key;
        element = element.replace('src', '');
        preloadedObject['path'] = element;
        obj[key.toUpperCase()] = preloadedObject;
    });
    return obj;
}
function createPreloadScene(arr) {
    var content = "export default class PreloadScene extends Phaser.Scene {\n    constructor() {\n      // generated from preload utility\n      super({ key: 'PreloadScene' });\n    }\n    preload() {\n";
    var obj = {};
    arr.forEach(function (element) {
        if (element.search('.png') === -1) {
            return;
        }
        var key = element.replace('.png', '').slice(element.lastIndexOf('/') + 1);
        obj[key.toUpperCase()] = key;
        content += "\t\t\tthis.load.image('" + key + "', '" + element + "');\n";
    });
    content += "\t}\n}\n";
    content += "export const PRELOADED_KEYS = " + JSON.stringify(obj);
    var fs = require('fs');
    fs.writeFile(__dirname + '/dist/preloadScene.ts', content, function () { return console.warn("still not fully tested. not replacing current preload scene, but placing generated file in " + (__dirname + '/dist')); });
}
