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
      lastMousePos: { x: 0, y: 0 }
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

  computed: {
    cursorPosition() {
      if (this.isRoot) return this.rootCursorPosition;
      return this.getParent().cursorPosition;
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
    },

    selectionSize() {
      return this.getSelected().length;
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
        level: path.length,
        ind,
        isFirstChild: ind == 0,
        isLastChild: ind === siblings.length - 1
      };
      return node;
    },

    emitInput(newValue) {
      this.getRoot().$emit('input', newValue);
    },

    emitSelect(selectedNodes, event) {
      this.getRoot().$emit('select', selectedNodes, event);
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

    select(path, event = null, addToSelection = false) {
      addToSelection = (event && event.ctrlKey || addToSelection) && this.allowMultiselect;
      const clickedNode = this.getNode(path);
      const newNodes = this.copy(this.value);
      const shiftSelectionMode = this.allowMultiselect && event.shiftKey && this.lastSelectedNode;
      const selectedNodes = [];
      let shiftSelectionStarted = false;

      this.traverse((node, nodeModel) => {

        if (shiftSelectionMode) {
          if (node.pathStr === clickedNode.pathStr || node.pathStr === this.lastSelectedNode.pathStr) {
            nodeModel.isSelected = true;
            shiftSelectionStarted = !shiftSelectionStarted;
          }
          if (shiftSelectionStarted) nodeModel.isSelected = true;
        } else if (node.pathStr === clickedNode.pathStr) {
          nodeModel.isSelected = true;
        } else if (!addToSelection) {
          if (nodeModel.isSelected) nodeModel.isSelected = false;
        }

        if (nodeModel.isSelected) selectedNodes.push(node);
      }, newNodes);

      this.lastSelectedNode = clickedNode;
      this.emitInput(newNodes);
      this.emitSelect(selectedNodes, event);
    },

    onNodeMousemoveHandler(event) {
      if (!this.isRoot) {
        this.getRoot().onNodeMousemoveHandler(event);
        return;
      }

      const initialDraggingState = this.isDragging;
      this.isDragging = this.isDragging || this.mouseIsDown && (this.lastMousePos.x !== event.clientX || this.lastMousePos.y !== event.clientY);

      const isDragStarted = initialDraggingState === false && this.isDragging === true;

      this.lastMousePos = {
        x: event.clientX,
        y: event.clientY
      };

      if (!this.isDragging) return;

      const $root = this.getRoot().$el;
      const rootRect = $root.getBoundingClientRect();
      const $dragInfo = this.$refs.dragInfo;
      const dragInfoTop = event.clientY - rootRect.top + $root.scrollTop - ($dragInfo.style.marginBottom | 0);
      const dragInfoLeft = event.clientX - rootRect.left;

      $dragInfo.style.top = dragInfoTop + 'px';
      $dragInfo.style.left = dragInfoLeft + 'px';

      const $target = document.elementFromPoint(event.clientX, event.clientY);
      const $nodeItem = $target.getAttribute('path') ? $target : $target.closest('[path]');

      if (!$nodeItem) return;

      const destNode = this.getNode(JSON.parse($nodeItem.getAttribute('path')));

      if (isDragStarted && !destNode.isSelected) {
        this.select(destNode.path, event);
      }

      const nodeHeight = $nodeItem.offsetHeight;
      const edgeSize = this.edgeSize;
      const offsetY = event.offsetY;
      let placement;

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

      this.setCursorPosition({ node: destNode, placement });

      const scrollBottomLine = rootRect.bottom - this.scrollAreaHeight;
      const scrollDownSpeed = (event.clientY - scrollBottomLine) / (rootRect.bottom - scrollBottomLine);
      const scrollTopLine = rootRect.top + this.scrollAreaHeight;
      const scrollTopSpeed = (scrollTopLine - event.clientY) / (scrollTopLine - rootRect.top);

      if (scrollDownSpeed > 0) {
        this.startScroll(scrollDownSpeed);
      } else if (scrollTopSpeed > 0) {
        this.startScroll(-scrollTopSpeed);
      } else {
        this.stopScroll();
      }
    },

    onMouseleaveHandler(event) {
      if (!this.isRoot || !this.isDragging) return;
      const $root = this.getRoot().$el;
      const rootRect = $root.getBoundingClientRect();
      if (event.clientY >= rootRect.bottom) {
        this.setCursorPosition({ node: this.getLastNode(), placement: 'after' });
      } else if (event.clientY < rootRect.top) {
        this.setCursorPosition({ node: this.getFirstNode(), placement: 'before' });
      }
    },

    getNodeEl(path) {
      this.getRoot().$el.querySelector(`[path="${JSON.stringify(path)}"]`);
    },

    getLastNode() {
      let lastNode = null;
      this.traverse(node => {
        lastNode = node;
      });
      return lastNode;
    },

    getFirstNode() {
      return this.getNode([0]);
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

      if (!this.isDragging && targetNode) {
        this.select(targetNode.path, event);
        return;
      }

      if (!this.cursorPosition) {
        this.stopDrag();
        return;
      };

      const draggingNodes = this.getSelected();

      // check that nodes is possible to insert
      for (let draggingNode of draggingNodes) {
        if (draggingNode.pathStr == this.cursorPosition.node.pathStr) {
          this.stopDrag();
          return;
        }

        if (this.checkNodeIsParent(draggingNode, this.cursorPosition.node)) {
          this.stopDrag();
          return;
        };
      }

      const newNodes = this.copy(this.value);
      const nodeModelsToInsert = [];

      // find and mark dragging model to delete
      for (let draggingNode of draggingNodes) {
        const sourceSiblings = this.getNodeSiblings(newNodes, draggingNode.path);
        const draggingNodeModel = sourceSiblings[draggingNode.ind];
        nodeModelsToInsert.push(this.copy(draggingNodeModel));
        draggingNodeModel['_markToDelete'] = true;
      }

      // insert dragging nodes to the new place
      const destNode = this.cursorPosition.node;
      const destSiblings = this.getNodeSiblings(newNodes, destNode.path);
      const destNodeModel = destSiblings[destNode.ind];

      if (this.cursorPosition.placement === 'inside') {
        destNodeModel.children = destNodeModel.children || [];
        destNodeModel.children.unshift(...nodeModelsToInsert);
      } else {
        const insertInd = this.cursorPosition.placement === 'before' ? destNode.ind : destNode.ind + 1;

        destSiblings.splice(insertInd, 0, ...nodeModelsToInsert);
      }

      // delete dragging node from the old place
      this.traverse((node, nodeModel, siblings) => {
        let i = siblings.length;
        while (i--) {
          if (siblings[i]['_markToDelete']) siblings.splice(i, 1);
        }
      }, newNodes);

      this.lastSelectedNode = null;
      this.emitInput(newNodes);
      this.emitDrop(draggingNodes, this.cursorPosition, event);
      this.stopDrag();
    },

    onToggleHandler(event, node) {
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
      const newNodes = this.copy(this.value);
      this.traverse((node, nodeModel) => {
        if (node.pathStr !== pathStr) return;
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

    remove(paths) {
      const pathsStr = paths.map(path => JSON.stringify(path));
      const newNodes = this.copy(this.value);
      this.traverse((node, nodeModel, siblings) => {
        for (const pathStr of pathsStr) {
          if (node.pathStr === pathStr) nodeModel._markToDelete = true;
        }
      }, newNodes);

      this.traverse((node, nodeModel, siblings) => {
        let i = siblings.length;
        while (i--) {
          if (siblings[i]._markToDelete) siblings.splice(i, 1);
        }
      }, newNodes);

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
        mousemove: function(event) {
          return _vm.onNodeMousemoveHandler(event)
        },
        mouseleave: function(event) {
          return _vm.onMouseleaveHandler(event)
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
                    dragover: function(event) {
                      return event.preventDefault()
                    }
                  }
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
                    attrs: { path: node.pathStr },
                    on: {
                      drop: function(event) {
                        return _vm.onNodeDropHandler(event, node)
                      },
                      mousedown: function(event) {
                        return _vm.onNodeMousedownHandler(event, node)
                      },
                      mouseup: function(event) {
                        return _vm.onNodeMouseupHandler(event, node)
                      },
                      contextmenu: function(event) {
                        return _vm.emitNodeContextmenu(node, event)
                      },
                      dblclick: function(event) {
                        return _vm.emitNodeDblclick(node, event)
                      },
                      click: function($event) {
                        _vm.emitNodeClick(node, $event)
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
                        })
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
                    dragover: function(event) {
                      return event.preventDefault()
                    }
                  }
                }),
                _vm._v(" "),
                node.children && node.children.length && node.isExpanded
                  ? _c("sl-vue-tree", {
                      attrs: {
                        value: node.children,
                        level: node.level,
                        parentInd: nodeInd,
                        allowMultiselect: _vm.allowMultiselect,
                        edgeSize: _vm.edgeSize,
                        showBranches: _vm.showBranches
                      },
                      on: {
                        dragover: function(event) {
                          return event.preventDefault()
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
                        }
                      ])
                    })
                  : _vm._e()
              ],
              1
            )
          }),
          _vm._v(" "),
          _c(
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
                  "\n        Items: " + _vm._s(_vm.selectionSize) + "\n      "
                )
              ])
            ],
            2
          )
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