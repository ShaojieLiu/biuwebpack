// import * as babylon from "babylon";
// import traverse from "@babel/traverse";
//
// const code = `function square(n) {
//   return n * n;
// }`;
//
// const ast = babylon.parse(code);
//
// traverse(ast, {
//   enter(path) {
//     if (
//       path.node.type === "Identifier" &&
//       path.node.name === "n"
//     ) {
//       path.node.name = "x";
//     }
//   }
// });

const parse = require('babylon').parse
const generate = require('@babel/generator')
const traverse  = require('@babel/traverse')

const code = `function square(n) {
  return n * n;
}`

const ast = parse(code)

console.log(generate, traverse)

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
