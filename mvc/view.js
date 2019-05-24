/* eslint no-invalid-this: 0, complexity:[2, 9] */
import {qs, qsa, $on, $parent, $delegate} from './helpers.js'

/**
 * View that abstracts away the browser's DOM completely.
 * It has two simple entry points:
 *
 *   - bind(eventName, handler)
 *     Takes a phyto application event and registers the handler
 *   - render(command, parameterObject)
 *     Renders the given command with the options
 */
export default class View {
  constructor(template) {
    this.template = template

    this.ENTER_KEY = 13
    this.ESCAPE_KEY = 27

    this.$phytoList = qs('.phyto-list')
    this.$phytoItemCounter = qs('.phyto-count')
    this.$clearCompleted = qs('.clear-completed')
    this.$main = qs('.main')
    this.$footer = qs('.footer')
    this.$toggleAll = qs('.toggle-all')
    this.$newPhyto = qs('.new-phyto')
    this.$loader = qs('.loader')
  }

  _removeItem(id) {
    var elem = qs('[data-id="' + id + '"]')

    if (elem) {
      this.$phytoList.removeChild(elem)
    }
  }

  _clearCompletedButton(completedCount, visible) {
    this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount)
    this.$clearCompleted.style.display = visible ? 'block' : 'none'
  }
/*
  _editItemDone(id, title) {
    var listItem = qs('[data-id="' + id + '"]')

    if (!listItem) {
      return
    }

    var input = qs('input.edit', listItem)
    listItem.removeChild(input)

    listItem.className = listItem.className.replace('editing', '')

    qsa('label', listItem).forEach(function(label) {
      label.textContent = title
    })
  }
*/
  render(viewCmd, parameter) {
    var that = this
    var viewCommands = {
      showEntries: function() {
        that.$phytoList.innerHTML = that.template.show(parameter)
      },
      removeItem: function() {
        that._removeItem(parameter)
      },
      updateElementCount: function() {
        that.$phytoItemCounter.innerHTML = that.template.itemCounter(parameter)
      },
      clearCompletedButton: function() {
        that._clearCompletedButton(parameter.completed, parameter.visible)
      },
      contentBlockVisibility: function() {
        that.$main.style.display = that.$footer.style.display = parameter.visible ? 'block' : 'none'
      },
      toggleAll: function() {
        that.$toggleAll.checked = parameter.checked
      },
      setFilter: function() {
        _setFilter(parameter)
      },
      clearNewPhyto: function() {
        that.$newPhyto.value = ''
      },
      elementComplete: function() {
        _elementComplete(parameter.id, parameter.completed)
      } /*,
      editItem: function() {
        _editItem(parameter.id, parameter.title)
      },
      editItemDone: function() {
        that._editItemDone(parameter.id, parameter.title)
      } */ ,
      loaderBlockVisibility: function() {
        that.$loader.style.display = that.$loader.style.display = parameter.visible ? 'block' : 'none'
      },
    }
    
    viewCommands[viewCmd]()
  }
  
  /*
  _bindItemEditDone(handler) {
    var that = this
    $delegate(that.$phytoList, 'li .edit', 'blur', function() {
      if (!this.dataset.iscanceled) {
        handler({
          id: _itemId(this),
          title: this.value
        })
      }
    })

    $delegate(that.$phytoList, 'li .edit', 'keypress', function(event) {
      if (event.keyCode === that.ENTER_KEY) {
        // Remove the cursor from the input when you hit enter just like if it
        // were a real form
        this.blur()
      }
    })
  }
  _bindItemEditCancel(handler) {
    var that = this
    $delegate(that.$phytoList, 'li .edit', 'keyup', function(event) {
      if (event.keyCode === that.ESCAPE_KEY) {
        this.dataset.iscanceled = true
        this.blur()

        handler({id: _itemId(this)})
      }
    })
  }
*/
  bind(event, handler) {
    var that = this
    if (event === 'newPhyto') {
      $on(that.$newPhyto, 'change', function() {
        handler(that.$newPhyto.value)
      })

    } else if (event === 'removeCompleted') {
      $on(that.$clearCompleted, 'click', function() {
        handler()
      })

    } else if (event === 'toggleAll') {
      $on(that.$toggleAll, 'click', function() {
        handler({completed: this.checked})
      })

    } else if (event === 'itemEdit') {
      $delegate(that.$phytoList, 'li label', 'dblclick', function() {
        handler({id: _itemId(this)})
      })

    } else if (event === 'itemRemove') {
      $delegate(that.$phytoList, '.destroy', 'click', function() {
        handler({id: _itemId(this)})
      })

    } else if (event === 'itemToggle') {
      $delegate(that.$phytoList, '.toggle', 'click', function() {
        handler({
          id: _itemId(this),
          completed: this.checked
        })
      })

    } else if (event === 'itemEditDone') {
      that._bindItemEditDone(handler)

    } else if (event === 'itemEditCancel') {
      that._bindItemEditCancel(handler)
    }
  }
}

function _setFilter(currentPage) {
  qs('.filters .selected').className = ''
  qs('.filters [href="#/' + currentPage + '"]').className = 'selected'
}

function _elementComplete(id, completed) {
  var listItem = qs('[data-id="' + id + '"]')

  if (!listItem) {
    return
  }

  listItem.className = completed ? 'completed' : ''

  // In case it was toggled from an event and not by clicking the checkbox
  qs('input', listItem).checked = completed
}
/*
function _editItem(id, title) {
  var listItem = qs('[data-id="' + id + '"]')

  if (!listItem) {
    return
  }

  listItem.className = listItem.className + ' editing'

  var input = document.createElement('input')
  input.className = 'edit'

  listItem.appendChild(input)
  input.focus()
  input.value = title
}
*/
function _itemId(element) {
  var li = $parent(element, 'li')
  return li.dataset.id
}
