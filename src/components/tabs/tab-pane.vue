<template>
  <div class="ct-tab-pane" v-show="active">
    <slot name="label"></slot>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ct-tab-pane',
  props: {
    disabled: Boolean,
  },
  created() {
    this.parent.addPane(this)
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    parent() {
      return this.$parent
    },
  },
  beforeDestroy() {
    this.parent.removePane(this)
  },
}
</script>

<style lang="stylus">
.ct-tab-pane
  height 100%
</style>
