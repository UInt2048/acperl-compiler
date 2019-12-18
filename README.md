**Credits**

 - I dedicate this compiler to Mr. Richard P. Siewert, a great computer science teacher at McMillen High School, who helped to further my computer science education, and was a very great Christian overall. He sadly passed away during the making of this program.
 - The ACPERL specification rev. 2017 is the property of the College Board, and can be found [here](https://web.archive.org/web/20170711045615/https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap-computer-science-principles-course-and-exam-description.pdf) on pages 118-124.
 - The [Super Tiny Compiler](https://git.io/compiler) by Jamie Kyle (jamiebuilds), which this was based off of.

---
**What is this?**

This is a compiler for the AP CS Principles Exam Reference Language (ACPERL), written in JavaScript. It's currently still under development.
You can try it out [here](https://turtlemaster19.github.io/acperl-compiler/Compiler.html).
If that site is blocked, you can also try it on [Code.org's App Lab](https://studio.code.org/projects/applab/new) by pasting the JS file there,
or on [JS Fiddle](https://jsfiddle.net) by pasting the HTML lines in the ```<span>``` tags and the JS file, and appending to the JS on either:
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