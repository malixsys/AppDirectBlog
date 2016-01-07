(function() {
  
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.content').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('active')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('active')
          .attr('aria-hidden', true)

        $.support.transition ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = 'fade'

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('active')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('active')

          $.support.transition ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);

/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('active')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('active')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('active')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('active')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('active')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.data('target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)
      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')
        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }


        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'active'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'active') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          //$tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = (Math.round($tip[0].offsetWidth/2)*2)
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('active')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {

        delta = 0
        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = (Math.round($tip[0].offsetWidth/2)*2)
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.content')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('active')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('active') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="arrow"></div><div class="content"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('active')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')

    var e = $.Event('classChange')
    this.$element.trigger(e)
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!($btn.attr('type') == 'button')) $btn = $btn.closest('button[type="button"]')
    $btn.button('toggle')
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('active')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('active')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('active')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('active') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    e.preventDefault()
    e.stopPropagation()
    $this[$(target).hasClass('active') ? 'removeClass' : 'addClass']('open')
    $this[$(target).hasClass('active') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.controls ol')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);

+function ($) {

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);

;
  var Matrix, Slider, Tutorial, tagsField,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    return $('.adb-js-auto_search--input').on('keyup', function() {
      var $search;
      $search = $(this).parents('.adb-search_field');
      $search.addClass('adb-is-loading');
      window.setTimeout((function() {
        $search.removeClass('adb-is-loading').addClass('adb-is-active');
      }), 500);
      return $('.adb-js-auto_search--clear').on('click', function(e) {
        $search = $(this).parents('.adb-search_field');
        e.preventDefault();
        $search.removeClass('adb-is-active');
        $search.find('input').val('');
        return e.stopPropagation();
      });
    });
  });

  $(function() {
    $('button').on('click', function() {
      return $(this).blur();
    });
    return $(document).on('click', '.adb-toggle_button', function() {
      var activeLabel, currentLabel, initLabel;
      initLabel = $(this).attr('data-label-init');
      activeLabel = $(this).attr('data-label-active');
      currentLabel = $(this).text();
      $(this).toggleClass('active');
      if (currentLabel === activeLabel) {
        return $(this).text(initLabel);
      } else {
        return $(this).text(activeLabel);
      }
    });
  });

  
/*
* jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
*
* Uses the built in easing capabilities added In jQuery 1.1
* to offer multiple easing options
*
* TERMS OF USE - jQuery Easing
*
* Open source under the BSD License.
*
* Copyright © 2008 George McGinley Smith
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
*
* Redistributions of source code must retain the above copyright notice, this list of
* conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list
* of conditions and the following disclaimer in the documentation and/or other materials
* provided with the distribution.
*
* Neither the name of the author nor the names of contributors may be used to endorse
* or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
* GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
* OF THE POSSIBILITY OF SUCH DAMAGE.
*
*/
jQuery.easing.jswing = jQuery.easing.swing; jQuery.extend(jQuery.easing, { def: "easeOutQuad", swing: function (e, f, a, h, g) { return jQuery.easing[jQuery.easing.def](e, f, a, h, g) }, easeInQuad: function (e, f, a, h, g) { return h * (f /= g) * f + a }, easeOutQuad: function (e, f, a, h, g) { return -h * (f /= g) * (f - 2) + a }, easeInOutQuad: function (e, f, a, h, g) { if ((f /= g / 2) < 1) { return h / 2 * f * f + a } return -h / 2 * ((--f) * (f - 2) - 1) + a }, easeInCubic: function (e, f, a, h, g) { return h * (f /= g) * f * f + a }, easeOutCubic: function (e, f, a, h, g) { return h * ((f = f / g - 1) * f * f + 1) + a }, easeInOutCubic: function (e, f, a, h, g) { if ((f /= g / 2) < 1) { return h / 2 * f * f * f + a } return h / 2 * ((f -= 2) * f * f + 2) + a }, easeInQuart: function (e, f, a, h, g) { return h * (f /= g) * f * f * f + a }, easeOutQuart: function (e, f, a, h, g) { return -h * ((f = f / g - 1) * f * f * f - 1) + a }, easeInOutQuart: function (e, f, a, h, g) { if ((f /= g / 2) < 1) { return h / 2 * f * f * f * f + a } return -h / 2 * ((f -= 2) * f * f * f - 2) + a }, easeInQuint: function (e, f, a, h, g) { return h * (f /= g) * f * f * f * f + a }, easeOutQuint: function (e, f, a, h, g) { return h * ((f = f / g - 1) * f * f * f * f + 1) + a }, easeInOutQuint: function (e, f, a, h, g) { if ((f /= g / 2) < 1) { return h / 2 * f * f * f * f * f + a } return h / 2 * ((f -= 2) * f * f * f * f + 2) + a }, easeInSine: function (e, f, a, h, g) { return -h * Math.cos(f / g * (Math.PI / 2)) + h + a }, easeOutSine: function (e, f, a, h, g) { return h * Math.sin(f / g * (Math.PI / 2)) + a }, easeInOutSine: function (e, f, a, h, g) { return -h / 2 * (Math.cos(Math.PI * f / g) - 1) + a }, easeInExpo: function (e, f, a, h, g) { return (f == 0) ? a : h * Math.pow(2, 10 * (f / g - 1)) + a }, easeOutExpo: function (e, f, a, h, g) { return (f == g) ? a + h : h * (-Math.pow(2, -10 * f / g) + 1) + a }, easeInOutExpo: function (e, f, a, h, g) { if (f == 0) { return a } if (f == g) { return a + h } if ((f /= g / 2) < 1) { return h / 2 * Math.pow(2, 10 * (f - 1)) + a } return h / 2 * (-Math.pow(2, -10 * --f) + 2) + a }, easeInCirc: function (e, f, a, h, g) { return -h * (Math.sqrt(1 - (f /= g) * f) - 1) + a }, easeOutCirc: function (e, f, a, h, g) { return h * Math.sqrt(1 - (f = f / g - 1) * f) + a }, easeInOutCirc: function (e, f, a, h, g) { if ((f /= g / 2) < 1) { return -h / 2 * (Math.sqrt(1 - f * f) - 1) + a } return h / 2 * (Math.sqrt(1 - (f -= 2) * f) + 1) + a }, easeInElastic: function (f, h, e, l, k) { var i = 1.70158; var j = 0; var g = l; if (h == 0) { return e } if ((h /= k) == 1) { return e + l } if (!j) { j = k * 0.3 } if (g < Math.abs(l)) { g = l; var i = j / 4 } else { var i = j / (2 * Math.PI) * Math.asin(l / g) } return -(g * Math.pow(2, 10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j)) + e }, easeOutElastic: function (f, h, e, l, k) { var i = 1.70158; var j = 0; var g = l; if (h == 0) { return e } if ((h /= k) == 1) { return e + l } if (!j) { j = k * 0.3 } if (g < Math.abs(l)) { g = l; var i = j / 4 } else { var i = j / (2 * Math.PI) * Math.asin(l / g) } return g * Math.pow(2, -10 * h) * Math.sin((h * k - i) * (2 * Math.PI) / j) + l + e }, easeInOutElastic: function (f, h, e, l, k) { var i = 1.70158; var j = 0; var g = l; if (h == 0) { return e } if ((h /= k / 2) == 2) { return e + l } if (!j) { j = k * (0.3 * 1.5) } if (g < Math.abs(l)) { g = l; var i = j / 4 } else { var i = j / (2 * Math.PI) * Math.asin(l / g) } if (h < 1) { return -0.5 * (g * Math.pow(2, 10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j)) + e } return g * Math.pow(2, -10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j) * 0.5 + l + e }, easeInBack: function (e, f, a, i, h, g) { if (g == undefined) { g = 1.70158 } return i * (f /= h) * f * ((g + 1) * f - g) + a }, easeOutBack: function (e, f, a, i, h, g) { if (g == undefined) { g = 1.70158 } return i * ((f = f / h - 1) * f * ((g + 1) * f + g) + 1) + a }, easeInOutBack: function (e, f, a, i, h, g) { if (g == undefined) { g = 1.70158 } if ((f /= h / 2) < 1) { return i / 2 * (f * f * (((g *= (1.525)) + 1) * f - g)) + a } return i / 2 * ((f -= 2) * f * (((g *= (1.525)) + 1) * f + g) + 2) + a }, easeInBounce: function (e, f, a, h, g) { return h - jQuery.easing.easeOutBounce(e, g - f, 0, h, g) + a }, easeOutBounce: function (e, f, a, h, g) { if ((f /= g) < (1 / 2.75)) { return h * (7.5625 * f * f) + a } else { if (f < (2 / 2.75)) { return h * (7.5625 * (f -= (1.5 / 2.75)) * f + 0.75) + a } else { if (f < (2.5 / 2.75)) { return h * (7.5625 * (f -= (2.25 / 2.75)) * f + 0.9375) + a } else { return h * (7.5625 * (f -= (2.625 / 2.75)) * f + 0.984375) + a } } } }, easeInOutBounce: function (e, f, a, h, g) { if (f < g / 2) { return jQuery.easing.easeInBounce(e, f * 2, 0, h, g) * 0.5 + a } return jQuery.easing.easeOutBounce(e, f * 2 - g, 0, h, g) * 0.5 + h * 0.5 + a } });

/*!
 * Hero Carousel - jQuery Plugin
 *
 * Copyright (c) 2011 Paul Welsh
 *
 * Version: 1.3 (26/05/2011)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

jQuery.fn.heroCarousel = function(options){

    options = jQuery.extend({
        animationSpeed: 1000,
        navigation: true,
        easing: '',
        timeout: 5000,
        pause: true,
        pauseOnNavHover: true,
        prevText: 'Previous',
        nextText: 'Next',
        css3pieFix: false,
        currentClass: 'current',
        onLoad: function(){},
        onStart: function(){},
        onComplete: function(){}
    }, options);

    // if(jQuery.browser.msie && parseFloat(jQuery.browser.version) < 7){
    // 	options.animationSpeed = 0;
    // }
    //
    return this.each(function() {
        var carousel = jQuery(this),
        elements = carousel.children();
        currentItem = 1;
        childWidth = elements.width();
        childHeight = elements.height();

        if(elements.length > 2){

            elements.each(function(i){
                if(options.itemClass){
                    jQuery(this).addClass(options.itemClass);
                }
            });

            elements.filter(':first').addClass(options.currentClass).before(elements.filter(':last'));

            var carouselWidth = Math.round(childWidth * carousel.children().length),
            carouselMarginLeft = '-'+ Math.round(childWidth + Math.round(childWidth / 2) ) +'px'

            carousel.addClass('hero-carousel-container').css({
                'position': 'relative',
                'overflow': 'hidden',
                'left': '50%',
                'top': 0,
                'margin-left': carouselMarginLeft,
                'height': childHeight,
                'width': carouselWidth
            });

            carousel.before('<ul class="hero-carousel-nav"><li class="prev"><a href="#">'+options.prevText+'</a></li><li class="next"><a href="#">'+options.nextText+'</a></li></ul>');

            var carouselNav = carousel.prev('.hero-carousel-nav'),
            timeoutInterval;

            if(options.timeout > 0){
                var paused = false;
                if(options.pause){
                    carousel.hover(function(){
                        paused = true;
                    },function(){
                        paused = false;
                    });
                }
                if(options.pauseOnNavHover){
                    carouselNav.hover(function(){
                        paused = true;
                    },function(){
                        paused = false;
                    });
                }
                function autoSlide(){
                    if(!paused){
                          carouselNav.find('.next a').trigger('click');
                      }
                }
                timeoutInterval = window.setInterval(autoSlide, options.timeout);
            }

            carouselNav.find('a').data('disabled', false).click(function(e){
                e.preventDefault();
                var navItem = jQuery(this),
                isPrevious = navItem.parent().hasClass('prev'),
                elements = carousel.children();
                if(navItem.data('disabled') === false){
                    options.onStart(carousel, carouselNav, elements.eq(currentItem), options);
                    if(isPrevious){
                        animateItem(elements.filter(':last'), 'previous');
                    }else{
                        animateItem(elements.filter(':first'), 'next');
                    }
                    navItem.data('disabled', true);
                    setTimeout(function(){
                        navItem.data('disabled', false);
                    }, options.animationSpeed+200);
                    if(options.timeout > 0){
                           window.clearInterval(timeoutInterval);
                           timeoutInterval = window.setInterval(autoSlide, options.timeout);
                      }
                }

            });

            function animateItem(object,direction){
                var carouselPosLeft = parseFloat(carousel.position().left),
                carouselPrevMarginLeft = parseFloat(carousel.css('margin-left'));

                if(direction === 'previous'){
                    object.before( object.clone().addClass('carousel-clone') );
                    carousel.prepend( object );
                    var marginLeft = Math.round(carouselPrevMarginLeft - childWidth);
                    var plusOrMinus = '+=';
                }else{
                    object.after( object.clone().addClass('carousel-clone') );
                    carousel.append( object );
                    var marginLeft = carouselMarginLeft;
                    var plusOrMinus = '-=';
                }
                if(options.css3pieFix){
                    fixPieClones(jQuery('.carousel-clone'));
                }
                carousel.css({
                    'left': carouselPosLeft,
                    'width': Math.round(carouselWidth + childWidth),
                    'margin-left': marginLeft
                }).animate({'left':plusOrMinus+childWidth}, options.animationSpeed, options.easing, function(){
                    carousel.css({
                        'left': '50%',
                        'width': carouselWidth,
                        'margin-left': carouselPrevMarginLeft
                    });
                    jQuery('.carousel-clone').remove();
                    finishCarousel();
                });
            }

            function fixPieClones(clonedObject){
                var itemPieId = clonedObject.attr('_pieId');
                if(itemPieId){
                    clonedObject.attr('_pieId', itemPieId+'_cloned');
                }
                clonedObject.find('*[_pieId]').each(function(i, item){
                    var descendantPieId = $(item).attr('_pieId');
                    $(item).attr('_pieId', descendantPieId+'_cloned');
                });
            }

            function finishCarousel(){
                var elements = carousel.children();
                elements.removeClass(options.currentClass).eq(currentItem).addClass(options.currentClass);
                options.onComplete(carousel, carousel.prev('.hero-carousel-nav'), elements.eq(currentItem), options);
            }

            // if(jQuery.browser.msie){
            //     carouselNav.find('a').attr("hideFocus", "true");
            // }

            options.onLoad(carousel, carouselNav, carousel.children().eq(currentItem), options);

        }

    });

};


;

  $(function() {
    return $(".adb-hero--carousel").heroCarousel({
      timeout: 10000,
      easing: "easeOutExpo",
      currentClass: "adb-is-active",
      prevText: "",
      nextText: "",
      onLoad: function() {
        $('.adb-hero').removeClass('adb-is-visually_hidden');
        $('.hero-carousel-nav .prev a').on('mouseenter mouseleave', function() {
          return $('.adb-hero--item:first-child').toggleClass('adb-is-hover');
        });
        return $('.hero-carousel-nav .next a').on('mouseenter mouseleave', function() {
          return $('.adb-hero--item:last-child').toggleClass('adb-is-hover');
        });
      },
      onStart: function() {
        return $('.adb-hero--item').removeClass('adb-is-hover');
      },
      onComplete: function() {
        return $('.adb-hero--item').removeClass('adb-is-hover');
      }
    });
  });

  
/*!
 * Datepicker for Bootstrap v1.5.0 (https://github.com/eternicode/bootstrap-datepicker)
 *
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */(function($, undefined){

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function isUTCEquals(date1, date2) {
		return (
			date1.getUTCFullYear() === date2.getUTCFullYear() &&
			date1.getUTCMonth() === date2.getUTCMonth() &&
			date1.getUTCDate() === date2.getUTCDate()
		);
	}
	function alias(method){
		return function(){
			return this[method].apply(this, arguments);
		};
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					if (this[i].valueOf() === val)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		this._process_options(options);

		this.dates = new DateArray();
		this.viewDate = this.o.defaultViewDate;
		this.focusDate = null;

		this.element = $(element);
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0)
			this.component = false;

		this.picker = $(DPGlobal.template);
		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('tfoot .today, tfoot .clear')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
		this.setDatesDisabled(this.o.datesDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			switch (o.startView){
				case 2:
				case 'decade':
					o.startView = 2;
					break;
				case 1:
				case 'year':
					o.startView = 1;
					break;
				default:
					o.startView = 0;
			}

			switch (o.minViewMode){
				case 1:
				case 'months':
					o.minViewMode = 1;
					break;
				case 2:
				case 'years':
					o.minViewMode = 2;
					break;
				default:
					o.minViewMode = 0;
			}

			o.startView = Math.max(o.startView, o.minViewMode);

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = ((o.weekStart + 6) % 7);

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
				return parseInt(d, 10);
			});

			o.datesDisabled = o.datesDisabled||[];
			if (!$.isArray(o.datesDisabled)) {
				var datesDisabled = [];
				datesDisabled.push(DPGlobal.parseDate(o.datesDisabled, format, o.language));
				o.datesDisabled = datesDisabled;
			}
			o.datesDisabled = $.map(o.datesDisabled,function(d){
				return DPGlobal.parseDate(d, format, o.language);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return /^auto|left|right|top|bottom$/.test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return /^left|right$/.test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return /^top|bottom$/.test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
			if (o.defaultViewDate) {
				var year = o.defaultViewDate.year || new Date().getFullYear();
				var month = o.defaultViewDate.month || 0;
				var day = o.defaultViewDate.day || 1;
				o.defaultViewDate = UTCDate(year, month, day);
			} else {
				o.defaultViewDate = UTCToday();
			}
			o.showOnFocus = o.showOnFocus !== undefined ? o.showOnFocus : true;
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
            var events = {
                keyup: $.proxy(function(e){
                    if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
                        this.update();
                }, this),
                keydown: $.proxy(this.keydown, this)
            };

            if (this.o.showOnFocus === true) {
                events.focus = $.proxy(this.show, this);
            }

            if (this.isInput) { // single input
                this._events = [
                    [this.element, events]
                ];
            }
            else if (this.component && this.hasInput) { // component: input + button
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.element.find('input'), events],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
			else if (this.element.is('div')){  // inline datepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					}
					else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (this.element.attr('readonly') && this.o.enableOnReadonly === false)
				return;
			if (!this.isInline)
				this.picker.appendTo(this.o.container);
			this.place();
			this.picker.show();
			this._attachSecondaryEvents();
			this._trigger('show');
			if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
				$(this.element).blur();
			}
			return this;
		},

		hide: function(){
			if (this.isInline)
				return this;
			if (!this.picker.is(':visible'))
				return this;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (
				this.o.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this._trigger('hide');
			return this;
		},

		remove: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
			return this;
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			var selected_date = this.dates.get(-1);
			if (typeof selected_date !== 'undefined') {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		clearDates: function(){
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}

			if (element) {
				element.val('').change();
			}

			this.update();
			this._trigger('changeDate');

			if (this.o.autoclose) {
				this.hide();
			}
		},
		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			if (!this.isInput){
				if (this.component){
					this.element.find('input').val(formatted).change();
				}
			}
			else {
				this.element.val(formatted).change();
			}
			return this;
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDatesDisabled: function(datesDisabled){
			this._process_options({datesDisabled: datesDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			if (this.isInline)
				return this;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				windowWidth = $(this.o.container).width(),
				windowHeight = $(this.o.container).height(),
				scrollTop = $(this.o.container).scrollTop(),
				appendOffset = $(this.o.container).offset();

			var parentsZindex = [];
			this.element.parents().each(function(){
				var itemZIndex = $(this).css('z-index');
				if (itemZIndex !== 'auto' && itemZIndex !== 0) parentsZindex.push(parseInt(itemZIndex));
			});
			var zIndex = Math.max.apply(Math, parentsZindex) + 10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left - appendOffset.left,
				top = offset.top - appendOffset.top;

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				if (offset.left < 0) {
					// component is outside the window on the left side. Move it into visible range
					this.picker.addClass('datepicker-orient-left');
					left -= offset.left - visualPadding;
				} else if (left + calendarWidth > windowWidth) {
					// the calendar passes the widow right edge. Align it to component right side
					this.picker.addClass('datepicker-orient-right');
					left = offset.left + width - calendarWidth;
				} else {
					// Default to left
					this.picker.addClass('datepicker-orient-left');
				}
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
					yorient = 'top';
				else
					yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top += height;
			else
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));

			if (this.o.rtl) {
				var right = windowWidth - (left + width);
				this.picker.css({
					top: top,
					right: right,
					zIndex: zIndex
				});
			} else {
				this.picker.css({
					top: top,
					left: left,
					zIndex: zIndex
				});
			}
			return this;
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return this;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			}
			else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.element.find('input').val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					date < this.o.startDate ||
					date > this.o.endDate ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.dates.length)
				this.viewDate = new Date(this.dates.get(-1));
			else if (this.viewDate < this.o.startDate)
				this.viewDate = new Date(this.o.startDate);
			else if (this.viewDate > this.o.endDate)
				this.viewDate = new Date(this.o.endDate);

			if (fromArgs){
				// setting date by clicking
				this.setValue();
			}
			else if (dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates))
					this._trigger('changeDate');
			}
			if (!this.dates.length && oldDates.length)
				this._trigger('clearDate');

			this.fill();
			return this;
		},

		fillDow: function(){
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				this.picker.find('.datepicker-days thead tr:first-child .datepicker-switch')
					.attr('colspan', function(i, val){
						return parseInt(val) + 1;
					});
				var cell = '<th class="cw">&#160;</th>';
				html += cell;
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12){
				html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			}
			else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() === today.getFullYear() &&
				date.getUTCMonth() === today.getMonth() &&
				date.getUTCDate() === today.getDate()){
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
				$.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1){
				cls.push('disabled');
			}
			if (this.o.datesDisabled.length > 0 &&
				$.grep(this.o.datesDisabled, function(d){
					return isUTCEquals(date, d); }).length > 0) {
				cls.push('disabled', 'disabled-date');
			}

			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
			}
			return cls;
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				tooltip;
			if (isNaN(year) || isNaN(month))
				return;
			this.picker.find('.datepicker-days thead .datepicker-switch')
						.text(dates[this.o.language].months[month]+' '+year);
			this.picker.find('tfoot .today')
						.text(todaytxt)
						.toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot .clear')
						.text(cleartxt)
						.toggle(this.o.clearBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth){
				if (prevMonth.getUTCDay() === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
				tooltip = null;
				if (prevMonth.getUTCDay() === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop){
				var that = this;
				$.each(months, function(i, month){
					if (!$(month).hasClass('disabled')) {
						var moDate = new Date(year, i, 1);
						var before = that.o.beforeShowMonth(moDate);
						if (before === false)
							$(month).addClass('disabled');
					}
				});
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			var years = $.map(this.dates, function(d){
					return d.getUTCFullYear();
				}),
				classes;
			for (var i = -1; i < 11; i++){
				classes = ['year'];
				if (i === -1)
					classes.push('old');
				else if (i === 10)
					classes.push('new');
				if ($.inArray(year, years) !== -1)
					classes.push('active');
				if (year < startYear || year > endYear)
					classes.push('disabled');
				html += '<span class="' + classes.join(' ') + '">' + year + '</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode){
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e){
			e.preventDefault();
			var target = $(e.target).closest('span, td, th'),
				year, month, day;
			if (target.length === 1){
				switch (target[0].nodeName.toLowerCase()){
					case 'th':
						switch (target[0].className){
							case 'datepicker-switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
								switch (this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										this._trigger('changeMonth', this.viewDate);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										if (this.viewMode === 1)
											this._trigger('changeYear', this.viewDate);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.o.todayBtn === 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
							case 'clear':
								this.clearDates();
								break;
						}
						break;
					case 'span':
						if (!target.hasClass('disabled')){
							this.viewDate.setUTCDate(1);
							if (target.hasClass('month')){
								day = 1;
								month = target.parent().find('span').index(target);
								year = this.viewDate.getUTCFullYear();
								this.viewDate.setUTCMonth(month);
								this._trigger('changeMonth', this.viewDate);
								if (this.o.minViewMode === 1){
									this._setDate(UTCDate(year, month, day));
								}
							}
							else {
								day = 1;
								month = 0;
								year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this._trigger('changeYear', this.viewDate);
								if (this.o.minViewMode === 2){
									this._setDate(UTCDate(year, month, day));
								}
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.hasClass('day') && !target.hasClass('disabled')){
							day = parseInt(target.text(), 10)||1;
							year = this.viewDate.getUTCFullYear();
							month = this.viewDate.getUTCMonth();
							if (target.hasClass('old')){
								if (month === 0){
									month = 11;
									year -= 1;
								}
								else {
									month -= 1;
								}
							}
							else if (target.hasClass('new')){
								if (month === 11){
									month = 0;
									year += 1;
								}
								else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day));
						}
						break;
				}
			}
			if (this.picker.is(':visible') && this._focused_from){
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}

			if (ix !== -1){
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive){
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			}
			else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if (!which || which  === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which  !== 'view') {
				this._trigger('changeDate');
			}
			var element;
			if (this.isInput){
				element = this.element;
			}
			else if (this.component){
				element = this.element.find('input');
			}
			if (element){
				element.change();
			}
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveMonth: function(date, dir){
			if (!date)
				return undefined;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (!this.picker.is(':visible')){
				if (e.keyCode === 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, newDate, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newViewDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir * 7);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newViewDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 32: // spacebar
					// Spacebar is used in manually typing dates in some formats.
					// As such, its behavior should not be hijacked.
					break;
				case 13: // enter
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						if (typeof e.stopPropagation === 'function') {
							e.stopPropagation(); // All modern browsers, IE9+
						} else {
							e.cancelBubble = true; // IE6,7,8 ignore "stopPropagation"
						}
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				var element;
				if (this.isInput){
					element = this.element;
				}
				else if (this.component){
					element = this.element.find('input');
				}
				if (element){
					element.change();
				}
			}
		},

		showMode: function(dir){
			if (dir){
				this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker
				.children('div')
				.hide()
				.filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName)
					.css('display', 'block');
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function(element, options){
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		datepickerPlugin.call($(this.inputs), options)
			.bind('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			if (this.updating)
				return;
			this.updating = true;

			var dp = $(e.target).data('datepicker'),
				new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				j = i - 1,
				k = i + 1,
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate())
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]){
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j]){
					this.pickers[j--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[k]){
				// Date being moved later/right
				while (k < l && new_date > this.dates[k]){
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	var datepickerPlugin = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.hasClass('input-daterange') || opts.inputs){
					var ropts = {
						inputs: opts.inputs || $this.find('input').toArray()
					};
					$this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
				}
				else {
					$this.data('datepicker', (data = new Datepicker(this, opts)));
				}
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined)
					return false;
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};
	$.fn.datepicker = datepickerPlugin;

	var defaults = $.fn.datepicker.defaults = {
		autoclose: false,
		beforeShowDay: $.noop,
		beforeShowMonth: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		toggleActive: false,
		daysOfWeekDisabled: [],
		datesDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		weekStart: 0,
		disableTouchKeyboard: false,
        enableOnReadonly: true,
		container: 'body'
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year, month){
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-\`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var part_re = /([\-+]\d+)([dmwy])/,
				parts = date.match(/([\-+]\d+)([dmwy])/g),
				part, dir, i;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			parts = date && date.match(this.nonpunctuation) || [];
			date = new Date();
			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(v);
					},
					yy: function(d,v){
						return d.setUTCFullYear(2000+v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&#171;</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">&#187;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};

	/* DATEPICKER VERSION
	 * =================== */
	$.fn.datepicker.version =  "1.5.0";

	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			datepickerPlugin.call($this, 'show');
		}
	);
	$(function(){
		datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});

}(window.jQuery));


;

  $(function() {
    return $('input[type="date"]').datepicker({
      clearBtn: true,
      todayHighlight: true,
      format: "yyyy-mm-dd"
    });
  });

  window.Dialog = (function() {
    function Dialog(item) {
      var dialog_selector;
      this.margin = 14;
      this.trigger_element = $(item);
      this.trigger_event = this.trigger_element.data('event') || "mouseover mouseout";
      this.trigger_width = this.trigger_element.outerWidth();
      this.trigger_height = this.trigger_element.outerHeight();
      if (this.trigger_element.next().hasClass('adb-js-dialog')) {
        dialog_selector = this.trigger_element.next();
      } else {
        dialog_selector = this.trigger_element.data('target') || this.trigger_element.attr('href');
      }
      this.dialog_element = $(dialog_selector);
      this.dialog_placement = this.dialog_element.data('placement') || "top";
      this.dialog_width = this.dialog_element.outerWidth(true);
      this.dialog_height = this.dialog_element.outerHeight(true);
      this.bindEvents();
      this.trigger_element.data('dialog', this);
    }

    Dialog.prototype.bindEvents = function() {
      this.trigger_element.on(this.trigger_event, (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this[_this.is_shown() ? "hide" : "show"]();
        };
      })(this));
      this.dialog_element.on('click', '[data-dismiss="dialog"], .adb-close', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.hide();
        };
      })(this));
      return $(window).on('resize', (function(_this) {
        return function(e) {
          return _this.calculatePlacement();
        };
      })(this));
    };

    Dialog.prototype.is_shown = function() {
      return this.dialog_element.is(':visible');
    };

    Dialog.prototype.show = function() {
      var e;
      e = $.Event('show');
      this.dialog_element.triggerHandler(e);
      this.trigger_element.triggerHandler(e);
      $('.adb-js-dialog:visible').hide();
      this.calculatePlacement();
      this.dialog_element.addClass('adb-is-active').show();
      $('[data-toggle="dialog"]').removeClass('adb-is-active');
      this.trigger_element.toggleClass('adb-is-active');
      return this.bindEscape();
    };

    Dialog.prototype.hide = function() {
      var e;
      e = $.Event('hide');
      this.dialog_element.triggerHandler(e);
      this.trigger_element.triggerHandler(e);
      this.dialog_element.removeClass('adb-is-active').hide();
      this.trigger_element.toggleClass('adb-is-active');
      return this.bindEscape();
    };

    Dialog.prototype.bindEscape = function() {
      if (this.is_shown()) {
        return $(document).on('keyup', (function(_this) {
          return function(e) {
            return e.which === 27 && _this.hide();
          };
        })(this));
      } else if (!this.is_shown()) {
        return this.dialog_element.off('keyup');
      }
    };

    Dialog.prototype.calculatePlacement = function() {
      this.trigger_left = parseInt(this.trigger_element.css("margin-left")) || parseInt(this.trigger_element.css("padding-left")) || 0;
      this.trigger_left = this.trigger_element.position().left + this.trigger_left;
      switch (this.dialog_placement) {
        case "top":
        case "top-center":
        case "top-middle":
        case "top-centered":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top - (this.dialog_element.outerHeight() + this.margin),
            'left': this.trigger_left - (this.dialog_element.outerWidth() / 2 - this.trigger_element.outerWidth() / 2)
          });
        case "top-left":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top - (this.dialog_element.outerHeight() + this.margin),
            'left': this.trigger_left
          });
        case "top-right":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top - (this.dialog_element.outerHeight() + this.margin),
            'left': this.trigger_left + (this.trigger_element.outerWidth() - this.dialog_element.outerWidth())
          });
        case "bottom":
        case "bottom-center":
        case "bottom-middle":
        case "bottom-centered":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top + this.trigger_element.outerHeight() + this.margin,
            'left': this.trigger_left - (this.dialog_element.outerWidth() / 2 - this.trigger_element.outerWidth() / 2)
          });
        case "bottom-left":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top + this.trigger_element.outerHeight() + this.margin,
            'left': this.trigger_left
          });
        case "bottom-right":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top + this.trigger_element.outerHeight() + this.margin,
            'left': this.trigger_left + (this.trigger_element.outerWidth() - this.dialog_element.outerWidth())
          });
        case "left-top":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top,
            'left': this.trigger_left - (this.dialog_element.outerWidth() + this.margin)
          });
        case "left":
        case "left-center":
        case "left-middle":
        case "left-centered":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top + (this.trigger_element.outerHeight() / 2 - this.dialog_element.outerHeight() / 2),
            'left': this.trigger_left - (this.dialog_element.outerWidth() + this.margin)
          });
        case "left-bottom":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top + (this.trigger_element.outerHeight() - this.dialog_element.outerHeight()),
            'left': this.trigger_left - (this.dialog_element.outerWidth() + this.margin)
          });
        case "right-top":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top,
            'left': this.trigger_left + (this.trigger_element.outerWidth() + this.margin)
          });
        case "right":
        case "right-center":
        case "right-middle":
        case "right-centered":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top + (this.trigger_element.outerHeight() / 2 - this.dialog_element.outerHeight() / 2),
            'left': this.trigger_left + (this.trigger_element.outerWidth() + this.margin)
          });
        case "right-bottom":
          return this.dialog_element.css({
            'top': this.trigger_element.position().top + (this.trigger_element.outerHeight() - this.dialog_element.outerHeight()),
            'left': this.trigger_left + (this.trigger_element.outerWidth() + this.margin)
          });
      }
    };

    return Dialog;

  })();

  $(function() {
    window.dialogs = [];
    return $('[data-toggle="dialog"]').each(function(index, item) {
      return window.dialogs[index] = new Dialog(item);
    });
  });

  
/*
* FormMakeup - Lite
* Version: 0.8.0
* License: MIT
* Author: Remy Martin - @rmartindotco
* Copyright (c) 2014 Remy Martin, All Rights Reserved
*/
;(function ( $, window, document, undefined ) {
  //Defaults currently not used
  var defaults = {
        theme: 'default',
        placeholderClassName: 'adb-js-dropdown-placeholder',
        selectClassName: 'adb-js-dropdown-select'
      };

  function FormMakeup( element, options ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this.init();
  }

  FormMakeup.prototype = {

    init: function() {
      //Bind events
      this.bindUIActions( );

      //Find all the elements passed in to apply makeup
      this.getElements( this.element );
    },

    bindUIActions: function( ) {
      var inst = this;
      $( inst.element ).on( 'change keyup focus blur', function( e ){
        var obj = $( e.currentTarget );

        //Let's change the label when a new option is selected
        if( e.type === 'change' || e.type === 'keyup' ){

            obj.prev( 'span' ).text( obj.find( 'option:selected' ).text( ) );

        //Let's add a class when the select is focused
        } else if( e.type === 'focus' ){

          obj.parent().addClass( 'adb-is-focused' );

        //Remove .is-focused class when select looses focus
        } else if ( e.type === 'blur') {

          obj.parent().removeClass( 'adb-is-focused' );
        }
      } );
    },
    getElements: function( el ){
      var obj = $( el ),
          inst = this;
          //Apply makeup to the element
          inst.applyMakeup( obj );
    },
    applyMakeup: function( el ){
      var obj = $( el ),
          inst = this;

      //Check if the element is indeed a select and not a multi-select and don't apply makeup if it already has
      if( obj.is( 'select' ) && !obj.attr('multiple') && !obj.data( 'makeupApplied' ) ) {

        //If select is disabled let's add a class
        if( obj.is( ':disabled' ) ) {
          obj.parent().addClass('adb-is-disabled');
        }

        //This is where the label for the selected option goes
        obj.before( '<span class="'+ inst.options.placeholderClassName +'"></span>' );

        //This is where we apply the classname for the select
        obj.addClass( inst.options.selectClassName );

        //We set the makeApplied boolean to true on the select data object
        obj.data( 'makeupApplied', true );

        //Add element to array to keep track of it
        $.makeup.elements.push( obj[0] );

        //Set the selected option to the as the label
        obj.prev( 'span' ).text( obj.find( 'option:selected' ).text( ) );
      }
    }
  };

  //Empty array to keep track of selects with makeup applied
  $.makeup = {
    elements: []
  };

  //Constructor
  $.fn.makeup = function ( options ) {
    return this.each(function () {
      if (!$(this).data("plugin_" + 'FormMakeup')) {
        $(this).data("plugin_" + 'FormMakeup', new FormMakeup( this, options ));
      }
    });
  };

  //This is a public function used if you make changes to the select via js/ajax you can force it to update the label and select the first option
  $.makeup.update = $.fn.makeup.update = function ( el ) {
    if( !el ) {
      el = $.makeup.elements;
    }
    $( el ).each( function( ) {
      var obj = $( this );
      if( obj.data( 'makeupApplied' ) && obj.is( 'select' ) && !obj.attr('multiple') ) {
          obj.prop( 'selectedIndex', 0 ).prev( 'span' ).text( obj.find( 'option:selected' ).text( ) );
      }
    } );
  };
})( window.Zepto || window.jQuery, window, document );

;

  $(function() {
    return $('.adb-js-dropdown select').makeup({
      placeholderClassName: 'adb-js-dropdown-placeholder',
      selectClassName: 'adb-js-dropdown-select'
    });
  });

  $(function() {});

  
/**
 * equalize.js
 * Author & copyright (c) 2012: Tim Svensen
 * Dual MIT & GPL license
 *
 * Page: http://tsvensen.github.com/equalize.js
 * Repo: https://github.com/tsvensen/equalize.js/
 */
(function(b){b.fn.equalize=function(a){var d=!1,g=!1,c,e;b.isPlainObject(a)?(c=a.equalize||"height",d=a.children||!1,g=a.reset||!1):c=a||"height";if(!b.isFunction(b.fn[c]))return!1;e=0<c.indexOf("eight")?"height":"width";return this.each(function(){var a=d?b(this).find(d):b(this).children(),f=0;a.each(function(){var a=b(this);g&&a.css(e,"");a=a[c]();a>f&&(f=a)});a.css(e,f+"px")})}})(jQuery);

;

  Matrix = (function() {
    function Matrix() {
      this.init_placeholders = bind(this.init_placeholders, this);
      this.contenteditable_blur = bind(this.contenteditable_blur, this);
      this.contenteditable_focus = bind(this.contenteditable_focus, this);
      this.focus_editable = bind(this.focus_editable, this);
      this.delete_matrix = bind(this.delete_matrix, this);
      this.append_row_to_table = bind(this.append_row_to_table, this);
      this.delete_row = bind(this.delete_row, this);
      this.prepend_row = bind(this.prepend_row, this);
      this.append_row = bind(this.append_row, this);
      this.clone_matrix = bind(this.clone_matrix, this);
      this.save_templates = bind(this.save_templates, this);
      console.log("constructor called");
    }

    Matrix.prototype.save_templates = function() {
      return $('[data-matrix-template]').each((function(_this) {
        return function(i, v) {
          var clone;
          clone = $(v).clone(true, true);
          clone.find('tbody tr:gt(0)').remove();
          clone.find('td:not(".controls")').find('[contenteditable], input.text, textarea').val('').text('');
          clone.find('td:not("controls") *').each(function(e) {
            return $(this).trigger('blur.adb-matrix.blur_td');
          });
          return window.matrix[$(v).data('matrix-template')] = clone;
        };
      })(this));
    };

    Matrix.prototype.clone_matrix = function() {
      var $last_matrix, $this, html, matrix_template;
      $this = $(this);
      matrix_template = $this.data('matrix');
      $last_matrix = $('[data-matrix-template="' + matrix_template + '"]').last();
      html = window.matrix[matrix_template].clone(true, true);
      console.log($this, matrix_template, $last_matrix, html);
      $last_matrix.after(html);
      return $last_matrix.find('td:not("controls") *').each(function() {
        return $(this).trigger('blur.adb-matrix.blur_td');
      });
    };

    Matrix.prototype.append_row = function(e) {
      var $this, appended, row_to_clone, row_to_insert, table;
      console.log("append_row");
      $this = $(this);
      table = $this.parents('[data-matrix-template]').find('table');
      console.log($this, table);
      row_to_clone = table.find('tbody tr').last();
      row_to_insert = row_to_clone.clone(true, true);
      row_to_insert.find('[contenteditable], input.text, textarea').text('').val('');
      appended = $this.parents('tr').after(row_to_insert);
      return appended.next('tr').find('*:not(".controls")').each(function(e) {
        return $(this).trigger('blur.adb-matrix.blur_td');
      });
    };

    Matrix.prototype.prepend_row = function(e) {
      var $this, prepended, row_to_clone, row_to_insert, table;
      console.log("prepend_row");
      $this = $(this);
      table = $this.parents('[data-matrix-template]').find('table');
      console.log($this, table);
      row_to_clone = table.find('tbody tr').last();
      row_to_insert = row_to_clone.clone(true, true);
      row_to_insert.find('[contenteditable], input.text, textarea').text('').val('');
      prepended = $this.parents('tr').before(row_to_insert);
      return prepended.prev('tr').find('*:not(".controls")').each(function(e) {
        return $(this).trigger('blur.adb-matrix.blur_td');
      });
    };

    Matrix.prototype.delete_row = function(e) {
      var $this, row_to_delete;
      console.log("delete_row");
      $this = $(this);
      console.log($this);
      row_to_delete = $this.parents('tr');
      if ($this.parents('tbody').find('tr').length === 1) {
        return alert("Sorry, this table requires at least one row.");
      } else {
        return row_to_delete.remove();
      }
    };

    Matrix.prototype.append_row_to_table = function(e) {
      var $this, row_to_clone, row_to_insert, table;
      console.log("append_row_to_table");
      $this = $(this);
      table = $this.parents('[data-matrix-template]').find('table');
      console.log($this, table);
      row_to_clone = table.find('tbody tr').last();
      row_to_insert = row_to_clone.clone(true, true);
      row_to_insert.find('[contenteditable], input.text, textarea').text('').val('');
      table.append(row_to_insert);
      return table.last('tr').find('*:not(".controls")').each(function(e) {
        return $(this).trigger('blur.adb-matrix.blur_td');
      });
    };

    Matrix.prototype.delete_matrix = function(e) {
      var $this, table;
      $this = $(this);
      table = $this.parents('[data-matrix-template]');
      console.log($this, table);
      return table.remove();
    };

    Matrix.prototype.focus_editable = function(e) {
      var $this;
      $this = $(this);
      return $(this).focus();
    };

    Matrix.prototype.contenteditable_focus = function(e) {
      var $this, ph;
      $this = $(this);
      ph = $this.data('placeholder');
      if ($this.text() === ph) {
        return $this.text('').removeClass('adb-js-matrix_field-placeholder');
      }
    };

    Matrix.prototype.contenteditable_blur = function(e) {
      var $this, ph;
      $this = $(this);
      ph = $this.data('placeholder');
      if ($this.text() === '' && (ph != null)) {
        return $this.text(ph).addClass('adb-js-matrix_field-placeholder');
      }
    };

    Matrix.prototype.init_placeholders = function() {
      return $('.adb-matrix_field [contenteditable]').each(function(index, value) {
        var $this, ph;
        $this = $(value);
        ph = $this.data('placeholder');
        if ($this.text() === '' && (ph != null)) {
          return $this.text(ph).addClass('adb-js-matrix_field-placeholder');
        }
      });
    };

    return Matrix;

  })();

  $(function() {
    window.matrix = {};
    Matrix.prototype.save_templates();
    return Matrix.prototype.init_placeholders();
  });

  $(document).on('click.adb-matrix.append_row', '.adb-matrix_field--append_row', Matrix.prototype.append_row);

  $(document).on('click.adb-matrix.prepend_row', '.adb-matrix_field--prepend_row', Matrix.prototype.prepend_row);

  $(document).on('click.adb-matrix.delete_row', '.adb-matrix_field--delete_row', Matrix.prototype.delete_row);

  $(document).on('click.adb-matrix.delete_row', '.adb-matrix_field--append_table', Matrix.prototype.append_row_to_table);

  $(document).on('click.adb-matrix.delete_row', '.adb-matrix_field--delete_matrix', Matrix.prototype.delete_matrix);

  $(document).on('click.adb-matrix.clone_matrix', '.adb-matrix_field--clone_matrix', Matrix.prototype.clone_matrix);

  $(document).on('click.adb-matrix.enter_td', '.adb-matrix_field td', Matrix.prototype.focus_editable);

  $(document).on('click.adb-matrix.focus_td', '.adb-matrix_field td', Matrix.prototype.contenteditable_focus);

  $(document).on('focus.adb-matrix.focus_td', '[contenteditable]', Matrix.prototype.contenteditable_focus);

  $(document).on('blur.adb-matrix.blur_td', '.adb-matrix_field td', Matrix.prototype.contenteditable_blur);

  $(function() {
    var sbw, scrollbar;
    scrollbar = function() {
      var width;
      document.body.style.overflow = 'hidden';
      width = document.body.clientWidth;
      document.body.style.overflow = 'scroll';
      width -= document.body.clientWidth;
      if (!width) {
        width = document.body.offsetWidth - document.body.clientWidth;
      }
      document.body.style.overflow = '';
      return width;
    };
    sbw = scrollbar();
    return $('[maxlength]').each(function(index, item) {
      var $count, $item, $parent, max;
      $item = $(item);
      $item.wrap('<div class="adb-js-maxlength"></div>');
      $parent = $item.parent();
      max = $item.attr('maxlength');
      $count = $("<span class='adb-js-maxlength-count'>" + max + "</span>");
      $item.after($count);
      if ($item.is('textarea')) {
        $parent.addClass('adb-js-maxlength-textarea');
      }
      $item.on('focus', function(event) {
        $count.addClass('adb-is-active');
        $parent.addClass('adb-is-focused');
        if ($item.is('input')) {
          return $item.css({
            'padding-right': $count.outerWidth()
          });
        } else if ($item.is('textarea')) {
          if (!(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) {
            return $item.css({
              'padding-right': sbw + "px"
            });
          }
        }
      });
      $item.on('blur', function(event) {
        $count.removeClass('adb-is-active');
        return $parent.removeClass('adb-is-focused');
      });
      return $item.on('keyup', function(event) {
        var keys, original_position;
        keys = {
          BACKSPACE: 8,
          TAB: 9,
          LEFT: 37,
          UP: 38,
          RIGHT: 39,
          DOWN: 40
        };
        switch (event.which) {
          case keys.UP:
          case keys.DOWN:
          case keys.LEFT:
          case keys.RIGHT:
          case keys.TAB:
          case keys.BACKSPACE:
            break;
          default:
            if ($(this).val().length >= max) {
              $(this).val($(this).val().substring(0, max));
              event.preventDefault();
              event.stopPropagation();
            }
        }
        original_position = $item.scrollTop();
        $item.scrollTop(original_position + 1);
        if ($item.scrollTop() === 0) {
          $count.animate({
            'right': 1
          }, 200);
          $count.data('scrolled', 'false');
        } else {
          if ($count.data('scrolled') !== "true") {
            $count.animate({
              'right': sbw + 1
            }, 200);
            $count.data('scrolled', 'true');
          }
        }
        $count.text(max - $(this).val().length);
        if ($(this).val().length >= max) {
          return $count.addClass('adb-is-error');
        } else {
          return $count.removeClass('adb-is-error');
        }
      });
    });
  });

  $(function() {
    var optionMenuOnClick;
    optionMenuOnClick = function() {
      var me, menu;
      me = $(this);
      menu = me.closest('.adb-js-context_menu');
      menu.toggleClass('adb-is-active');
      return me.toggleClass('adb-is-active');
    };
    $(document).on('click', '.adb-js-context_menu--trigger', optionMenuOnClick);
    $(document).on('mousedown', function(e) {
      var isOptions, isTargetToggle, isToggle, isToggleActive, target;
      target = $(e.target);
      isTargetToggle = target.hasClass('adb-js-context_menu--trigger');
      isToggle = isTargetToggle || target.closest('.adb-js-context_menu--trigger').length > 0;
      isOptions = target.hasClass('adb-js-context_menu--menu') || target.closest('.adb-js-context_menu--menu').length > 0;
      if (isTargetToggle) {
        isToggleActive = target.hasClass('adb-is-active');
      } else if (isToggle) {
        isToggleActive = target.closest('.adb-js-context_menu--trigger').hasClass('adb-is-active');
      } else {
        isToggleActive = false;
      }
      if ((!isToggle || !isToggleActive) && !isOptions) {
        $('.adb-js-context_menu').removeClass('adb-is-active');
        return $('.adb-js-context_menu--trigger').removeClass('adb-is-active');
      }
    });
    $(document).on('mouseup', function(e) {
      var isOptions, target;
      target = $(e.target);
      isOptions = target.hasClass('adb-js-context_menu--menu') || target.closest('.adb-js-context_menu--menu').length > 0;
      if (isOptions) {
        $('.adb-js-context_menu').removeClass('adb-is-active');
        return $('.adb-js-context_menu--trigger').removeClass('adb-is-active');
      }
    });
    $('a.adb-js-context_menu--trigger').attr("tabindex", 0);
    return $('a.adb-js-context_menu--trigger').keypress(function(e) {
      if (e.keyCode === 32 || e.keyCode === 13) {
        optionMenuOnClick.call(this);
        return false;
      }
    });
  });

  $(function() {
    return $('.adb-js-meter').each(function(i, element) {
      var $meter, percent, state;
      $meter = $(this);
      percent = $meter.data('percent') || '0';
      state = $meter.data('state');
      if (state === 'loading') {
        $meter.children().animate({
          'width': percent + '%'
        }, 1800);
      } else {
        $meter.children().css({
          'width': percent + '%'
        });
      }
      return $meter.data('percent', percent).attr('data-percent', percent);
    });
  });

  tagsField = (function() {
    function tagsField(item) {
      this.total = 0;
      this.element = item;
      this.inputs = this.element.find('.adb-js-checkbox input');
      this.categories = this.element.find('.adb-js-tags_field--category');
      this.tags = this.element.find('.adb-js-tags_field--tags');
      this.subcategory = $('<div class="adb-tag"><span class="adb-tag--text adb-js-tag--text"></span><a class="adb-tag--remove adb-js-tag--remove" href="# title="Remove"></a></div>');
      this.bindEvents();
    }

    tagsField.prototype.bindEvents = function() {
      this.categories.first().addClass('adb-is-active');
      this.categories.find('a').on('click', function(e) {
        var $category, $target, target;
        e.preventDefault();
        target = $(this).attr('href') || $(this).data('target');
        $target = $(target);
        $category = $(this).parent();
        $category.siblings().removeClass('adb-is-active');
        $category.addClass('adb-is-active');
        $target.siblings().hide();
        return $target.show();
      });
      return this.inputs.on('change', (function(_this) {
        return function(e) {
          var $target, id, value;
          $target = $(e.target);
          id = $target.attr('id');
          value = $target.val();
          if ($target.is(':checked')) {
            return _this.addToList(id, value);
          } else {
            return _this.removeFromList(id);
          }
        };
      })(this));
    };

    tagsField.prototype.bindCloseEvent = function(id) {
      return $("#tag-" + id).find('.adb-js-tag--remove').click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.removeFromList(id);
        };
      })(this));
    };

    tagsField.prototype.evalTotal = function() {
      if (this.total > 0) {
        return this.tags.show();
      } else {
        return this.tags.hide();
      }
    };

    tagsField.prototype.updateCategoryCount = function() {
      return this.element.find('.adb-js-tags_field--subcategory').each((function(_this) {
        return function(i, element) {
          var $number, count;
          count = $(element).find('input:checked').length;
          $number = $('#' + $(element).attr('id') + '-link').find('.adb-js-tags_field--badge');
          if (count > 0) {
            $number.show().text(count);
          } else {
            $number.hide();
          }
          return _this.evalTotal();
        };
      })(this));
    };

    tagsField.prototype.activePanel = function() {
      return this.element.find('.adb-js-tags_field--subcategory:visible');
    };

    tagsField.prototype.addToList = function(id, value) {
      this.newsub = this.subcategory.clone();
      this.newsub.find('.adb-js-tag--text').text(value);
      this.newsub.attr('id', "tag-" + id);
      this.tags.append(this.newsub);
      this.bindCloseEvent(id);
      this.total++;
      return this.updateCategoryCount();
    };

    tagsField.prototype.removeFromList = function(id) {
      $('#tag-' + id).remove();
      this.activePanel().find('#' + id).removeAttr('checked');
      this.activePanel().find('#' + id).parents('.adb-js-checkbox').removeClass('adb-is-active');
      this.total--;
      return this.updateCategoryCount();
    };

    return tagsField;

  })();

  $(window).on('load', function() {
    var tagsFields;
    if ($('.adb-js-tags_field').length) {
      tagsFields = [];
      return $('.adb-js-tags_field').each(function(index, item) {
        return tagsFields[index] = new tagsField($(item));
      });
    }
  });

  
/*! http://mths.be/placeholder v2.0.7 by @mathias */
;
(function(window, document, $) {

    var isInputSupported = 'placeholder' in document.createElement('input'),
        isTextareaSupported = 'placeholder' in document.createElement('textarea'),
        prototype = $.fn,
        valHooks = $.valHooks,
        hooks,
        placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function() {
            var $this = this;
            $this.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.placeholder')
                .bind({
                'focus.placeholder': clearPlaceholder,
                'blur.placeholder': setPlaceholder
            })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);
                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);
                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != document.activeElement) {
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                return $element;
            }
        };

        isInputSupported || (valHooks.input = hooks);
        isTextareaSupported || (valHooks.textarea = hooks);

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.placeholder').each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {},
        rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this,
            $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
                input == document.activeElement && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement,
        input = this,
            $input = $(input),
            $origInput = $input,
            id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({
                            'type': 'text'
                        });
                    } catch (e) {
                        $replacement = $('<input>').attr($.extend(args(this), {
                            'type': 'text'
                        }));
                    }
                    $replacement.removeAttr('name')
                        .data({
                        'placeholder-password': true,
                        'placeholder-id': id
                    })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input.data({
                        'placeholder-textinput': $replacement,
                        'placeholder-id': id
                    })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

}(this, document, jQuery));

;

  $(function() {
    return $('input, textarea').placeholder();
  });

  $(function() {
    $('.adb-js-checkbox, .adb-js-radio').each((function(_this) {
      return function(i, element) {
        if ($(element).find('input').prop('checked')) {
          return $(element).addClass('adb-is-selected');
        } else if ($(element).find('input').prop('disabled')) {
          return $(element).addClass('adb-is-disabled');
        }
      };
    })(this));
    return $(document).on('click', '.adb-js-checkbox', function(e) {
      var $input, label;
      $input = $(this).find('input');
      label = $(this).is('label');
      if (!$input.prop('disabled')) {
        if (!label) {
          if ($input.prop('checked')) {
            $input.prop('checked', false);
          } else {
            $input.prop('checked', true);
          }
        }
        if ($input.prop('checked')) {
          return $(this).addClass('adb-is-selected');
        } else {
          return $(this).removeClass('adb-is-selected');
        }
      }
    });
  });

  $(function() {
    return $(document).on('click', '.adb-js-radio', function(e) {
      var $input, name;
      $input = $(this).find('input');
      name = $input.attr('name');
      if (!$input.prop('disabled')) {
        $input.prop('checked', true);
        $('[name="' + name + '"]').closest('.adb-js-radio').removeClass('adb-is-selected');
        $(this).addClass('adb-is-selected');
      }
      return e.stopPropagation();
    });
  });

  $(function() {
    return $('.adb-js-checkboxes_field .adb-js-checkbox').on('click', function() {
      var $input, $list, $parent, $siblings;
      console.log($(this).next());
      $input = $(this).find('input');
      $list = $(this).siblings('ul');
      $parent = $(this).parent();
      if ($input.is(':checked')) {
        $list.show();
        $parent.addClass('adb-is-selected');
        if ($parent.data('check') === 'all') {
          $siblings = $parent.siblings();
          $siblings.find('input').prop('checked', true);
          return $siblings.find('.adb-js-checkbox').addClass('adb-is-selected');
        }
      } else {
        $list.find('.adb-is-selected input').removeAttr('checked');
        $list.find('.adb-is-selected').removeClass('adb-is-selected');
        $list.hide();
        $parent.removeClass('adb-is-selected');
        if ($parent.data('check') === 'all') {
          $siblings = $parent.siblings();
          $siblings.find('input').prop('checked', false);
          return $siblings.find('.adb-js-checkbox').removeClass('adb-is-selected');
        }
      }
    });
  });

  Slider = (function() {
    function Slider(element) {
      this.animateSlide = bind(this.animateSlide, this);
      this.offScreenItems = bind(this.offScreenItems, this);
      this.parent = element.parent();
      this.parent.data('slider', this);
      this.bounding_box = element;
      this.slider_container = this.bounding_box.find('.adb-slider--items');
      this.items = this.slider_container.find('.adb-slider--item');
      this.margin_adjust = $(this.items[1]).css('margin-left');
      this.prev_btn = this.parent.find('.adb-js-slider-prev');
      this.next_btn = this.parent.find('.adb-js-slider-next');
      this.offscreen_left = [];
      this.offscreen_right = [];
      this.setSlideContainerWidth();
      this.offScreenItems();
      this.bindEvents();
      if (this.parent.hasClass('modal')) {
        console.log("yup, modal");
        this.bounding_box.css({
          overflow: 'hidden'
        });
      }
    }

    Slider.prototype.bindEvents = function() {
      this.next_btn.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          if (_this.next_btn.prop('disabled') !== true) {
            return _this.nextPage();
          }
        };
      })(this));
      this.prev_btn.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          if (_this.prev_btn.prop('disabled') !== true) {
            return _this.prevPage();
          }
        };
      })(this));
      return this.parent.on('show', (function(_this) {
        return function() {
          return window.setTimeout(function() {
            _this.setSlideContainerWidth();
            return _this.offScreenItems();
          }, 200);
        };
      })(this));
    };

    Slider.prototype.setSlideContainerWidth = function() {
      var w;
      if (this.parent.hasClass('single')) {
        this.items.each((function(_this) {
          return function(index, value) {
            return $(value).width(_this.bounding_box.outerWidth());
          };
        })(this));
      }
      w = 0;
      this.items.each(function(i, v) {
        return w += $(v).outerWidth(true);
      });
      return this.slider_container.width(w);
    };

    Slider.prototype.offScreenItems = function() {
      this.offScreenLeft();
      this.offScreenRight();
      return this.adjustButtons();
    };

    Slider.prototype.adjustButtons = function() {
      if (this.offscreen_right.length >= 1) {
        this.next_btn.prop('disabled', false);
      } else {
        this.next_btn.prop('disabled', true);
      }
      if (this.offscreen_left.length >= 1) {
        return this.prev_btn.prop('disabled', false);
      } else {
        return this.prev_btn.prop('disabled', true);
      }
    };

    Slider.prototype.offScreenLeft = function() {
      this.offscreen_left.length = 0;
      return this.items.each((function(_this) {
        return function(i, v) {
          if ($(v).offset().left + $(v).outerWidth(true) + parseInt(_this.slider_container.css('margin-left')) < 0) {
            return _this.offscreen_left.push(v);
          }
        };
      })(this));
    };

    Slider.prototype.offScreenRight = function() {
      this.offscreen_right.length = 0;
      return this.items.each((function(_this) {
        return function(i, v) {
          if (v.offsetLeft + parseInt(_this.slider_container.css('margin-left')) > _this.bounding_box.get(0).offsetWidth) {
            return _this.offscreen_right.push(v);
          }
        };
      })(this));
    };

    Slider.prototype.nextPage = function() {
      var new_offset;
      new_offset = parseInt(this.slider_container.css('margin-left')) - parseInt(this.bounding_box.get(0).offsetWidth) - parseInt(this.margin_adjust);
      return this.animateSlide(new_offset);
    };

    Slider.prototype.prevPage = function() {
      var new_offset;
      new_offset = parseInt(this.slider_container.css('margin-left')) + parseInt(this.bounding_box.get(0).offsetWidth) + parseInt(this.margin_adjust);
      return this.animateSlide(new_offset);
    };

    Slider.prototype.animateSlide = function(new_offset) {
      this.next_btn.addClass('disabled');
      this.prev_btn.addClass('disabled');
      this.slider_container.stop(true, true);
      return this.slider_container.animate({
        'margin-left': new_offset
      }, 400, this.offScreenItems);
    };

    return Slider;

  })();

  $(function() {
    var sliders;
    if ($('.adb-js-slider').length) {
      sliders = {};
      return $('.adb-js-slider').each(function(i, v) {
        return sliders[i] = new Slider($(v));
      });
    }
  });

  
/* HTML5 Sortable (http://farhadi.ir/projects/html5sortable)
 * Released under the MIT license.
 */(function(a){var b,c=a();a.fn.sortable=function(d){var e=String(d);return d=a.extend({connectWith:!1},d),this.each(function(){if(/^enable|disable|destroy$/.test(e)){var f=a(this).children(a(this).data("items")).attr("draggable",e=="enable");e=="destroy"&&f.add(this).removeData("connectWith items").off("dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s");return}var g,h,f=a(this).children(d.items),i=a("<"+(/^ul|ol$/i.test(this.tagName)?"li":"div")+' class="adb-js-sortable-placeholder">');f.find(d.handle).mousedown(function(){g=!0}).mouseup(function(){g=!1}),a(this).data("items",d.items),c=c.add(i),d.connectWith&&a(d.connectWith).add(this).data("connectWith",d.connectWith),f.attr("draggable","true").on("dragstart.h5s",function(c){if(d.handle&&!g)return!1;g=!1;var e=c.originalEvent.dataTransfer;e.effectAllowed="move",e.setData("Text","dummy"),h=(b=a(this)).addClass("adb-js-sortable-dragging").index()}).on("dragend.h5s",function(){b.removeClass("adb-js-sortable-dragging").show(),c.detach(),h!=b.index()&&f.parent().trigger("sortupdate",{item:b}),b=null}).not("a[href], img").on("selectstart.h5s",function(){return this.dragDrop&&this.dragDrop(),!1}).end().add([this,i]).on("dragover.h5s dragenter.h5s drop.h5s",function(e){return!f.is(b)&&d.connectWith!==a(b).parent().data("connectWith")?!0:e.type=="drop"?(e.stopPropagation(),c.filter(":visible").after(b),!1):(e.preventDefault(),e.originalEvent.dataTransfer.dropEffect="move",f.is(this)?(d.forcePlaceholderSize&&i.height(b.outerHeight()),b.hide(),a(this)[i.index()<a(this).index()?"after":"before"](i),c.not(i).detach()):!c.is(this)&&!a(this).children(d.items).length&&(c.detach(),a(this).append(i)),!1)})})}})(jQuery);


;

  $(function() {
    $('.adb-js-sortable').sortable({
      handle: '.adb-js-sortable-reorder'
    }).on('sortupdate', function() {
      return $(this).find('.adb-js-sortable-reorder').removeClass('adb-is-hover');
    });
    $('.adb-js-sortable-reorder').on('mouseover mouseout', function(e) {
      return $(this).toggleClass('adb-is-hover');
    }).on('mousedown', function(e) {
      return $(this).parents('.adb-js-sortable').addClass('adb-is-dragging');
    }).on('mouseup mouseleave', function(e) {});
    return $(this).parents('.adb-js-sortable').removeClass('adb-is-dragging');
  });

  $(function() {
    return $(document).on('click', '[data-loading]', function(e) {
      var $icon, $trigger, icon, loading;
      $trigger = $(this);
      icon = '<span class="adb-loading"><span class="adb-loading--text">...</span></span>';
      loading = $(this).data('loading');
      $icon = $(icon);
      $trigger.attr('disabled', true).addClass('adb-is-loading');
      $trigger.append($icon);
      return setTimeout(function() {
        $trigger.attr('disabled', false).removeClass('adb-is-loading');
        return $icon.remove();
      }, 4000);
    });
  });

  $(function() {
    return $('.adb-js-sticky').each(function(index, item) {
      var parentWidth, top;
      parentWidth = $(item).parent().outerWidth();
      top = $(item).position().top - 24;
      $(item).width(parentWidth);
      return $(item).affix({
        offset: {
          top: top
        }
      });
    });
  });

  $(function() {
    $(document).on('click', '[data-toggle="filters"]', function() {
      var $target;
      $target = $(this).parents('[data-filters]').find('.adb-js-filters');
      $(this).toggleClass('adb-is-active');
      $(this).text(function(i, text) {
        if (text === "Hide Filters") {
          return "Show Filters";
        } else {
          return "Hide Filters";
        }
      });
      return $target.toggleClass('adb-is-visually_hidden');
    });
    $(document).on('click', '[data-url]', function(e) {
      var $url;
      $url = $(this).data('url');
      if ($url) {
        return window.document.location = $url;
      }
    });
    $('[data-toggle-rows] tr').each(function(i, item) {
      var $input, $row;
      $row = $(this);
      $input = $row.find('[type="checkbox"]');
      if (!$input.prop('checked')) {
        $row.addClass('adb-is-disabled');
      }
      return $input.on('change', function(e) {
        var final;
        final = $input.prop('checked');
        console.log(e, final);
        if (final === true) {
          $row.removeClass('adb-is-disabled').addClass('adb-is-enabled');
          $row.siblings('tr').removeClass('adb-is-enabled');
          return setTimeout((function() {
            $row.removeClass('adb-is-enabled');
          }), 4000);
        } else {
          return $row.removeClass('adb-is-enabled').addClass('adb-is-disabled');
        }
      });
    });
    $('th[data-sort].adb-is-active').each((function(_this) {
      return function(i, element) {
        var order;
        order = $(element).data('sort-order');
        if (!order) {
          return $(element).data('sort-order', 'descending').attr('data-sort-order', 'descending');
        }
      };
    })(this));
    return $(document).on('click', 'th[data-sort]', function(e) {
      var order, sort;
      sort = $(this).data('sort');
      order = $(this).data('sort-order');
      if ($(this).hasClass('adb-is-active')) {
        if (order === 'ascending') {
          return $(this).data('sort-order', 'descending').attr('data-sort-order', 'descending');
        } else if (order === 'descending') {
          return $(this).data('sort-order', 'ascending').attr('data-sort-order', 'ascending');
        }
      } else {
        $(this).siblings('[data-sort]').removeClass('adb-is-active');
        $(this).data('sort-order', 'descending').attr('data-sort-order', 'descending');
        return $(this).addClass('adb-is-active');
      }
    });
  });

  $(function() {
    return $('[data-toggle="tab"], [data-toggle="pill"]').on('shown', function(e) {
      var $target, target;
      target = $(e.target).attr('href') || $(e.target).data('target');
      $target = $(target);
      if ($target.find('[data-truncate="paragraph"]').length) {
        $('[data-truncate="paragraph"]').each((function(_this) {
          return function(i, element) {
            var lines;
            lines = $(element).data("lines");
            return $(element).trunk8({
              lines: lines
            });
          };
        })(this));
      }
      if ($target.find('.dropdown').length) {
        console.log($target.find('.dropdown'));
        $('.dropdown select').chosen({
          disable_search_threshold: 12
        });
      }
      if (target = '#product-pricing') {
        return $target.find('.adb-subscriptions').each(function(index, item) {
          var cell, cellHeight, j, k, len, len1, results, row, rowHeight, subscriptionRows;
          subscriptionRows = new Array();
          $(this).find('.adb-subscription').each(function(index, item) {
            return $(this).find('.adb-subscription--content_section').each(function(index, item) {
              var row;
              if (!subscriptionRows[index]) {
                row = [this];
                return subscriptionRows.push(row);
              } else {
                return subscriptionRows[index].push(this);
              }
            });
          });
          results = [];
          for (j = 0, len = subscriptionRows.length; j < len; j++) {
            row = subscriptionRows[j];
            console.log($(row));
            rowHeight = 0;
            for (k = 0, len1 = row.length; k < len1; k++) {
              cell = row[k];
              cellHeight = $(cell).outerHeight();
              if (cellHeight > rowHeight) {
                rowHeight = cellHeight;
              }
              console.log(rowHeight);
            }
            results.push($(row).height(rowHeight));
          }
          return results;
        });
      }
    });
  });

  $(function() {
    $('.adb-js-input_row').find('input').on('focus', function() {
      $(this).parents('.adb-js-input_row').addClass('adb-is-focused');
      return $(this).parents('.adb-js-input_row').removeAttr('data-error').removeClass('adb-is-error');
    }).on('blur', function() {
      return $(this).parents('.adb-js-input_row').removeClass('adb-is-focused');
    });
    $('.adb-js-input_row').find('[disabled]').each(function(i, element) {
      return $(this).parents('.adb-js-input_row').addClass('adb-is-disabled');
    });
    return $('[data-validate]').each(function(i, element) {
      var $icon;
      $(this).wrap('<div></div>');
      $(this).parent().addClass('adb-js-text__validated');
      $(this).after('<span class="adb-js-text__validated--status"></span>');
      $icon = $(this).next('.adb-js-text__validated--status');
      console.log($icon);
      $icon.data({
        html: true,
        toggle: 'tooltip',
        title: $(this).data('error')
      });
      return $icon.tooltip('show');
    });
  });

  
(function() {
  /**
   * @constructor
   */
  var ToggleSwitch = function(eCheckBox, sOnText, sOffText) 
  {
    /**
     * @private
     */
    this.eCheckBox = eCheckBox;

    /**
     * @private
     */
    this.eTrack = document.createElement('div');
    this.eTrack.className = 'ts-track ' + this.eCheckBox.className;
    this.eTrack.innerHTML = '<div class="ts-switch-container">' + 
                  '<span class="ts-on-text">' + sOnText + '</span>' + 
                  '<span class="ts-switch"></span>' + 
                  '<span class="ts-off-text">' + sOffText + '</span>' + 
                '</div>';

    /**
     * @private
     */
    this.eSwitchContainer = this.eTrack.firstChild;

    /**
     * @private
     */
    this.eOnText = this.eSwitchContainer.firstChild;

    /**
     * @private
     */
    this.eSwitch = this.eOnText.nextSibling;

    /**
     * @private
     */
    this.eOffText = this.eSwitch.previousSibling;

    this.eTrack.addEventListener('click', this._click.bind(this), false);

    // Events for mobile devices
    this.eSwitch.addEventListener('touchend', this._touchEnd.bind(this), false);
    this.eSwitch.addEventListener('touchstart', this._touchStart.bind(this), false);
    this.eSwitch.addEventListener('touchmove', this._touchMove.bind(this), false);

    // Events for dragging on desktop devices.
    document.addEventListener('mousemove', this._mouseMove.bind(this), false);
    this.eSwitch.addEventListener('mousedown', this._mouseDown.bind(this), false);
    document.addEventListener('mouseup', this._mouseUp.bind(this), false);

    this.eCheckBox.parentNode.replaceChild(this.eTrack, this.eCheckBox);
    this.eTrack.appendChild(this.eCheckBox);

    if (this.eCheckBox.checked)
    {
      this._disableTransition();
      this._switch(true, true);
    }
  };

  ToggleSwitch.prototype = 
  {
    /**
     * @private 
     */
    _isOn: false,

    /**
     * @private 
     */
    _isMouseDown: false,

    /**
     * @private
     */
    _isDragging: false,

    // -- Public Methods --

    /**
     * Returns TRUE if the switch is on, false otherwise.
     * @return {boolean}
     */
    isOn: function()
    {
      return this._isOn;
    },

    /**
     * Switches the switch on.
     */
    on: function()
    {
      this._switch(true);
    },

    /**
     * Switches the switch off.
     */
    off: function()
    {
      this._switch(false);
    },

    /**
     * Toggle the switch to the opposite state.
     */
    toggle: function()
    {
      (this._isOn) ? this.off() : this.on();
    },

    /**
     * Adds a listener to listen to changes
     */
    addListener: function(fCallback)
    {
      this.fCallback = fCallback;
    },

    // -- Private Methods --

    /**
     * @private
     */
    _click: function(e)
    {
      if (!this._isDragging)
      {
        this.toggle();  
      }
      this._isMouseDown = false;
      this._isDragging = false;
    },

    /**
     * @private
     */
    _mouseDown: function()
    {
      this._disableTransition();
      this._isMouseDown = true;
    },

    /**
     * @private
     */
    _mouseMove: function(e)
    {
      if (this._isMouseDown)
      {
        this._isDragging = true;
        this._pointerMove(e, e.pageX);
      }
    },

    /**
     * @private
     */
    _mouseUp: function(e)
    {
      if (this._isDragging)
      {
        this._snapSwitch();
      }
    },

    /**
     * @private
     */
    _touchStart: function(e)
    {
      this._disableTransition();
      // Prevent scrolling of the window.
      e.preventDefault(); 
    },

    /**
     * @private
     */
    _touchMove: function(e)
    {
      if (e.touches.length == 1)
      {
        this._pointerMove(e, e.touches[0].pageX, true);
      }
    },

    /**
     * @private
     */
    _touchEnd: function(e)
    {
      this._snapSwitch(); 
    },

    /**
     * Called for both desktop and mobile pointing.
     * @private
     */
    _pointerMove: function(e, nCoordX, bPreventDefault)
    {
      var nPos = this._convertCoordToMarginLeft(nCoordX);
      var nBackgroundPos = this._convertCoordToBackgroundPosition(nCoordX);

      var maxMarginLeft = this._getMaxContainerMarginLeft();
      var minMarginLeft = this._getMinContainerMarginLeft();

      if (nPos <= minMarginLeft)
      {
        nPos = minMarginLeft;
        nBackgroundPos = this._getMinTrackBackgroundX();
      }
      else if (nPos >= maxMarginLeft)
      {
        nPos = maxMarginLeft;
        nBackgroundPos = 0;
      }

      this.eSwitchContainer.style.marginLeft = nPos + "px";
      this.eTrack.style.backgroundPosition = nBackgroundPos + "px";

      if (bPreventDefault) 
      {
        e.preventDefault();
      }
    },

    /**
     * @private
     */
    _disableTransition: function()
    {
      this._addClass(this.eTrack, 'no-transition');
    },

    /**
     * @private
     */
    _enableTransition: function()
    {
      this._removeClass(this.eTrack, 'no-transition');
    },

    /**
     * @private
     */
    _convertCoordToMarginLeft: function(nCoordX)
    {
      var left = this._getPosition(this.eTrack).left;
      return nCoordX - left - (-this._getMinContainerMarginLeft()) - (this.eSwitch.offsetWidth / 2);
    },

    /**
     * @private
     */
    _convertCoordToBackgroundPosition: function(nCoordX)
    {
      var left = this._getPosition(this.eTrack).left;
      return nCoordX - left - (-this._getMinTrackBackgroundX()) - (this.eSwitch.offsetWidth / 2);
    },

    /**
     * @private
     */
    _getOccupiedSpaceBeforeSwitch: function()
    {
      return this.eOnText.offsetWidth +
        (this._getPosition(this.eSwitch).left - this._getPosition(this.eOnText).left - this.eOnText.offsetWidth);
    },

    /**
     * @private
     */
    _getMaxContainerMarginLeft: function()
    {
      return this.eTrack.offsetWidth - this.eSwitch.offsetWidth - this._getOccupiedSpaceBeforeSwitch() - 1;
    },

    /**
     * @private
     */
    _getMinContainerMarginLeft: function() 
    {
      return -this._getOccupiedSpaceBeforeSwitch() - 1;
    },

    /**
     * @private
     */
    _getMinTrackBackgroundX: function()
    {
      return -this.eTrack.offsetWidth + this.eSwitch.offsetWidth - 1;
    },

    /**
     * @private
     */
    _snapSwitch: function()
    {
      var pos = parseInt(this.eSwitchContainer.style.marginLeft, 0);
      var max = this._getMaxContainerMarginLeft();
      var min = this._getMinContainerMarginLeft();

      (pos > (max + min) / 2) ? this.on() : this.off();
    },

    /**
     * @private
     */
    _switch: function(bEnabled, bDisableTransition)
    {
      this._isOn = bEnabled;
      if (!bDisableTransition)
      {
        this._enableTransition(); 
      }

      var nMargin = (bEnabled) ? this._getMaxContainerMarginLeft() : this._getMinContainerMarginLeft();
      var nBackgroundPos = (bEnabled) ? 0 : this._getMinTrackBackgroundX();
      this.eSwitchContainer.style.marginLeft = nMargin + "px";
      this.eTrack.style.backgroundPosition = nBackgroundPos + "px 0px";
      (bEnabled) ? this.eTrack.className += " active" : this.eTrack.className = this.eTrack.className.replace( /(?:^|\s)active(?!\S)/g , '' );
      (bEnabled) ? this.eCheckBox.setAttribute('checked', 'checked') : this.eCheckBox.removeAttribute('checked');
      if (this.fCallback) this.fCallback(bEnabled);
    },

    // -- UTILITY METHODS --

    /**
     * @private
     */
    _getPosition: function(eEl)
    {
      var curleft = curtop = 0;
      if (eEl.offsetParent) 
      {
        do 
        {
          curleft += eEl.offsetLeft;
          curtop += eEl.offsetTop;
        } while (eEl = eEl.offsetParent);
      }
      return {left: curleft, top: curtop};
    },

    /**
     * @private
     */
    _removeClass: function(eEl, sClass)
    {
      var sClassName = (eEl.className) || '';
      eEl.className = sClassName.replace(new RegExp('(\\b' + sClass + '\\b)'), '').trim();
    },

    /**
     * @private
     */
    _addClass: function(eEl, sClass)
    {
      this._removeClass(eEl, sClass);
      eEl.className += ' ' + sClass;
    }
  };

  // Google Closure Externs.
  window['ToggleSwitch'] = ToggleSwitch;
  window['ToggleSwitch'].prototype['on'] = ToggleSwitch.prototype.on;
  window['ToggleSwitch'].prototype['isOn'] = ToggleSwitch.prototype.isOn;
  window['ToggleSwitch'].prototype['off'] = ToggleSwitch.prototype.off;
  window['ToggleSwitch'].prototype['toggle'] = ToggleSwitch.prototype.toggle;
})();

;

  $(function() {
    var switches;
    switches = $('.switch');
    return $(switches).each(function(index, item) {
      var $item;
      $item = $(item);
      return new ToggleSwitch(item, $item.attr('data-active-label'), $item.attr('data-inactive-label'));
    });
  });

  $(function() {
    return $(document).find('[data-toggle~="tooltip"], .has_tooltip').tooltip({
      html: true,
      container: 'body'
    });
  });

  
/**!
 * trunk8 v1.3.1
 * https://github.com/rviscomi/trunk8
 * 
 * Copyright 2012 Rick Viscomi
 * Released under the MIT License.
 * 
 * Date: September 26, 2012
 */

(function ($) {
	var methods,
		utils,
		SIDES = {
			/* cen...ter */
			center: 'center',
			/* ...left */
			left: 'left',
			/* right... */
			right: 'right'
		},
		WIDTH = {
			auto: 'auto'
		};
	
	function trunk8(element) {
		this.$element = $(element);
		this.original_text = this.$element.html();
		this.settings = $.extend({}, $.fn.trunk8.defaults);
	}
	
	trunk8.prototype.updateSettings = function (options) {
		this.settings = $.extend(this.settings, options);
	};

	function stripHTML(html) {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent||tmp.innerText;
	}

	function getHtmlArr(str) {
		/* Builds an array of strings and designated */
		/* HTML tags around them. */
		if (stripHTML(str) === str) {
			return str.split(/\s/g);
		}
		var allResults = [],
			reg = /<([a-z]+)([^<]*)(?:>(.*?(?!<\1>)*)<\/\1>|\s+\/>)(['.?!,]*)|((?:[^<>\s])+['.?!,]*\w?|<br\s?\/?>)/ig,
			outArr = reg.exec(str),
			lastI,
			ind;
		while (outArr && lastI !== reg.lastIndex) {
			lastI = reg.lastIndex;
			if (outArr[5]) {
				allResults.push(outArr[5]);
			} else if (outArr[1]) {
				allResults.push({
					tag: outArr[1],
					attribs: outArr[2],
					content: outArr[3],
					after: outArr[4]
				});
			}
			outArr = reg.exec(str);
		}
		for (ind = 0; ind < allResults.length; ind++) {
			if (typeof allResults[ind] !== 'string' &&
					allResults[ind].content) {
				allResults[ind].content = getHtmlArr(allResults[ind].content);
			}
		}
		return allResults;
	}

	function rebuildHtmlFromBite(bite, htmlObject, fill) {
		// Take the processed bite after binary-search
		// truncated and re-build the original HTML
		// tags around the processed string.
		bite = bite.replace(fill, '');

		var biteHelper = function(contentArr, tagInfo) {
				var retStr = '',
					content,
					biteContent,
					biteLength,
					nextWord,
					i;
				for (i = 0; i < contentArr.length; i++) {
					content = contentArr[i];
					biteLength = $.trim(bite).split(' ').length;
					if ($.trim(bite).length) {
						if (typeof content === 'string') {
							if (!/<br\s*\/?>/.test(content)) {
								if (biteLength === 1 && $.trim(bite).length <= content.length) {
									content = bite;
									// We want the fill to go inside of the last HTML
									// element if the element is a container.
									if (tagInfo === 'p' || tagInfo === 'div') {
										content += fill;
									}
									bite = '';
								} else {
									bite = bite.replace(content, '');
								}
							}
							retStr += $.trim(content) + ((i === contentArr.length-1 || biteLength <= 1) ? '' : ' ');
						} else {
							biteContent = biteHelper(content.content, content.tag);
							if (content.after) bite = bite.replace(content.after, '');
							if (biteContent) {
								if (!content.after) content.after = ' ';
								retStr += '<'+content.tag+content.attribs+'>'+biteContent+'</'+content.tag+'>' + content.after;
							}
						}
					}
				}
				return retStr;
			},
			htmlResults = biteHelper(htmlObject);

		// Add fill if doesn't exist. This will place it outside the HTML elements.
		if (htmlResults.slice(htmlResults.length - fill.length) === fill) {
			htmlResults += fill;
		}

		return htmlResults;
	}

	function truncate() {
		var data = this.data('trunk8'),
			settings = data.settings,
			width = settings.width,
			side = settings.side,
			fill = settings.fill,
			parseHTML = settings.parseHTML,
			line_height = utils.getLineHeight(this) * settings.lines,
			str = data.original_text,
			length = str.length,
			max_bite = '',
			lower, upper,
			bite_size,
			bite,
			text,
			htmlObject;
		
		/* Reset the field to the original string. */
		this.html(str);
		text = this.text();

		/* If string has HTML and parse HTML is set, build */
		/* the data struct to house the tags */
		if (parseHTML && stripHTML(str) !== str) {
			htmlObject = getHtmlArr(str);
			str = stripHTML(str);
			length = str.length;
		}

		if (width === WIDTH.auto) {
			/* Assuming there is no "overflow: hidden". */
			if (this.height() <= line_height) {
				/* Text is already at the optimal trunkage. */
				return;
			}

			/* Binary search technique for finding the optimal trunkage. */
			/* Find the maximum bite without overflowing. */
			lower = 0;
			upper = length - 1;

			while (lower <= upper) {
				bite_size = lower + ((upper - lower) >> 1);
				
				bite = utils.eatStr(str, side, length - bite_size, fill);

				if (parseHTML && htmlObject) {
					bite = rebuildHtmlFromBite(bite, htmlObject, fill);
				}
				
				this.html(bite);

				/* Check for overflow. */
				if (this.height() > line_height) {
					upper = bite_size - 1;
				}
				else {
					lower = bite_size + 1;

					/* Save the bigger bite. */
					max_bite = (max_bite.length > bite.length) ? max_bite : bite;
				}
			}

			/* Reset the content to eliminate possible existing scroll bars. */
			this.html('');
			
			/* Display the biggest bite. */
			this.html(max_bite);
			
			if (settings.tooltip) {
				this.attr('title', text);
			}
		}
		else if (!isNaN(width)) {
			bite_size = length - width;

			bite = utils.eatStr(str, side, bite_size, fill);

			this.html(bite);
			
			if (settings.tooltip) {
				this.attr('title', str);
			}
		}
		else {
			$.error('Invalid width "' + width + '".');
		}
	}

	methods = {
		init: function (options) {
			return this.each(function () {
				var $this = $(this),
					data = $this.data('trunk8');
				
				if (!data) {
					$this.data('trunk8', (data = new trunk8(this)));
				}
				
				data.updateSettings(options);
				
				truncate.call($this);
			});
		},

		/** Updates the text value of the elements while maintaining truncation. */
		update: function (new_string) {
			return this.each(function () {
				var $this = $(this);
				
				/* Update text. */
				if (new_string) {
					$this.data('trunk8').original_text = new_string;
				}

				/* Truncate accordingly. */
				truncate.call($this);
			});
		},
		
		revert: function () {
			return this.each(function () {
				/* Get original text. */
				var text = $(this).data('trunk8').original_text;
				
				/* Revert element to original text. */
				$(this).html(text);
			});
		},

		/** Returns this instance's settings object. NOT CHAINABLE. */
		getSettings: function () {
			return $(this.get(0)).data('trunk8').settings;
		}
	};

	utils = {
		/** Replaces [bite_size] [side]-most chars in [str] with [fill]. */
		eatStr: function (str, side, bite_size, fill) {
			var length = str.length,
				key = utils.eatStr.generateKey.apply(null, arguments),
				half_length,
				half_bite_size;

			/* If the result is already in the cache, return it. */
			if (utils.eatStr.cache[key]) {
				return utils.eatStr.cache[key];
			}
			
			/* Common error handling. */
			if ((typeof str !== 'string') || (length === 0)) {
				$.error('Invalid source string "' + str + '".');
			}
			if ((bite_size < 0) || (bite_size > length)) {
				$.error('Invalid bite size "' + bite_size + '".');
			}
			else if (bite_size === 0) {
				/* No bite should show no truncation. */
				return str;
			}
			if (typeof (fill + '') !== 'string') {
				$.error('Fill unable to be converted to a string.');
			}

			/* Compute the result, store it in the cache, and return it. */
			switch (side) {
				case SIDES.right:
					/* str... */
					return utils.eatStr.cache[key] =
							$.trim(str.substr(0, length - bite_size)) + fill;
					
				case SIDES.left:
					/* ...str */
					return utils.eatStr.cache[key] =
							fill + $.trim(str.substr(bite_size));
					
				case SIDES.center:
					/* Bit-shift to the right by one === Math.floor(x / 2) */
					half_length = length >> 1; // halve the length
					half_bite_size = bite_size >> 1; // halve the bite_size

					/* st...r */
					return utils.eatStr.cache[key] =
							$.trim(utils.eatStr(str.substr(0, length - half_length), SIDES.right, bite_size - half_bite_size, '')) +
							fill +
							$.trim(utils.eatStr(str.substr(length - half_length), SIDES.left, half_bite_size, ''));
					
				default:
					$.error('Invalid side "' + side + '".');
			}
		},
		
		getLineHeight: function (elem) {
				var floats = $(elem).css('float');
				if (floats !== 'none') {
					$(elem).css('float', 'none');
				}
				var pos = $(elem).css('position');
				if (pos === 'absolute') {
					$(elem).css('position', 'static');
				}
	
				var html = $(elem).html(),
				wrapper_id = 'line-height-test',
				line_height;
	
				/* Set the content to a small single character and wrap. */
				$(elem).html('i').wrap('<div id="' + wrapper_id + '" />');
	
				/* Calculate the line height by measuring the wrapper.*/
				line_height = $('#' + wrapper_id).innerHeight();
	
				/* Remove the wrapper and reset the content. */
				$(elem).html(html).css({ 'float': floats, 'position': pos }).unwrap();
	
				return line_height;
			}
	};

	utils.eatStr.cache = {};
	utils.eatStr.generateKey = function () {
		return Array.prototype.join.call(arguments, '');
	};
	
	$.fn.trunk8 = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' + method + ' does not exist on jQuery.trunk8');
		}
	};
	
	/* Default trunk8 settings. */
	$.fn.trunk8.defaults = {
		fill: '&hellip;',
		lines: 1,
		side: SIDES.right,
		tooltip: true,
		width: WIDTH.auto,
		parseHTML: false
	};
})(jQuery);


;

  $(function() {
    return $('[data-truncate="paragraph"]').each((function(_this) {
      return function(i, element) {
        return $(element).trunk8({
          lines: $(element).data("lines")
        });
      };
    })(this));
  });

  Tutorial = (function() {
    function Tutorial(elements, show_on_load) {
      this.elements = elements;
      this.show_on_load = show_on_load;
      this.steps = [];
      this.elements.each((function(_this) {
        return function(index, item) {
          return _this.steps[index] = new Dialog(item);
        };
      })(this));
      this.currentSlide = 0;
      this.bindEvents();
      this.positionSteps();
      if (this.show_on_load) {
        this.showFirst();
      }
    }

    Tutorial.prototype.orderSteps = function() {
      return this.steps.sort(function(a, b) {
        return a.order - b.order;
      });
    };

    Tutorial.prototype.bindEvents = function() {
      $(this.steps).each((function(_this) {
        return function(index, step) {
          step.dialog_element.find('.adb-pager--button__next').on('click', function(e) {
            e.preventDefault();
            return _this.nextSlide();
          });
          return step.dialog_element.find('.adb-pager--button__prev').on('click', function(e) {
            e.preventDefault();
            return _this.prevSlide();
          });
        };
      })(this));
      return $('[data-toggle="guided"]').on('show', (function(_this) {
        return function(e) {
          _this.currentSlide = parseInt($(e.delegateTarget).data('order')) - 1;
          return _this.setActiveIndicator();
        };
      })(this));
    };

    Tutorial.prototype.nextSlide = function() {
      if (this.currentSlide !== this.steps.length - 1) {
        return this.showSlide(this.steps[this.currentSlide + 1]);
      }
    };

    Tutorial.prototype.prevSlide = function() {
      if (this.currentSlide !== 0) {
        return this.showSlide(this.steps[this.currentSlide - 1]);
      }
    };

    Tutorial.prototype.showSlide = function(slide) {
      this.hideCurrentSlide();
      slide.calculatePlacement();
      return slide.show();
    };

    Tutorial.prototype.hideSlide = function(slide) {
      return slide.hide();
    };

    Tutorial.prototype.hideCurrentSlide = function() {
      return this.hideSlide(this.steps[this.currentSlide]);
    };

    Tutorial.prototype.showFirst = function() {
      return this.steps[0].show();
    };

    Tutorial.prototype.setActiveIndicator = function() {
      return $('.adb-pager--caption').text((this.currentSlide + 1) + " of " + this.steps.length);
    };

    Tutorial.prototype.positionSteps = function() {
      return $(this.steps).each((function(_this) {
        return function(index, step) {
          step.dialog_height = step.dialog_element.outerHeight();
          return step.calculatePlacement();
        };
      })(this));
    };

    return Tutorial;

  })();

  $(function() {
    var $firstSlide, groups, key, value;
    if ($('[data-toggle="guided"]').length) {
      groups = {};
      $('[data-toggle="guided"]').each(function() {
        var group;
        group = $(this).attr('data-group');
        if (group != null) {
          return groups[group] = $('[data-toggle="guided"][data-group="' + group + '"]');
        } else {
          return groups["loose"] = $('[data-toggle="guided"]:not([data-group])');
        }
      });
      window.guided = (function() {
        var results;
        results = [];
        for (key in groups) {
          value = groups[key];
          results.push(new Tutorial(value, false));
        }
        return results;
      })();
    }
    if ($('[data-toggle="guided"][data-event="load"]').length) {
      $firstSlide = $('[data-toggle="guided"][data-event="load"]').first().data('dialog');
      return window.guided[0].showSlide($firstSlide);
    }
  });

  $(function() {
    return $('.adb-upload').find('[type="file"]').on('change', function(e) {
      var $clear, $select, $text, $upload, value;
      value = $(this).val();
      value = value.substring(value.lastIndexOf('\\') + 1);
      $upload = $(this).closest('.adb-upload');
      $select = $(this).closest('.adb-upload--select');
      $clear = $('<a/>').addClass('adb-upload--clear');
      $text = $upload.find('[type="text"]');
      $text.val(value);
      $select.before($clear);
      $text.css({
        'padding-right': $select.outerWidth() + $clear.innerWidth() + 'px'
      });
      $clear.css({
        right: $select.outerWidth()
      });
      return $clear.on('click', function(e) {
        console.log(e);
        $text.val('');
        $select.find('[type="file"]').val('');
        return $(this).remove();
      });
    });
  });

  $('.upload_field').find('.spinner-large:not(".preserve")').hide();

  $(window).on('dragover', function(e) {
    return e.preventDefault();
  });

  $(window).on('drop', function(e) {
    return e.preventDefault();
  });

  $('.upload_field').on('click', 'button.remove', function(e) {
    var $target_parent, $upload_field;
    e.preventDefault();
    $target_parent = $(e.target).parents('.file_uploaded');
    $upload_field = $target_parent.siblings('.upload_field');
    $target_parent.remove();
    return $upload_field.removeClass('hidden');
  });

  $(document).on('dragover', function(e) {
    $('.upload_field').addClass('dragging');
    return window.clearTimeout(window.dragTimer);
  });

  $('.upload_field').on('dragenter', function(e) {
    return $(e.target).parents('.upload_field').addClass('over');
  });

  $('.upload_field').on('dragleave', function(e) {
    return $(e.target).parents('.upload_field').removeClass('over');
  });

  $('.upload_field').on('drop', function(e) {
    var $target;
    e.preventDefault();
    $target = $(e.target);
    if ($target.get(0).nodeName === "LABEL") {
      $target = $(e.target);
    } else {
      $target = $(e.target).parents('label');
    }
    $target.find('.text').addClass('hidden');
    $target.find('.spinner-large').show();
    setTimeout(function() {
      $target.find('.spinner-large').hide();
      $target.find('.text').removeClass('hidden');
      return $target.before($('<div class="upload_field file_uploaded dragging"> <div class="info"> <span class="file"> <i class="icon icon-file"></i> file-name-here.jpg</span> <button class="delete small square"><i class="icon icon-trash"></i></button> </div> <div class="image framed"> <img src="/images/content/product-screenshot.png"> </div> </div>'));
    }, 2000);
    return $('.upload_field').removeClass('dragging');
  });

  $('body').on('dragleave', function(e) {
    window.clearTimeout(window.dragTimer);
    return window.dragTimer = window.setTimeout(function(ev) {
      return $('.upload_field').removeClass('dragging');
    }, 85);
  });

  $(function() {
    if (localStorage.getItem('controls') === 'hidden') {
      $('.adb-editor_enabler').show();
    } else {
      $('.adb-editor_controls').show();
      $('.adb-editor_enabler').hide();
    }
    $('.calculate-columns input').on('change', function() {
      var $form, value, width;
      value = $(this).val();
      width = value * 48 + (value - 1) * 24;
      $form = $(this).parents('.calculate-columns');
      if (value < 2) {
        $form.find('.unit').text('column');
      } else {
        $form.find('.unit').text('columns');
      }
      return $form.find('.number').text(width + 'px');
    });
    $('.adb-editor_controls--close').on('click', function() {
      $(this).parents('.adb-editor_controls').hide();
      localStorage.setItem('controls', 'hidden');
      return $('.adb-editor_enabler').show();
    });
    $('.adb-editor_enabler').on('click', function() {
      $('.adb-editor_controls').show();
      localStorage.setItem('controls', 'shown');
      return $('.adb-editor_enabler').hide();
    });
    $('.adb-container_expand').on('click', function(e) {
      var target;
      target = $(this).data('target');
      e.preventDefault();
      $(target).hide().removeClass('adb-is-hidden').fadeIn();
      return $(this).blur();
    });
    $('.adb-js-tile').on('mouseover mouseout', function(e) {
      $(this).find('.adb-js-tile-basic').toggle();
      return $(this).find('.adb-js-tile-extended').toggle();
    }).on('mouseover', function() {
      return $(this).find('.adb-js-tile-extended').trunk8({
        lines: $(this).data('lines')
      });
    });
    return $('.adb-js-placeholder').each((function(_this) {
      return function(i, element) {
        var $placeholder, $targets;
        $placeholder = $(element);
        $targets = $placeholder.siblings('.adb-js-placeholder-target');
        return window.setTimeout((function() {
          $placeholder.fadeOut(1000, function() {
            return $targets.each((function(_this) {
              return function(i, element) {
                var $target;
                $target = $(element);
                return $target.toggleClass('adb-is-hidden');
              };
            })(this));
          });
        }), 5000);
      };
    })(this));
  });

  $(function() {
    return $(document).on('click', '[data-toggle="panel"]', function() {
      var $target, $trigger, active, target, type;
      $trigger = $(this);
      target = $trigger.val() || $trigger.attr('href') || $trigger.data('target') || $trigger.next();
      $target = $(target);
      active = $trigger.data('active');
      type = $trigger.data('type') || $trigger.attr('type');
      console.log(target);
      if (type === 'radio' || $trigger.is('select')) {
        $target.siblings('.adb-js-panel-target').removeClass('adb-is-active').hide();
        $target.addClass('adb-is-active').show();
        if (active) {
          $trigger.addClass('adb-is-active');
          return $trigger.siblings().removeClass('adb-is-active');
        }
      } else {
        $target.toggleClass('adb-is-active').toggle();
        if (active) {
          return $trigger.toggleClass('adb-is-active');
        }
      }
    });
  });

}).call(this);
