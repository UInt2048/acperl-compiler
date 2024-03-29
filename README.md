# Dedication

 - I dedicate this compiler to Mr. Richard P. Siewert, a great computer science teacher at McMillen High School, in Murphy, TX, who helped to further my computer science education, and was a very great Christian overall. He sadly passed away during the making of this program.

# Description

This is a compiler for the AP CS Principles Exam Reference Language (ACPERL), written in JavaScript. The ACPERL specification rev. 2017 is the property of the College Board, and can be found [here](https://web.archive.org/web/20170711045615/https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap-computer-science-principles-course-and-exam-description.pdf) on pages 118-124.

This program was based on the [Super Tiny Compiler](https://git.io/compiler) by Jamie Kyle (jamiebuilds).

# How can I run this?
Here are some sample methods to run this code. However, don't claim it's yours in accordance with the license.

## Method 0 - GitHub Pages
You can try it out [here](https://uint2048.github.io/acperl-compiler/Compiler.html).

## Method 1 - Download/Clone
You can download or clone it and run the HTML file.

## Method 2 - Append
You can also try it on [Code.org's App Lab](https://studio.code.org/projects/applab/new) or on [JS Fiddle](https://jsfiddle.net):
1. Paste the JS file
2. If on JS Fiddle, paste the HTML inside the ```<span>``` tags.
3. Append the following, or something similar, to the JS:
<details>
<summary>Example Code</summary>

```javascript
console.log(new Compiler(
  'a \u2190 +6 - --5\n' +
  'a \u2190 .6 + 4 * .9\n' +
  'IF (a = 42)\n' +
  '{\n' +
  'DISPLAY ("true")\n' +
  '}\n' +
  'ELSE\n' +
  '{\n' +
  'DISPLAY (a)\n' +
  '}\n' +
  'REPEAT 5 TIMES\n' +
  '{\n' +
  'DISPLAY ("HELLO")\n' +
  '}\n' +
  'REPEAT UNTIL (a = 3 OR a < 0)\n' +
  '{\n' +
  'a ← a - 1\n' +
  '}\n' +
  'DISPLAY (a)\n' +
  'PROCEDURE hello()\n' +
  '{\n' +
  'RETURN ("HELLO")\n' +
  '}\n' +
  'DISPLAY(hello())\n' +
  'ROTATE_RIGHT()\n' +
  'MOVE_FORWARD()\n' +
  'DISPLAY(CAN_MOVE("left"))\n' +
  'a \u2190 INPUT("WHAT IS A?")\n' +
  'DISPLAY(a)\n' +
  'a \u2190 [6, 3]\n' +
  'DISPLAY(a[1])\n' +
  'APPEND(a, -4)\n' +
  'FOR EACH item IN a\n' +
  '{\n' +
  'DISPLAY(item)\n' +
  '}\n' +
  'REMOVE(a, 0)\n' +
  'IF (LENGTH(a) = 2) {\n' +
  'DISPLAY(RANDOM(0, 1))\n' +
  '}\n' +
  'DISPLAY(a)', [
    [!window.document || window.document.getElementById("imageCanvas"),
      !window.document || window.document.getElementById("robotCanvas")
    ], window.prompt, true, [2, 3, [
        [1, 0.5, 0],
        [0, 0.5, 1]
      ],
      [0, 0]
    ]
  ]).comp);
```

</details>

## Method 3 - Copypasta
Alternatively, you can go to JSFiddle and paste the JS file, and the HTML file inside the ```<body>``` tags.
