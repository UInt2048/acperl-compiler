//ACPERL Compiler
//jshint maxerr: 999
//jshint maxstatements: 999
//jshint maxlen: 80
//jshint browser: true
//jshint node: true
//jshint latedef: true
//jshint undef: true
"use strict";

function Compiler(program, $robotArray, $options, $evil) {
  var acperl = this;
  acperl.CompilerSettings = function(semicolons) {
    this.semicolons = semicolons || false;
  };
  acperl.construct = function(obj, arr) {
    if (obj === Function) return Function.prototype.call.apply(
      Function, [null].concat(arr));
    return new(Function.prototype.bind.apply(
      obj, [null].concat(arr)))();
  };
  acperl.err = function(num, errInput, compilerInput) {
    this.num = num || 0;
    this.errInput = errInput || [];
    this.compilerInput = compilerInput || '';
    this.line = this.compilerInput.split('\n')[this.errInput[0] - 1];
    this.obj = function(object, _this) {
      var s = "{\n";
      for (var prop in object)
        if (Object.prototype.hasOwnProperty.call(object, prop)) s +=
          '"' + prop + '": ' + _this.e(object[prop], _this, false) + ',\n';
      return s + "}";
    };
    this.e = function($, $this) {
      var _this = $this || this;
      var _e = _this.e;
      var eInput = arguments.length > 2 && arguments[2] !== 0 / 0 ?
        arguments[2] : true;
      var _ = eInput ? _this.errInput[$] : $;
      if (typeof _ === "string" && _this.num === 3) return _.split('\\n')[0];
      else if (typeof _ === "string") return _.split('\n')[0];
      else if (_ === 0 / 0) return "undefined";
      else if (_ === null) return "null";
      else if (Array.isArray(_)) return '[' + _.map(function($) {
        return _e($, _this, 0);
      }).join(', ') + ']';
      else if (typeof _ === "object") return _this.obj(_, _this);
      else return '' + _;
    };
    this.getMessage = function(_this) {
      var __this = this,
        e = function(x) {
          return __this.e(x, _this);
        },
        line = function() {
          return e(0) + "| " + _this.line;
        };
      return "(" + _this.num + ") " + (
        _this.num === 1 ? "The character: " + e(1) + "\n\n" +
        line() + ", doesn't exist. You input " + _this.program +
        " to the tokenizer, which expects a valid ACPERL program as a string." :
        _this.num === 2 ? "Missing angle bracket (>) for the comment: <" +
        e(1) + "\n\n" + line() :
        _this.num === 3 ? "Missing quote mark (\") for the string: \"" + e(1) +
        "\n\n" + line() :
        _this.num === 4 ? "Invalid character: \"" + e(1) + "\"\n\n" + line() :
        _this.num === 5 ? "Missing " + e(1) < 0 ? "opening " : "closing " +
        "parenthesis: " + e(1) < 0 ? "'('" : "')'" + "\n\n" + line() :
        _this.num === 6 ? "Comma not allowed in element of array: " + e(1) +
        "\n\n" + line() :
        _this.num === 7 ? "There should be a comma separating elements. " +
        "Instead, there's a: " + e(1) + "\n\n" + line() :
        _this.num === 8 ? "The keyword, " + e(1) + ", shouldn't be here." +
        "\n\n" + line() :
        _this.num === 9 ? "PROCEDURE requires a name, instead of " + e(1) +
        "\n\n" + line() :
        _this.num === 10 ? "" + e(2) + " requires parentheses around the " +
        "condition, instead of: " + e(1) + "\n\n" + line() :
        _this.num === 11 ? "REPEAT requires 'UNTIL', or a number followed " +
        "by 'TIMES', instead of: " + e(1) + "\n\n" + line() :
        _this.num === 12 ? "The body of a " + e(2) + " must start with '{', " +
        "instead of: " + e(1) + "\n\n" + line() :
        _this.num === 13 ? "Missing closing brace, '}', in " + e(1) + " body." +
        "\n\n" + line() :
        _this.num === 14 ? "There shouldn't be a closing " + e(1) + " here." +
        "\n\n" + line() :
        _this.num === 15 ? "There shouldn't be an operator, " + e(1) +
        ", here.\n\n" + e(0) + "| " + _this.line :
        _this.num === 16 ? "A token, " + e(1) + ", was input to the parser " +
        "that it doesn't recognize. You shouldn't encounter this. If you do, " +
        "please go to GitHub and create an issue.\n\n" + line() :
        _this.num === 17 ? "The keyword, " + e(1) + ", isn't supported yet. " +
        "You shouldn't encounter this. If you do, please go to GitHub and " +
        "create an issue.\n\n" + line() :
        _this.num === 18 ? "" + e(1) + " hasn't been defined. Please check " +
        "your spelling matches.\n\n" + line() :
        _this.num === 19 ? "The node, " + e(1) + ", isn't supported yet. You " +
        "shouldn't encounter this. If you do, please go to GitHub and create " +
        "an issue.\n\n" + line() :
        "Unexpected error") + "\n\tat Line " + e(0) + " (ACPERL program)";
    };
    return this.getMessage(this);
  };
  acperl.Robot = function(canvases, input, initGrid, gridArgs) {
    if (!gridArgs) gridArgs = [];
    if (!canvases[0] || !canvases[1]) throw new RangeError("The robot " +
      "requires two defined canvases. However, the robot didn't receive " +
      "them.\n\nCanvases: " + (new acperl.err(0, [canvases], '')).e(0));
    this.fillColor = function fillColor(r, g, b, a, $context) {
      var context = $context || this.actCon;
      context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };
    this.rect = function rect(x, y, width, height, $context) {
      var context = $context || this.actCon,
        fillStyle = context.fillStyle,
        _x = x + context.canvas.width / 2,
        _y = -y + context.canvas.height / 2;
      context.fillStyle = context.strokeStyle;
      context.fillRect(_x, _y, width, height);
      context.fillStyle = fillStyle;
      context.fillRect(_x + 1, _y + 1, width - 2, height - 2);
      this.drawImage();
    };
    this.drawImage = function drawImage($context, $roboCon) {
      var x = this.getX(),
        y = this.getY(),
        w = 10,
        h = 15,
        context = $context || this.actCon,
        roboCon = $roboCon || this.con;
      this.clearContext(roboCon);
      roboCon.save();
      this.centerCoords(roboCon);
      roboCon.translate(x, y);
      roboCon.rotate(-this.angle);
      roboCon.translate(-x, -y);
      roboCon.beginPath();
      roboCon.moveTo(x - w / 2, y);
      roboCon.lineTo(x + w / 2, y);
      roboCon.lineTo(x, y + h);
      roboCon.closePath();
      roboCon.fillStyle = "black";
      roboCon.fill();
      roboCon.restore();
      roboCon.drawImage(context.canvas, 0, 0, 300, 300, 0, 0, 300, 300);
    };
    this.forward = function forward(dist, $ifPos) {
      var ifPos = ($ifPos === false) ? $ifPos : ($ifPos || true);
      if (dist < 0) return this.left(180, this.left(180),
        this.forward(-dist, ifPos)); // Turn around, forward -dist, then back
      this.actCon.save();
      this.centerCoords(this.actCon);
      this.actCon.beginPath();
      var newX = this.getX() + Math.sin(this.angle) * dist,
        newY = this.getY() + Math.cos(this.angle) * dist;
      this.gridPos = ifPos ? ([Math.round(this.gridPos[0] +
          (newY - this.getY()) / 25),
        Math.round(this.gridPos[1] + (newX - this.getX()) / 25)
      ]) : this.gridPos; // Update grid
      if (newX > this.actCan.width / 2 || newX < -this.actCan.width / 2 ||
        newY > this.actCan.height / 2 || newY < -this.actCan.height / 2 ||
        ifPos && (this.gridPos[0] < 0 || this.gridPos[1] < 0 ||
          this.gridPos[0] > this.gridArr[0] ||
          this.gridPos[1] > this.gridArr[1]))
        throw new RangeError("The robot attempted to leave its valid range.");
      this.actCon.moveTo(this.getX(), this.getY());
      this.actCon.lineTo(newX, newY);
      this.setX(newX);
      this.setY(newY);
      this.actCon.stroke();
      this.actCon.restore();
      this.drawImage();
    };
    this.right = function right($angle) {
      var angle = ($angle === 0) ? $angle : ($angle || 90);
      this.angle = (this.angle + angle / 180 * Math.PI) % (2 * Math.PI);
      this.drawImage();
    };
    this.left = function left($angle) {
      var angle = ($angle === 0) ? $angle : ($angle || 90);
      this.angle = (this.angle - angle / 180 * Math.PI) % (2 * Math.PI);
      this.drawImage();
    };
    this.grid = function grid($rows, $columns, $fillArr, $initPos) {
      var rows = $rows || 0,
        columns = $columns || 0,
        fillArr = $fillArr || [],
        initPos = $initPos || [0, 0];
      this.gridArr = [rows, columns, fillArr];
      var rowFunc = function(squares, fillArr, t) {
        var fill = function(val) {
          return t.fillColor(val, val, val, 1);
        };
        t.left(90);
        for (var square = 0; square < squares; square++) {
          fill(Math.ceil(255 * fillArr[square]));
          t.rect(t.getX(), t.getY(), 25, 25);
          t.forward(-25, false);
        }
        t.forward(squares * 25, false);
        t.right(90);
      };
      for (var row = 0; row < rows; row++) {
        rowFunc(columns, fillArr[row], this);
        this.forward(-25, false);
      }
      this.forward(rows * 25, false);
      this.setX(this.getX() + 25 * (0.5 + initPos[0]));
      this.setY(this.getY() - 25 * (0.5 + initPos[1]));
      this.drawImage();
      return (this.gridPos = initPos);
    };
    this.canMove = function canMove(dir) {
      var $dir = (dir === "left" ? -90 : dir === "right" ? 90 :
          dir === "forward" ? 0 : dir === "backward" ? 180 : null) +
        180 * this.angle / Math.PI;
      if ($dir === null) throw new RangeError("An unsupported direction, " +
        dir + " was given, which only accepts " +
        "'left', 'right', 'forward', and 'backward'.");
      var d = (dir % 360 + 360) % 360, // Must be 0, 90, 180, or 270
        deltArr = d === 90 || d === 270 ? [0, 2 - d / 90] : [d / 90 - 1, 0],
        r = Math.round(this.gridPos[0] + deltArr[0]),
        c = Math.round(this.gridPos[1] + deltArr[1]);
      return r >= 0 && r <= this.gridArr[0] && c >= 0 &&
        c <= this.gridArr[1] && this.gridArr[2][r][c] !== 0;
    };
    this.initHTML = function initHTML() {
      this.pos = {};
      this.pos.x = 0;
      this.pos.y = 0;
      this.getX = function getX() {
        return this.pos.x;
      };
      this.getY = function getY() {
        return this.pos.y;
      };
      this.setX = function setX(val) {
        this.pos.x = val;
      };
      this.setY = function setY(val) {
        this.pos.y = val;
      };
      this.angle = 0;
      this.width = 1;
      this.actCan = canvases[0];
      this.actCon = canvases[0].getContext('2d');
      this.can = canvases[1];
      this.con = canvases[1].getContext('2d');
      this.actCon.textAlign = "center";
      this.actCon.textBaseline = "middle";
      this.con.globalCompositeOperation = 'destination-over';
      this.actCon.lineWidth = this.width;
      this.actCon.strokeStyle = "black";
      this.actCon.globalAlpha = 1;
      this.clearContext = function clearContext(context) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
      };
      this.centerCoords = function centerCoords(context) {
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.transform(1, 0, 0, -1, 0, 0);
      };
      this.clearContext(this.actCon);
      this.drawImage();
    };
    this.initCode = function initCode() {
      this.forward = window.moveForward;
      this.left = window.turnLeft;
      this.right = window.turnRight;
      this.input = window.prompt.bind();
      this.actCan = window.createCanvas("imageCanvas");
      this.fillColor = function fillColor(r, g, b, a) {
        window.setFillColor("rgba(" + r + ", " + g + ", " + b + ", " + a + ")");
      };
      this.rect = function rect(x, y, width, height) {
        window.rect(this.initX + x, this.initY - y, width, height);
      };
      this.getX = function getX() {
        return window.getX() - this.initX;
      };
      this.getY = function getY() {
        return -(window.getY() - this.initY);
      };
      this.initX = window.getX(); // 160
      this.initY = window.getY(); // 240
      this.setX = function setX(val) {
        window.penUp();
        window.moveTo(this.initX + val, this.getY() + this.initY);
        window.penDown();
      };
      this.setY = function setY(val) {
        window.penUp();
        window.moveTo(this.getX() + this.initX, this.initY - val);
        window.penDown();
      };
      this.drawImage = function drawImage() {
        return true;
      };
    };
    this.initFunc = canvases[0] === true && canvases[1] === true ?
      this.initCode : this.initHTML;
    this.initFunc();
    this.gridPos = initGrid || false ?
      this.grid.apply(this, gridArgs) : [1 / 0, 1 / 0];
    this.input = input.bind();
    this.random = function random(min, max) {
      return window.crypto && window.crypto.getRandomValues ?
        window.crypto.getRandomValues(new Uint32Array(1))[0] *
        (max - min) / 0x100000000 + min :
        Math.random() * (max - min) + min;
    };
  };
  acperl.tokenizer = function tokenizer(input) {
    var current = 0, // "Cursor"
      tokens = [], // Push tokens here
      line = 1; // Line count
    function insert(type, value, $increment) {
      var increment = $increment || 0;
      tokens.push({
        type: type,
        value: value,
        line: line,
        current: tokens.length
      });
      current += increment;
    }
    while (current < input.length) { // Loop through input
      var value, char = input[current]; // Current character
      if (!char) throw new Error(acperl.err(1, [line, char], acperl.program));
      else if (char === '(' || char === ')') insert("parenthesis", char, 1);
      else if (char === '{' || char === '}') insert("curlybracket", char, 1);
      else if (char === '[' || char === ']') insert("bracket", char, 1);
      else if (char === ',') insert("comma", ",", 1);
      else if (char === '<' && input[current + 1] !== ' ') { // Comments
        value = '';
        char = input[++current];
        while (!(char === '>' && input[current - 1] !== ' ')) {
          value += char;
          char = input[++current];
          if (current < input.length) continue;
          insert("comment", value);
          throw new Error(acperl.err(2, [line, value], acperl.program));
        }
        insert("comment", value, 1);
      } else if (/[\u2190+*\-\/=\u2260><\u2265\u2264]/.test(char))
        insert("operator", char, 1);
      else if (/\n/.test(char)) {
        line++;
        current++;
      } else if (/\s/.test(char)) current++; // Whitespace
      else if (/[0-9]/.test(char)) {
        value = '';
        while (/[0-9]/.test(char)) { // Test if following characters are numbers
          value += char; // Add character to string
          char = input[++current]; // Increment current and char and continue
          if (current >= input.length) break;
        }
        insert("number", value, 0);
      } else if (char === '"') {
        value = '';
        char = input[++current]; // We don't need to tokenize the quote
        while (char !== '"') {
          if (char === '\\') char = "\\\\"; // Escape character if needed
          if (char === '\t') char = "\\t";
          if (char === '\v') char = "\\v";
          if (char === '\0') char = "\\0";
          if (char === '\b') char = "\\b";
          if (char === '\f') char = "\\f";
          if (char === '\n') char = "\\n";
          if (char === '\r') char = "\\r";
          if (char === '\'') char = "\\'";
          value += char; // Add character to string
          char = input[++current]; // Increment current and char and continue
          if (current < input.length) continue;
          insert("string", value);
          throw new Error(acperl.err(3, [line, value], acperl.program));
        }
        insert("string", value, 1);
      } else if (char === ';' && acperl.settings.semicolons) { // 1-line Comment
        value = '';
        char = input[++current];
        while (!/\n/.test(char)) {
          value += char;
          char = input[++current];
          if (current >= input.length) break;
        }
        insert("singlecomment", value, 1);
      } else if (/[A-Z_]/i.test(char)) { // Name
        value = '';
        while (/[A-Z_]/i.test(char)) {
          value += char; // Add character to string
          char = input[++current]; // Increment current and char and continue
          if (current >= input.length) break;
        }
        insert(/^(IF|ELSE|REPEAT|UNTIL|TIMES|PROCEDURE)$/.test(value) ?
          "keyword" : /^(MOD|AND|OR|NOT)$/.test(value) ? "operator" :
          /^(true|false)$/.test(value) ? "boolean" : "name", value, 0);
      } else throw new Error(acperl.err(4, [line, char], acperl.program));
    }
    return tokens; // End of loop
  };
  acperl.parser = function parser(tokenArray) {
    var t = tokenArray;

    function autoInsert() { // Automatic Parenthesis Insertion - for parser
      var _c = 0,
        _p = function _p() {
          for (var _len2 = arguments.length, args = new Array(
              _len2), _key2 = 0; _key2 < _len2; _key2++)
            args[_key2] = arguments[_key2];
          return args;
        }, // This will be used to separate precedence
        ops = [_p([1, "NOT"]), _p([2, '*'], [2, '/'], [2, "MOD"]),
          _p(['12', '+'], ['12', '-']),
          _p([2, '>'], [2, '<'], [2, '\u2265'], [2, '\u2264']),
          _p([2, '='], [2, '\u2260']), _p([2, "AND"]), _p([2, "OR"]),
          _p([2, '\u2190'])
        ],
        tV = function tV(_, a, b) {
          return _.type === a && (b ? _.value === b : true);
        };
      for (var _i = 0, _ops = ops; _i < _ops.length; _i++) {
        var _op = _ops[_i];
        for (var c = 0; c >= 0 && c < t.length; c++) {
          if (t[c].type !== "operator") continue;
          var bool = false,
            op = void 0,
            comment = /^((single)?comment)$/;
          for (var _j = 0, _op_ = _op; _j < _op_.length; _j++) { // Precedence
            var operator = _op_[_j];
            if (operator[1] === t[c].value) {
              bool = true;
              op = operator.slice(0);
              break;
            }
          }
          if (!bool) continue;
          if (c === 0 && op[0] === '12') op[0] = 1;
          else if (c > 0) {
            var p = c - 1;
            while (p >= 0 && comment.test(t[p].type)) p--;
            if (tV(t[p], "parenthesis", "(") || tV(t[p], "bracket", "[") ||
              tV(t[p], "keyword") || tV(t[p], "comma") ||
              tV(t[p], "operator") && op[0] === '12') op[0] = 1;
            else if (op[0] === '12') op[0] = 2;
          }
          while (t[c - 1] && comment.test(t[c - 1].type)) t.splice(c-- - 1, 1);
          if (c < 1 || t[c - 1].value !== ')' && t[c - 1].value !== ']' &&
            t[c - 1].type !== "operator" || op[0] === 1) {
            t.splice((op[0] === 1 ? c : c - 1), 0, {
              type: "parenthesis",
              value: "(",
              line: t[c].line,
              current: "API " + _c++
            });
            c++;
          } else {
            var j = c - 2;
            for (var parens = 1; parens !== 0; j--) {
              if (j < 0) throw new Error(acperl.err(
                5, [t[c].line, parens], acperl.program));
              if (t[j].value === ')' || t[j].value === ']') parens++;
              if (t[j].value === '(' || t[j].value === '[') parens--;
            }
            t.splice(t[j].type === "name" ? j : j + 1, 0, {
              type: "parenthesis",
              value: "(",
              line: t[c].line,
              current: "API " + _c++
            });
            c++;
          }

          while (comment.test(t[c + 1].type)) t.splice(c + 1, 1);
          if (t[c + 1].type === "name" && t[c + 2].type === "parenthesis" &&
            t[c + 2].value === "(") c++; // In case of call expression
          var $c = c;
          if (t[c + 1].type === "operator") $c++;
          if (t[$c + 1].value !== '(' && t[$c + 1].value !== '[' ||
            $c === t.length - 1) {
            t.splice($c + 2, 0, {
              type: "parenthesis",
              value: ")",
              line: t[$c].line,
              current: "API " + _c++
            });
          } else {
            var $j = $c + 2;
            for (var $parens = 1; $parens !== 0; $j++) {
              if ($j >= t.length) throw new Error(acperl.err(
                5, [t[$c].line, $parens], acperl.program));
              if (t[$j].value === ')' || t[$j].value === ']') $parens--;
              if (t[$j].value === '(' || t[$j].value === '[') $parens++;
            }
            t.splice($j, 0, {
              type: "parenthesis",
              value: ")",
              line: t[$c].line,
              current: "API " + _c++
            });
          }
        }
      }
    }
    autoInsert();
    console.log(acperl.autoInserted = t);
    var c = 0, // "Cursor"
      ast = {
        type: "Program",
        body: []
      },
      ret = function ret(inc, line, $type, $value, $obj) {
        var type = $type || null,
          value = $value || null,
          obj = $obj || {};
        c += inc;
        obj.line = line;
        if (obj.type !== null) obj.type = type;
        if (obj.value !== null) obj.value = value;
        return obj;
      };

    function recursive() {
      var node, l = t[c].line; //console.log(ast.body);
      if (t[c].type === "number") return ret(1, l, "NumberLiteral", t[c].value);
      if (t[c].type === "string") return ret(1, l, "StringLiteral", t[c].value);
      if (t[c].type === "boolean") return ret(1, l, "Boolean", t[c].value);
      if (t[c].type === "comment") return ret(1, l, "Comment", t[c].value);
      if (t[c].type === "singlecomment")
        return ret(1, l, "SingleComment", t[c].value);
      if (t[c].type === "name") {
        if ((t[c + 1].type !== "parenthesis" || t[c + 1].value !== "(") &&
          (t[c + 1].type !== "bracket" || t[c + 1].value !== "["))
          return ret(1, l, "Name", t[c].value);
        c += 2;
        if (t[c - 1].type === "parenthesis") { // For calling functions
          node = {
            name: t[c - 2].value,
            params: []
          };
          while (t[c].type !== "parenthesis" || t[c].value !== ')') {
            node.params.push(recursive());
            if (t[c].type === "comma") c++;
            else if (t[c].type !== "parenthesis" || t[c].value !== ')')
              throw new Error(acperl.err(7,
                [t[c].line, t[c].value], acperl.program));
          }
          return ret(1, l, "CallExpression", null, node); // Skip parenthesis
        } else if (t[c - 1].type === "bracket") { // Accessing element of array
          node = {
            name: t[c - 2].value,
            value: recursive()
          };
          while (node.value === null) node.value = recursive() || null;
          if (t[c].type !== "bracket") throw new Error(acperl.err(
            6, [t[c].line, node.value], acperl.program));
          return ret(1, l, "ArrayElement", node.value, node); // Skip bracket
        }
      }
      if (t[c].type === "bracket" && t[c].value === "[") {
        // Declaring an array
        node = {
          name: null,
          elements: []
        };
        c++; // Skip bracket
        while (t) { // Loop until end of bracket
          node.elements.push(recursive());
          if (t[c].type === "comma") c++;
          else if (t[c].type !== "bracket") throw new Error(acperl.err(
            7, [t[c].line, t[c].value], acperl.program));
          else break;
        }
        while (t[c].type !== "bracket" || t[c].value !== ']') {
          node.elements.push(recursive());
          if (t[c].type === "comma") c++;
          else if (t[c].type !== "bracket") throw new Error(acperl.err(
            7, [t[c].line, t[c].value], acperl.program));
        }
        return ret(1, l, "Array", null, node); // Skip bracket
      }

      if (t[c].type === "parenthesis" && t[c].value === "(") {
        c++; // Skip opening parenthesis
        if (t[c].type === "operator") { // For unary operators
          node = {
            name: t[c++].value, // Operator, then skip it
            params: []
          };
          while (t[c].type !== "parenthesis" || t[c].value !== ')')
            node.params.push(recursive());
          return ret(1, l, "CallExpression", null, node); // Skip parenthesis
        }
        // If not, probably operator or wrapping parenthesis
        node = {
          name: null,
          params: []
        };
        node.params.push(recursive());
        if (t[c].type === "operator") {
          node.name = t[c++].value; // Operator
          while (t[c].type !== "parenthesis" || t[c].value !== ')')
            node.params.push(recursive());
        }
        return ret(1, l, "CallExpression", null, node); // Skip parenthesis
      }
      if (t[c].type === "keyword") {
        if (/^(UNTIL|TIMES|ELSE)$/.test(t[c].value)) throw new Error(acperl.err(
          8, [t[c].line, t[c].value], acperl.program));
        node = {
          type: "BlockExpression",
          name: t[c++].value,
          funcName: null,
          cond: null,
          body: [],
          _else: null
        };
        if (node.name === "REPEAT" && t[c].value === "UNTIL") {
          node.name = "REPEAT UNTIL";
          c++;
        }
        if (node.name === "PROCEDURE" && t[c].type === "name") {
          node.funcName = t[c].value;
          acperl.declared.push(node.funcName);
          c++;
        } else if (node.name === "PROCEDURE" && t[c].type !== "name") throw new
        Error(acperl.err(9, [t[c].line, t[c].value], acperl.program));
        if ((node.name === "IF" || node.name === "REPEAT UNTIL" ||
            node.name === "PROCEDURE") && t[c].value !== "(") throw new
        Error(acperl.err(10, [t[c].line, t[c].value, node.name],
          acperl.program));
        if (t[c + 1].value === ')' && t[c + 1].type === "parenthesis") c += 2;
        else node.cond = recursive();
        if (node.name === "PROCEDURE" && node.cond && node.cond.name)
          node.cond.name = null;
        if (node.name === "REPEAT" && t[c].value !== "TIMES") throw new
        Error(acperl.err(11, [t[c].line, t[c].value], acperl.program));
        if (node.name === "REPEAT" && t[c].value === "TIMES") c++;
        var addBody = function addBody(body) {
          if (t[c].value !== "{") throw new Error(acperl.err(
            12, [t[c].line, t[c].value, node.name], acperl.program));
          c++;
          for (var loopNode, blocks = 1; blocks !== 0;) {
            if ((loopNode = recursive())) body.push(loopNode);
            if (c >= t.length) throw new Error(acperl.err(
              13, [t[t.length - 1].line, node.name], acperl.program));
            if (t[c].type === "curlybracket" && t[c].value === '{') blocks++;
            if (t[c].type === "curlybracket" && t[c].value === '}') blocks--;
          }
          c++;
        };
        addBody(node.body);
        if (!t[c] || t[c].type !== "keyword" ||
          t[c].value !== "ELSE") return node;
        node._else = [];
        c++;
        addBody(node._else);
        return node;
      }
      if (/^(parenthesis|bracket)$/.test(t[c].type)) throw new Error(acperl.err(
        14, [t[c].line, t[c].type], acperl.program));
      if (t[c].type === "operator") throw new Error(acperl.err(
        15, [t[c].line, t[c].value], acperl.program));
      throw new Error(acperl.err(16, [t[c].line, t[c]], acperl.program));
    }
    while (c < t.length) ast.body.push(recursive());
    return ast;
  };
  acperl.codeGen = function codeGen(n) {
    var mapGen = function mapGen(mapVal) {
        return Array.isArray(mapVal) ? mapVal.map(function(currentValue) {
          return acperl.codeGen(currentValue);
        }) : acperl.codeGen(mapVal);
      },
      r = function(val) {
        return val || '';
      },
      cGen = function(val) {
        return acperl.codeGen(val);
      },
      stdLib = //'"use strict";\n'+
      "function $DISPLAY(expression) {return console.log(expression);}\n" +
      "function $INPUT(text) {return robot.input(text);}\n" +
      "function $RANDOM(min, max) {return robot.random(min, max);}\n" +
      "function $INSERT(list, i, value) {return list.splice(i, 0, value);}\n" +
      "function $APPEND(list, value) {return list.push(value);}\n" +
      "function $REMOVE(list, i) {return list.splice(i, 1);}\n" +
      "function $LENGTH(list) {return list.length;}\n" +
      "function $MOVE_FORWARD() {return robot.forward(25);}\n" +
      "function $ROTATE_LEFT() {return robot.left(90);}\n" +
      "function $ROTATE_RIGHT() {return robot.right(90);}\n" +
      "function $CAN_MOVE(dir) {return robot.canMove(dir);}\n",
      ops = [
        ['!', "NOT"],
        ['*', '*'],
        ['/', '/'],
        ['%', "MOD"],
        ['+', '+'],
        ['-', '-'],
        ['>', '>'],
        ['<', '<'],
        [">=", '\u2265'],
        ["<=", '\u2264'],
        ['===', '='],
        ["!==", '\u2260'],
        ["&&", "AND"],
        ["||", "OR"],
        ['=', '\u2190']
      ],
      isAnOperator = function(testName) {
        if (!testName) return false;
        for (var i = 0; i < ops.length; i++)
          if (ops[i][1] === testName) return i + 1; // op index
        return false;
      },
      includes = function(arr, item) {
        return arr.indexOf(item) + 1;
      };
    if (!n) return r(n);
    var ret = void 0,
      op = void 0;
    if (n.type === "Program") return r(stdLib + mapGen(n.body).join('\n'));
    else if (n.type === "BlockExpression") {
      if (!(ret = n.name === "IF" ? "if (" + cGen(n.cond) +
          ") {\n" + mapGen(n.body).join('\n') + "\n}" + (n._else ? " else {\n" +
            mapGen(n._else).join('\n') + "\n}" : "") : n.name === "REPEAT" ?
          "for (var _" + acperl.count + " = 0; _" + acperl.count + " < " +
          cGen(n.cond) + "; _" + acperl.count + "++) {\n" +
          mapGen(n.body).join('\n') + "\n}" : n.name === "REPEAT UNTIL" ?
          "while (!(" + cGen(n.cond) + ")) {\n" + mapGen(n.body).join('\n') +
          "\n}" : n.name === "PROCEDURE" ? "function " + '$' + n.funcName +
          (n.cond ? cGen(n.cond) : "()") + " {\n" + mapGen(n.body).join('\n') +
          "\n}" : ""))
        throw new Error(acperl.err(17, [n.line, n.name], acperl.program));
      return r(ret);
    } else if (n.type === "CallExpression") {
      if ((op = isAnOperator(n.name))) return r(n.params.length === 1 ?
        ops[op - 1][0] + cGen(n.params[0]) : cGen(n.params.shift()) +
        " " + ops[op - 1][0] + " " + mapGen(n.params).join(''));
      if (!n.name) return r('(' + (n.params.length < 1 ? "" :
        mapGen(n.params).join(', ')) + ')');
      if (!includes(acperl.builtIn, n.name) && !includes(acperl.declared,
          n.name) && n.name !== "RETURN") throw new Error(acperl.err(
        18, [n.line, n.name], acperl.program));
      return r((n.name !== "RETURN" ? '$' + n.name : "return") + '(' +
        (n.params.length < 1 ? "" : mapGen(n.params).join(', ')) + ')' +
        (n.name === "RETURN" ? ';' : ''));
    } else if (n.type === "Array") return r('[' + (n.elements.length < 1 ? "" :
      mapGen(n.elements).join(', ')) + ']');
    else if (n.type === "ArrayElement") return r(n.name + "[" + cGen(n.value) +
      " - 1]");
    else if (/^(Boolean|Name|NumberLiteral)$/.test(n.type)) return r(n.value);
    else if (n.type === "StringLiteral") return r('"' + n.value + '"');
    else if (n.type === "Commment") return r("/*" + n.value + "*/");
    else if (n.type === "SingleComment") return r("//" + n.value);
    else throw new Error(acperl.err(19, [n.line, n.name], acperl.program));
  };
  acperl.codeStyle = function(generated) {
    var arr = generated.split('\n'),
      repeat = function(string, times) {
        for (var repeatedString = ""; times > 0; times--)
          repeatedString += string;
        return repeatedString;
      };
    for (var str = '', ind = 0, line = 0; line < arr.length; line++) {
      var lastChar = arr[line].slice(-1),
        linearr = arr[line].split('');
      for (var $count = 0, $a = 0, $s = 0; $count < linearr.length; $count++) {
        if (linearr[$count] === "}") {
          if ($a <= 0) $s += 2;
          else $a -= 2;
        } else if (linearr[$count] === "{") $a += 2;
      }
      ind -= $s; // Subtract any subtractions
      str += repeat(' ', ind) + arr[line];
      ind += $a; // Add any additions
      str += (lastChar !== "{" && lastChar !== "}") ? ";\n" : "\n";
    }
    return str;
  };
  var robotArray = $robotArray || [],
    options = $options || [],
    evil = ($evil === false) ? $evil : ($evil || true);
  acperl.count = 0;
  acperl.builtIn = [
    "DISPLAY",
    "INPUT",
    "RANDOM",
    "INSERT",
    "APPEND",
    "REMOVE",
    "LENGTH",
    "MOVE_FORWARD",
    "ROTATE_LEFT",
    "ROTATE_RIGHT",
    "CAN_MOVE"
  ];
  acperl.declared = [];
  acperl.program = program || "";
  acperl.settings = acperl.construct(acperl.CompilerSettings, options);
  acperl.compiled = acperl.codeStyle(
    acperl.codeGen(acperl.parser(acperl.tokenizer(program))));
  acperl.robot = acperl.construct(acperl.Robot, robotArray);
  if (evil) acperl.construct(Function,
    ["robot", acperl.compiled])(acperl.robot);
}