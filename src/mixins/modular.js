export default {
  created() {
    if (this.$util.hasOwn(this.$route.meta, 'modular')) {
      this.$store.commit('SHOW_MODULAR')
    } else {
      this.$store.commit('HIDE_MODULAR')
    }
  },
  methods: {
    hiddenFullscreen(payload) {
      // console.log(this.$parent.$options.name)
      if (this.$parent.$options.name === 'fullscreen') {
        this.$parent.visiable = false
        this.$parent.$emit('on-close', payload)
      }
    },
  },
}