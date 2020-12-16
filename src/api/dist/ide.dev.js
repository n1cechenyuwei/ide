"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = require("./request");

var ide = {
  getsdk: function getsdk(data) {
    return (0, _request.get)("getsdk", data);
  },
  run: function run(data) {
    return (0, _request.post)("run", data);
  }
};
var _default = ide;
exports["default"] = _default;