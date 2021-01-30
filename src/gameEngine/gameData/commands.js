const commands = function(parser, game) {
  parser
    .addCommand("go")
    .set("syntax", [
      "go <validDirection:direction>",
      "move <validDirection:direction>",
      "walk <validDirection:direction>",
      "run <validDirection:direction>",
    ])
    .set("success", function(result) {
      if (result.args.direction === "back") {
        return game.moveBack();
      } else {
        return game.moveTo(result.args.direction);
      }
    })
    .set("fail", function(result) {
      return {success: false, ...result};
    });

  parser
    .addCommand("take")
    .set("syntax", [
      "take <validThing:thing*>",
      "take the <validThing:thing*>",
      "pick up <validThing:thing*>",
      "pick up the <validThing:thing*>",
    ])
    .set("success", function(result) {
      return game.pickupThing(result.args.thing);
    })
    .set("fail", function(result) {
      return {success: false, ...result};
    });

  parser
    .addCommand("drop")
    .set("syntax", [
      "drop <validThing:thing*>",
      "drop the <validThing:thing*>",
      "put down <validThing:thing*>",
      "put down the <validThing:thing*>",
    ])
    .set("success", function(result) {
      return game.putDownThing(result.args.thing);
    })
    .set("fail", function(result) {
      return {success: false, ...result};
    });

  parser
    .addCommand("lookat")
    .set("syntax", [
      "look at <validThing:thing*>",
      "look at the <validThing:thing*>",
    ])
    .set("success", function(result) {
      return game.lookAt(result.args.thing);
    })
    .set("fail", function(result) {
      return {success: false, ...result};
    });

  parser
    .addCommand("look", "look around")
    .set("syntax", ["look"])
    .set("success", function() {
      return game.lookAround();
    })
    .set("fail", function(result) {
      return {success: false, ...result};
    });

  parser
    .addCommand("say", "say to players")
    .set("syntax", ["> <exists:playerMessage*>", "say <exists:playerMessage*>"])
    .set("success", function(result) {
      return game.say(result.args.playerMessage);
    })
    .set("fail", function(result) {
      return {success: false, ...result};
    });

  parser.addFailCatch(function(result) {
    return {success: false, ...result};
  });
};

module.exports = commands;
