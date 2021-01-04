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
        game.moveBack();
      } else {
        game.moveTo(result.args.direction);
      }
    })
    .set("fail", function(result) {
      game.responseHandler(result);
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
      game.pickupThing(result.args.thing);
    })
    .set("fail", function(result) {
      game.responseHandler(result);
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
      game.putDownThing(result.args.thing);
    })
    .set("fail", function(result) {
      game.responseHandler(result);
    });

  parser
    .addCommand("lookat")
    .set("syntax", [
      "look at <validThing:thing*>",
      "look at the <validThing:thing*>",
    ])
    .set("success", function(result) {
      game.lookAt(result.args.thing);
    })
    .set("fail", function(result) {
      game.responseHandler(result);
    });

  parser
    .addCommand("look", "look around")
    .set("syntax", ["look"])
    .set("success", function() {
      game.lookAround();
    })
    .set("fail", function(result) {
      game.responseHandler(result);
    });

  parser
    .addCommand("say", "say to players")
    .set("syntax", ["> <exists:playerMessage*>", "say <exists:playerMessage*>"])
    .set("success", function(result) {
      console.log("its good", result);
      game.say(result.args.playerMessage);
    })
    .set("fail", function(result) {
      console.log("fail", result);
      game.responseHandler(result);
    });

  parser.addFailCatch(function(result) {
    game.responseHandler(result);
  });
};

module.exports = commands;
