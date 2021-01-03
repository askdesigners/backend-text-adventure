const {HydratePlace} = require("../places");

function makePlaceKey(p){
  return `${p.x}|${p.y}`;
}

/**
 * 
 * 
 * @param {any} p
 * @param {any} dimensions
 * @returns
 */
function deriveNeighbors(p, dimensions){
  const blockedTo = p.blockedTo;
  const {x, y} = p;
  const [width, height] = dimensions;
  let dirs = {};
  
  if(blockedTo.indexOf("s") !=-1  || y >= height){
    dirs.toS = false;
  } else {
    dirs.toS = makePlaceKey({x, y: y + 1});
  }
  
  if(blockedTo.indexOf("n") !=-1  || y === 0){
    dirs.toN = false;
  } else {
    dirs.toN = makePlaceKey({x, y: y - 1});
  }
  
  if(blockedTo.indexOf("e") !=-1 || x >= width){
    dirs.toE = false;
  } else {
    dirs.toE = makePlaceKey({x: x + 1, y});
  }
  
  if(blockedTo.indexOf("w") !=-1  || x === 0){
    dirs.toW = false;
  } else {
    dirs.toW = makePlaceKey({x: x - 1, y});
  }
  return dirs;
}

/**
  * 
  * 
  * @param {any} placeData
  * @returns
  */
exports.buildMap = function(placeData){
  // placeData = {dimensions, definitions, descriptions}
  let map = {};
  for(var p of placeData.map){
    const key = makePlaceKey(p);
    map[key] = HydratePlace({...p, ...deriveNeighbors(p, placeData.map)});
  }
  return map;
};