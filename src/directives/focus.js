export default {
  inserted(el, binding) {
    if (binding.value) el.focus()
    else el.blur()
  },
  componentUpdated(el, binding) {
    if (binding.modifiers.lazy) {
      if (Boolean(binding.value) === Boolean(binding.oldValue)) {
        return false
      }
    }

    if (binding.value) el.focus()
    else el.blur()
  },
}