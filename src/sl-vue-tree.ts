
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


class SvtNode<TDataType> implements ISvtNodeModel<TDataType> {

  title: string;
  isLeaf?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  data?: TDataType;

  isVisible?: boolean;
  isFirstChild: boolean;
  isLastChild: boolean;
  ind: number;
  level: number;
  path: number[];
  pathStr: string;
  children: SvtNode<TDataType>[];

}

export class SvtTree<TDataType> {
  nodes: SvtNode<TDataType>[] = [];
}


