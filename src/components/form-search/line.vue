<template>
  <div class="search-line">
    <div class="clear">
      <dl class="title left hidden" v-if="title">{{title}}：</dl>
      <dl class="content" :style="titleStyl">
        <slot></slot>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ctFormSearchLine',
  props: {
    title: {
      type: [String, Number],
      default: '',
    },
  },
  computed: {
    titleStyl() {
      const ret = {}
      if (!this.title) {
        ret.marginLeft = 0
      }
      return ret
    },
  },
}
</script>