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
        mousemove: _vm.onMousemoveHandler,
        mouseleave: _vm.onMouseleaveHandler,
        dragend: function($event) {
          _vm.onDragendHandler(null, $event)
        }
      }
    },
    [
      _c(
        "div",
        { ref: "nodes", staticClass: "sl-vue-tree-nodes-list" },
        [
          _vm._l(_vm.nodes, function(node, nodeInd) {
            return _c(
              "div",
              {
                staticClass: "sl-vue-tree-node",
                class: { "sl-vue-tree-selected": node.isSelected }
              },
              [
                _c("div", {
                  staticClass: "sl-vue-tree-cursor sl-vue-tree-cursor_before",
                  style: {
                    visibility:
                      _vm.cursorPosition &&
                      _vm.cursorPosition.node.pathStr === node.pathStr &&
                      _vm.cursorPosition.placement === "before"
                        ? "visible"
                        : "hidden"
                  },
                  on: {
                    dragover: function($event) {
                      $event.preventDefault()
                    }
                  }
                }),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass: "sl-vue-tree-node-item",
                    class: {
                      "sl-vue-tree-cursor-hover":
                        _vm.cursorPosition &&
                        _vm.cursorPosition.node.pathStr === node.pathStr,

                      "sl-vue-tree-cursor-inside":
                        _vm.cursorPosition &&
                        _vm.cursorPosition.placement === "inside" &&
                        _vm.cursorPosition.node.pathStr === node.pathStr,
                      "sl-vue-tree-node-is-leaf": node.isLeaf,
                      "sl-vue-tree-node-is-folder": !node.isLeaf
                    },
                    attrs: { path: node.pathStr },
                    on: {
                      mousedown: function($event) {
                        _vm.onNodeMousedownHandler($event, node)
                      },
                      mouseup: function($event) {
                        _vm.onNodeMouseupHandler($event, node)
                      },
                      contextmenu: function($event) {
                        _vm.emitNodeContextmenu(node, $event)
                      },
                      dblclick: function($event) {
                        _vm.emitNodeDblclick(node, $event)
                      },
                      click: function($event) {
                        _vm.emitNodeClick(node, $event)
                      },
                      dragover: function($event) {
                        _vm.onExternalDragoverHandler(node, $event)
                      },
                      drop: function($event) {
                        _vm.onExternalDropHandler(node, $event)
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
                                  click: function($event) {
                                    _vm.onToggleHandler($event, node)
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
                                              ? node.isExpanded
                                                ? "-"
                                                : "+"
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
                        _vm._t("title", [_vm._v(_vm._s(node.title))], {
                          node: node
                        }),
                        _vm._v(" "),
                        !node.isLeaf &&
                        node.children.length == 0 &&
                        node.isExpanded
                          ? _vm._t("empty-node", null, { node: node })
                          : _vm._e()
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
                node.children && node.children.length && node.isExpanded
                  ? _c("sl-vue-tree", {
                      attrs: {
                        value: node.children,
                        level: node.level,
                        parentInd: nodeInd,
                        allowMultiselect: _vm.allowMultiselect,
                        allowToggleBranch: _vm.allowToggleBranch,
                        edgeSize: _vm.edgeSize,
                        showBranches: _vm.showBranches
                      },
                      on: {
                        dragover: function($event) {
                          $event.preventDefault()
                        }
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
                                            ? node.isExpanded
                                              ? "-"
                                              : "+"
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
                        },
                        {
                          key: "empty-node",
                          fn: function(ref) {
                            var node = ref.node
                            return [
                              !node.isLeaf &&
                              node.children.length == 0 &&
                              node.isExpanded
                                ? _vm._t("empty-node", null, { node: node })
                                : _vm._e()
                            ]
                          }
                        }
                      ])
                    })
                  : _vm._e(),
                _vm._v(" "),
                _c("div", {
                  staticClass: "sl-vue-tree-cursor sl-vue-tree-cursor_after",
                  style: {
                    visibility:
                      _vm.cursorPosition &&
                      _vm.cursorPosition.node.pathStr === node.pathStr &&
                      _vm.cursorPosition.placement === "after"
                        ? "visible"
                        : "hidden"
                  },
                  on: {
                    dragover: function($event) {
                      $event.preventDefault()
                    }
                  }
                })
              ],
              1
            )
          }),
          _vm._v(" "),
          _vm.isRoot
            ? _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.isDragging,
                      expression: "isDragging"
                    }
                  ],
                  ref: "dragInfo",
                  staticClass: "sl-vue-tree-drag-info"
                },
                [
                  _vm._t("draginfo", [
                    _vm._v(
                      "\n        Items: " +
                        _vm._s(_vm.selectionSize) +
                        "\n      "
                    )
                  ])
                ],
                2
              )
            : _vm._e()
        ],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true

if (false) {}

/***/ }),

/***/ "./src/sl-vue-tree.js":
/*!****************************!*\
  !*** ./src/sl-vue-tree.js ***!
  \****************************/
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
    },
    allowToggleBranch: {
      type: Boolean,
      default: true
    },
    multiselectKey: {
      type: [String, Array],
      default: function () {
        return ['ctrlKey', 'metaKey']
      },
      validator: function (value) {
        let allowedKeys = ['ctrlKey', 'metaKey', 'altKey'];
        let multiselectKeys = Array.isArray(value) ? value : [value];
        multiselectKeys = multiselectKeys.filter(keyName => allowedKeys.indexOf(keyName ) !== -1);
        return !!multiselectKeys.length;
      }
    },
    scrollAreaHeight: {
      type: Number,
      default: 70
    },
    maxScrollSpeed: {
      type: Number,
      default: 20
    }
  },

  data() {
    return {
      rootCursorPosition: null,
      scrollIntervalId: 0,
      scrollSpeed: 0,
      lastSelectedNode: null,
      mouseIsDown: false,
      isDragging: false,
      lastMousePos: {x: 0, y: 0},
      preventDrag: false,
      currentValue: this.value
    };
  },

  mounted() {
    if (this.isRoot) {
      document.addEventListener('mouseup', this.onDocumentMouseupHandler);
    }
  },

  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseupHandler);
  },

  watch: {
    value: function (newValue) {
      this.currentValue = newValue;
    }
  },

  computed: {
    cursorPosition() {
      if (this.isRoot) return this.rootCursorPosition;
      return this.getParent().cursorPosition;
    },

    nodes() {
      if (this.isRoot) {
        const nodeModels = this.copy(this.currentValue);
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
      return !this.level
    },

    selectionSize() {
      return this.getSelected().length;
    },

    dragSize() {
      return this.getDraggable().length;
    }
  },
  methods: {

    setCursorPosition(pos) {
      if (this.isRoot) {
        this.rootCursorPosition = pos;
        return;
      }
      this.getParent().setCursorPosition(pos);
    },

    getNodes(nodeModels, parentPath = [], isVisible = true) {

      return nodeModels.map((nodeModel, ind) => {
        const nodePath = parentPath.concat(ind);
        return this.getNode(nodePath, nodeModel, nodeModels, isVisible);
      })
    },

    getNode(
      path,
      nodeModel = null,
      siblings = null,
      isVisible = null
    ) {
      const ind = path.slice(-1)[0];

      // calculate nodeModel, siblings, isVisible fields if it is not passed as arguments
      siblings = siblings || this.getNodeSiblings(this.currentValue, path);
      nodeModel = nodeModel || (siblings && siblings[ind]) || null;

      if (isVisible == null) {
        isVisible = this.isVisible(path);
      }

      if (!nodeModel) return null;

      const isExpanded = nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded;
      const isDraggable = nodeModel.isDraggable == void 0 ? true : !!nodeModel.isDraggable;
      const isSelectable = nodeModel.isSelectable == void 0 ? true : !!nodeModel.isSelectable;

      const node = {

        // define the all ISlTreeNodeModel props
        title: nodeModel.title,
        isLeaf: !!nodeModel.isLeaf,
        children: nodeModel.children ? this.getNodes(nodeModel.children, path, isExpanded) : [],
        isSelected: !!nodeModel.isSelected,
        isExpanded,
        isVisible,
        isDraggable,
        isSelectable,
        data: nodeModel.data !== void 0 ? nodeModel.data : {},

        // define the all ISlTreeNode computed props
        path: path,
        pathStr: JSON.stringify(path),
        level: path.length,
        ind,
        isFirstChild: ind == 0,
        isLastChild: ind === siblings.length - 1
      };
      return node;
    },

    isVisible(path) {
      if (path.length < 2) return true;
      let nodeModels = this.currentValue;

      for (let i = 0; i < path.length - 1; i++) {
        let ind = path[i];
        let nodeModel = nodeModels[ind];
        let isExpanded = nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded;
        if (!isExpanded) return false;
        nodeModels = nodeModel.children;
      }

      return true;
    },

    emitInput(newValue) {
      this.currentValue = newValue;
      this.getRoot().$emit('input', newValue);
    },

    emitSelect(selectedNodes, event) {
      this.getRoot().$emit('select', selectedNodes, event);
    },

    emitBeforeDrop(draggingNodes, position, cancel) {
      this.getRoot().$emit('beforedrop', draggingNodes, position, cancel);
    },

    emitDrop(draggingNodes, position, event) {
      this.getRoot().$emit('drop', draggingNodes, position, event);
    },

    emitToggle(toggledNode, event) {
      this.getRoot().$emit('toggle', toggledNode, event);
    },

    emitNodeClick(node, event) {
      this.getRoot().$emit('nodeclick', node, event);
    },

    emitNodeDblclick(node, event) {
      this.getRoot().$emit('nodedblclick', node, event);
    },

    emitNodeContextmenu(node, event) {
      this.getRoot().$emit('nodecontextmenu', node, event);
    },

    onExternalDragoverHandler(node, event) {
      event.preventDefault();
      const root = this.getRoot();
      const cursorPosition = root.getCursorPositionFromCoords(event.clientX, event.clientY);
      root.setCursorPosition(cursorPosition);
      root.$emit('externaldragover', cursorPosition, event);
    },

    onExternalDropHandler(node, event) {
      const root = this.getRoot();
      const cursorPosition = root.getCursorPositionFromCoords(event.clientX, event.clientY);
      root.$emit('externaldrop', cursorPosition, event);
      this.setCursorPosition(null);
    },

    select(path, addToSelection = false, event = null) {
      const multiselectKeys = Array.isArray(this.multiselectKey) ?
        this.multiselectKey:
        [this.multiselectKey];
      const multiselectKeyIsPressed = event && !!multiselectKeys.find(key => event[key]);
      addToSelection = (multiselectKeyIsPressed || addToSelection) && this.allowMultiselect ;

      const selectedNode = this.getNode(path);
      if (!selectedNode) return null;
      const newNodes = this.copy(this.currentValue);
      const shiftSelectionMode = this.allowMultiselect && event && event.shiftKey && this.lastSelectedNode;
      const selectedNodes = [];
      let shiftSelectionStarted = false;

      this.traverse((node, nodeModel) => {


        if (shiftSelectionMode) {
          if (node.pathStr === selectedNode.pathStr || node.pathStr === this.lastSelectedNode.pathStr) {
            nodeModel.isSelected = node.isSelectable;
            shiftSelectionStarted = !shiftSelectionStarted;
          }
          if (shiftSelectionStarted) nodeModel.isSelected = node.isSelectable;
        } else if (node.pathStr === selectedNode.pathStr) {
          nodeModel.isSelected = node.isSelectable;
        } else if (!addToSelection) {
          if (nodeModel.isSelected) nodeModel.isSelected = false;
        }

        if (nodeModel.isSelected) selectedNodes.push(node);

      }, newNodes);


      this.lastSelectedNode = selectedNode;
      this.emitInput(newNodes);
      this.emitSelect(selectedNodes, event);
      return selectedNode;
    },

    onMousemoveHandler(event) {
      if (!this.isRoot) {
        this.getRoot().onMousemoveHandler(event);
        return;
      }

      if (this.preventDrag) return;

      const initialDraggingState = this.isDragging;
      const isDragging =
        this.isDragging || (
        this.mouseIsDown &&
        (this.lastMousePos.x !== event.clientX || this.lastMousePos.y !== event.clientY)
      );

      const isDragStarted = initialDraggingState === false && isDragging === true;

      this.lastMousePos = {
        x: event.clientX,
        y: event.clientY
      };

      if (!isDragging) return;

      const $root = this.getRoot().$el;
      const rootRect = $root.getBoundingClientRect();
      const $dragInfo = this.$refs.dragInfo;
      const dragInfoTop = (event.clientY - rootRect.top + $root.scrollTop - ($dragInfo.style.marginBottom | 0) );
      const dragInfoLeft = (event.clientX - rootRect.left);

      $dragInfo.style.top = dragInfoTop + 'px';
      $dragInfo.style.left = dragInfoLeft + 'px';

      const cursorPosition = this.getCursorPositionFromCoords(event.clientX, event.clientY);
      const destNode = cursorPosition.node;
      const placement = cursorPosition.placement;

      if (isDragStarted && !destNode.isSelected) {
        this.select(destNode.path, false, event);
      }

      const draggableNodes = this.getDraggable();
      if (!draggableNodes.length) {
        this.preventDrag = true;
        return;
      }

      this.isDragging = isDragging;

      this.setCursorPosition({ node: destNode, placement });

      const scrollBottomLine = rootRect.bottom - this.scrollAreaHeight;
      const scrollDownSpeed = (event.clientY - scrollBottomLine) / (rootRect.bottom - scrollBottomLine);
      const scrollTopLine = rootRect.top + this.scrollAreaHeight;
      const scrollTopSpeed = (scrollTopLine - event.clientY) / (scrollTopLine - rootRect.top);

      if (scrollDownSpeed > 0) {
        this.startScroll(scrollDownSpeed);
      } else if (scrollTopSpeed > 0) {
        this.startScroll(-scrollTopSpeed)
      } else {
        this.stopScroll();
      }
    },

    getCursorPositionFromCoords(x, y) {
      const $target = document.elementFromPoint(x, y);
      const $nodeItem = $target.getAttribute('path') ? $target : this.getClosetElementWithPath($target);
      let destNode;
      let placement;

      if ($nodeItem) {

        if (!$nodeItem) return;

        destNode = this.getNode(JSON.parse($nodeItem.getAttribute('path')));

        const nodeHeight = $nodeItem.offsetHeight;
        const edgeSize = this.edgeSize;
        const offsetY = y - $nodeItem.getBoundingClientRect().top;


        if (destNode.isLeaf) {
          placement = offsetY >= nodeHeight / 2 ? 'after' : 'before';
        } else {
          if (offsetY <= edgeSize) {
            placement = 'before';
          } else if (offsetY >= nodeHeight - edgeSize) {
            placement = 'after';
          } else {
            placement = 'inside';
          }
        }
      } else {
        const $root = this.getRoot().$el;
        const rootRect = $root.getBoundingClientRect();
        if (y > rootRect.top + (rootRect.height / 2)) {
          placement = 'after';
          destNode = this.getLastNode();
        } else {
          placement = 'before';
          destNode = this.getFirstNode();
        }
      }

      return { node: destNode, placement };
    },

    getClosetElementWithPath($el) {
      if (!$el) return null;
      if ($el.getAttribute('path')) return $el;
      return this.getClosetElementWithPath($el.parentElement);
    },

    onMouseleaveHandler(event) {
      if (!this.isRoot || !this.isDragging) return;
      const $root = this.getRoot().$el;
      const rootRect = $root.getBoundingClientRect();
      if (event.clientY >= rootRect.bottom) {
        this.setCursorPosition({ node: this.nodes.slice(-1)[0], placement: 'after' });
      } else if (event.clientY < rootRect.top) {
        this.setCursorPosition({ node: this.getFirstNode(), placement: 'before'});
      }
    },

    getNodeEl(path) {
      this.getRoot().$el.querySelector(`[path="${JSON.stringify(path)}"]`);
    },

    getLastNode() {
      let lastNode  = null;
      this.traverse((node) => {
        lastNode = node;
      });
      return lastNode;
    },

    getFirstNode() {
      return this.getNode([0]);
    },

    getNextNode(path, filter = null) {

      let resultNode = null;

      this.traverse((node) => {
        if (this.comparePaths(node.path, path) < 1) return;

        if (!filter || filter(node)) {
          resultNode = node;
          return false; // stop traverse
        }

      });

      return resultNode;
    },

    getPrevNode(path, filter) {
      let prevNodes = [];

      this.traverse((node) => {
        if (this.comparePaths(node.path, path) >= 0) {
          return false;
        }
        prevNodes.push(node);
      });

      let i = prevNodes.length;
      while (i--) {
        const node = prevNodes[i];
        if (!filter || filter(node)) return node;
      }

      return null;
    },

    /**
     * returns 1 if path1 > path2
     * returns -1 if path1 < path2
     * returns 0 if path1 == path2
     *
     * examples
     *
     * [1, 2, 3] < [1, 2, 4]
     * [1, 1, 3] < [1, 2, 3]
     * [1, 2, 3] > [1, 2, 0]
     * [1, 2, 3] > [1, 1, 3]
     * [1, 2] < [1, 2, 0]
     *
     */
    comparePaths(path1, path2) {
      for (let i = 0; i < path1.length; i++) {
        if (path2[i] == void 0) return 1;
        if (path1[i] > path2[i]) return 1;
        if (path1[i] < path2[i]) return -1;
      }
      return path2[path1.length] == void 0 ? 0 : -1;
    },

    onNodeMousedownHandler(event, node) {
      // handle only left mouse button
      if (event.button !== 0) return;

      if (!this.isRoot) {
        this.getRoot().onNodeMousedownHandler(event, node);
        return;
      }
      this.mouseIsDown = true;
    },


    startScroll(speed) {
      const $root = this.getRoot().$el;
      if (this.scrollSpeed === speed) {
        return;
      } else if (this.scrollIntervalId) {
        this.stopScroll();
      }

      this.scrollSpeed = speed;
      this.scrollIntervalId = setInterval(() => {
        $root.scrollTop += this.maxScrollSpeed * speed;
      }, 20);
    },

    stopScroll() {
      clearInterval(this.scrollIntervalId);
      this.scrollIntervalId = 0;
      this.scrollSpeed = 0;
    },

    onDocumentMouseupHandler(event) {
      if (this.isDragging) this.onNodeMouseupHandler(event);
    },

    onNodeMouseupHandler(event, targetNode = null) {

      // handle only left mouse button
      if (event.button !== 0) return;

      if (!this.isRoot) {
        this.getRoot().onNodeMouseupHandler(event, targetNode);
        return;
      }

      this.mouseIsDown = false;

      if (!this.isDragging && targetNode && !this.preventDrag) {
        this.select(targetNode.path, false, event);
      }

      this.preventDrag = false;

      if (!this.cursorPosition) {
        this.stopDrag();
        return;
      };


      const draggingNodes = this.getDraggable();

      // check that nodes is possible to insert
      for (let draggingNode of draggingNodes) {
        if (draggingNode.pathStr == this.cursorPosition.node.pathStr) {
          this.stopDrag();
          return;
        }

        if (this.checkNodeIsParent(draggingNode, this.cursorPosition.node)) {
          this.stopDrag();
          return;
        }
      }

      const newNodes = this.copy(this.currentValue);
      const nodeModelsSubjectToInsert = [];

      // find dragging model to delete
      for (let draggingNode of draggingNodes) {
        const sourceSiblings = this.getNodeSiblings(newNodes, draggingNode.path);
        const draggingNodeModel = sourceSiblings[draggingNode.ind];
        nodeModelsSubjectToInsert.push(draggingNodeModel);
      }

      // allow the drop to be cancelled
      let cancelled = false;
      this.emitBeforeDrop(draggingNodes, this.cursorPosition, () => cancelled = true);

      if (cancelled) {
          this.stopDrag();
          return;
      }

      const nodeModelsToInsert = [];

      // mark dragging model to delete
      for (let draggingNodeModel of nodeModelsSubjectToInsert) {
          nodeModelsToInsert.push(this.copy(draggingNodeModel));
          draggingNodeModel['_markToDelete'] = true;
      }

      // insert dragging nodes to the new place
      this.insertModels(this.cursorPosition, nodeModelsToInsert, newNodes);


      // delete dragging node from the old place
      this.traverseModels((nodeModel, siblings, ind) => {
        if (!nodeModel._markToDelete) return;
        siblings.splice(ind, 1);
      }, newNodes);


      this.lastSelectedNode = null;
      this.emitInput(newNodes);
      this.emitDrop(draggingNodes, this.cursorPosition, event);
      this.stopDrag();
    },


    onToggleHandler(event, node) {
      if (!this.allowToggleBranch) return;

      this.updateNode(node.path, { isExpanded: !node.isExpanded });
      this.emitToggle(node, event);
      event.stopPropagation();
    },

    stopDrag() {
      this.isDragging = false;
      this.mouseIsDown = false;
      this.setCursorPosition(null);
      this.stopScroll();
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


    updateNode(path, patch) {
      if (!this.isRoot) {
        this.getParent().updateNode(path, patch);
        return;
      }

      const pathStr = JSON.stringify(path);
      const newNodes = this.copy(this.currentValue);
      this.traverse((node, nodeModel) => {
        if (node.pathStr !== pathStr) return;
        Object.assign(nodeModel, patch);
      }, newNodes);

      this.emitInput(newNodes);
    },

    getSelected() {
      const selectedNodes = [];
      this.traverse((node) => {
        if (node.isSelected) selectedNodes.push(node);
      });
      return selectedNodes;
    },

    getDraggable() {
      const selectedNodes = [];
      this.traverse((node) => {
        if (node.isSelected && node.isDraggable) selectedNodes.push(node);
      });
      return selectedNodes;
    },


    traverse(
      cb,
      nodeModels = null,
      parentPath = []
    ) {
      if (!nodeModels) nodeModels = this.currentValue;

      let shouldStop = false;

      const nodes = [];

      for (let nodeInd = 0; nodeInd < nodeModels.length; nodeInd++) {
        const nodeModel = nodeModels[nodeInd];
        const itemPath = parentPath.concat(nodeInd);
        const node = this.getNode(itemPath, nodeModel, nodeModels);
        shouldStop = cb(node, nodeModel, nodeModels) === false;
        nodes.push(node);

        if (shouldStop) break;

        if (nodeModel.children) {
          shouldStop = this.traverse(cb, nodeModel.children, itemPath) === false;
          if (shouldStop) break;
        }
      }

      return !shouldStop ? nodes : false;
    },

    traverseModels(cb, nodeModels) {
      let i = nodeModels.length;
      while (i--) {
        const nodeModel = nodeModels[i];
        if (nodeModel.children) this.traverseModels(cb, nodeModel.children);
        cb(nodeModel, nodeModels, i);
      }
      return nodeModels;
    },

    remove(paths) {
      const pathsStr = paths.map(path => JSON.stringify(path));
      const newNodes = this.copy(this.currentValue);
      this.traverse( (node, nodeModel, siblings) => {
        for (const pathStr of pathsStr) {
          if (node.pathStr === pathStr) nodeModel._markToDelete = true;
        }
      }, newNodes);

      this.traverseModels((nodeModel, siblings, ind) => {
        if (!nodeModel._markToDelete) return;
        siblings.splice(ind, 1);
      }, newNodes);

      this.emitInput(newNodes);
    },

    insertModels(cursorPosition, nodeModels, newNodes) {
      const destNode = cursorPosition.node;
      const destSiblings = this.getNodeSiblings(newNodes, destNode.path);
      const destNodeModel = destSiblings[destNode.ind];

      if (cursorPosition.placement === 'inside') {
        destNodeModel.children = destNodeModel.children || [];
        destNodeModel.children.unshift(...nodeModels);
      } else {
        const insertInd = cursorPosition.placement === 'before' ?
          destNode.ind :
          destNode.ind + 1;

        destSiblings.splice(insertInd, 0, ...nodeModels);
      }
    },

    insert(cursorPosition, nodeModel) {
      const nodeModels = Array.isArray(nodeModel) ? nodeModel : [nodeModel];
      const newNodes = this.copy(this.currentValue);

      this.insertModels(cursorPosition, nodeModels, newNodes);

      this.emitInput(newNodes);
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

/***/ "./src/sl-vue-tree.vue":
/*!*****************************!*\
  !*** ./src/sl-vue-tree.vue ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sl_vue_tree_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!./sl-vue-tree.js */ "./src/sl-vue-tree.js");
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
  _sl_vue_tree_js__WEBPACK_IMPORTED_MODULE_0__["default"],
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