const parser from "../utils/parser";

const validators = function(Game) {
  const wordsToStrip = ["the", "to", "a", "an"];
  const validDirections = [
    "north",
    "south",
    "east",
    "west",
    "n",
    "s",
    "e",
    "w",
    "back",
  ];

  const validThings = Object.keys(Game.things.collection);

  parser.addValidator("validDirection", function(lexeme) {
    return {
      success: validDirections.indexOf(lexeme) !== -1,
      message: "That's not a direction I understand.\n",
    };
  });

  parser.addValidator("validThing", function(lexeme) {
    return {
      success: validThings.indexOf(lexeme) !== -1,
      message: "That's not thing you can take.\n",
    };
  });

  parser.addValidator("exists", function(lexeme) {
    return {
      success: !!lexeme,
      message: "Speak up I can't hear you!\n",
    };
  });

  // eslint-disable-next-line no-unused-vars
  parser.addLexemeTransform(function(lexemes, env) {
    return lexemes.filter(lex => {
      return wordsToStrip.indexOf(lex) === -1;
    });
  });
};

export default validators;
