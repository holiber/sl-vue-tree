
export default {
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
      lastMousePos: {x: 0, y: 0}
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
      return !this.level
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
      })
    },

    getNode(
      path,
      nodeModel = null,
      siblings = null
    ) {
      const ind = path.slice(-1)[0];
      siblings = siblings || this.getNodeSiblings(this.value, path);
      nodeModel = nodeModel || (siblings && siblings[ind]) || null;

      if (!nodeModel) return null;

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

    select(path, addToSelection = false, event = null) {
      addToSelection = ((event && event.ctrlKey) || addToSelection) && this.allowMultiselect;
      const selectedNode = this.getNode(path);
      if (!selectedNode) return null;
      const newNodes = this.copy(this.value);
      const shiftSelectionMode = this.allowMultiselect && event && event.shiftKey && this.lastSelectedNode;
      const selectedNodes = [];
      let shiftSelectionStarted = false;

      this.traverse((node, nodeModel) => {

        if (shiftSelectionMode) {
          if (node.pathStr === selectedNode.pathStr || node.pathStr === this.lastSelectedNode.pathStr) {
            nodeModel.isSelected = true;
            shiftSelectionStarted = !shiftSelectionStarted;
          }
          if (shiftSelectionStarted) nodeModel.isSelected = true;
        } else if (node.pathStr === selectedNode.pathStr) {
          nodeModel.isSelected = true;
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

      const initialDraggingState = this.isDragging;
      this.isDragging =
        this.isDragging || (
        this.mouseIsDown &&
        (this.lastMousePos.x !== event.clientX || this.lastMousePos.y !== event.clientY)
      );

      const isDragStarted = initialDraggingState === false && this.isDragging === true;

      this.lastMousePos = {
        x: event.clientX,
        y: event.clientY
      };

      if (!this.isDragging) return;

      const $root = this.getRoot().$el;
      const rootRect = $root.getBoundingClientRect();
      const $dragInfo = this.$refs.dragInfo;
      const dragInfoTop = (event.clientY - rootRect.top + $root.scrollTop - ($dragInfo.style.marginBottom | 0) );
      const dragInfoLeft = (event.clientX - rootRect.left);

      $dragInfo.style.top = dragInfoTop + 'px';
      $dragInfo.style.left = dragInfoLeft + 'px';



      const $target = document.elementFromPoint(event.clientX, event.clientY);
      const $nodeItem = $target.getAttribute('path') ? $target : $target.closest('[path]');
      const offsetY = event.offsetY;
      let destNode;
      let placement;

      if ($nodeItem) {

        if (!$nodeItem) return;

        destNode = this.getNode(JSON.parse($nodeItem.getAttribute('path')));

        if (isDragStarted && !destNode.isSelected) {
          this.select(destNode.path, false, event);
        }


        const nodeHeight = $nodeItem.offsetHeight;
        const edgeSize = this.edgeSize;


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
        if (offsetY < rootRect.height / 2) return;
        placement = 'after';
        destNode = this.nodes.slice(-1)[0];
      }
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
        this.select(targetNode.path, false, event);
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
        const insertInd = this.cursorPosition.placement === 'before' ?
          destNode.ind :
          destNode.ind + 1;

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
      this.traverse((node) => {
        if (node.isSelected) selectedNodes.push(node);
      });
      return selectedNodes;
    },


    traverse(
      cb,
      nodeModels = null,
      parentPath = []
    ) {
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
      this.traverse( (node, nodeModel, siblings) => {
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
};
