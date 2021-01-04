const validators = function(parser, game) {
  game;
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

  parser.addValidator("validDirection", function(lexeme) {
    return {
      success: validDirections.indexOf(lexeme) !== -1,
      message: "That's not a direction I understand.\n",
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

module.exports = validators;
