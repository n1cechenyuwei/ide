<template>
  <div class="u-h-100 u-flex-col">
    <div
      class="u-flex-1 u-flex h-auto u-col-top u-rela"
      style="overflow: hidden"
    >
      <div class="u-rela u-h-100">
        <div class="left c_write" :style="{ width: left_width + 'px' }">
          <el-tree :data="list" node-key="id" default-expand-all>
            <div class="li u-font-14 u-flex" slot-scope="{ node, data }">
              <!-- <div v-if="!data.children">
                <i class="iconfont icon-c1"></i>
              </div> -->
              <span class="u-m-l-6" @click="() => append(node, data)">{{
                data.name
              }}</span>
              <!-- <span>{{ data }}</span> -->
            </div>
          </el-tree>
        </div>
        <div class="drap_line" @mousedown="TextWidthChange"></div>
      </div>
      <div class="u-flex-1 u-flex-col u-h-100" style="overflow: hidden">
        <div>
          <div class="u-flex" style="background-color: rgba(33, 33, 33, 0.6)">
            <el-select
              class="u-m-l-40 select_edit"
              v-model="cmMode"
              placeholder="请选择"
              size="small"
              style="width: 150px"
              @change="onEditorModeChange"
            >
              <el-option
                v-for="item in cmEditorModeOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <div class="cursor c_write u-m-l-20 runbtn">
              <i class="el-icon-office-building"> build</i>
            </div>
            <div class="cursor c_write u-m-l-20 runbtn">
              <i class="el-icon-s-tools"> Run</i>
            </div>
          </div>
        </div>
        <div class="u-flex-1 u-flex-col" style="overflow: hidden">
          <!-- <el-tabs v-model="activeName" @tab-click="tabClick" type="card">
            <el-tab-pane
              :label="item.name"
              :name="item.name"
              v-for="(item, index) in tabs"
              :key="index"
            >
              <input type="text" /> -->
          <codemirror
            ref="myCm"
            :value="editorValue"
            :options="cmOptions"
            @changes="onCmCodeChanges"
            @blur="onCmBlur"
            @keydown.native="onKeyDown"
            @mousedown.native="onMouseDown"
            @paste.native="OnPaste"
          ></codemirror>
          <!-- </el-tab-pane>
          </el-tabs> -->

          <div
            class="c_write u-rela print u-flex-col"
            :style="{ height: printHeight + 'px' }"
          >
            <div class="right_drap_line" @mousedown="printHeightChange"></div>
            <div class="u-flex" style="background-color: #353a40; height: 40px">
              <div class="tab u-font-14">OutPut</div>
            </div>
            <div class="u-flex-1 u-flex-col" style="overflow: hidden">
              <codemirror
                ref="myCm2"
                :value="editorValue2"
                :options="cmOptions"
                @changes="onCmCodeChanges"
                @blur="onCmBlur"
                @keydown.native="onKeyDown"
                @mousedown.native="onMouseDown"
                @paste.native="OnPaste"
              ></codemirror>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "codemirror/mode/javascript/javascript.js";
// import "codemirror/mode/xml/xml.js";
// import "codemirror/mode/htmlmixed/htmlmixed.js";
// import "codemirror/mode/css/css.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/go/go.js";
import "codemirror/mode/rust/rust.js";
// import "codemirror/mode/markdown/markdown.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/javascript-hint.js";
// import "codemirror/addon/hint/xml-hint.js";
// import "codemirror/addon/hint/css-hint.js";
// import "codemirror/addon/hint/html-hint.js";
import "codemirror/addon/hint/sql-hint.js";
import "codemirror/addon/hint/anyword-hint.js";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/json-lint";
require("script-loader!jsonlint");
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
// import "codemirror/addon/fold/xml-fold.js";
import "codemirror/addon/fold/comment-fold.js";
// import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/matchtags.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/search/jump-to-line.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/addon/display/autorefresh.js";
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/match-highlighter.js";
export default {
  data() {
    return {
      cmEditorModeOptions: [
        "json",
        "sql",
        "go",
        "C",
        "C++",
        "Rust",
        "python",
        "javascript",
      ],
      editorValue: "",
      editorValue2: "",
      cmTheme: "dracula",
      cmMode: "application/json",
      cmOptions: {
        theme: "dracula",
        mode: "application/json",
        lineWrapping: true,
        lineNumbers: true,
        autofocus: true,
        smartIndent: false,
        autocorrect: true,
        spellcheck: true,
        extraKeys: {
          Tab: "autocomplete",
          "Ctrl-Alt-L": () => {
            try {
              if (
                this.cmOptions.mode == "application/json" &&
                this.editorValue
              ) {
                this.editorValue = this.formatStrInJson(this.editorValue);
              }
            } catch (e) {
              this.$message.error("格式化代码出错：" + e.toString());
            }
          },
        },
        lint: true,
        gutters: [
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
        ],
        foldGutter: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: { bothTags: true },
        matchBrackets: true,
        styleActiveLine: true,
        autoRefresh: true,
        highlightSelectionMatches: {
          minChars: 2,
          style: "matchhighlight",
          showToken: true,
        },
        styleSelectedText: true,
        enableAutoFormatJson: true,
        defaultJsonIndentation: 2,
      },
      list: [
        {
          name: "一级目录",
          children: [
            {
              name: "二级目录-1",
              children: [
                {
                  name: "三级目录-1",
                  code: `
                    WebAssembly.instantiateStreaming(fetch("../out/main.wasm"), {
                      main: {
                        sayHello() {
                          console.log("Hello from WebAssembly!");
                          console.log(111)
                        }
                      },
                      env: {
                        abort(_msg, _file, line, column) {
                          console.error("abort called at main.ts:" + line + ":" + column);
                        }
                      },
                    }).then(result => {
                      const exports = result.instance.exports;
                      document.getElementById("container").textContent = "Result: " + exports.add(19, 23);
                    }).catch(console.error);
                  `,
                },
              ],
            },
          ],
        },
        {
          name: "一级目录 -2",
        },
      ],
      left_width: 200,
      windowHeight: 0,
      printHeight: 200, // 打印台高度
      tabs: [],
      activeName: "",
    };
  },
  watch: {
    windowHeight(val) {
      // let that = this;
      // console.log("实时屏幕高度：", val, this.windowHeight);
      this.windowHeight = val;
    },
    // cmTheme: function() {
    //   try {
    //     let theme =
    //       this.cmTheme == "default" ? "blackboard" : this.cmTheme;
    //     require("codemirror/theme/" + theme + ".css");
    //     this.cmOptions.theme = theme;
    //     this.resetLint();
    //   } catch (e) {
    //     this.$message.error("切换编辑器主题出错：" + e.toString());
    //   }
    // },
    // cmMode: function( ) {
    //   this.$set(this.cmOptions, "mode", this.cmMode);
    //   this.resetLint();
    //   this.resetFoldGutter();
    // }
  },
  methods: {
    resetLint() {
      if (!this.$refs.myCm.codemirror.getValue()) {
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption("lint", false);
        });
        return;
      }
      this.$refs.myCm.codemirror.setOption("lint", false);
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption("lint", true);
      });
    },
    resetFoldGutter() {
      this.$refs.myCm.codemirror.setOption("foldGutter", false);
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption("foldGutter", true);
      });
    },

    // 切换编辑模式事件处理函数
    onEditorModeChange(value) {
      let cmMode = "application/json";
      this.cmMode = value;
      switch (value) {
        case "json":
          cmMode = "application/json";
          break;
        case "sql":
          cmMode = "sql";
          break;
        case "javascript":
          cmMode = "javascript";
          break;
        case "go":
          cmMode = "text/x-go";
          break;
        case "Rust":
          cmMode = "text/x-rustsrc";
          break;

        case "C":
          cmMode = "text/x-csrc";
          break;
        case "C++":
          cmMode = "text/x-c++src";
          break;
        case "python":
          cmMode = "python";
          break;
        default:
          cmMode = "application/json";
      }
      this.$set(this.cmOptions, "mode", cmMode);
      this.resetLint();
      this.resetFoldGutter();
    },
    // 获取值
    getValue() {
      console.log(this.$refs.myCm.codemirror.getValue());
      try {
        return this.$refs.myCm.codemirror.getValue();
      } catch (e) {
        let errorInfo = e.toString();
        this.$message.error("获取编辑框内容失败：" + errorInfo);
        return errorInfo;
      }
    },
    // 修改值
    setValue(value) {
      try {
        if (typeof value != typeof "") {
          this.$message.error("修改编辑框内容失败：编辑宽内容只能为字符串");
          return;
        }
        if (this.cmOptions.mode == "application/json") {
          this.editorValue = this.formatStrInJson(value);
        } else {
          this.editorValue = value;
        }
      } catch (e) {
        this.$message.error("修改编辑框内容失败：" + e.toString());
      }
    },
    // 黏贴事件处理函数
    OnPaste() {
      if (this.cmOptions.mode == "application/json") {
        try {
          this.editorValue = this.formatStrInJson(this.editorValue);
        } catch (e) {
          // 啥都不做
        }
      }
    },
    // 失去焦点时处理函数
    onCmBlur(cm) {
      try {
        let editorValue = cm.getValue();
        if (this.cmOptions.mode == "application/json" && editorValue) {
          if (!this.enableAutoFormatJson) {
            return;
          }
          this.editorValue = this.formatStrInJson(editorValue);
        }
      } catch (e) {
        // 啥也不做
      }
    },
    // 按下键盘事件处理函数
    onKeyDown(event) {
      const keyCode = event.keyCode || event.which || event.charCode;
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey;
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.myCm.codemirror.showHint({ completeSingle: false });
      }
    },
    // 按下鼠标时事件处理函数
    onMouseDown() {
      this.$refs.myCm.codemirror.closeHint();
    },
    onCmCodeChanges(cm) {
      console.log(cm);
      // this.editorValue = cm.getValue();
      // this.resetLint();
    },
    // 格式化字符串为json格式字符串
    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),
        null,
        this.defaultJsonIndentation
      );
    },

    append(node, data) {
      console.log(node);
      console.log(data);
      if (!data.children) {
        console.log(this.tabs.indexOf(data));
        if (this.tabs.indexOf(data) > -1) {
          this.activeName = data.name;
        } else {
          this.tabs.push(data);
          this.activeName = data.name;
        }
      }
    },

    tabClick() {},

    // 左边拖拽放大宽度
    TextWidthChange(e) {
      let odivParent = e.currentTarget.parentNode; //获取目标父元素
      let dw = odivParent.offsetWidth; //存储默认的div的宽度。
      document.onmousemove = (e2) => {
        this.left_width = dw + (e2.clientX - dw);
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    // 打印台高度
    printHeightChange(e) {
      document.onmousemove = (e2) => {
        this.printHeight = this.windowHeight - e2.clientY;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
  },
  created() {
    // this.$http.ide.ideList({ name: "11", age: 22 });
    try {
      if (!this.editorValue) {
        this.cmOptions.lint = false;
        return;
      }
      if (this.cmOptions.mode == "application/json") {
        if (!this.enableAutoFormatJson) {
          return;
        }
        this.editorValue = this.formatStrInJson(this.editorValue);
      }
    } catch (e) {
      console.log("初始化codemirror出错：" + e);
      // this.$message.error("初始化codemirror出错：" + e);
    }
  },
  mounted() {
    this.windowHeight = document.documentElement.clientHeight;
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        // window.fullWidth = document.documentElement.clientWidth;
        this.windowHeight = window.fullHeight; // 高
        // this.windowWidth = window.fullWidth; // 宽
      })();
    };
  },
};
</script>
<style lang="scss" scoped>
/deep/.vue-codemirror {
  overflow: hidden;
  flex: 1;
}
/deep/.CodeMirror {
  height: 100% !important;
  min-height: 300px;
}
.CodeMirror-selected {
  background-color: blue !important;
}
.CodeMirror-selectedtext {
  color: white !important;
}
.cm-matchhighlight {
  background-color: #ae00ae;
}
.left {
  min-height: 100%;
  min-width: 200px;
  background-color: rgba(255, 255, 255, 0.05);
  max-width: 400px;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.drap_line {
  position: absolute;
  transform: translate(50%);
  right: 0%;
  top: 0;
  cursor: e-resize;
  width: 2px;
  height: 100%;
  background-color: #757575;
  transition: 0.3s ease all;
  z-index: 999;
}
.drap_line:hover {
  width: 10px;
  background-color: #757575;
}
.right_drap_line {
  position: absolute;
  top: 0%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
  background-color: #757575;
  transition: 0.3s ease all;
  z-index: 999;
  cursor: n-resize;
}
.right_drap_line:hover {
  height: 10px;
  background-color: #757575;
}
.print {
  min-height: 100px !important;
  max-height: 600px;
}
/deep/.el-tree {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}

/deep/.el-tree-node__content:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/deep/.el-tree-node:focus > .el-tree-node__content {
  background-color: #519aba;
}
.runbtn {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
.runbtn:hover {
  background-color: rgba(0, 0, 0, 0.5);
  color: #409eff;
}
/deep/.select_edit input {
  background-color: rgba(0, 0, 0, 0) !important;
  border: none;
  color: #fff;
}
.tab {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
</style>