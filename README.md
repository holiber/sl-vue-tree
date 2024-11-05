# sl-vue-tree

Customizable draggable tree component for Vue.js.

![Preview](preview.png)

[Demo](https://holiber.github.io/sl-vue-tree/demo/index)

## Installation

```bash
npm i sl-vue-tree
```

# Quick Start

```html
<div id="app">
  <sl-vue-tree v-model="nodes" />
</div>

<link rel="stylesheet" href="dist/sl-vue-tree-dark.css">
<script src="dist/sl-vue-tree.js"></script>

<script>
  var nodes = [
    { title: 'Item1', isLeaf: true },
    { title: 'Item2', isLeaf: true, data: { visible: false } },
    { title: 'Folder1' },
    {
      title: 'Folder2',
      isExpanded: true,
      children: [
        { title: 'Item3', isLeaf: true },
        { title: 'Item4', isLeaf: true }
      ]
    }
  ];

  new Vue({
    el: '#app',
    components: { SlVueTree },
    data: function () {
      return {
        nodes: nodes
      };
    }
  });
</script>
```

The `value` property is an array of `ISlTreeNodeModel` nodes:

```typescript
interface ISlTreeNodeModel<TDataType> {
  title: string;
  isLeaf?: boolean;
  children?: ISlTreeNodeModel<TDataType>[];
  isExpanded?: boolean;
  isSelected?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  data?: TDataType; // any serializable user data
}
```

For convenience, the component's events return `ISlTreeNode` objects. These are actually `ISlTreeNodeModel` instances with some computed properties:

```typescript
interface ISlTreeNode<TDataType> extends ISlTreeNodeModel<TDataType> {
  isFirstChild: boolean;
  isLastChild: boolean;
  isVisible: boolean; // node is visible if all of its parents are expanded
  level: number;      // nesting level
  ind: number;        // index in the array of siblings
  path: number[];     // path to node as an array of indexes, e.g., [2, 0, 1] is the path to `Item4` in the example above
  pathStr: string;    // serialized path to node
  children: ISlTreeNode<TDataType>[];
}
```

You can get the list of `ISlTreeNode` objects from the computed `slVueTree.nodes` property.

# Props

| Prop             | Type               | Default                | Description                                                                                                                                                                                                      |
|------------------|--------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| value            | ISlTreeNodeModel[] | `[]`                   | An array of nodes to display. Each node is represented by the `ISlTreeNodeModel` interface.                                                                                                                      |
| allowMultiselect | Boolean            | `true`                 | Enables or disables the multiselect feature.                                                                                                                                                                     |
| allowToggleBranch | Boolean           | `true`                 | Enables or disables the expand/collapse button.                                                                                                                                                                  |
| edgeSize         | Number             | `3`                    | Offset in pixels from the top and bottom of a folder-node element. While dragging, if the cursor is within this offset, the dragged node will be placed before or after the folder-node instead of inside it.    |
| scrollAreaHeight | Number             | `70`                   | Offset in pixels from the top and bottom of the component element. While dragging, if the cursor is within this area, scrolling starts.                                                                           |
| maxScrollSpeed   | Number             | `20`                   | The maximum scroll speed. The scroll speed is relative to the cursor position.                                                                                                                                   |
| multiselectKey   | String or String[] | `['ctrlKey', 'metaKey']` | The keys for enabling multiselect mode. Allowed values are `'ctrlKey'`, `'metaKey'`, `'altKey'`.                                                                                                                 |

# Computed Properties

| Property       | Type                       | Description                                                                                                                                                     |
|----------------|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| nodes          | ISlTreeNode[]              | List of nodes with computed properties. See the `ISlTreeNode` interface.                                                                                        |
| cursorPosition | ICursorPosition<TDataType> | Represents the current cursor position that describes the action to be applied to the dragged node on the `mouseup` event. See the `ICursorPosition` interface. |
| selectionSize  | Number                     | The count of selected nodes.                                                                                                                                    |
| dragSize       | Number                     | The count of selected and draggable nodes.                                                                                                                      |
| isDragging     | Boolean                    | Indicates whether nodes are currently being dragged.                                                                                                            |

```typescript
interface ICursorPosition<TDataType> {
  node: ISlTreeNode<TDataType>;
  placement: 'before' | 'inside' | 'after';
}
```

# Events

| Event           | Callback Arguments                                                          | Description                                          |
|-----------------|------------------------------------------------------------------------------|------------------------------------------------------|
| input           | `nodes: ISlTreeNodeModel[]`                                                 | Triggered whenever the `value` property changes.     |
| select          | `selectedNodes: ISlTreeNode[]`, `event: MouseEvent`                         | Triggered when a node is selected or deselected.     |
| toggle          | `toggledNode: ISlTreeNode`, `event: MouseEvent`                             | Triggered when a node is expanded or collapsed.      |
| drop            | `draggingNodes: ISlTreeNode[]`, `position: ICursorPosition`, `event: MouseEvent` | Triggered when dragged nodes are dropped.            |
| nodeclick       | `node: ISlTreeNode`, `event: MouseEvent`                                    | Handles the `click` event on a node.                 |
| nodedblclick    | `node: ISlTreeNode`, `event: MouseEvent`                                    | Handles the `dblclick` event on a node.              |
| nodecontextmenu | `node: ISlTreeNode`, `event: MouseEvent`                                    | Handles the `contextmenu` event on a node.           |
| externaldrop    | `cursorPosition: ICursorPosition`, `event: MouseEvent`                      | Handles the `drop` event for external items. [Demo](https://holiber.github.io/sl-vue-tree/demo/externaldrag) |

# Methods

| Method                                                                                                        | Description                                                                                       |
|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| getNode(path: number[]): ISlTreeNode                                                                          | Finds a node by its path.                                                                         |
| traverse(callback: (node: ISlTreeNode, nodeModel: ISlTreeNodeModel, siblings: ISlTreeNodeModel[]) => boolean) | Traverses all nodes. Traversing stops if the callback returns `false`.                            |
| updateNode(path: number[], patch: Partial<ISlTreeNodeModel>)                                                  | Updates a node by its path.                                                                       |
| select(path: number[], addToSelection = false)                                                                | Selects a node by its path.                                                                       |
| getNodeEl(path: number[]): HTMLElement                                                                        | Gets the node's HTMLElement by its path.                                                          |
| getSelected(): ISlTreeNode[]                                                                                  | Gets the selected nodes.                                                                          |
| insert(position: ICursorPosition, nodeModel: ISlTreeNodeModel)                                                | Inserts a node at the specified cursor position.                                                  |
| remove(paths: number[][])                                                                                     | Removes nodes by their paths, e.g., `.remove([[0,1], [0,2]])`.                                    |
| getFirstNode(): ISlTreeNode                                                                                   | Gets the first node in the tree.                                                                  |
| getLastNode(): ISlTreeNode                                                                                    | Gets the last node in the tree.                                                                   |
| getNextNode(path: number[], filter?: (node: ISlTreeNode<TDataType>) => boolean): ISlTreeNode<TDataType>       | Gets the next node. You can skip nodes by using the `filter` function.                            |
| getPrevNode(path: number[], filter?: (node: ISlTreeNode<TDataType>) => boolean): ISlTreeNode<TDataType>       | Gets the previous node. You can skip nodes by using the `filter` function.                        |

# Slots

| Slot        | Context       | Description                                                                                   |
|-------------|---------------|-----------------------------------------------------------------------------------------------|
| title       | ISlTreeNode   | Slot for customizing the item title.                                                          |
| toggle      | ISlTreeNode   | Slot for the expand/collapse button.                                                          |
| sidebar     | ISlTreeNode   | Slot for sidebar content.                                                                     |
| draginfo    | SlVueTree     | Slot that follows the mouse cursor while dragging. By default, shows the count of dragging nodes. |
| empty-node  | ISlTreeNode   | Slot for an optional message when a folder is open but empty.                                 |


# Examples

## Add a Folder or Item Icon via the `title` Slot

```html
<sl-vue-tree v-model="nodes">
  <template slot="title" slot-scope="{ node }">
    <span class="item-icon">
      <i class="fa fa-file" v-if="node.isLeaf"></i>
      <i class="fa fa-folder" v-else></i>
    </span>
    {{ node.title }}
  </template>
</sl-vue-tree>
```

## Select All Nodes

```javascript
slVueTree.traverse((node, nodeModel, path) => {
  Vue.set(nodeModel, 'isSelected', true);
});
```

## Handle `keydown` and `keyup` Events via `getNextNode` and `getPrevNode` Methods

[Demo](https://holiber.github.io/sl-vue-tree/demo/keyboardcontrol)


# IE11 Support

You must include a [babel-polyfill](https://babeljs.io/docs/en/babel-polyfill) for the component to work correctly in IE11.

[See IE11 Example](https://holiber.github.io/sl-vue-tree/demo/ie11test.html)

# Contributing

[See CONTRIBUTING.md](CONTRIBUTING.md)

# Changelog

## v1.8.5

- Fixed TypeScript definitions. See [#77](https://github.com/holiber/sl-vue-tree/pull/77).

## v1.8.4

- Added `insert` method. See [#39](https://github.com/holiber/sl-vue-tree/pull/39).

## v1.8.3

- Enabled the ability to disable or enable the expand/collapse button. See [#33](https://github.com/holiber/sl-vue-tree/pull/33).

## v1.8.1

- Added IE11 support. See [#17](https://github.com/holiber/sl-vue-tree/issues/17).

## v1.8.0

- Added `empty-node` slot.

## v1.7.1

- Added `multiselectKey` property.

## v1.7.0

- Added `isSelectable` and `isDraggable` flags.

## v1.6.0

- Added `getNextNode` and `getPrevNode` methods. See [#6](https://github.com/holiber/sl-vue-tree/issues/6).

## v1.5.1

- Improved dropping at the bottom of the tree. See [#5](https://github.com/holiber/sl-vue-tree/issues/5).

## v1.5.0

- Added `SlVueTree.select` method.
- Fixed `SlVueTree.@nodeclick` event.
