class ctDialog {
  constructor(type, ...args) {
    this.assign()
    this.type = type
    this.selector = '.ct-dialog'
    this.hodor = document.createElement('div')

    // 是否在完成callback之后进行destory操作
    this.callbackDestory = true

    this.config = {
      title: 'Hello',
      content: 'Are you sure to continue?',
      contentLoaded: null,
      icon: '',
      opacity: 0.2,

      confirmButton: 'Okay',
      cancelButton: 'Close',

      confirmButtonClass: 'ct-dialog-default',
      cancelButtonClass: 'ct-dialog-default',

      theme: 'white',
      animation: 'zoom',
      closeAnimation: 'scale',
      animationSpeed: 500,
      animationBounce: 1.2,
      keyboardEnabled: false,
      rtl: false,
      confirmKeys: [13], // ENTER key
      cancelKeys: [27], // ESC key

      autoClose: 0,
      autoCloseTimer: null,
      container: 'body',
      backgroundClose: false,
      backgroundCloseAnimation: 'shark',

      // callback
      onConfirm: null,
      onCancel: null,
      onOpen: null,
      onClose: null,
      onAction: null,

      closeIcon: null,
      closeIconClass: false,
      watchInterval: 100,
    }

    this.args = args[0]

    Object.assign(this.config, this.args)

    this.init()
    this.autoClose()
  }

  init() {
    this.close = '<div class="ct-dialog-close">x</div>'

    this.title = `<div class="ct-dialog-title">${this.config.title}</div>`

    this.content = `<div class="ct-dialog-content">${this.config.content}</div>`

    this.buttons = ''

    this.confirmButton = `<button type="button" class="ct-dialog-btn ct-dialog-confirm">
    ${this.config.confirmButton}
    </button>`

    this.cancelButton = `<button type="button" class="ct-dialog-btn ct-dialog-cancel">
    ${this.config.cancelButton}
    </button>`

    switch (this.type) {
      case 'dialog':
        this.dialog()
        break
      case 'alert':
        this.alert()
        break
      case 'confirm':
        this.confirm()
        break
      default:
        throw new Error('type must is dialog, alert or confirm')
    }
  }

  bindEvent() {
    const $confirm = this.box.querySelector('.ct-dialog-confirm')
    const $cancel = this.box.querySelector('.ct-dialog-cancel')
    const $close = this.box.querySelector('.ct-dialog-close')
    const $bg = this.elemet.querySelector('.ct-dialog-bg')

    if ($confirm) {
      $confirm.addEventListener('click', () => {
        if (this.config.onConfirm) {
          this.config.onConfirm.call(this)
          this.destory()
        } else {
          this.destory()
        }
        return false
      })
    }

    if ($cancel) {
      $cancel.addEventListener('click', () => {
        if (this.config.onCancel) {
          this.config.onCancel.call(this)
          this.destory()
        } else {
          this.destory()
        }
        return false
      })
    }

    if ($close) {
      $close.addEventListener('click', () => {
        if (this.config.onClose) {
          this.config.onClose.call(this)
          this.destory()
        } else {
          this.destory()
        }
        return false
      })
    }

    if (this.config.backgroundClose) {
      $bg.addEventListener('click', () => {
        this.destory()
        return false
      })
    } else if (!this.config.backgroundClose) {
      if (this.config.backgroundCloseAnimation) {
        $bg.addEventListener('click', () => {
          if (this.box.className.indexOf(this.config.backgroundCloseAnimation) > -1) {
            return false
          }

          this.addClass(this.box, this.config.backgroundCloseAnimation)

          setTimeout(() => {
            this.box.className = this.box.className.replace(' shark', '')
          }, 800)

          return false
        })
      } else {
        throw new Error('open backgroundClose fail.')
      }
    }
  }

  renderButtons() {
    if (this.config.confirmButton) {
      this.buttons += this.confirmButton
    }

    if (this.config.cancelButton) {
      this.buttons += this.cancelButton
    }

    this.buttonsWarp = `<div class="ct-dialog-footer clear"><div class="right">${this.buttons}</div></div>`
  }

  renderBox() {
    this.body = `
    <div class="ct-dialog-bg" style="opacity: ${this.config.opacity}"></div>
    <div class="ct-dialog-warp">
    <div class="ct-dialog-container">
    <div class="ct-dialog-box">
    ${this.close}
    ${this.title}
    ${this.content}
    ${this.buttonsWarp}
    <div class="ct-dialog-clear"></div>
    </div>
    </div>
    </div>
    `
  }

  renderWarp() {
    this.addClass(this.hodor, 'ct-dialog')
    this.addClass(this.hodor, this.config.theme)
    this.hodor.innerHTML = this.body
  }

  renderElements() {
    this.renderButtons()
    this.renderBox()
    this.renderWarp()
  }

  render() {
    if (document.querySelector(this.selector)) {
      this.destory()
    }
    this.renderElements()
    this.append()
    this.setElements()
    this.setAnimation()
    this.setCenter()
    this.bindEvent()
  }

  setElements() {
    this.elemet = document.querySelector(this.selector)
    this.box = this.elemet.querySelector('.ct-dialog-box')
  }

  setCenter() {
    const dialogHeight = document.querySelector('.ct-dialog-container').offsetHeight
    const bodyHeight = window.screen.height / 2
    const height = bodyHeight - dialogHeight
    this.box.style.marginTop = `${height}px`
  }

  setAnimation() {
    if (this.config.animation) {
      this.addClass(this.box, this.config.animation)
      setTimeout(() => {
        this.removeClass(this.box, this.config.animation)
      }, 200)
    }
  }

  append() {
    document.querySelector(this.config.container).appendChild(this.hodor)
  }

  remove() {
    document.body.removeChild(document.querySelector(this.selector))
  }

  destory() {
    if (this.callbackDestory) {
      window.clearTimeout(this.config.autoCloseTimer)
      if (this.box) {
        this.box.className += ' scale'
        setTimeout(() => {
          this.remove()
        }, 200)
      } else {
        this.remove()
      }
    }
  }

  autoClose() {
    if (this.config.autoClose) {
      this.autoCloseTimer = setTimeout(() => {
        this.destory()
      }, this.config.autoClose)
    }
  }

  dialog() {
    this.config.confirmButton = false
    this.config.cancelButton = false
    this.render()
  }

  alert() {
    this.config.cancelButton = false
    this.render()
  }

  confirm() {
    this.render()
  }
  /*eslint-disable */
  assign() {
    // 兼容处理
    if (!Object.assign) {
      Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
          "use strict";
          if (target === undefined || target === null)
          throw new TypeError("Cannot convert first argument to object");
          var to = Object(target);
          for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource === undefined || nextSource === null) continue;
            var keysArray = Object.keys(Object(nextSource));
            for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
              var nextKey = keysArray[nextIndex];
              var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
              if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
            }
          }
          return to;
        }
      });
    }
  }

  hasClass(elemet, cls) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`)
    if (elemet.className.match(reg)) {
      return true
    }
    return false
  }

  addClass(elemet, cls) {
    const el = elemet

    if (el.className) {
      el.className = `${el.className} ${cls}`
    } else {
      el.className = cls
    }

    return false
  }

  removeClass(elemet, cls) {
    const el = elemet
    el.className = el.className.replace(` ${cls}`, '')
    return false
  }
  /*eslint-enable */
}

export default ctDialog
