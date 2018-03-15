
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
      return !this.level
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
      })
    },

    getNode(
      path,
      nodeModel = null,
      siblings = null
    ) {
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

    onNodeClickHandler(event, clickedNode) {
      if (!this.isRoot) {
        // handle event only in root component
        this.$emit('itemClick', event, clickedNode);
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


    onNodeDropHandler(event, targetNode) {

    },


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
        const insertInd = this.cursorPosition.placement === 'before' ?
          destNode.ind :
          destNode.ind + 1;

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

    checkNodeIsParent(sourceNode, destNode) {
      const destPath = destNode.path;
      return JSON.stringify(destPath.slice(0, sourceNode.path.length)) == sourceNode.pathStr;
    },

    copy(entity) {
      return JSON.parse(JSON.stringify(entity));
    }

  }
};
