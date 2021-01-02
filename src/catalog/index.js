// A map of all unique items in the game, and the entities that 
// read all files in local dir, and load by file name
const fs = require("fs");

const ItemCatalog = fs.readdirSync(__dirname).reduce((acc, file)=>{
  if(file !== "index.js"){
    acc[file] = require(`./${file}`);
  }
}, {});

exports.ItemCatalog = ItemCatalog;

exports.HydrateItems = (items) => {
  return items.map((itm)=>{
    return exports.HydrateItem(itm);
  });
};

exports.HydrateItem = (item) => {
  const instance = ItemCatalog[item.instance];
  if(!instance) throw new TypeError(`No item named ${item.instance}`);
  return instance(item);
};