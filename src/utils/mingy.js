/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const {Command} = require("./command");

class Parser {
  constructor() {
    this.commands = {};
    this.validators = {};
    this.env = {};
    this.lexemeTransforms = [];
  }

  addCommand(name) {
    const command = new Command(name);
    this.commands[name] = command;
    return command;
  }

  addValidator(name, logic) {
    this.validators[name] = logic;
  }

  addFailCatch(logic) {
    this.failCatch = logic;
  }

  addLexemeTransform(logic) {
    this.lexemeTransforms.push(logic);
  }

  parse(input) {
    input = this.cleanInput(input);
    const lexemes = input.split(" ");
    return this.parseLexemes(lexemes);
  }

  // eslint-disable-next-line class-methods-use-this
  cleanInput(input) {
    input = input.replace("\r\n", "\n");
    if (input.slice(-1) === "\n") {
      input = input.slice(0, input.length - 1);
    }
    while (input.indexOf("  ") !== -1) {
      input = input.replace("  ", " ");
    }
    return input;
  }

  validCommands(lexemes) {
    const matchingCommands = [];
    // cycle through commands looking for syntax match

    for (const index in this.commands) {
      const command = this.commands[index];
      // we clone lexemes because if the last syntax lexeme has a wildcard the
      // submitted lexeme corresponding to the last syntax lexeme ends up
      // getting subsequent submitted lexemes added to it
      const vettedCommand = command.returnMatchingCommands(
        this.validators,
        this.clone(lexemes),
      );
      if (vettedCommand !== null) {
        matchingCommands.push(vettedCommand);
      }
    }
    return matchingCommands;
  }

  parseLexemes(lexemes) {
    // transformations first
    for (const index in this.lexemeTransforms) {
      lexemes = this.lexemeTransforms[index](lexemes, this.env);
    }

    const validatedCommands = this.validCommands(lexemes);

    if (validatedCommands.length > 0) {
      for (const index in validatedCommands) {
        const { command } = validatedCommands[index];
        const validatedResults = command.testValidators(
          validatedCommands[index].syntaxLexemes,
          this.validators,
          this.clone(lexemes),
        );
        if (validatedResults.success) {
          command.success(validatedResults);
        } else {
          command.fail(validatedResults);
        }
      }
    } else {
      this.failCatch({
        success: false,
        message: "I don't know what you mean...",
      });
    }
  }

  clone(obj) {
    const newObj = obj instanceof Array ? [] : {};
    for (const i in obj) {
      if (i === "clone") break;
      if (obj[i] && typeof obj[i] === "object") {
        newObj[i] = this.clone(obj[i]);
      } else newObj[i] = obj[i];
    }
    return newObj;
  }
}

module.exports = Parser;
