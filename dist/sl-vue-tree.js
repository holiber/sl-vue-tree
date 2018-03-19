(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SlVueTree"] = factory();
	else
		root["SlVueTree"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sl-vue-tree.vue");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/babel-loader/lib/index.js!./src/sl-vue-tree.js":
/*!************************************************************************!*\
  !*** C:/Users/alex/node_modules/babel-loader/lib!./src/sl-vue-tree.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'sl-vue-tree',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    edgeSize: {
      type: Number,
      default: 3
    },
    showBranches: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    },
    parentInd: {
      type: Number
    },
    allowMultiselect: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      rootCursorPosition: null,
      rootDraggingNode: null
    };
  },

  computed: {
    cursorPosition() {
      if (this.isRoot) return this.rootCursorPosition;
      return this.getParent().cursorPosition;
    },

    draggingNode() {
      if (this.isRoot) return this.rootDraggingNode;
      return this.getParent().draggingNode;
    },

    nodes() {
      if (this.isRoot) {
        const nodeModels = this.copy(this.value);
        return this.getNodes(nodeModels);
      }

      return this.getParent().nodes[this.parentInd].children;
    },
    /**
    * gaps is using for nodes indentation
    * @returns {number[]}
    */
    gaps() {
      const gaps = [];
      let i = this.level - 1;
      if (!this.showBranches) i++;
      while (i-- > 0) gaps.push(i);
      return gaps;
    },

    isRoot() {
      return !this.level;
    }
  },
  methods: {

    setDraggingNode(node) {
      if (this.isRoot) {
        this.rootDraggingNode = node;
        return;
      }
      this.getParent().setDraggingNode(node);
    },

    setCursorPosition(pos) {
      if (this.isRoot) {
        this.rootCursorPosition = pos;
        return;
      }
      this.getParent().setCursorPosition(pos);
    },

    getNodes(nodeModels, parentPath = []) {

      return nodeModels.map((nodeModel, ind) => {
        const nodePath = parentPath.concat(ind);
        return this.getNode(nodePath, nodeModel, nodeModels);
      });
    },

    getNode(path, nodeModel = null, siblings = null) {
      const ind = path.slice(-1)[0];
      siblings = siblings || this.getNodeSiblings(this.value, path);
      nodeModel = nodeModel || siblings[ind];

      const node = {

        // define the all ISlTreeNodeModel props
        title: nodeModel.title,
        isLeaf: !!nodeModel.isLeaf,
        children: nodeModel.children ? this.getNodes(nodeModel.children, path) : [],
        isExpanded: nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded,
        isSelected: !!nodeModel.isSelected,
        data: nodeModel.data !== void 0 ? nodeModel.data : {},

        // define the all ISlTreeNode computed props
        path: path,
        pathStr: JSON.stringify(path),
        ind,
        isFirstChild: ind == 0,
        isLastChild: ind === siblings.length - 1
      };
      return node;
    },

    emitInput(newValue) {
      this.getRoot().$emit('input', newValue);
    },

    emitSelect(selectedNode, event) {
      this.getRoot().$emit('select', selectedNode, event);
    },

    emitDrop(targetNode, position, event) {
      this.getRoot().$emit('drop', targetNode, position, event);
    },

    emitToggle(toggledNode, event) {
      this.getRoot().$emit('toggle', toggledNode, event);
    },

    emitNodeDblclick(node, event) {
      this.getRoot().$emit('nodedblclick', node, event);
    },

    emitNodeContextmenu(node, event) {
      this.getRoot().$emit('nodecontextmenu', node, event);
    },

    emitNodeClick(node, event) {
      this.getRoot().$emit('nodeClick', node, event);
    },

    onNodeClickHandler(event, clickedNode) {
      if (!this.isRoot) {
        // handle event only in the root component
        this.getRoot().onNodeClickHandler(event, clickedNode);
        return;
      }

      const newNodes = this.copy(this.value);

      this.traverse((node, nodeModel) => {
        if (node.pathStr === clickedNode.pathStr) {
          nodeModel.isSelected = true;
        } else if (!event.ctrlKey || !this.allowMultiselect) {
          if (nodeModel.isSelected) nodeModel.isSelected = false;
        }
      }, newNodes);

      this.emitInput(newNodes);
      this.emitSelect(clickedNode, event);
      this.emitNodeClick(clickedNode, event);
    },

    onNodeDragoverHandler(event, destNode) {
      if (!this.draggingNode) return;

      const $nodeItem = event.currentTarget;
      const height = $nodeItem.offsetHeight;
      const edgeSize = this.edgeSize;
      const offsetY = event.offsetY;
      let placement;

      if (destNode.isLeaf) {
        placement = offsetY >= height / 2 ? 'after' : 'before';
      } else {
        if (offsetY <= edgeSize) {
          placement = 'before';
        } else if (offsetY >= height - edgeSize) {
          placement = 'after';
        } else {
          placement = 'inside';
        }
      }

      this.setCursorPosition({ node: destNode, placement });

      if (this.checkNodeIsParent(this.draggingNode, this.cursorPosition.node)) return;

      event.preventDefault();
    },

    onNodeDropHandler(event, targetNode) {},

    onNodeDragstartHandler(event, node) {
      this.setDraggingNode(node);
    },

    onNodeDragendHandler(event, targetNode) {

      if (!this.isRoot) {
        this.getParent().onNodeDragendHandler(event, targetNode);
        return;
      }

      if (this.checkNodeIsParent(this.draggingNode, this.cursorPosition.node)) {
        this.stopDrag();
        return;
      };

      const newNodes = this.copy(this.value);

      // find and mark dragging model
      const sourceSiblings = this.getNodeSiblings(newNodes, this.draggingNode.path);
      const draggingNodeModel = sourceSiblings[this.draggingNode.ind];
      const nodeModelToInsert = this.copy(draggingNodeModel);
      draggingNodeModel['_markToDelete'] = true;

      // insert dragging node to the new place
      const destNode = this.cursorPosition.node;
      const destSiblings = this.getNodeSiblings(newNodes, destNode.path);
      const destNodeModel = destSiblings[destNode.ind];

      if (this.cursorPosition.placement == 'inside') {
        destNodeModel.children = destNodeModel.children || [];
        destNodeModel.children.unshift(nodeModelToInsert);
      } else {
        const insertInd = this.cursorPosition.placement === 'before' ? destNode.ind : destNode.ind + 1;

        destSiblings.splice(insertInd, 0, nodeModelToInsert);
      }

      // delete dragging node from the old place
      this.traverse((node, nodeModel, siblings) => {
        if (!nodeModel['_markToDelete']) return true;
        const nodeInd = node.ind;
        siblings.splice(nodeInd, 1);
        return false;
      }, newNodes);

      this.emitInput(newNodes);
      this.emitDrop(this.draggingNode, this.cursorPosition, event);
      this.stopDrag();
    },

    onToggleHandler(event, node) {
      this.updateNode(node, { isExpanded: !node.isExpanded });
      this.emitToggle(node, event);
      event.stopPropagation();
    },

    stopDrag() {
      this.setDraggingNode(null);
      this.setCursorPosition(null);
    },

    getParent() {
      return this.$parent;
    },

    getRoot() {
      if (this.isRoot) return this;
      return this.getParent().getRoot();
    },

    getNodeSiblings(nodes, path) {
      if (path.length === 1) return nodes;
      return this.getNodeSiblings(nodes[path[0]].children, path.slice(1));
    },

    updateNode(nodeToUpdate, patch) {
      if (!this.isRoot) {
        this.getParent().updateNode(nodeToUpdate, patch);
        return;
      }

      const newNodes = this.copy(this.value);
      this.traverse((node, nodeModel) => {
        if (node.pathStr !== nodeToUpdate.pathStr) return;
        Object.assign(nodeModel, patch);
      }, newNodes);

      this.emitInput(newNodes);
    },

    getSelected() {
      const selectedNodes = [];
      this.traverse(node => {
        if (node.isSelected) selectedNodes.push(node);
      });
      return selectedNodes;
    },

    traverse(cb, nodeModels = null, parentPath = []) {
      if (!nodeModels) nodeModels = this.value;

      let shouldStop = false;

      const nodes = [];

      nodeModels.forEach((nodeModel, nodeInd) => {
        const itemPath = parentPath.concat(nodeInd);
        const node = this.getNode(itemPath, nodeModel, nodeModels);
        shouldStop = cb(node, nodeModel, nodeModels) === false;
        nodes.push(node);

        if (shouldStop) return false;

        if (nodeModel.children) {
          shouldStop = this.traverse(cb, nodeModel.children, itemPath) === false;
        }
      });

      return !shouldStop ? nodes : false;
    },

    checkNodeIsParent(sourceNode, destNode) {
      const destPath = destNode.path;
      return JSON.stringify(destPath.slice(0, sourceNode.path.length)) == sourceNode.pathStr;
    },

    copy(entity) {
      return JSON.parse(JSON.stringify(entity));
    }

  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/component-normalizer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/component-normalizer.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  scriptExports = scriptExports || {}

  // ES6 modules interop
  var type = typeof scriptExports.default
  if (type === 'object' || type === 'function') {
    scriptExports = scriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-0b7c263a\",\"hasScoped\":false,\"optionsId\":\"0\",\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/sl-vue-tree.vue":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-0b7c263a","hasScoped":false,"optionsId":"0","buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/sl-vue-tree.vue ***!
  \**********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "sl-vue-tree",
      class: { "sl-vue-tree-root": _vm.isRoot },
      on: {
        dragover: function($event) {
          $event.preventDefault()
          ;(function(event) {
            return void 0
          })($event)
        }
      }
    },
    _vm._l(_vm.nodes, function(node, nodeInd) {
      return _c(
        "div",
        {
          staticClass: "sl-vue-tree-node",
          class: { "sl-vue-tree-selected": node.isSelected }
        },
        [
          _c("div", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value:
                  _vm.cursorPosition &&
                  _vm.cursorPosition.node.pathStr === node.pathStr &&
                  _vm.cursorPosition.placement === "before",
                expression:
                  "\n        cursorPosition &&\n        cursorPosition.node.pathStr === node.pathStr &&\n        cursorPosition.placement === 'before'\n      "
              }
            ],
            staticClass: "sl-vue-tree-cursor sl-vue-tree-cursor_before"
          }),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "sl-vue-tree-node-item",
              class: {
                "sl-vue-tree-cursor-inside":
                  _vm.cursorPosition &&
                  _vm.cursorPosition.placement === "inside" &&
                  _vm.cursorPosition.node.pathStr === node.pathStr,
                "sl-vue-tree-node-is-leaf": node.isLeaf,
                "sl-vue-tree-node-is-folder": !node.isLeaf
              },
              attrs: { draggable: "true" },
              on: {
                dragover: function(event) {
                  return _vm.onNodeDragoverHandler(event, node)
                },
                drop: function(event) {
                  return _vm.onNodeDropHandler(event, node)
                },
                dragstart: function(event) {
                  return _vm.onNodeDragstartHandler(event, node)
                },
                dragend: function(event) {
                  return _vm.onNodeDragendHandler(event, node)
                },
                click: function(event) {
                  return _vm.onNodeClickHandler(event, node)
                },
                contextmenu: function(event) {
                  return _vm.emitNodeContextmenu(node, event)
                },
                dblclick: function(event) {
                  return _vm.emitNodeDblclick(node, event)
                }
              }
            },
            [
              _vm._l(_vm.gaps, function(gapInd) {
                return _c("div", { staticClass: "sl-vue-tree-gap" })
              }),
              _vm._v(" "),
              _vm.level && _vm.showBranches
                ? _c(
                    "div",
                    { staticClass: "sl-vue-tree-branch" },
                    [
                      _vm._t(
                        "branch",
                        [
                          !node.isLastChild
                            ? _c("span", [
                                _vm._v(
                                  "\n            " +
                                    _vm._s(String.fromCharCode(0x251c)) +
                                    _vm._s(String.fromCharCode(0x2500)) +
                                    " \n          "
                                )
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          node.isLastChild
                            ? _c("span", [
                                _vm._v(
                                  "\n            " +
                                    _vm._s(String.fromCharCode(0x2514)) +
                                    _vm._s(String.fromCharCode(0x2500)) +
                                    " \n          "
                                )
                              ])
                            : _vm._e()
                        ],
                        { node: node }
                      )
                    ],
                    2
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "sl-vue-tree-title" },
                [
                  !node.isLeaf
                    ? _c(
                        "span",
                        {
                          staticClass: "sl-vue-tree-toggle",
                          on: {
                            click: function(event) {
                              return _vm.onToggleHandler(event, node)
                            }
                          }
                        },
                        [
                          _vm._t(
                            "toggle",
                            [
                              _c("span", [
                                _vm._v(
                                  "\n             " +
                                    _vm._s(
                                      !node.isLeaf
                                        ? node.isExpanded ? "-" : "+"
                                        : ""
                                    ) +
                                    "\n            "
                                )
                              ])
                            ],
                            { node: node }
                          )
                        ],
                        2
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm._t("title", [_vm._v(_vm._s(node.title))], { node: node })
                ],
                2
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "sl-vue-tree-sidebar" },
                [_vm._t("sidebar", null, { node: node })],
                2
              )
            ],
            2
          ),
          _vm._v(" "),
          _c("div", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value:
                  _vm.cursorPosition &&
                  _vm.cursorPosition.node.pathStr === node.pathStr &&
                  _vm.cursorPosition.placement === "after",
                expression:
                  "\n        cursorPosition &&\n        cursorPosition.node.pathStr === node.pathStr &&\n        cursorPosition.placement === 'after'\n      "
              }
            ],
            staticClass: "sl-vue-tree-cursor sl-vue-tree-cursor_after"
          }),
          _vm._v(" "),
          node.children && node.children.length && node.isExpanded
            ? _c("sl-vue-tree", {
                attrs: {
                  value: node.children,
                  level: _vm.level + 1,
                  parentInd: nodeInd,
                  allowMultiselect: _vm.allowMultiselect,
                  edgeSize: _vm.edgeSize,
                  showBranches: _vm.showBranches
                },
                scopedSlots: _vm._u([
                  {
                    key: "title",
                    fn: function(ref) {
                      var node = ref.node
                      return [
                        _vm._t("title", [_vm._v(_vm._s(node.title))], {
                          node: node
                        })
                      ]
                    }
                  },
                  {
                    key: "toggle",
                    fn: function(ref) {
                      var node = ref.node
                      return [
                        _vm._t(
                          "toggle",
                          [
                            _c("span", [
                              _vm._v(
                                "\n             " +
                                  _vm._s(
                                    !node.isLeaf
                                      ? node.isExpanded ? "-" : "+"
                                      : ""
                                  ) +
                                  "\n          "
                              )
                            ])
                          ],
                          { node: node }
                        )
                      ]
                    }
                  },
                  {
                    key: "sidebar",
                    fn: function(ref) {
                      var node = ref.node
                      return [_vm._t("sidebar", null, { node: node })]
                    }
                  }
                ])
              })
            : _vm._e()
        ],
        1
      )
    })
  )
}
var staticRenderFns = []
render._withStripped = true

if (false) {}

/***/ }),

/***/ "./src/sl-vue-tree.vue":
/*!*****************************!*\
  !*** ./src/sl-vue-tree.vue ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_loader_sl_vue_tree_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !babel-loader!./sl-vue-tree.js */ "../../node_modules/babel-loader/lib/index.js!./src/sl-vue-tree.js");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b7c263a_hasScoped_false_optionsId_0_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sl_vue_tree_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/vue-loader/lib/template-compiler/index?{"id":"data-v-0b7c263a","hasScoped":false,"optionsId":"0","buble":{"transforms":{}}}!../node_modules/vue-loader/lib/selector?type=template&index=0!./sl-vue-tree.vue */ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-0b7c263a\",\"hasScoped\":false,\"optionsId\":\"0\",\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/sl-vue-tree.vue");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_component_normalizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/component-normalizer */ "./node_modules/vue-loader/lib/runtime/component-normalizer.js");
var disposed = false
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(_node_modules_vue_loader_lib_runtime_component_normalizer__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _babel_loader_sl_vue_tree_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  _node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b7c263a_hasScoped_false_optionsId_0_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sl_vue_tree_vue__WEBPACK_IMPORTED_MODULE_1__["render"],
  _node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b7c263a_hasScoped_false_optionsId_0_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sl_vue_tree_vue__WEBPACK_IMPORTED_MODULE_1__["staticRenderFns"],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\sl-vue-tree.vue"

/* hot reload */
if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=sl-vue-tree.js.map