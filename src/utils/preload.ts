main();
function main() {

  let arr = [];
  walkSync('./src/assets', arr);
  arr = arr.filter((e : string) => e.search('.png') !== -1);

  console.log(`found ${arr.length} keys in the assets folder.`);

  let obj = createObjectConstant(arr);
  let content = `let PRELOADED_KEYS = ${JSON.stringify(obj)};\nexport { PRELOADED_KEYS }`;
  const fs = require('fs');
  fs.writeFile(__dirname + '/dist/preloadedKeyObject.ts', content, () => console.warn(`still not fully tested. exporting constant only into file in ${__dirname + '/dist'}`));
}
// List all files in a directory in Node.js recursively in a synchronous fashion
export function walkSync(dir, filelist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = walkSync(path.join(dir, file), filelist);
      }
      else {
          filelist.push(path.join(dir, file));
      }
  });
  return filelist;
};

function createObjectConstant(arr) {
  let obj = {};
  arr.forEach(element => {
    let preloadedObject = {};
    let key = element.replace('.png', '').slice(element.lastIndexOf('/') + 1);
    preloadedObject['key'] = key;
    element = element.replace('src', '');
    preloadedObject['path'] = element.slice(1, element.length);
    obj[key.toUpperCase()] = preloadedObject;
  });
  return obj;
}


function createPreloadScene(arr) {
  let content = `export default class PreloadScene extends Phaser.Scene {
    constructor() {
      // generated from preload utility
      super({ key: 'PreloadScene' });
    }
    preload() {\n`

  let obj = {};
  arr.forEach((element : string) => {
    if (element.search('.png') === -1) {return;}
    let key = element.replace('.png', '').slice(element.lastIndexOf('/') + 1);
    obj[key.toUpperCase()] = key;
    content += `\t\t\tthis.load.image('${key}', '${element}');\n`
  });


  content += "\t}\n}\n";

  content += `export const PRELOADED_KEYS = ${JSON.stringify(obj)}`;

  var fs  = require('fs');
  fs.writeFile(__dirname + '/dist/preloadScene.ts', content, () => console.warn(`still not fully tested. not replacing current preload scene, but placing generated file in ${__dirname + '/dist'}`));
}