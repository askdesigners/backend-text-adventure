const commands = (parser, game) => {
  parser
    .addCommand("go")
    .set("syntax", [
      "go <validDirection:direction>",
      "move <validDirection:direction>",
      "walk <validDirection:direction>",
      "run <validDirection:direction>",
    ])
    .set("success", (result) => {
      if (result.args.direction === "back") {
        return {action: game.moveBack.bind(game), arg:result.args.direction };
      } else {
        return {action: game.moveTo.bind(game), arg: result.args.direction};
      }
    })
    .set("fail", (result) => {
      return {action: ()=>({success: false, ...result}), arg: null};
    });

  parser
    .addCommand("take")
    .set("syntax", [
      "take <validThing:thing*>",
      "take the <validThing:thing*>",
      "pick up <validThing:thing*>",
      "pick up the <validThing:thing*>",
    ])
    .set("success", (result) => {
      return { action: game.pickupThing.bind(game), arg: result.args.thing };
    })
    .set("fail", (result) => {
      return { action: ()=>({success: false, ...result}), arg: null };
    });

  parser
    .addCommand("drop")
    .set("syntax", [
      "drop <validThing:thing*>",
      "drop the <validThing:thing*>",
      "put down <validThing:thing*>",
      "put down the <validThing:thing*>",
    ])
    .set("success", (result) => {
      return { action: game.putDownThing.bind(game), arg: result.args.thing };
    })
    .set("fail", (result) => {
      return {action: ()=>({success: false, ...result}), arg: null};
    });

  parser
    .addCommand("lookat")
    .set("syntax", [
      "look at <validThing:thing*>",
      "look at the <validThing:thing*>",
    ])
    .set("success", (result) => {
      return { action: game.lookAt.bind(game), arg: result.args.thing };
    })
    .set("fail", (result) => {
      return {action: ()=>({success: false, ...result}), arg: null};
    });

  parser
    .addCommand("look", "look around")
    .set("syntax", ["look"])
    .set("success", function() {
      return { action: game.lookAround.bind(game), arg: null };
    })
    .set("fail", (result) => {
      return {action: ()=>({success: false, ...result}), arg: null};
    });

  parser
    .addCommand("say", "say to players")
    .set("syntax", ["> <exists:playerMessage*>", "say <exists:playerMessage*>"])
    .set("success", (result) => {
      return { action: game.say.bind(game), arg: result.args.playerMessage };
    })
    .set("fail", (result) => {
      return {action: ()=>({success: false, ...result}), arg: null};
    });

  parser.addFailCatch((result) => {
    return {action: ()=>({success: false, ...result}), arg: null};
  });
};

module.exports = commands;
