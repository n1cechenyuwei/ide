"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _elementUi = require("element-ui");

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

var _vueCodemirror = _interopRequireDefault(require("vue-codemirror"));

require("element-ui/lib/theme-chalk/index.css");

require("codemirror/lib/codemirror.css");

require("codemirror/theme/dracula.css");

require("codemirror/theme/blackboard.css");

var _jshint = _interopRequireDefault(require("jshint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.JSHINT = _jshint["default"].JSHINT;

_vue["default"].use(_vueCodemirror["default"]);

_vue["default"].use(_elementUi.Select);

_vue["default"].use(_elementUi.Button);

_vue["default"].use(_elementUi.Option);

_vue["default"].use(_elementUi.Dialog);

_vue["default"].use(_elementUi.Icon);

_vue["default"].use(_elementUi.Tree);

_vue["default"].prototype.$msgbox = _elementUi.MessageBox;
_vue["default"].prototype.$alert = _elementUi.MessageBox.alert;
_vue["default"].prototype.$confirm = _elementUi.MessageBox.confirm;
_vue["default"].prototype.$prompt = _elementUi.MessageBox.prompt;
_vue["default"].prototype.$message = _elementUi.Message;
_vue["default"].config.productionTip = false;
new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');