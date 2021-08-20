<template>
  <div class="split-horizontal">
    <basic-container class="aside" ref="aside">
      <slot name="left"></slot>
    </basic-container>
    <div class="drag-bar" @mousedown="handleResizeDrag"></div>
    <basic-container class="main" ref="main">
      <slot name="right"></slot>
    </basic-container>
  </div>
</template>

<script>
export default {
  name: "SplitHorizontal",
  methods: {
    handleResizeDrag(e) {
      const oriPosX = e.clientX;
      const oriWidth = parseInt(window.getComputedStyle(this.$refs.aside.$el).width);
      const mainElm = this.$refs.main.$el;
      const asideElm = this.$refs.aside.$el;
      document.body.style.cursor = 'e-resize';

      function handleMouseMove(e) {
        const delta = e.clientX - oriPosX;
        const width = Math.min(Math.max(oriWidth + delta, 200), 900);
        asideElm.style.width = width + 'px';
        mainElm.style.width = `calc(100% - ${width}px)`;
        e.preventDefault();
      }

      function handleMouseUp() {
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
  }
}
</script>

<style lang="scss" scoped>
.split-horizontal {
  display: flex;
  align-items: stretch;

  .aside {
    height: 100%;
    width: 300px;
    flex-shrink: 0;
    margin-right: 4px;
    transition: width 0.1s;
  }

  /deep/ .basic-container {
    padding: 0;
    & > .el-card {
      height: 100%;
      .el-card__body {
        height: 100%;
      }
    }
  }

  .drag-bar {
    width: 4px;
    border-radius: 2px;
    cursor: e-resize;
    flex-shrink: 0;

    &:hover,
    &:active {
      background-color: #dddee0;
    }
  }

  .main {
    margin-left: 4px;
    width: calc(100% - 300px);
  }
}
</style>
