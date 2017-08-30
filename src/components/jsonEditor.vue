<template>
  <div class='json-editor'>
    <textarea ref='textarea'></textarea>
  </div>
</template>

<script>
import codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript'

export default {
  name: 'jsonEditor',
  props: ['value'],
  date() {
    return {
      jsonEditor: '',
    }
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    },
  },
  mounted() {
    this.jsonEditor = codemirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'monokai',
      lint: true,
    })

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', payload => {
      this.$emit('changed', payload.getValue())
      this.$emit('input', payload.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    },
  },
}
</script>

<style lang="stylus">
.json-editor
  height 600px
  .CodeMirror
    height 100%
</style>
