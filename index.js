#!/usr/bin/env node
const log = console.log.bind(console)
const fs = require('fs')
const babylon = require('babylon')

const read = (path) => {
    return fs.readFileSync('./test/' + path).toString()
}

const write = (name, str) => {
    return fs.writeFileSync(name, str)
}

const parse = str => {
    return babylon.parse(str)
}

const showAst = ast => {
    log(ast.tokens.map(t => t.type.label + '           ' + t.value))
}

const load = name => {
    const code = read(name)
    const ast = parse(code)
    return {name, code, ast}
}

const loadDeep = moduleName => {
    const result = load(moduleName)
    const {name, code, ast} = result
    showAst(ast)
    return result
}

const main = () => {
    const firstModule = 'main.js'
    const {name, code, ast} = loadDeep(firstModule)
    // showAst(ast)
    const templateArr = getTemplate(name, code)
    const bundle = getModel(name, templateArr)
    // log(bundle)
    write('bundle.js', bundle)
}

var getTemplate = (moduleName, code) => `
/***/ "${moduleName}":
/*!*****************!*\
  !*** ${moduleName} ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("${code.replace(/\n/g, '\\n')}\\n\\n//# sourceURL=webpack:///${moduleName}?");

/***/ }),
`

var getModel = (firstModule, templateArr) => `
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "${firstModule}");
/******/ })
/************************************************************************/
/******/ ({${templateArr}})`

main()
