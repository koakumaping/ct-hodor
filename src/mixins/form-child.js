import { isEmpty } from 'ct-util'

export default {
  props: {
    readonly: {
      type: [String, Number, Boolean],
      default: undefined,
    },
  },
  computed: {
    isReadonly() {
      return this.readonly !== undefined ? this.readonly : this.p.readonly
    },
  },
  inject: ['p'],
  methods: {
    e(value, title = '') {
      if (isEmpty(value)) return title || '--'
      return value
    },
  },
}