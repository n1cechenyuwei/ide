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
  },
  build: function build(data) {
    return (0, _request.post)("towasm", data);
  },
  projectList: function projectList() {
    return (0, _request.get)("getlanguage");
  }
};
var _default = ide;
exports["default"] = _default;