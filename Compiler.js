//jshint esversion: 6
//jshint maxerr: 999

let compiler = program => {
  
  let builtInFuncs = [
  "DISPLAY",
  "INPUT",
  "RANDOM",
  
  ];
  let declaredFuncs = [];

  let tokenizer = input => {
    let current = 0; // "Cursor"
    let tokens = []; // Push tokens here

    // Loop through input
    while (current < input.length) {
      let char = input[current]; // Current character
      console.log(tokens);

      // Left Parenthesis
      if (char === '(') {
        tokens.push({
          type: "parenthesis",
          value: "("
        });

        // Increment counter and end
        current++;
        continue;
      }

      // Right Parenthesis
      if (char === ')') {
        tokens.push({
          type: "parenthesis",
          value: ")"
        });

        // Increment counter and end
        current++;
        continue;
      }

      // Left Curly Bracket
      if (char === '{') {
        tokens.push({
          type: "curlybracket",
          value: "{"
        });

        // Increment counter and end
        current++;
        continue;
      }

      // Right Curly Bracket
      if (char === '}') {
        tokens.push({
          type: "curlybracket",
          value: "}"
        });

        // Increment counter and end
        current++;
        continue;
      }

      // Newline
      if (/\n/.test(char)) {
        tokens.push({
          type: "newline",
          value: char
        });

        // Increment counter and end
        current++;
        continue;
      }

      // Whitespace or comma
      if (/[\s,]/.test(char)) {
        // Increment counter and end
        current++;
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        let value = '';

        // Test if following characters are numbers
        while (/[0-9]/.test(char)) {
          value += char; // Add character to string
          char = input[++current]; // Increment current and char and continue
          if (current > input.length) throw "Unfinished string with value of " + value;
        }

        tokens.push({
          type: "number",
          value: value
        });

        continue; // End - counter was already incremented in loop
      }

      // Strings (Quote marks)
      if (char === '"') {
        let value = '';
        char = input[++current]; // We don't need to tokenize the quote

        while (char != '"') {
          value += char; // Add character to string
          char = input[++current]; // Increment current and char and continue
          if (current > input.length) {
            tokens.push({
              type: "string",
              value: value
            });
            throw "Unfinished string with value of " + value;
          }
        }

        tokens.push({
          type: "string",
          value: value
        });

        current++;
        continue; // End - counter was already incremented in loop
      }

      // Operators
      if (/[←+*\-\/=≠><≥≤]/.test(char)) {
        tokens.push({
          type: "operator",
          value: char
        });

        // Increment counter and end
        current++;
        continue;
      }

      // Name
      if (/[A-Z]/i.test(char)) {
        let value = '';
        while (/[A-Z]/i.test(char)) {
          value += char; // Add character to string
          char = input[++current]; // Increment current and char and continue
        }

        let token = ({
          type: "name",
          value: value
        });

        // Some names are actually operators...
        if (/(MOD)|(AND)|(OR)|(NOT)/.test(token.value)) token.type = "operator";
        // Some names are actually keywords...
        if (/(IF)|(ELSE)|(REPEAT)|(UNTIL)|(TIMES)|(PROCEDURE)/.test(token.value)) token.type = "keyword";

        tokens.push(token);

        continue; // End - counter was already incremented in loop
      }

      throw new TypeError("Invalid character: " + char);
    }
    return tokens; // End of loop
  }

  let parser = tokenArray => {
    let tokens = tokenArray,
      length = tokens.length;
    // Automatic Parenthesis Insertion - used for parser
    let autoInsert = () => {
      let operators = [
        [
          [1, "NOT"]
        ],
        [
          [2, '*'],
          [2, '/'],
          [2, "MOD"]
        ],
        [
          [2, '+'],
          [2, '-']
        ],
        [
          [2, '>'],
          [2, '<'],
          [2, '≥'],
          [2, '≤']
        ],
        [
          [2, '='],
          [2, '≠']
        ],
        [
          [2, "AND"]
        ],
        [
          [2, "OR"]
        ],
        [
          [2, '←']
        ]
      ];
      for (let i of operators) {
        for (let current = 0; current < length; current++) {
          let token = tokens[current],
            previous = tokens[current - 1],
            next = tokens[current + 1];
          if (token.type != "operator") continue;

          // Test if token is at the right precedence
          let bool = false,
            op;
          for (let operator of i) {
            if (operator[1] == token.value) {
              bool = true;
              op = operator;
              break;
            }
          }
          if (!bool) continue;

          console.log(op);

          // Before
          if (current == 1 || previous.value != ')' || op[0] == 1) {
            tokens.splice(current - 1, 0, {
              type: "parenthesis",
              value: "("
            });
            // Correct variables
            current++;
            length++;
            token = tokens[current];
            previous = tokens[current - 1];
            next = tokens[current + 1];
          } else {
            let parentheses = 1,
              j = current - 2;
            while (parentheses != 0) {
              if (j < 0) throw new TypeError("Parenthesis mismatch");
              if (tokens[j].value == ')') parentheses++;
              if (tokens[j].value == '(') parentheses--;
              j--;
            }
            tokens.splice(j, 0, {
              type: "parenthesis",
              value: "("
            });
            // Correct variables
            current++;
            length++;
            token = tokens[current];
            previous = tokens[current - 1];
            next = tokens[current + 1];
          }
          // After
          if (current == length - 1 || next.value != '(') {
            tokens.splice(current + 2, 0, {
              type: "parenthesis",
              value: ")"
            });
            // Correct variables
            current++;
            length++;
            token = tokens[current];
            previous = tokens[current - 1];
            next = tokens[current + 1];
          } else {
            let parentheses = 1,
              j = current + 2;
            while (parentheses != 0) {
              if (j >= length) throw new TypeError("Parenthesis mismatch");
              if (tokens[j].value == '(') parentheses++;
              if (tokens[j].value == ')') parentheses--;
              j++;
            }
            tokens.splice(j, 0, {
              type: "parenthesis",
              value: ")"
            });
            // Correct variables
            current++;
            length++;
            token = tokens[current];
            previous = tokens[current - 1];
            next = tokens[current + 1];
          }
        }
      }
    };
    autoInsert();

    //throw "Program aborted after Automatic Parenthesis Insertion!";

    let current = 0; // "Cursor"

    let recursive = () => {
      let token = tokens[current]; // Current token
      console.log(ast.body);

      if (token.type === "number") {
        current++;
        return {
          type: "NumberLiteral",
          value: token.value
        };
      }

      if (token.type === "string") {
        current++;
        return {
          type: "StringLiteral",
          value: token.value
        };
      }

      if (token.type === "name") {
        if (tokens[current + 1].type === "parenthesis" && tokens[current + 1].value === "(") return ++current - current;
        current++;
        return {
          type: "Name",
          value: token.value
        }
      }

      if (token.type === "newline") {
        if (current == 0) return ++current - current;
        if (tokens[current - 1].type == "newline") return ++current - current;

        current++;
        return {
          type: "Newline",
          value: token.value
        }
      }

      if (token.type === "parenthesis" && token.value === "(") {
        if (tokens[current - 1]) { // Check that it exists
          if (tokens[current - 1].type === "name") {
            let name = tokens[current - 1].value;
            token = tokens[++current]; // Skip parenthesis
            let node = {
              type: "CallExpression",
              name: name,
              params: []
            };

            // Loop until end of parenthesis
            while (token.type !== "parenthesis" || (token.type === "parenthesis" && token.value !== ')')) {
              let loopNode = recursive();
              if (loopNode) node.params.push(loopNode);
              token = tokens[current];
            }

            current++; // Skip parenthesis
            return node;
          }
        }
        // Probably an operator
        token = tokens[++current]; // Skip parenthesis
        let node = {
          type: "CallExpression",
          name: null,
          params: []
        };

        let loopNode = recursive();
        if (loopNode) node.params.push(loopNode);
        if (tokens[current].type == "operator") {
          node.name = tokens[current++].value; // Operator
          let loopNode = recursive();
          if (loopNode) node.params.push(loopNode);
        }
        current++; // Skip parenthesis
        //if (tokens[current + 1].type == "parenthesis" && tokens[current + 1].value === ')') current++;
        return node;
      }

      if (token.type === "keyword") {
        if (token.value === "UNTIL" || token.value === "TIMES" || token.value === "ELSE") {
          throw "Unexpected keyword (#" + current + ") with value of " + token.value;
        }
        let node = {
          type: "BlockExpression",
          name: token.value,
          funcName: null,
          condition: null,
          body: [],
          elseBody: null
        }
        token = tokens[++current];
        if (node.name === "REPEAT" && token.value === "UNTIL") {
          node.name = "REPEAT UNTIL";
          token = tokens[++current];
        }
        if (node.name === "PROCEDURE" && token.type === "name") {
          node.funcName = token.value;
          declaredFuncs.push(node.funcName);
          token = tokens[++current];
        } else if (node.name === "PROCEDURE" && token.type !== "name") throw "Procedure must be named";

        if ((node.name === "IF" || node.name === "REPEAT UNTIL" || node.name === "PROCEDURE") && token.value !== "(") {
          throw "Parenthesis required after " + node.name;
        }

        node.condition = recursive();
        if (node.name === "PROCEDURE" && node.condition.name !== null) node.condition.name = null;


        if (node.condition.type === "BlockExpression") throw "Unexpected BlockExpression in condition";
        token = tokens[current];
        if (node.name === "REPEAT" && token.value !== "TIMES") {
          throw "TIMES required in REPEAT ... TIMES construct";
        }
        if (node.name === "REPEAT" && token.value === "TIMES") token = tokens[++current];

        let addBody = body => {
          if (token.type == "newline") token = tokens[++current];
          if (token.value != "{") throw node.name + " body must start with '{', not " + token.value;

          let blocks = 1;
          current++;
          while (blocks != 0) {
            let loopNode = recursive();
            if (loopNode) body.push(loopNode);
            //current++;
            if (current >= tokens.length) {
              console.log(body);
              throw "Out of bounds error in " + node.name + " body";
            }
            if (tokens[current].value === '{') blocks++;
            if (tokens[current].value === '}') blocks--;
          }

          token = tokens[++current];
        }
        addBody(node.body);

        if (token && token.type === "newline") token = tokens[++current];
        if (!token || token.type !== "keyword" || token.value !== "ELSE") return node;

        node.elseBody = [];
        token = tokens[++current];
        addBody(node.elseBody);
        return node;
      }

      if (token.type === "parenthesis") throw "Unexpected closing parenthesis (#" + current + ")";

      if (token.type === "operator") throw "Unexpected operator (#" + current + ")";

      throw new TypeError("Unrecognized token (#" + current + "): " + token.type + " with value of '" + token.value + "'");
    };

    let ast = {
      type: "Program",
      body: []
    };

    while (current < tokens.length) {
      let node = recursive();
      if (node) ast.body.push(node);
    }

    return ast;
  }

  // Code generator
  let codeGenerator = node => {
    let standardLibrary = `
    function $DISPLAY(expression) {
    console.log(expression);
    }
    function $INPUT(text) {
    return Window.prompt(text);
    }
    function $RANDOM(min, max) {
    let rawRandomVal = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return rawRandomVal * (max-min)/ (2**32 - 1);
    }
    function $INSERT(list, i, value) {
    list.splice(i, 0, value);
    }
    function $APPEND(list, value){
    list.push(value);
    }
    function $REMOVE(list, i) {
    return list.splice(i, 1);
    }
    function $LENGTH(list) {
    return list.length;
    }
    function $MOVE_FORWARD() {
    }
    function $ROTATE_LEFT() {
    }
    function $ROTATE_RIGHT() {
    }
    function $CAN_MOVE(direction) {
    }
    `;
    let operators = [
      ['!', "NOT"],
      ['*', '*'],
      ['/', '/'],
      ['%', "MOD"],
      ['+', '+'],
      ['-', '-'],
      ['>', '>'],
      ['<', '<'],
      [">=", '≥'],
      ["<=", '≤'],
      ['===', '='],
      ["!==", '≠'],
      ["&&", "AND"],
      ["||", "OR"],
      ['=', '←']
    ];
    let isAnOperator = testName => {
      for (let i = 0; i < operators.length; i++) {
        if (operators[i][1] == testName) return (i + 1);
      }
      return false;
    }
    console.log(node);
    if (!node) throw "Invalid node"
    switch (node.type) {
      case "Program":
        return standardLibrary+node.body.map(codeGenerator).join('\n');
      case "BlockExpression":
        switch (node.name) {
          case "IF":
            let a = "if (" + codeGenerator(node.condition) + ") {" + node.body.map(codeGenerator).join('\n  ') + "}";
            if (node.elseBody) a += " else {" + node.elseBody.map(codeGenerator).join('\n  ') + "}";
            return a;
          case "REPEAT":
            return "for (let _=0; _<" + codeGenerator(node.condition) + "; _++) {" + node.body.map(codeGenerator).join('\n  ') + "}";
          case "REPEAT UNTIL":
            return "while (" + codeGenerator(node.condition) + ") {" + node.body.map(codeGenerator).join('\n  ') + "}";
          case "PROCEDURE":
            return "function " + '$'+node.funcName + codeGenerator(node.condition) + " {" + node.body.map(codeGenerator).join('\n  ') + "}";
          default:
            throw new TypeError("Unsupported keyword: " + node.name);
        }
        case "CallExpression":
          let opIndex = isAnOperator(node.name)
          if (opIndex) return codeGenerator(node.params.shift()) + " " + operators[opIndex - 1][0] + " " + node.params.map(codeGenerator).join(';');
          if (node.name) {
            let name = '$'+node.name;
            return name + '(' + (node.params.length >= 1 ? node.params.map(codeGenerator).join(', ') : "") + ')';
          }
          return '(' + (node.params.length >= 1 ? node.params.map(codeGenerator).join(', ') : "") + ')';
        case "Name":
          return node.value;
        case "NumberLiteral":
          return node.value;
        case "StringLiteral":
          return '"' + node.value + '"';
        case "Newline":
          return;
        default:
          throw new TypeError(node.type);
    }
  }

  let tokens = tokenizer(program);
  let parsed = parser(tokens);
  let compiled = codeGenerator(parsed);
  var compiledFunc = new Function(compiled);
  compiledFunc();
  return compiled;
}