// A map of all unique places in the game, and the entities that 
// read all files in local dir, and load by file name
const fs = require("fs");
const Place = require("../entities/Place.entity");

const Places = fs.readdirSync(__dirname).reduce((acc, file)=>{
  if(file !== "index.js"){
    acc[file] = require(`./${file}`);
  }
}, {});

exports.Places = Places;

exports.HydratePlaces = (items) => {
  return items.map((itm)=>{
    return exports.HydratePlace(itm);
  });
};

exports.HydratePlace = (item) => {
  return new Place(item);
};