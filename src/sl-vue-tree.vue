<template>
  <div
      class="sl-vue-tree"
      :class="{'sl-vue-tree-root': isRoot }"
  >
    <div
        class="sl-vue-tree-node" v-for="(node, nodeInd) in nodes"
        :class="{'sl-vue-tree-selected': node.isSelected }"
    >

      <div
        class="sl-vue-tree-cursor sl-vue-tree-cursor_before"
        v-show="
          cursorPosition &&
          cursorPosition.node.pathStr === node.pathStr &&
          cursorPosition.placement === 'before'
        "
      >
        <!-- suggested place for node insertion  -->
      </div>

      <div
          class="sl-vue-tree-node-item"
          draggable="true"
          @dragover="event => onNodeDragoverHandler(event, node)"
          @drop="event => onNodeDropHandler(event, node)"
          @dragstart="event => onNodeDragstartHandler(event, node)"
          @dragend="event => onNodeDragendHandler(event, node)"
          @click="event => onNodeClickHandler(event, node)"
          @contextmenu="event =>emitNodeContextmenu(node, event)"
          @dblclick="event => emitNodeDblclick(node, event)"
          @dragleave="event => onDragleaveHandler(event, node)"
          :class="{
            'sl-vue-tree-cursor-inside':
              cursorPosition &&
              cursorPosition.placement === 'inside' &&
              cursorPosition.node.pathStr === node.pathStr,
            'sl-vue-tree-node-is-leaf' : node.isLeaf,
            'sl-vue-tree-node-is-folder' : !node.isLeaf
          }"
      >
        <div class="sl-vue-tree-gap" v-for="gapInd in gaps"></div>

        <div class="sl-vue-tree-branch" v-if="level && showBranches">
          <slot name="branch" :node="node">
            <span v-if="!node.isLastChild">
              {{ String.fromCharCode(0x251C) }}{{ String.fromCharCode(0x2500) }}&nbsp;
            </span>
            <span v-if="node.isLastChild">
              {{String.fromCharCode(0x2514) }}{{ String.fromCharCode(0x2500) }}&nbsp;
            </span>
          </slot>
        </div>

        <div class="sl-vue-tree-title">
          <span class="sl-vue-tree-toggle" v-if="!node.isLeaf" @click="event => onToggleHandler(event, node)">
            <slot name="toggle" :node="node">
              <span>
               {{ !node.isLeaf ? (node.isExpanded ? '-' : '+') : '' }}
              </span>
            </slot>
          </span>

          <slot name="title" :node="node">{{ node.title }}</slot>
        </div>

        <div class="sl-vue-tree-sidebar">
          <slot name="sidebar" :node="node"></slot>
        </div>

      </div>

      <div
        class="sl-vue-tree-cursor sl-vue-tree-cursor_after"
        v-show="
          cursorPosition &&
          cursorPosition.node.pathStr === node.pathStr &&
          cursorPosition.placement === 'after'
        "
      >
        <!-- suggested place for node insertion  -->
      </div>

      <sl-vue-tree
        v-if="node.children && node.children.length && node.isExpanded"
        :value="node.children"
        :level="level + 1"
        :parentInd="nodeInd"
        :allowMultiselect="allowMultiselect"
        :edgeSize="edgeSize"
        :showBranches="showBranches"
      >
        <template slot="title" slot-scope="{ node }">
          <slot name="title" :node="node">{{ node.title }}</slot>
        </template>

        <template slot="toggle" slot-scope="{ node }">
          <slot name="toggle" :node="node">
            <span>
               {{ !node.isLeaf ? (node.isExpanded ? '-' : '+') : '' }}
            </span>
          </slot>
        </template>

        <template slot="sidebar" slot-scope="{ node }">
          <slot name="sidebar" :node="node"></slot>
        </template>

      </sl-vue-tree>
    </div>
  </div>
</template>

<script src="./sl-vue-tree.js"></script>


