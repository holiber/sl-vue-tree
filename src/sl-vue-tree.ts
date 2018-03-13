
import Component from 'vue-class-component';
import Vue from 'vue';

export interface ISlTreeNodeModel<TDataType> {
  title: 'string';
  isLeaf?: boolean;
  children?: ISlTreeNodeModel<TDataType>[];
  isExpanded?: boolean;
  isSelected?: boolean;
  data?: TDataType;
}

export interface ISlTreeNode<TDataType> extends ISlTreeNodeModel<TDataType> {
  isFirstChild: boolean;
  isLastChild: boolean;
  ind: number;
  path: number[];
  pathStr: string;
  children: ISlTreeNode<TDataType>[];
}

export interface ICursorPosition<TDataType> {
  node: ISlTreeNode<TDataType>;
  placement: 'before' | 'inside' | 'after';
}


@Component({
  name: 'sl-vue-tree',
  props: {
    value: Array,
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
      type: Number,
      default: null
    },
    allowMultiselect: {
      type: Boolean,
      default: true
    }
  }
})
export default class SlVueTree<TDataType> extends Vue {


  value: ISlTreeNodeModel<TDataType>[];


  // @Prop({ default: 3})
  edgeSize: number;

  // @Prop({ default: true})
  allowMultiselect: boolean;

  // @Prop({ default: false})
  showBranches: boolean;

  // @Prop({default: 0})
  level: number;

  // @Prop()
  parentInd: number;

  // only the root component stores some props
  private rootCursorPosition: ICursorPosition<TDataType> = null;
  private rootDraggingNode: ISlTreeNode<TDataType> = null;


  get cursorPosition(): ICursorPosition<TDataType> {
    if (this.isRoot) return this.rootCursorPosition;
    return this.getParent().cursorPosition;
  }

  set cursorPosition(pos: ICursorPosition<TDataType>) {
    if (this.isRoot) {
      this.rootCursorPosition = pos;
      return;
    }
    this.getParent().cursorPosition = pos;
  }

  get draggingNode(): ISlTreeNode<TDataType> {
    if (this.isRoot) return this.rootDraggingNode;
    return this.getParent().draggingNode;
  }

  set draggingNode(node: ISlTreeNode<TDataType>) {
    if (this.isRoot) {
      this.rootDraggingNode = node;
      return;
    }
    this.getParent().draggingNode = node;
  }

  get nodes(): ISlTreeNode<TDataType>[] {
    if (this.isRoot) {
      const nodeModels = this.copy(this.value);
      return this.getNodes(nodeModels);
    }

    return this.getParent().nodes[this.parentInd].children;
  }

  protected emitInput(newValue: ISlTreeNodeModel<TDataType>[]) {
    this.$emit('input', newValue);
  }

  protected emitSelect(selectedNode: ISlTreeNode<TDataType>, event: MouseEvent) {
    this.$emit('select', selectedNode, event);
  }

  protected emitDrop(targetNode: ISlTreeNode<TDataType>, position: ICursorPosition<TDataType>, event: DragEvent) {
    this.$emit('drop', targetNode, position, event);
  }

  protected emitToggle(toggledNode: ISlTreeNode<TDataType>, event: DragEvent) {
    this.$emit('toggle', toggledNode, event);
  }


  getNodes(nodeModels: ISlTreeNodeModel<TDataType>[], parentPath: number[] = []): ISlTreeNode<TDataType>[] {

    return nodeModels.map((nodeModel, ind) => {
      const nodePath = parentPath.concat(ind);
      return this.getNode(nodePath, nodeModel, nodeModels);
    })
  }

  getNode(
    path: number[],
    nodeModel?: ISlTreeNodeModel<TDataType>,
    siblings?: ISlTreeNodeModel<TDataType>[]
  ): ISlTreeNode<TDataType> {
    const ind = path.slice(-1)[0];
    siblings = siblings || this.getNodeSiblings(this.value, path);
    nodeModel = nodeModel || siblings[ind];

    const node: ISlTreeNode<TDataType> = {

      // define the all ISlTreeNodeModel props
      title: nodeModel.title,
      isLeaf: !!nodeModel.isLeaf,
      children: nodeModel.children ? this.getNodes(nodeModel.children, path) : [],
      isExpanded: nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded,
      isSelected: !!nodeModel.isSelected,
      data: nodeModel.data !== void 0 ? nodeModel.data : {} as TDataType,

      // define the all ISlTreeNode computed props
      path: path,
      pathStr: JSON.stringify(path),
      ind,
      isFirstChild: ind == 0,
      isLastChild: ind === siblings.length - 1
    };
    return node;
  }

  /**
   * gaps is using for nodes indentation
   * @returns {number[]}
   */
  get gaps(): number[] {
    const gaps: number[] = [];
    let i = this.level - 1;
    if (!this.showBranches) i++;
    while (i-- > 0) gaps.push(i);
    return gaps;
  }

  get isRoot(): boolean {
    return !this.level
  }


  onNodeClickHandler(event: MouseEvent, clickedNode: ISlTreeNode<TDataType>) {
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
        nodeModel.isSelected = false;
      }
    }, newNodes);

    this.emitInput(newNodes);
    this.emitSelect(clickedNode, event);
  }


  onNodeDragoverHandler(event: DragEvent, destNode: ISlTreeNode<TDataType>) {
    if (!this.draggingNode) return;
    
    const $nodeItem = event.currentTarget as HTMLElement;
    const height = $nodeItem.offsetHeight;
    const edgeSize = this.edgeSize;
    const offsetY = event.offsetY;
    let placement: 'before' | 'inside' | 'after';


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
    this.cursorPosition = { node: destNode, placement };

    if (this.checkNodeIsParent(this.draggingNode, this.cursorPosition.node)) return;
    
    event.preventDefault();
  }


  onNodeDropHandler(event: DragEvent, targetNode: ISlTreeNode<TDataType>) {
    if (!this.isRoot) {
      this.getParent().onNodeDropHandler(event, targetNode);
      return;
    }

    if (this.checkNodeIsParent(this.draggingNode, this.cursorPosition.node)) return;

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
  }


  onNodeDragstartHandler(event: DragEvent, node: ISlTreeNode<TDataType>) {
    this.draggingNode = node;
  }


  onNodeDragendHandler() {
    this.draggingNode = null;
    this.cursorPosition = null;
  }


  onToggleHandler(event: DragEvent, node: ISlTreeNode<TDataType>) {
    this.updateNode(node, { isExpanded: !node.isExpanded });
    this.emitToggle(node, event);
    event.stopPropagation();
  }


  getParent(): SlVueTree<TDataType> {
    return this.$parent as SlVueTree<TDataType>;
  }


  getNodeSiblings(nodes: ISlTreeNodeModel<TDataType>[], path: number[]): ISlTreeNodeModel<TDataType>[] {
    if (path.length === 1) return nodes;
    return this.getNodeSiblings(nodes[path[0]].children, path.slice(1));
  }


  updateNode(nodeToUpdate: ISlTreeNode<TDataType>, patch: Partial<ISlTreeNodeModel<TDataType>>) {
    if (!this.isRoot) {
      this.getParent().updateNode(nodeToUpdate, patch);
      return;
    }

    const newNodes = this.copy(this.value);
    this.traverse((node, nodeModel) => {
      if (node.pathStr !== nodeToUpdate.pathStr) return;
      Object.assign(nodeModel, patch);
    }, newNodes);

    this.$emit('input', newNodes);
  }

  getSelected() {
    const selectedNodes: ISlTreeNode<TDataType>[] = [];
    this.traverse((node) => {
      if (node.isSelected) selectedNodes.push(node);
    });
    return selectedNodes;
  }


  traverse(
    cb: (
      node: ISlTreeNode<TDataType>,
      nodeModel: ISlTreeNodeModel<TDataType>,
      siblings: ISlTreeNodeModel<TDataType>[]
    ) => boolean | void,
    nodeModels?: ISlTreeNodeModel<TDataType>[],
    parentPath: number[] = []
  ): ISlTreeNode<TDataType>[] | boolean {
    if (!nodeModels) nodeModels = this.value;

    let shouldStop = false;

    const nodes: ISlTreeNode<TDataType>[] = [];

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
  }

  private checkNodeIsParent(sourceNode: ISlTreeNode<TDataType>, destNode: ISlTreeNode<TDataType>): boolean {
    const destPath = destNode.path;
    return JSON.stringify(destPath.slice(0, sourceNode.path.length)) == sourceNode.pathStr;
  }

  private copy<T>(entity: T): T {
    return JSON.parse(JSON.stringify(entity));
  }

}