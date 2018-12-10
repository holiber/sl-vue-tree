
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

  // Model props
  title: string;
  isLeaf?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  data?: TDataType;
  children: SvtNode<TDataType>[] = [];

  // Generated props
  tree: SvtTree<TDataType>;
  parent: SvtNode<TDataType>;
  isVisible?: boolean;
  isFirstChild: boolean;
  isLastChild: boolean;
  ind: number;
  level: number;
  path: number[];
  pathStr: string;
  isOutdated: boolean;


  constructor(tree: SvtTree<TDataType>, nodeModel: ISvtNodeModel<TDataType>,  ind?: number, parent?: SvtNode<TDataType>) {

    this.tree = tree;
    this.ind = ind;
    this.parent = parent;

    const isExpanded = nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded;
    const isDraggable = nodeModel.isDraggable == void 0 ? true : !!nodeModel.isDraggable;
    const isSelectable = nodeModel.isSelectable == void 0 ? true : !!nodeModel.isSelectable;
    const isLeaf = nodeModel.isLeaf == void 0 ? false : !!nodeModel.isLeaf;

    const isVisible = !this.parent || (isExpanded && this.parent.isVisible);
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
      pathStr,
      isOutdated: false
    });


    for (let ci = 0; ci < childrenModels.length; ci++) {
      const childModel = childrenModels[ci];
      this.children.push(new SvtNode(this.tree, childModel, ind, this));
    }
  }



  getModel(): ISvtNodeModel<TDataType> {
    return {
      title: this.title,
      isLeaf: this.isLeaf,
      isExpanded: this.isExpanded,
      isSelected: this.isSelected,
      isDraggable: this.isDraggable,
      isSelectable: this.isSelectable,
      data: this.data,
      children: this.getChildrenModels()
    }
  }

  getChildrenModels(): ISvtNodeModel<TDataType>[] {
    return this.children.map(child => child.getModel());
  }

  update(patch: Partial<ISvtNodeModel<TDataType>>) {

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

  getNodes(path: number[]): SvtNode<TDataType>[] {
    if (!path || !path.length) return this.nodes;
    const node = this.getNode(path);
    if (!node) return [];
    return node.children;
  }

  getNode(path): SvtNode<TDataType> {
    let nodes = this.nodes;
    let node: SvtNode<TDataType>;
    for (let nodeInd of path) {
      if (!nodes) return null;
      node = nodes[nodeInd];
      if (!node) return null;
      nodes = node.children;
    }
    return node;
  }

}