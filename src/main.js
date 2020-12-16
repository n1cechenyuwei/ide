import Vue from 'vue'
import { Button, Select, Option, Dialog, Icon, Tree, Message, MessageBox, Tabs, TabPane, Input, Loading } from 'element-ui';
import App from './App.vue'

import router from './router'
import store from './store'
import api from './api/index'
import VueCodeMirror from 'vue-codemirror'
import 'element-ui/lib/theme-chalk/index.css';
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/blackboard.css";
import './assets/iconfont/iconfont.css'

import jshint from "jshint";

window.JSHINT = jshint.JSHINT;
Vue.use(VueCodeMirror)
Vue.use(Select);
Vue.use(Button);
Vue.use(Option);
Vue.use(Dialog);
Vue.use(Icon);
Vue.use(Tree);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Loading);

Vue.prototype.$http = api
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
