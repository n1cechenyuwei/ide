"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("./request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ide = {
  ideList: function ideList(data) {
    return _request["default"].post("asddd/getOrderList", data);
  }
};
var _default = ide;
exports["default"] = _default;