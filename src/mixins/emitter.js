function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat([params]))
    } else {
      // todo 如果 params 是空数组，接收到的会是 undefined
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}

export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    },
    findComponentUpward(context, componentName, componentNames) {
      if (typeof componentName === 'string') {
        componentNames = [componentName]
      } else {
        componentNames = componentName
      }

      let parent = context.$parent
      let name = parent.$options.name
      while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent
        if (parent) name = parent.$options.name
      }
      return parent
    },
    findComponentDownward(context, componentName) {
      const childrens = context.$children
      let children = null

      if (childrens.length) {
        childrens.forEach(child => {
          const name = child.$options.name
          if (name === componentName) {
            children = child
          }
        })

        for (let i = 0; i < childrens.length; i++) {
          const child = childrens[i]
          const name = child.$options.name
          if (name === componentName) {
            children = child
            break
          } else {
            children = this.findComponentDownward(child, componentName)
            if (children) break
          }
        }
      }
      return children
    },
    findComponentsDownward(context, componentName, components = []) {
      const childrens = context.$children

      if (childrens.length) {
        childrens.forEach(child => {
          const name = child.$options.name
          const childs = child.$children

          if (name === componentName) components.push(child)
          if (childs.length) {
            const findChilds = this.findComponentsDownward(child, componentName, components)
            if (findChilds.length > 0) components.concat(findChilds)
          }
        })
      }
      return components
    },
  },
}