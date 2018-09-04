
export interface ISvtNodeModel<TDataType> {
  title: string;
  isLeaf?: boolean;
  children?: ISvtNodeModel<TDataType>[];
  isExpanded?: boolean;
  isSelected?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  data?: TDataType;
}

export interface ISvtCrusor<TDataType>  {
  position: 'before' | 'after' | 'inside';
  node: ISvtNodeModel<TDataType>;
}


export class SvtNode<TDataType> implements ISvtNodeModel<TDataType> {

  title: string;
  isLeaf?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  data?: TDataType;

  tree: SvtTree<TDataType>;
  parent: SvtNode<TDataType>;
  isVisible?: boolean;
  isFirstChild: boolean;
  isLastChild: boolean;
  ind: number;
  level: number;
  path: number[];
  pathStr: string;
  children: SvtNode<TDataType>[];

  constructor(tree: SvtTree<TDataType>, nodeModel: ISvtNodeModel<TDataType>,  ind?: number, parent?: SvtNode<TDataType>) {

    this.tree = tree;
    this.ind = ind;
    this.parent = parent;

    const isExpanded = nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded;
    const isDraggable = nodeModel.isDraggable == void 0 ? true : !!nodeModel.isDraggable;
    const isSelectable = nodeModel.isSelectable == void 0 ? true : !!nodeModel.isSelectable;
    const isLeaf = nodeModel.isLeaf == void 0 ? false : !!nodeModel.isLeaf;

    const isVisible = isExpanded && this.parent.isVisible;
    const isFirstChild = this.ind == 0;
    const isLastChild = this.parent ? ind === this.parent.children.length - 1: this.tree.nodes.length - 1;
    const level = this.parent ? this.parent.level + 1 : 0;
    const path = this.parent ? this.parent.path.concat(this.ind) : [this.ind];
    const pathStr = JSON.stringify(path);

    const childrenModels = nodeModel.children || [];
    delete nodeModel.children;

    Object.assign(this, {
      ...nodeModel,
      isLeaf,
      isExpanded,
      isDraggable,
      isSelectable,
      isVisible,
      isFirstChild,
      isLastChild,
      level,
      path,
      pathStr
    });


    for (let ci = 0; ci < childrenModels.length; ci++) {
      const childModel = childrenModels[ci];
      this.children.push(new SvtNode(this.tree, childModel, ind, this));
    }
  }


}

export class SvtTree<TDataType> {
  nodes: SvtNode<TDataType>[] = [];
  cursor: ISvtCrusor<TDataType> = null;

  constructor(nodeModels: ISvtNodeModel<TDataType>[]) {
    nodeModels = SvtTree.copy(nodeModels);
    this.updateModels(nodeModels);
  }

  static copy<T>(entity: T): T {
    // TODO: replace with smarter copy
    return JSON.parse(JSON.stringify(entity));
  }

  updateModels(nodeModels: ISvtNodeModel<TDataType>[]) {
    this.nodes = nodeModels.map((nodeModel, ind) => new SvtNode(this, nodeModel, ind));
  }

  getNodes(path: number[]): SvtNode[] {

  }

  getNode(path) {
    let nodes = this.nodes;
    let node: SvtNode<TDataType> = null;
    for (let nodeInd of path) {
      node = nodes[nodeInd];
      nodes = this.nodes[]
    }
  }

}