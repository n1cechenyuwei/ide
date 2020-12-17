<template>
  <div class="u-h-100 u-flex-col" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div
      class="u-flex-1 u-flex h-auto u-col-top u-rela"
      style="overflow: hidden"
    >
      <div class="u-rela u-h-100">
        <div class="left c_write" :style="{ width: left_width + 'px' }">
          <div class="creat_box u-flex u-row-center cursor">
            <div class="runbtn" @click="dialogVisible = true">
              <i class="el-icon-document"></i> 创建新项目
            </div>
          </div>
          <el-tree :data="list" :props="treeProps" @node-click="tree_click" @node-contextmenu="menu">
            <div class="li u-font-14 u-flex" slot-scope="{ data }">
              <span class="u-m-l-2" slot="reference">{{ data.name }}</span>
               
             
              <!-- <div v-if="!data.children">
                <i class="iconfont icon-c1"></i>
              </div> -->
              <!-- <span class="u-m-l-2">{{ data.name }}</span> -->
            </div>
          </el-tree>
        </div>
        <div class="drap_line" @mousedown="TextWidthChange"></div>
      </div>
      <div class="u-flex-1 u-flex-col u-h-100" style="overflow: hidden">
        <div>
          <div class="u-flex title_bg">
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
            <div class="cursor c_write u-m-l-20 runbtn" @click="save">
              <i class="el-icon-office-building"> save</i>
            </div>
            <div class="cursor c_write u-m-l-20 runbtn" @click="run('build')">
              <i class="el-icon-s-tools"> Build</i>
            </div>
            <div class="cursor c_write u-m-l-20 runbtn" @click="run('run')">
              <i class="el-icon-s-tools"> Run</i>
            </div>
            
          </div>
        </div>
        <div class="title_bg u-flex" v-show="fileName != ''">
          <div class="runbtn cursor c_write active">{{ fileName }}</div>
        </div>
        <div class="u-flex-1 u-flex-col u-row-between" style="overflow: hidden">
          <!-- <el-tabs v-model="activeName" @tab-click="tabClick" type="card">
            <el-tab-pane
              :label="item.name"
              :name="item.name"
              v-for="(item, index) in tabs"
              :key="index"
            > -->
          <!-- <div style="overflow: hidden"> -->
            <codemirror
              v-show="fileName != ''"
              ref="myCm"
              :value="editorValue"
              :options="cmOptions"
              @changes="onCmCodeChanges"
              @blur="onCmBlur"
              @keydown.native="onKeyDown"
              @mousedown.native="onMouseDown"
              @paste.native="OnPaste"
            ></codemirror>
            <div style="height:200px" v-show="fileName == ''">

            </div>
          <!-- </div> -->
         
          <!-- </el-tab-pane>
          </el-tabs> -->

          <div
            class="c_write u-rela print u-flex-col "
            :style="{ height: printHeight }"
          >
            <div class="right_drap_line" @mousedown="printHeightChange"></div>
            <div class="u-flex" style="background-color: #353a40; height: 40px">
              <div class="tab u-font-14">OutPut</div>
            </div>
            <div class="u-flex-1 u-flex-col" style="overflow: hidden">
              <codemirror
                ref="myCm2"
                :value="editorValue2"
                :options="cmOptions2"
              ></codemirror>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="创建新项目"
      class="createDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <div>
        <div :class="['project', pro_active == index ? 'pro_active': '']" v-for="(item, index) in projectList" :key="index" @click="pro_active = index">
          {{item}}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createProject"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title=""
      class="createDialog"
      :visible.sync="contractDialog"
      :close-on-click-modal="false"
      width="1100px"
    >
      <div class="u-p-l-40 u-p-r-40">
        <div class="u-m-b-10 u-flex">
          <span style="width: 130px">合约方法：</span>
          <el-input class="u-flex-1 u-mh-0" v-model="editorValue3" ></el-input>
        </div>
        <div class="u-m-t-30">
          <div class="u-flex u-row-between u-m-b-10">
            <span style="width: 130px">合约参数:</span>
            <el-button  type="primary" icon="el-icon-plus" size="mini" @click="paramsAdd"></el-button>
          </div>
          <div
            v-for="(item, index) in contractParams"
            :key="index"
            class="u-flex u-m-b-10 u-row-between"
            style="padding-left: 130px"
          >
            <div  class="u-m-r-10">key:</div>
            <el-input v-model="item.key" clearable style="width: 300px" max="300" size="small"></el-input>
            <div class="u-m-r-10 u-m-l-50">value:</div>
            <el-input v-model="item.value" clearable style="width: 300px" size="small"></el-input>
            <el-button class="u-m-l-30" type="primary" icon="el-icon-minus" max="300" size="mini" @click="paramsDel(index)"></el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contractDialog = false">cancel</el-button>
        <el-button type="primary" @click="runSubmit"
          >{{runType == 'run' ? 'Run' : 'Build'}}</el-button
        >
      </span>
    </el-dialog>
    
    <div class="menuBox" v-show="showmenu" @click="showmenu = false" @contextmenu.prevent="showmenu = false">
      <div class="menu" :style="{left: menuLfet +'px', top: menuTop + 'px'}">
        <!-- <div class="li">delete</div> -->
        <div class="li" @click="file_download(fileInfo.name, fileInfo.content)">download</div>
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
      projectList: [],
      fileName: "",
      editorValue: "",
      editorValue2: "",
      cmTheme: "dracula",
      cmMode: "json",
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
      cmOptions2: {
        theme: "dracula",
        readOnly: true,
        lineWrapping: true,
        lineNumbers: true,
      },
      list: [],
      treeProps: { children: "child" },
      left_width: 200,
      windowHeight: 0,
      printHeight: '100%', // 打印台高度
      tabs: [],
      activeName: "",
      dialogVisible: false,
      contractDialog: false,
      editorValue3: "",
      contractParams: [],
      loading: false,
      showmenu: false,
      menuLfet: 0,
      menuTop: 0,
      fileInfo: {}, // 文件详情
      runType: 'run',
      pro_active: 0
    };
  },
  watch: {
    // windowHeight(val) {
    //   this.windowHeight = val;
    // },
  },
  methods: {
    // 获取所有项目列表
    async getProjectList() {
      let res = await this.$http.ide.projectList()
      if (res.code == 200) {
        this.projectList = res.projectList
      }
    },
    createProject() {
      let pro = this.projectList[this.pro_active]
      if (pro == undefined) {
        return this.$message.error('创建失败')
      }
      this.loading = true
      this.getSdk(pro)

    },

    // 获取sdk
    async getSdk(type) {
      let res = await this.$http.ide.getsdk({ type: type });
      this.loading = false
      if (res.code == 200) {
        let file = res.sdkFile;
        file.name = type;
        window.localStorage.setItem("filesType", type);
        window.localStorage.setItem("files", JSON.stringify([file]));
        this.list = [file];
        this.dialogVisible = false
      }
    },

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
          cmMode = "text/javascript";
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
          cmMode = "text/x-python";
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
      this.editorValue = cm.getValue();
      this.resetLint();
    },
    // 格式化字符串为json格式字符串
    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),
        null,
        this.defaultJsonIndentation
      );
    },
    tree_click(data,node) {
      console.log(node)
      if (!data.child) {
        this.editorValue = data.content;
        this.fileName = data.name;
        let name = this.fileName.substring(this.fileName.lastIndexOf(".") + 1);
        this.getFileType(name);
      }
    },
    // 文件右键
    menu(node, data) {
      if (!data.child) {
        this.menuLfet = node.clientX
        this.menuTop = node.clientY
        this.showmenu = true
        this.fileInfo = data
      }
    },

    // 文件下载
    file_download(filename, file) {
      let aLink = document.createElement('a');
      aLink = document.createElement('a');
      let evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      aLink.download = filename;
      aLink.href = URL.createObjectURL(new Blob([file]));
      aLink.dispatchEvent(evt);
    },



    save() {
      if (this.fileName != "") {
        let content = this.$refs.myCm.codemirror.getValue();
        this.filterDoc(this.fileName, content, this.list);
        window.localStorage.setItem("files", JSON.stringify(this.list));
      }
    },

    async run(type) {
      this.save();
      this.runType = type
      this.contractDialog = true;
    },

    paramsAdd() {
      let obj = {
        key: '',
        value: ''
      }
      this.contractParams.push(obj)
    },
    paramsDel(index) {
      this.contractParams.splice(index, 1)
    },

    async runSubmit() {
      if (this.editorValue3 == '') {
        return this.$message.error('请输入合约方法')
      }
      this.loading = true
      let input = {
        function: this.editorValue3,
        paramters: null
      }
      let arr = this.contractParams
      let arr2 = []
      for (let i in arr) {
        if (arr[i].key != '' && arr[i].value != '') {
          let obj = {
            key: arr[i].key,
            value: arr[i].value
          }
          arr2.push(obj)
        }
      }
      if (arr2.length > 0) {
        input.paramters = arr2
      }
      let type = window.localStorage.getItem("filesType");
      if (this.runType == 'run') {
        let res = await this.$http.ide.run({
          type: type,
          input: input,
          contractFile: this.list[0],
        });
        this.loading = false
        if (res) {
          this.editorValue2 += res;
          this.contractDialog = false
        }
      } else {
        let res = await this.$http.ide.build({
          type: type,
          input: input,
          contractFile: this.list[0],
        });
        this.loading = false
        console.log(res.buildContent.wasmFile.content)
        let file = res.buildContent.wasmFile.content
        let blob = this.dataURLtoBlob(file)
        let aLink = document.createElement('a');
        aLink = document.createElement('a');
        let evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        aLink.download = 'main.wasm';
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);


        // this.file_download('main.wasm', blob)
        // console.log(res)
        // if (res.code == 200) {
        //   this.editorValue2 += `${res.buildContent.buildErrMsg}`
        //   if (res.buildContent.wasmFile) {
        //     res.buildContent.wasmFile.isRead = false
        //     this.list[0].child.push(res.buildContent.wasmFile)
        //   }
        //   this.contractDialog = false
        // }
      }
      

    },

    // base64文件转二进制
    dataURLtoBlob(base64) {
      // let arr = dataurl.split(','),
      // mime = arr[0].match(/:(.*?);/)[1],
      // bstr = atob(arr[0]),
      // n = bstr.length,
      // u8arr = new Uint8Array(n);
      // while(n--){
      //   u8arr[n] = bstr.charCodeAt(n);
      // }
      // return new Blob([u8arr], {type:mime});
      let bstr = atob(base64),
      n = bstr.length,
      u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n) // 转换编码后才可以使用charCodeAt 找到Unicode编码
      }  
      return new Blob([u8arr])
    },

    filterDoc(name, content, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (name == arr[i].name) {
          arr[i].content = content;
          break;
        } else {
          if (arr[i].child) {
            this.filterDoc(name, content, arr[i].child);
          }
        }
      }
    },


    getFileType(value) {
      let cmMode = "json";
      switch (value) {
        case "json":
          cmMode = "json";
          break;
        case "sql":
          cmMode = "sql";
          break;
        case "js":
          cmMode = "javascript";
          break;
        case "go":
          cmMode = "go";
          break;
        case "rs":
          cmMode = "Rust";
          break;

        case "c":
          cmMode = "C";
          break;
        case "h":
          cmMode = "C";
          break;
        case "cc":
          cmMode = "C++";
          break;
        case "cpp":
          cmMode = "C++";
          break;
        case "py":
          cmMode = "python";
          break;
        default:
          cmMode = "json";
      }
      this.onEditorModeChange(cmMode);
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
        this.printHeight = this.windowHeight - e2.clientY + 'px';
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
    let files = window.localStorage.getItem("files");
    if (files && files != "") {
      this.list = JSON.parse(files);
    }
    this.getProjectList()
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
        this.windowHeight = window.fullHeight; // 高
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
  // font-family: Apple LiGothic Medium;
  // font-size: 14px;
  // font-family: Helvetica, Tahoma, Arial, "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  // font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
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
  z-index: 20;
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
  z-index: 20;
  cursor: n-resize;
}
.right_drap_line:hover {
  height: 10px;
  background-color: #757575;
}
.print {
  min-height: 40px !important;
  max-height: calc(100% - 300px);
  height: 100%;
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
.active {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
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
.creat_box {
  background-color: rgba(33, 33, 33, 0.6);
  height: 40px;
}
/deep/.createDialog .el-dialog {
  background-color: #303342;
}
/deep/.createDialog .el-dialog__body,
/deep/.createDialog .el-dialog__header .el-dialog__title {
  color: #fff;
}
.project {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  cursor: pointer;
}
.project:hover {
  background-color: rgba(33, 33, 33, 0.6);
}
.pro_active {
  background-color: #1a1a1a !important;
}
.li {
  width: 100%;
}
.title_bg {
  background-color: rgba(33, 33, 33, 0.6);
}
.menuBox {
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  .menu {
    position: absolute;
    background-color: #303342;
    color: #fff;
    width: 130px;
    padding: 10px 0;
    box-shadow: 0 2px 8px #000;
    color: #BBB;
    background-color: #2D2F31;
    .li {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      font-size: 14px;
      padding: 0 10px;
    }
    .li:hover {
      background-color: rgba(33, 33, 33, 0.6);
    }
  }
}

</style>