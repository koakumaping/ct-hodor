<template>
  <transition name="in-out-translate-fade" appear>
    <td :data-label="label" :title="title">
      <slot></slot>
      <slot v-if="flag" name="edit"></slot>
      <slot v-else name="text"></slot>
    </td>
  </transition>
</template>

<script>
export default {
  name: 'ctTableTd',
  props: {
    flag: {
      type: [String, Number, Boolean],
      defalut: false,
    },
    label: {
      type: [String, Number],
      defalut: '',
    },
    title: {
      type: [String, Number],
      defalut: '',
    },
  },
}
</script>