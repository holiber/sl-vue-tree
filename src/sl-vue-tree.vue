<template>
  <div
      class="sl-vue-tree"
      :class="{'sl-vue-tree-root': isRoot }"
      @mousemove="onMousemoveHandler"
      @mouseleave="onMouseleaveHandler"
      @dragend="onDragendHandler(null, $event)"
  >
    <div ref="nodes" class="sl-vue-tree-nodes-list">
      <div
          class="sl-vue-tree-node" v-for="(node, nodeInd) in nodes"
          :class="{'sl-vue-tree-selected': node.isSelected }"
      >
        <div
          class="sl-vue-tree-cursor sl-vue-tree-cursor_before"
          @dragover.prevent
          :style="{ visibility:
            cursorPosition &&
            cursorPosition.node.pathStr === node.pathStr &&
            cursorPosition.placement === 'before' ?
             'visible' :
             'hidden'
           }"
        >
          <!-- suggested place for node insertion  -->
        </div>

        <div
            class="sl-vue-tree-node-item"
            @mousedown="onNodeMousedownHandler($event, node)"
            @mouseup="onNodeMouseupHandler($event, node)"
            @contextmenu="emitNodeContextmenu(node, $event)"
            @dblclick="emitNodeDblclick(node, $event)"
            @click="emitNodeClick(node, $event)"
            @dragover="onExternalDragoverHandler(node, $event)"
            @drop="onExternalDropHandler(node, $event)"
            :path="node.pathStr"
            :class="{
            'sl-vue-tree-cursor-hover':
              cursorPosition &&
              cursorPosition.node.pathStr === node.pathStr,

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
            <span class="sl-vue-tree-toggle" v-if="!node.isLeaf" @click="onToggleHandler($event, node)">
              <slot name="toggle" :node="node">
                <span>
                  <img v-if="node.isExpanded && !node.isSelected" src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/arrowDown.png">
                  <img v-if="node.isExpanded && node.isSelected" src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/arrowDownBlue.png">
                  <img v-if="!node.isExpanded && !node.isSelected" src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/arrowRight.png">
                  <img v-if="!node.isExpanded && node.isSelected" src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/arrowRightBlue.png">
                </span>

                <img v-if="node.isSelected" src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/folderBlue.png">
                <img v-if="!node.isSelected" src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/folder.png">
                

              </slot>
            </span>

            <span v-if='node.shapeType == "simpleTextShape"'>
              <slot name="toggle" :node="node">
                <img src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/simpleTextIcon.png">
              </slot>
            </span>

            <span v-if='node.shapeType == "imageShape"'>
              <slot name="toggle" :node="node">
                <img src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/imageIcon.png">
              </slot>
            </span>

            <!-- <slot name="title" :node="node">{{ node.title }}</slot> -->
          </div>

          <slot name="title" :node="node">{{ node.title }}</slot>

          <div class="sl-vue-tree-sidebar">
            <slot name="sidebar" :node="node"></slot>
          </div>

        </div>

        <sl-vue-tree
            v-if="node.children && node.children.length && node.isExpanded"
            :value="node.children"
            :level="node.level"
            :parentInd="nodeInd"
            :allowMultiselect="allowMultiselect"
            :edgeSize="edgeSize"
            :showBranches="showBranches"
            @dragover.prevent
        >
          <template slot="title" slot-scope="{ node }">
            <slot name="title" :node="node">{{ node.title }}</slot>
          </template>

          <template slot="toggle" slot-scope="{ node }">
            <slot name="toggle" :node="node">
                <span v-if="!node.isLeaf">
                  <span>
                    <img v-if="node.isExpanded" src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/arrowDown.png">
                    <img v-else src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/arrowRight.png">
                  </span>

                  <img src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/folder.png">
                </span>

                <span v-if='node.shapeType == "simpleTextShape"'>
                  <slot name="toggle" :node="node">
                    <img src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/simpleTextIcon.png">
                  </slot>
                </span>

                <span v-if='node.shapeType == "imageShape"'>
                  <slot name="toggle" :node="node">
                    <img src="https://s3-ap-northeast-1.amazonaws.com/labelweb/sl-vue-tree/imageIcon.png">
                  </slot>
                </span>
            </slot>
          </template>

          <template slot="sidebar" slot-scope="{ node }">
            <slot name="sidebar" :node="node"></slot>
          </template>

        </sl-vue-tree>

        <div
            class="sl-vue-tree-cursor sl-vue-tree-cursor_after"
            @dragover.prevent
            :style="{
              visibility:
               cursorPosition &&
               cursorPosition.node.pathStr === node.pathStr &&
               cursorPosition.placement === 'after' ?
               'visible' :
               'hidden'
             }"
        >
          <!-- suggested place for node insertion  -->
        </div>

      </div>

      <div v-show="isDragging" v-if="isRoot" ref="dragInfo" class="sl-vue-tree-drag-info">
        <slot name="draginfo">
          Items: {{selectionSize}}
        </slot>
      </div>

    </div>

  </div>
</template>

<script src="./sl-vue-tree.js"></script>


