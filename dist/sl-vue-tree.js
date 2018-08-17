!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.SlVueTree=e():t.SlVueTree=e()}(window,function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},r.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e);var n=r(6),i={name:"sl-vue-tree",props:{value:{type:Array,default:()=>[]},edgeSize:{type:Number,default:3},showBranches:{type:Boolean,default:!1},level:{type:Number,default:0},parentInd:{type:Number},allowMultiselect:{type:Boolean,default:!0},multiselectKey:{type:[String,Array],default:["ctrlKey","metaKey"],validator:function(t){let e=["ctrlKey","metaKey","altKey"],r=Array.isArray(t)?t:[t];return!!(r=r.filter(t=>-1!==e.indexOf(t))).length}},scrollAreaHeight:{type:Number,default:70},maxScrollSpeed:{type:Number,default:20}},data(){return{rootCursorPosition:null,scrollIntervalId:0,scrollSpeed:0,lastSelectedNode:null,mouseIsDown:!1,isDragging:!1,lastMousePos:{x:0,y:0},preventDrag:!1,currentValue:this.value}},mounted(){this.isRoot&&document.addEventListener("mouseup",this.onDocumentMouseupHandler)},beforeDestroy(){document.removeEventListener("mouseup",this.onDocumentMouseupHandler)},watch:{value:function(t){this.currentValue=t}},computed:{cursorPosition(){return this.isRoot?this.rootCursorPosition:this.getParent().cursorPosition},nodes(){if(this.isRoot){const t=this.copy(this.currentValue);return this.getNodes(t)}return this.getParent().nodes[this.parentInd].children},gaps(){const t=[];let e=this.level-1;for(this.showBranches||e++;e-- >0;)t.push(e);return t},isRoot(){return!this.level},selectionSize(){return this.getSelected().length},dragSize(){return this.getDraggable().length}},methods:{setCursorPosition(t){this.isRoot?this.rootCursorPosition=t:this.getParent().setCursorPosition(t)},getNodes(t,e=[],r=!0){return t.map((n,i)=>{const o=e.concat(i);return this.getNode(o,n,t,r)})},getNode(t,e=null,r=null,n=null){const i=t.slice(-1)[0];if(r=r||this.getNodeSiblings(this.currentValue,t),e=e||r&&r[i]||null,null==n&&(n=this.isVisible(t)),!e)return null;const o=void 0==e.isExpanded||!!e.isExpanded,s=void 0==e.isDraggable||!!e.isDraggable,u=void 0==e.isSelectable||!!e.isSelectable;return{title:e.title,isLeaf:!!e.isLeaf,children:e.children?this.getNodes(e.children,t,o):[],isSelected:!!e.isSelected,isExpanded:o,isVisible:n,isDraggable:s,isSelectable:u,data:void 0!==e.data?e.data:{},path:t,pathStr:JSON.stringify(t),level:t.length,ind:i,isFirstChild:0==i,isLastChild:i===r.length-1}},isVisible(t){if(t.length<2)return!0;let e=this.currentValue;for(let r=0;r<t.length-1;r++){let n=e[t[r]];if(!(void 0==n.isExpanded||!!n.isExpanded))return!1;e=n.children}return!0},emitInput(t){this.currentValue=t,this.getRoot().$emit("input",t)},emitSelect(t,e){this.getRoot().$emit("select",t,e)},emitDrop(t,e,r){this.getRoot().$emit("drop",t,e,r)},emitToggle(t,e){this.getRoot().$emit("toggle",t,e)},emitNodeClick(t,e){this.getRoot().$emit("nodeclick",t,e)},emitNodeDblclick(t,e){this.getRoot().$emit("nodedblclick",t,e)},emitNodeContextmenu(t,e){this.getRoot().$emit("nodecontextmenu",t,e)},onExternalDragoverHandler(t,e){e.preventDefault();const r=this.getRoot(),n=r.getCursorPositionFromCoords(e.clientX,e.clientY);r.setCursorPosition(n),r.$emit("externaldragover",n,e)},onExternalDropHandler(t,e){const r=this.getRoot(),n=r.getCursorPositionFromCoords(e.clientX,e.clientY);r.$emit("externaldrop",n,e),this.setCursorPosition(null)},select(t,e=!1,r=null){const n=Array.isArray(this.multiSelectKey)?this.multiselectKey:[this.multiselectKey],i=r&&!!n.find(t=>r[t]);e=(i||e)&&this.allowMultiselect;const o=this.getNode(t);if(!o)return null;const s=this.copy(this.currentValue),u=this.allowMultiselect&&r&&r.shiftKey&&this.lastSelectedNode,a=[];let l=!1;return this.traverse((t,r)=>{u?(t.pathStr!==o.pathStr&&t.pathStr!==this.lastSelectedNode.pathStr||(r.isSelected=t.isSelectable,l=!l),l&&(r.isSelected=t.isSelectable)):t.pathStr===o.pathStr?r.isSelected=t.isSelectable:e||r.isSelected&&(r.isSelected=!1),r.isSelected&&a.push(t)},s),this.lastSelectedNode=o,this.emitInput(s),this.emitSelect(a,r),o},onMousemoveHandler(t){if(!this.isRoot)return void this.getRoot().onMousemoveHandler(t);if(this.preventDrag)return;const e=this.isDragging,r=this.isDragging||this.mouseIsDown&&(this.lastMousePos.x!==t.clientX||this.lastMousePos.y!==t.clientY),n=!1===e&&!0===r;if(this.lastMousePos={x:t.clientX,y:t.clientY},!r)return;const i=this.getRoot().$el,o=i.getBoundingClientRect(),s=this.$refs.dragInfo,u=t.clientY-o.top+i.scrollTop-(0|s.style.marginBottom),a=t.clientX-o.left;s.style.top=u+"px",s.style.left=a+"px";const l=this.getCursorPositionFromCoords(t.clientX,t.clientY),h=l.node,f=l.placement;if(n&&!h.isSelected&&this.select(h.path,!1,t),!this.getDraggable().length)return void(this.preventDrag=!0);this.isDragging=r,this.setCursorPosition({node:h,placement:f});const c=o.bottom-this.scrollAreaHeight,p=(t.clientY-c)/(o.bottom-c),d=o.top+this.scrollAreaHeight,g=(d-t.clientY)/(d-o.top);p>0?this.startScroll(p):g>0?this.startScroll(-g):this.stopScroll()},getCursorPositionFromCoords(t,e){const r=document.elementFromPoint(t,e),n=r.getAttribute("path")?r:r.closest("[path]");let i,o;if(n){if(!n)return;i=this.getNode(JSON.parse(n.getAttribute("path")));const t=n.offsetHeight,r=this.edgeSize,s=e-n.getBoundingClientRect().top;o=i.isLeaf?s>=t/2?"after":"before":s<=r?"before":s>=t-r?"after":"inside"}else{const t=this.getRoot().$el.getBoundingClientRect();e>t.top+t.height/2?(o="after",i=this.getLastNode()):(o="before",i=this.getFirstNode())}return{node:i,placement:o}},onMouseleaveHandler(t){if(!this.isRoot||!this.isDragging)return;const e=this.getRoot().$el.getBoundingClientRect();t.clientY>=e.bottom?this.setCursorPosition({node:this.nodes.slice(-1)[0],placement:"after"}):t.clientY<e.top&&this.setCursorPosition({node:this.getFirstNode(),placement:"before"})},getNodeEl(t){this.getRoot().$el.querySelector(`[path="${JSON.stringify(t)}"]`)},getLastNode(){let t=null;return this.traverse(e=>{t=e}),t},getFirstNode(){return this.getNode([0])},getNextNode(t,e=null){let r=null;return this.traverse(n=>{if(!(this.comparePaths(n.path,t)<1))return!e||e(n)?(r=n,!1):void 0}),r},getPrevNode(t,e){let r=[];this.traverse(e=>{if(this.comparePaths(e.path,t)>=0)return!1;r.push(e)});let n=r.length;for(;n--;){const t=r[n];if(!e||e(t))return t}return null},comparePaths(t,e){for(let r=0;r<t.length;r++){if(void 0==e[r])return 1;if(t[r]>e[r])return 1;if(t[r]<e[r])return-1}return void 0==e[t.length]?0:-1},onNodeMousedownHandler(t,e){0===t.button&&(this.isRoot?this.mouseIsDown=!0:this.getRoot().onNodeMousedownHandler(t,e))},startScroll(t){const e=this.getRoot().$el;this.scrollSpeed!==t&&(this.scrollIntervalId&&this.stopScroll(),this.scrollSpeed=t,this.scrollIntervalId=setInterval(()=>{e.scrollTop+=this.maxScrollSpeed*t},20))},stopScroll(){clearInterval(this.scrollIntervalId),this.scrollIntervalId=0,this.scrollSpeed=0},onDocumentMouseupHandler(t){this.isDragging&&this.onNodeMouseupHandler(t)},onNodeMouseupHandler(t,e=null){if(0!==t.button)return;if(!this.isRoot)return void this.getRoot().onNodeMouseupHandler(t,e);if(this.mouseIsDown=!1,this.isDragging||!e||this.preventDrag||this.select(e.path,!1,t),this.preventDrag=!1,!this.cursorPosition)return void this.stopDrag();const r=this.getDraggable();for(let t of r){if(t.pathStr==this.cursorPosition.node.pathStr)return void this.stopDrag();if(this.checkNodeIsParent(t,this.cursorPosition.node))return void this.stopDrag()}const n=this.copy(this.currentValue),i=[];for(let t of r){const e=this.getNodeSiblings(n,t.path)[t.ind];i.push(this.copy(e)),e._markToDelete=!0}const o=this.cursorPosition.node,s=this.getNodeSiblings(n,o.path),u=s[o.ind];if("inside"===this.cursorPosition.placement)u.children=u.children||[],u.children.unshift(...i);else{const t="before"===this.cursorPosition.placement?o.ind:o.ind+1;s.splice(t,0,...i)}this.traverseModels((t,e,r)=>{t._markToDelete&&e.splice(r,1)},n),this.lastSelectedNode=null,this.emitInput(n),this.emitDrop(r,this.cursorPosition,t),this.stopDrag()},onToggleHandler(t,e){this.updateNode(e.path,{isExpanded:!e.isExpanded}),this.emitToggle(e,t),t.stopPropagation()},stopDrag(){this.isDragging=!1,this.mouseIsDown=!1,this.setCursorPosition(null),this.stopScroll()},getParent(){return this.$parent},getRoot(){return this.isRoot?this:this.getParent().getRoot()},getNodeSiblings(t,e){return 1===e.length?t:this.getNodeSiblings(t[e[0]].children,e.slice(1))},updateNode(t,e){if(!this.isRoot)return void this.getParent().updateNode(t,e);const r=JSON.stringify(t),n=this.copy(this.currentValue);this.traverse((t,n)=>{t.pathStr===r&&Object.assign(n,e)},n),this.emitInput(n)},getSelected(){const t=[];return this.traverse(e=>{e.isSelected&&t.push(e)}),t},getDraggable(){const t=[];return this.traverse(e=>{e.isSelected&&e.isDraggable&&t.push(e)}),t},traverse(t,e=null,r=[]){e||(e=this.currentValue);let n=!1;const i=[];for(let o=0;o<e.length;o++){const s=e[o],u=r.concat(o),a=this.getNode(u,s,e);if(n=!1===t(a,s,e),i.push(a),n)break;if(s.children&&(n=!1===this.traverse(t,s.children,u)))break}return!n&&i},traverseModels(t,e){let r=e.length;for(;r--;){const n=e[r];n.children&&this.traverseModels(t,n.children),t(n,e,r)}return e},remove(t){const e=t.map(t=>JSON.stringify(t)),r=this.copy(this.currentValue);this.traverse((t,r,n)=>{for(const n of e)t.pathStr===n&&(r._markToDelete=!0)},r),this.traverseModels((t,e,r)=>{t._markToDelete&&e.splice(r,1)},r),this.emitInput(r)},checkNodeIsParent(t,e){const r=e.path;return JSON.stringify(r.slice(0,t.path.length))==t.pathStr},copy:t=>n(t)}},o=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"sl-vue-tree",class:{"sl-vue-tree-root":t.isRoot},on:{mousemove:t.onMousemoveHandler,mouseleave:t.onMouseleaveHandler,dragend:function(e){t.onDragendHandler(null,e)}}},[r("div",{ref:"nodes",staticClass:"sl-vue-tree-nodes-list"},[t._l(t.nodes,function(e,n){return r("div",{staticClass:"sl-vue-tree-node",class:{"sl-vue-tree-selected":e.isSelected}},[r("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_before",style:{visibility:t.cursorPosition&&t.cursorPosition.node.pathStr===e.pathStr&&"before"===t.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(t){t.preventDefault()}}}),t._v(" "),r("div",{staticClass:"sl-vue-tree-node-item",class:{"sl-vue-tree-cursor-hover":t.cursorPosition&&t.cursorPosition.node.pathStr===e.pathStr,"sl-vue-tree-cursor-inside":t.cursorPosition&&"inside"===t.cursorPosition.placement&&t.cursorPosition.node.pathStr===e.pathStr,"sl-vue-tree-node-is-leaf":e.isLeaf,"sl-vue-tree-node-is-folder":!e.isLeaf},attrs:{path:e.pathStr},on:{mousedown:function(r){t.onNodeMousedownHandler(r,e)},mouseup:function(r){t.onNodeMouseupHandler(r,e)},contextmenu:function(r){t.emitNodeContextmenu(e,r)},dblclick:function(r){t.emitNodeDblclick(e,r)},click:function(r){t.emitNodeClick(e,r)},dragover:function(r){t.onExternalDragoverHandler(e,r)},drop:function(r){t.onExternalDropHandler(e,r)}}},[t._l(t.gaps,function(t){return r("div",{staticClass:"sl-vue-tree-gap"})}),t._v(" "),t.level&&t.showBranches?r("div",{staticClass:"sl-vue-tree-branch"},[t._t("branch",[e.isLastChild?t._e():r("span",[t._v("\n            "+t._s(String.fromCharCode(9500))+t._s(String.fromCharCode(9472))+" \n          ")]),t._v(" "),e.isLastChild?r("span",[t._v("\n            "+t._s(String.fromCharCode(9492))+t._s(String.fromCharCode(9472))+" \n          ")]):t._e()],{node:e})],2):t._e(),t._v(" "),r("div",{staticClass:"sl-vue-tree-title"},[e.isLeaf?t._e():r("span",{staticClass:"sl-vue-tree-toggle",on:{click:function(r){t.onToggleHandler(r,e)}}},[t._t("toggle",[r("span",[t._v("\n             "+t._s(e.isLeaf?"":e.isExpanded?"-":"+")+"\n            ")])],{node:e})],2),t._v(" "),t._t("title",[t._v(t._s(e.title))],{node:e})],2),t._v(" "),r("div",{staticClass:"sl-vue-tree-sidebar"},[t._t("sidebar",null,{node:e})],2)],2),t._v(" "),e.children&&e.children.length&&e.isExpanded?r("sl-vue-tree",{attrs:{value:e.children,level:e.level,parentInd:n,allowMultiselect:t.allowMultiselect,edgeSize:t.edgeSize,showBranches:t.showBranches},on:{dragover:function(t){t.preventDefault()}},scopedSlots:t._u([{key:"title",fn:function(e){var r=e.node;return[t._t("title",[t._v(t._s(r.title))],{node:r})]}},{key:"toggle",fn:function(e){var n=e.node;return[t._t("toggle",[r("span",[t._v("\n             "+t._s(n.isLeaf?"":n.isExpanded?"-":"+")+"\n          ")])],{node:n})]}},{key:"sidebar",fn:function(e){var r=e.node;return[t._t("sidebar",null,{node:r})]}}])}):t._e(),t._v(" "),r("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_after",style:{visibility:t.cursorPosition&&t.cursorPosition.node.pathStr===e.pathStr&&"after"===t.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(t){t.preventDefault()}}})],1)}),t._v(" "),t.isRoot?r("div",{directives:[{name:"show",rawName:"v-show",value:t.isDragging,expression:"isDragging"}],ref:"dragInfo",staticClass:"sl-vue-tree-drag-info"},[t._t("draginfo",[t._v("\n        Items: "+t._s(t.selectionSize)+"\n      ")])],2):t._e()],2)])};o._withStripped=!0;var s=function(t,e,r,n,i,o,s,u){var a=typeof(t=t||{}).default;"object"!==a&&"function"!==a||(t=t.default);var l,h="function"==typeof t?t.options:t;if(e&&(h.render=e,h.staticRenderFns=r,h._compiled=!0),n&&(h.functional=!0),o&&(h._scopeId=o),s?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(s)},h._ssrRegister=l):i&&(l=u?function(){i.call(this,this.$root.$options.shadowRoot)}:i),l)if(h.functional){h._injectStyles=l;var f=h.render;h.render=function(t,e){return l.call(e),f(t,e)}}else{var c=h.beforeCreate;h.beforeCreate=c?[].concat(c,l):[l]}return{exports:t,options:h}}(i,o,[],!1,null,null,null);s.options.__file="src/sl-vue-tree.vue";e.default=s.exports},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},function(t,e){e.read=function(t,e,r,n,i){var o,s,u=8*i-n-1,a=(1<<u)-1,l=a>>1,h=-7,f=r?i-1:0,c=r?-1:1,p=t[e+f];for(f+=c,o=p&(1<<-h)-1,p>>=-h,h+=u;h>0;o=256*o+t[e+f],f+=c,h-=8);for(s=o&(1<<-h)-1,o>>=-h,h+=n;h>0;s=256*s+t[e+f],f+=c,h-=8);if(0===o)o=1-l;else{if(o===a)return s?NaN:1/0*(p?-1:1);s+=Math.pow(2,n),o-=l}return(p?-1:1)*s*Math.pow(2,o-n)},e.write=function(t,e,r,n,i,o){var s,u,a,l=8*o-i-1,h=(1<<l)-1,f=h>>1,c=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(u=isNaN(e)?1:0,s=h):(s=Math.floor(Math.log(e)/Math.LN2),e*(a=Math.pow(2,-s))<1&&(s--,a*=2),(e+=s+f>=1?c/a:c*Math.pow(2,1-f))*a>=2&&(s++,a/=2),s+f>=h?(u=0,s=h):s+f>=1?(u=(e*a-1)*Math.pow(2,i),s+=f):(u=e*Math.pow(2,f-1)*Math.pow(2,i),s=0));i>=8;t[r+p]=255&u,p+=d,u/=256,i-=8);for(s=s<<i|u,l+=i;l>0;t[r+p]=255&s,p+=d,s/=256,l-=8);t[r+p-d]|=128*g}},function(t,e,r){"use strict";e.byteLength=function(t){var e=l(t),r=e[0],n=e[1];return 3*(r+n)/4-n},e.toByteArray=function(t){for(var e,r=l(t),n=r[0],s=r[1],u=new o(function(t,e,r){return 3*(e+r)/4-r}(0,n,s)),a=0,h=s>0?n-4:n,f=0;f<h;f+=4)e=i[t.charCodeAt(f)]<<18|i[t.charCodeAt(f+1)]<<12|i[t.charCodeAt(f+2)]<<6|i[t.charCodeAt(f+3)],u[a++]=e>>16&255,u[a++]=e>>8&255,u[a++]=255&e;2===s&&(e=i[t.charCodeAt(f)]<<2|i[t.charCodeAt(f+1)]>>4,u[a++]=255&e);1===s&&(e=i[t.charCodeAt(f)]<<10|i[t.charCodeAt(f+1)]<<4|i[t.charCodeAt(f+2)]>>2,u[a++]=e>>8&255,u[a++]=255&e);return u},e.fromByteArray=function(t){for(var e,r=t.length,i=r%3,o=[],s=0,u=r-i;s<u;s+=16383)o.push(h(t,s,s+16383>u?u:s+16383));1===i?(e=t[r-1],o.push(n[e>>2]+n[e<<4&63]+"==")):2===i&&(e=(t[r-2]<<8)+t[r-1],o.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"="));return o.join("")};for(var n=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",u=0,a=s.length;u<a;++u)n[u]=s[u],i[s.charCodeAt(u)]=u;function l(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function h(t,e,r){for(var i,o,s=[],u=e;u<r;u+=3)i=(t[u]<<16&16711680)+(t[u+1]<<8&65280)+(255&t[u+2]),s.push(n[(o=i)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return s.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},function(t,e){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var n=r(3),i=r(2),o=r(1);function s(){return a.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function u(t,e){if(s()<e)throw new RangeError("Invalid typed array length");return a.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e)).__proto__=a.prototype:(null===t&&(t=new a(e)),t.length=e),t}function a(t,e,r){if(!(a.TYPED_ARRAY_SUPPORT||this instanceof a))return new a(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return f(this,t)}return l(this,t,e,r)}function l(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?function(t,e,r,n){if(e.byteLength,r<0||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");e=void 0===r&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n);a.TYPED_ARRAY_SUPPORT?(t=e).__proto__=a.prototype:t=c(t,e);return t}(t,e,r,n):"string"==typeof e?function(t,e,r){"string"==typeof r&&""!==r||(r="utf8");if(!a.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|d(e,r),i=(t=u(t,n)).write(e,r);i!==n&&(t=t.slice(0,i));return t}(t,e,r):function(t,e){if(a.isBuffer(e)){var r=0|p(e.length);return 0===(t=u(t,r)).length?t:(e.copy(t,0,0,r),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||(n=e.length)!=n?u(t,0):c(t,e);if("Buffer"===e.type&&o(e.data))return c(t,e.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,e)}function h(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function f(t,e){if(h(e),t=u(t,e<0?0:0|p(e)),!a.TYPED_ARRAY_SUPPORT)for(var r=0;r<e;++r)t[r]=0;return t}function c(t,e){var r=e.length<0?0:0|p(e.length);t=u(t,r);for(var n=0;n<r;n+=1)t[n]=255&e[n];return t}function p(t){if(t>=s())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s().toString(16)+" bytes");return 0|t}function d(t,e){if(a.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return k(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return H(t).length;default:if(n)return k(t).length;e=(""+e).toLowerCase(),n=!0}}function g(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function v(t,e,r,n,i){if(0===t.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return-1;r=t.length-1}else if(r<0){if(!i)return-1;r=0}if("string"==typeof e&&(e=a.from(e,n)),a.isBuffer(e))return 0===e.length?-1:y(t,e,r,n,i);if("number"==typeof e)return e&=255,a.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):y(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function y(t,e,r,n,i){var o,s=1,u=t.length,a=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;s=2,u/=2,a/=2,r/=2}function l(t,e){return 1===s?t[e]:t.readUInt16BE(e*s)}if(i){var h=-1;for(o=r;o<u;o++)if(l(t,o)===l(e,-1===h?0:o-h)){if(-1===h&&(h=o),o-h+1===a)return h*s}else-1!==h&&(o-=o-h),h=-1}else for(r+a>u&&(r=u-a),o=r;o>=0;o--){for(var f=!0,c=0;c<a;c++)if(l(t,o+c)!==l(e,c)){f=!1;break}if(f)return o}return-1}function m(t,e,r,n){r=Number(r)||0;var i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;var o=e.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var s=0;s<n;++s){var u=parseInt(e.substr(2*s,2),16);if(isNaN(u))return s;t[r+s]=u}return s}function w(t,e,r,n){return $(k(e,t.length-r),t,r,n)}function b(t,e,r,n){return $(function(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function _(t,e,r,n){return b(t,e,r,n)}function S(t,e,r,n){return $(H(e),t,r,n)}function P(t,e,r,n){return $(function(t,e){for(var r,n,i,o=[],s=0;s<t.length&&!((e-=2)<0);++s)r=t.charCodeAt(s),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function E(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function R(t,e,r){r=Math.min(t.length,r);for(var n=[],i=e;i<r;){var o,s,u,a,l=t[i],h=null,f=l>239?4:l>223?3:l>191?2:1;if(i+f<=r)switch(f){case 1:l<128&&(h=l);break;case 2:128==(192&(o=t[i+1]))&&(a=(31&l)<<6|63&o)>127&&(h=a);break;case 3:o=t[i+1],s=t[i+2],128==(192&o)&&128==(192&s)&&(a=(15&l)<<12|(63&o)<<6|63&s)>2047&&(a<55296||a>57343)&&(h=a);break;case 4:o=t[i+1],s=t[i+2],u=t[i+3],128==(192&o)&&128==(192&s)&&128==(192&u)&&(a=(15&l)<<18|(63&o)<<12|(63&s)<<6|63&u)>65535&&a<1114112&&(h=a)}null===h?(h=65533,f=1):h>65535&&(h-=65536,n.push(h>>>10&1023|55296),h=56320|1023&h),n.push(h),i+=f}return function(t){var e=t.length;if(e<=A)return String.fromCharCode.apply(String,t);var r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=A));return r}(n)}e.Buffer=a,e.SlowBuffer=function(t){+t!=t&&(t=0);return a.alloc(+t)},e.INSPECT_MAX_BYTES=50,a.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),e.kMaxLength=s(),a.poolSize=8192,a._augment=function(t){return t.__proto__=a.prototype,t},a.from=function(t,e,r){return l(null,t,e,r)},a.TYPED_ARRAY_SUPPORT&&(a.prototype.__proto__=Uint8Array.prototype,a.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&a[Symbol.species]===a&&Object.defineProperty(a,Symbol.species,{value:null,configurable:!0})),a.alloc=function(t,e,r){return function(t,e,r,n){return h(e),e<=0?u(t,e):void 0!==r?"string"==typeof n?u(t,e).fill(r,n):u(t,e).fill(r):u(t,e)}(null,t,e,r)},a.allocUnsafe=function(t){return f(null,t)},a.allocUnsafeSlow=function(t){return f(null,t)},a.isBuffer=function(t){return!(null==t||!t._isBuffer)},a.compare=function(t,e){if(!a.isBuffer(t)||!a.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},a.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},a.concat=function(t,e){if(!o(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return a.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=a.allocUnsafe(e),i=0;for(r=0;r<t.length;++r){var s=t[r];if(!a.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(n,i),i+=s.length}return n},a.byteLength=d,a.prototype._isBuffer=!0,a.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)g(this,e,e+1);return this},a.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)g(this,e,e+3),g(this,e+1,e+2);return this},a.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)g(this,e,e+7),g(this,e+1,e+6),g(this,e+2,e+5),g(this,e+3,e+4);return this},a.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?R(this,0,t):function(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(e>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return T(this,e,r);case"utf8":case"utf-8":return R(this,e,r);case"ascii":return C(this,e,r);case"latin1":case"binary":return D(this,e,r);case"base64":return E(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return B(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}.apply(this,arguments)},a.prototype.equals=function(t){if(!a.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===a.compare(this,t)},a.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},a.prototype.compare=function(t,e,r,n,i){if(!a.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return-1;if(e>=r)return 1;if(e>>>=0,r>>>=0,n>>>=0,i>>>=0,this===t)return 0;for(var o=i-n,s=r-e,u=Math.min(o,s),l=this.slice(n,i),h=t.slice(e,r),f=0;f<u;++f)if(l[f]!==h[f]){o=l[f],s=h[f];break}return o<s?-1:s<o?1:0},a.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},a.prototype.indexOf=function(t,e,r){return v(this,t,e,r,!0)},a.prototype.lastIndexOf=function(t,e,r){return v(this,t,e,r,!1)},a.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return m(this,t,e,r);case"utf8":case"utf-8":return w(this,t,e,r);case"ascii":return b(this,t,e,r);case"latin1":case"binary":return _(this,t,e,r);case"base64":return S(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return P(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},a.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var A=4096;function C(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function D(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function T(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var i="",o=e;o<r;++o)i+=j(t[o]);return i}function B(t,e,r){for(var n=t.slice(e,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function N(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function x(t,e,r,n,i,o){if(!a.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function I(t,e,r,n){e<0&&(e=65535+e+1);for(var i=0,o=Math.min(t.length-r,2);i<o;++i)t[r+i]=(e&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function O(t,e,r,n){e<0&&(e=4294967295+e+1);for(var i=0,o=Math.min(t.length-r,4);i<o;++i)t[r+i]=e>>>8*(n?i:3-i)&255}function M(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function U(t,e,r,n,o){return o||M(t,0,r,4),i.write(t,e,r,n,23,4),r+4}function Y(t,e,r,n,o){return o||M(t,0,r,8),i.write(t,e,r,n,52,8),r+8}a.prototype.slice=function(t,e){var r,n=this.length;if(t=~~t,e=void 0===e?n:~~e,t<0?(t+=n)<0&&(t=0):t>n&&(t=n),e<0?(e+=n)<0&&(e=0):e>n&&(e=n),e<t&&(e=t),a.TYPED_ARRAY_SUPPORT)(r=this.subarray(t,e)).__proto__=a.prototype;else{var i=e-t;r=new a(i,void 0);for(var o=0;o<i;++o)r[o]=this[o+t]}return r},a.prototype.readUIntLE=function(t,e,r){t|=0,e|=0,r||N(t,e,this.length);for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i;return n},a.prototype.readUIntBE=function(t,e,r){t|=0,e|=0,r||N(t,e,this.length);for(var n=this[t+--e],i=1;e>0&&(i*=256);)n+=this[t+--e]*i;return n},a.prototype.readUInt8=function(t,e){return e||N(t,1,this.length),this[t]},a.prototype.readUInt16LE=function(t,e){return e||N(t,2,this.length),this[t]|this[t+1]<<8},a.prototype.readUInt16BE=function(t,e){return e||N(t,2,this.length),this[t]<<8|this[t+1]},a.prototype.readUInt32LE=function(t,e){return e||N(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},a.prototype.readUInt32BE=function(t,e){return e||N(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},a.prototype.readIntLE=function(t,e,r){t|=0,e|=0,r||N(t,e,this.length);for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*e)),n},a.prototype.readIntBE=function(t,e,r){t|=0,e|=0,r||N(t,e,this.length);for(var n=e,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*e)),o},a.prototype.readInt8=function(t,e){return e||N(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},a.prototype.readInt16LE=function(t,e){e||N(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},a.prototype.readInt16BE=function(t,e){e||N(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},a.prototype.readInt32LE=function(t,e){return e||N(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},a.prototype.readInt32BE=function(t,e){return e||N(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},a.prototype.readFloatLE=function(t,e){return e||N(t,4,this.length),i.read(this,t,!0,23,4)},a.prototype.readFloatBE=function(t,e){return e||N(t,4,this.length),i.read(this,t,!1,23,4)},a.prototype.readDoubleLE=function(t,e){return e||N(t,8,this.length),i.read(this,t,!0,52,8)},a.prototype.readDoubleBE=function(t,e){return e||N(t,8,this.length),i.read(this,t,!1,52,8)},a.prototype.writeUIntLE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||x(this,t,e,r,Math.pow(2,8*r)-1,0);var i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},a.prototype.writeUIntBE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||x(this,t,e,r,Math.pow(2,8*r)-1,0);var i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},a.prototype.writeUInt8=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,1,255,0),a.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},a.prototype.writeUInt16LE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,2,65535,0),a.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):I(this,t,e,!0),e+2},a.prototype.writeUInt16BE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,2,65535,0),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):I(this,t,e,!1),e+2},a.prototype.writeUInt32LE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,4,4294967295,0),a.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):O(this,t,e,!0),e+4},a.prototype.writeUInt32BE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,4,4294967295,0),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):O(this,t,e,!1),e+4},a.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e|=0,!n){var i=Math.pow(2,8*r-1);x(this,t,e,r,i-1,-i)}var o=0,s=1,u=0;for(this[e]=255&t;++o<r&&(s*=256);)t<0&&0===u&&0!==this[e+o-1]&&(u=1),this[e+o]=(t/s>>0)-u&255;return e+r},a.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e|=0,!n){var i=Math.pow(2,8*r-1);x(this,t,e,r,i-1,-i)}var o=r-1,s=1,u=0;for(this[e+o]=255&t;--o>=0&&(s*=256);)t<0&&0===u&&0!==this[e+o+1]&&(u=1),this[e+o]=(t/s>>0)-u&255;return e+r},a.prototype.writeInt8=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,1,127,-128),a.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},a.prototype.writeInt16LE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,2,32767,-32768),a.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):I(this,t,e,!0),e+2},a.prototype.writeInt16BE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,2,32767,-32768),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):I(this,t,e,!1),e+2},a.prototype.writeInt32LE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,4,2147483647,-2147483648),a.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):O(this,t,e,!0),e+4},a.prototype.writeInt32BE=function(t,e,r){return t=+t,e|=0,r||x(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),a.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):O(this,t,e,!1),e+4},a.prototype.writeFloatLE=function(t,e,r){return U(this,t,e,!0,r)},a.prototype.writeFloatBE=function(t,e,r){return U(this,t,e,!1,r)},a.prototype.writeDoubleLE=function(t,e,r){return Y(this,t,e,!0,r)},a.prototype.writeDoubleBE=function(t,e,r){return Y(this,t,e,!1,r)},a.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var i,o=n-r;if(this===t&&r<e&&e<n)for(i=o-1;i>=0;--i)t[i+e]=this[i+r];else if(o<1e3||!a.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)t[i+e]=this[i+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+o),e);return o},a.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!a.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;var o;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(o=e;o<r;++o)this[o]=t;else{var s=a.isBuffer(t)?t:k(new a(t,n).toString()),u=s.length;for(o=0;o<r-e;++o)this[o+e]=s[o%u]}return this};var L=/[^+\/0-9A-Za-z-_]/g;function j(t){return t<16?"0"+t.toString(16):t.toString(16)}function k(t,e){var r;e=e||1/0;for(var n=t.length,i=null,o=[],s=0;s<n;++s){if((r=t.charCodeAt(s))>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(s+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320)}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r)}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function H(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(L,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function $(t,e,r,n){for(var i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}}).call(this,r(4))},function(t,e,r){(function(e){var r=function(){"use strict";function t(t,e){return null!=e&&t instanceof e}var r,n,i;try{r=Map}catch(t){r=function(){}}try{n=Set}catch(t){n=function(){}}try{i=Promise}catch(t){i=function(){}}function o(s,a,l,h,f){"object"==typeof a&&(l=a.depth,h=a.prototype,f=a.includeNonEnumerable,a=a.circular);var c=[],p=[],d=void 0!==e;return void 0===a&&(a=!0),void 0===l&&(l=1/0),function s(l,g){if(null===l)return null;if(0===g)return l;var v,y;if("object"!=typeof l)return l;if(t(l,r))v=new r;else if(t(l,n))v=new n;else if(t(l,i))v=new i(function(t,e){l.then(function(e){t(s(e,g-1))},function(t){e(s(t,g-1))})});else if(o.__isArray(l))v=[];else if(o.__isRegExp(l))v=new RegExp(l.source,u(l)),l.lastIndex&&(v.lastIndex=l.lastIndex);else if(o.__isDate(l))v=new Date(l.getTime());else{if(d&&e.isBuffer(l))return v=e.allocUnsafe?e.allocUnsafe(l.length):new e(l.length),l.copy(v),v;t(l,Error)?v=Object.create(l):void 0===h?(y=Object.getPrototypeOf(l),v=Object.create(y)):(v=Object.create(h),y=h)}if(a){var m=c.indexOf(l);if(-1!=m)return p[m];c.push(l),p.push(v)}for(var w in t(l,r)&&l.forEach(function(t,e){var r=s(e,g-1),n=s(t,g-1);v.set(r,n)}),t(l,n)&&l.forEach(function(t){var e=s(t,g-1);v.add(e)}),l){var b;y&&(b=Object.getOwnPropertyDescriptor(y,w)),b&&null==b.set||(v[w]=s(l[w],g-1))}if(Object.getOwnPropertySymbols){var _=Object.getOwnPropertySymbols(l);for(w=0;w<_.length;w++){var S=_[w];(!(E=Object.getOwnPropertyDescriptor(l,S))||E.enumerable||f)&&(v[S]=s(l[S],g-1),E.enumerable||Object.defineProperty(v,S,{enumerable:!1}))}}if(f){var P=Object.getOwnPropertyNames(l);for(w=0;w<P.length;w++){var E,R=P[w];(E=Object.getOwnPropertyDescriptor(l,R))&&E.enumerable||(v[R]=s(l[R],g-1),Object.defineProperty(v,R,{enumerable:!1}))}}return v}(s,l)}function s(t){return Object.prototype.toString.call(t)}function u(t){var e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),e}return o.clonePrototype=function(t){if(null===t)return null;var e=function(){};return e.prototype=t,new e},o.__objToStr=s,o.__isDate=function(t){return"object"==typeof t&&"[object Date]"===s(t)},o.__isArray=function(t){return"object"==typeof t&&"[object Array]"===s(t)},o.__isRegExp=function(t){return"object"==typeof t&&"[object RegExp]"===s(t)},o.__getRegExpFlags=u,o}();"object"==typeof t&&t.exports&&(t.exports=r)}).call(this,r(5).Buffer)}]).default});
//# sourceMappingURL=sl-vue-tree.js.map