const models = require("../db/models");
const ItemEntity =require("../entities/Item.entity");

exports.getItemsInRadius = async function ({x, y, radius = 1}) {
  const Item = models.getModel("Item");
  const items = await Item.find({
    x: {
      $gte: x - radius,
      $lte: x + radius,
    },
    y: {
      $gte: y - radius,
      $lte: y + radius,
    }
  });

  return items.map(new ItemEntity);
};

exports.getItemsHere = async function ({x, y}) {
  const Item = models.getModel("Item");
  const items = await Item.find({x, y});
  return items.map(new ItemEntity);
};