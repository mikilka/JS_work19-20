/** * Created by Сергей on 08.11.2016. */$(function() {    $('.banners_header').click(function() {        $('.plus_minus').html('+');        if($(this).hasClass('banners_header_active')) {            $(this).removeClass('banners_header_active');            $(this).next().slideUp();        } else {            $('.updates__banners__text').slideUp();            $('.banners_header').removeClass('banners_header_active');            $(this).addClass('banners_header_active');            $(this).children('.plus_minus').html('-');            $(this).next().slideDown();        }    });});/** * Created by Сергей on 08.11.2016. */(function($) {    $(function() {        $('.jcarousel').jcarousel();        $('.jcarousel-control-prev')            .on('jcarouselcontrol:active', function() {                $(this).removeClass('inactive');            })            .on('jcarouselcontrol:inactive', function() {                $(this).addClass('inactive');            })            .jcarouselControl({                target: '-=1'            });        $('.jcarousel-control-next')            .on('jcarouselcontrol:active', function() {                $(this).removeClass('inactive');            })            .on('jcarouselcontrol:inactive', function() {                $(this).addClass('inactive');            })            .jcarouselControl({                target: '+=1'            });        $('.jcarousel-pagination')            .on('jcarouselpagination:active', 'a', function() {                $(this).addClass('active');            })            .on('jcarouselpagination:inactive', 'a', function() {                $(this).removeClass('active');            })            .jcarouselPagination();    });})(jQuery);/*! jCarousel - v0.3.4 - 2015-09-23
* http://sorgalla.com/jcarousel/
* Copyright (c) 2006-2015 Jan Sorgalla; Licensed MIT */
(function($) {
    'use strict';

    var jCarousel = $.jCarousel = {};

    jCarousel.version = '0.3.4';

    var rRelativeTarget = /^([+\-]=)?(.+)$/;

    jCarousel.parseTarget = function(target) {
        var relative = false,
            parts    = typeof target !== 'object' ?
                           rRelativeTarget.exec(target) :
                           null;

        if (parts) {
            target = parseInt(parts[2], 10) || 0;

            if (parts[1]) {
                relative = true;
                if (parts[1] === '-=') {
                    target *= -1;
                }
            }
        } else if (typeof target !== 'object') {
            target = parseInt(target, 10) || 0;
        }

        return {
            target: target,
            relative: relative
        };
    };

    jCarousel.detectCarousel = function(element) {
        var carousel;

        while (element.length > 0) {
            carousel = element.filter('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            carousel = element.find('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            element = element.parent();
        }

        return null;
    };

    jCarousel.base = function(pluginName) {
        return {
            version:  jCarousel.version,
            _options:  {},
            _element:  null,
            _carousel: null,
            _init:     $.noop,
            _create:   $.noop,
            _destroy:  $.noop,
            _reload:   $.noop,
            create: function() {
                this._element
                    .attr('data-' + pluginName.toLowerCase(), true)
                    .data(pluginName, this);

                if (false === this._trigger('create')) {
                    return this;
                }

                this._create();

                this._trigger('createend');

                return this;
            },
            destroy: function() {
                if (false === this._trigger('destroy')) {
                    return this;
                }

                this._destroy();

                this._trigger('destroyend');

                this._element
                    .removeData(pluginName)
                    .removeAttr('data-' + pluginName.toLowerCase());

                return this;
            },
            reload: function(options) {
                if (false === this._trigger('reload')) {
                    return this;
                }

                if (options) {
                    this.options(options);
                }

                this._reload();

                this._trigger('reloadend');

                return this;
            },
            element: function() {
                return this._element;
            },
            options: function(key, value) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options);
                }

                if (typeof key === 'string') {
                    if (typeof value === 'undefined') {
                        return typeof this._options[key] === 'undefined' ?
                                null :
                                this._options[key];
                    }

                    this._options[key] = value;
                } else {
                    this._options = $.extend({}, this._options, key);
                }

                return this;
            },
            carousel: function() {
                if (!this._carousel) {
                    this._carousel = jCarousel.detectCarousel(this.options('carousel') || this._element);

                    if (!this._carousel) {
                        $.error('Could not detect carousel for plugin "' + pluginName + '"');
                    }
                }

                return this._carousel;
            },
            _trigger: function(type, element, data) {
                var event,
                    defaultPrevented = false;

                data = [this].concat(data || []);

                (element || this._element).each(function() {
                    event = $.Event((pluginName + ':' + type).toLowerCase());

                    $(this).trigger(event, data);

                    if (event.isDefaultPrevented()) {
                        defaultPrevented = true;
                    }
                });

                return !defaultPrevented;
            }
        };
    };

    jCarousel.plugin = function(pluginName, pluginPrototype) {
        var Plugin = $[pluginName] = function(element, options) {
            this._element = $(element);
            this.options(options);

            this._init();
            this.create();
        };

        Plugin.fn = Plugin.prototype = $.extend(
            {},
            jCarousel.base(pluginName),
            pluginPrototype
        );

        $.fn[pluginName] = function(options) {
            var args        = Array.prototype.slice.call(arguments, 1),
                returnValue = this;

            if (typeof options === 'string') {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (!instance) {
                        return $.error(
                            'Cannot call methods on ' + pluginName + ' prior to initialization; ' +
                            'attempted to call method "' + options + '"'
                        );
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        return $.error(
                            'No such method "' + options + '" for ' + pluginName + ' instance'
                        );
                    }

                    var methodValue = instance[options].apply(instance, args);

                    if (methodValue !== instance && typeof methodValue !== 'undefined') {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (instance instanceof Plugin) {
                        instance.reload(options);
                    } else {
                        new Plugin(this, options);
                    }
                });
            }

            return returnValue;
        };

        return Plugin;
    };
}(jQuery));

(function($, window) {
    'use strict';

    var toFloat = function(val) {
        return parseFloat(val) || 0;
    };

    $.jCarousel.plugin('jcarousel', {
        animating:   false,
        tail:        0,
        inTail:      false,
        resizeTimer: null,
        lt:          null,
        vertical:    false,
        rtl:         false,
        circular:    false,
        underflow:   false,
        relative:    false,

        _options: {
            list: function() {
                return this.element().children().eq(0);
            },
            items: function() {
                return this.list().children();
            },
            animation:   400,
            transitions: false,
            wrap:        null,
            vertical:    null,
            rtl:         null,
            center:      false
        },

        // Protected, don't access directly
        _list:         null,
        _items:        null,
        _target:       $(),
        _first:        $(),
        _last:         $(),
        _visible:      $(),
        _fullyvisible: $(),
        _init: function() {
            var self = this;

            this.onWindowResize = function() {
                if (self.resizeTimer) {
                    clearTimeout(self.resizeTimer);
                }

                self.resizeTimer = setTimeout(function() {
                    self.reload();
                }, 100);
            };

            return this;
        },
        _create: function() {
            this._reload();

            $(window).on('resize.jcarousel', this.onWindowResize);
        },
        _destroy: function() {
            $(window).off('resize.jcarousel', this.onWindowResize);
        },
        _reload: function() {
            this.vertical = this.options('vertical');

            if (this.vertical == null) {
                this.vertical = this.list().height() > this.list().width();
            }

            this.rtl = this.options('rtl');

            if (this.rtl == null) {
                this.rtl = (function(element) {
                    if (('' + element.attr('dir')).toLowerCase() === 'rtl') {
                        return true;
                    }

                    var found = false;

                    element.parents('[dir]').each(function() {
                        if ((/rtl/i).test($(this).attr('dir'))) {
                            found = true;
                            return false;
                        }
                    });

                    return found;
                }(this._element));
            }

            this.lt = this.vertical ? 'top' : 'left';

            // Ensure before closest() call
            this.relative = this.list().css('position') === 'relative';

            // Force list and items reload
            this._list  = null;
            this._items = null;

            var item = this.index(this._target) >= 0 ?
                           this._target :
                           this.closest();

            // _prepare() needs this here
            this.circular  = this.options('wrap') === 'circular';
            this.underflow = false;

            var props = {'left': 0, 'top': 0};

            if (item.length > 0) {
                this._prepare(item);
                this.list().find('[data-jcarousel-clone]').remove();

                // Force items reload
                this._items = null;

                this.underflow = this._fullyvisible.length >= this.items().length;
                this.circular  = this.circular && !this.underflow;

                props[this.lt] = this._position(item) + 'px';
            }

            this.move(props);

            return this;
        },
        list: function() {
            if (this._list === null) {
                var option = this.options('list');
                this._list = $.isFunction(option) ? option.call(this) : this._element.find(option);
            }

            return this._list;
        },
        items: function() {
            if (this._items === null) {
                var option = this.options('items');
                this._items = ($.isFunction(option) ? option.call(this) : this.list().find(option)).not('[data-jcarousel-clone]');
            }

            return this._items;
        },
        index: function(item) {
            return this.items().index(item);
        },
        closest: function() {
            var self    = this,
                pos     = this.list().position()[this.lt],
                closest = $(), // Ensure we're returning a jQuery instance
                stop    = false,
                lrb     = this.vertical ? 'bottom' : (this.rtl && !this.relative ? 'left' : 'right'),
                width;

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            this.items().each(function() {
                closest = $(this);

                if (stop) {
                    return false;
                }

                var dim = self.dimension(closest);

                pos += dim;

                if (pos >= 0) {
                    width = dim - toFloat(closest.css('margin-' + lrb));

                    if ((Math.abs(pos) - dim + (width / 2)) <= 0) {
                        stop = true;
                    } else {
                        return false;
                    }
                }
            });


            return closest;
        },
        target: function() {
            return this._target;
        },
        first: function() {
            return this._first;
        },
        last: function() {
            return this._last;
        },
        visible: function() {
            return this._visible;
        },
        fullyvisible: function() {
            return this._fullyvisible;
        },
        hasNext: function() {
            if (false === this._trigger('hasnext')) {
                return true;
            }

            var wrap = this.options('wrap'),
                end = this.items().length - 1,
                check = this.options('center') ? this._target : this._last;

            return end >= 0 && !this.underflow &&
                ((wrap && wrap !== 'first') ||
                    (this.index(check) < end) ||
                    (this.tail && !this.inTail)) ? true : false;
        },
        hasPrev: function() {
            if (false === this._trigger('hasprev')) {
                return true;
            }

            var wrap = this.options('wrap');

            return this.items().length > 0 && !this.underflow &&
                ((wrap && wrap !== 'last') ||
                    (this.index(this._first) > 0) ||
                    (this.tail && this.inTail)) ? true : false;
        },
        clipping: function() {
            return this._element['inner' + (this.vertical ? 'Height' : 'Width')]();
        },
        dimension: function(element) {
            return element['outer' + (this.vertical ? 'Height' : 'Width')](true);
        },
        scroll: function(target, animate, callback) {
            if (this.animating) {
                return this;
            }

            if (false === this._trigger('scroll', null, [target, animate])) {
                return this;
            }

            if ($.isFunction(animate)) {
                callback = animate;
                animate  = true;
            }

            var parsed = $.jCarousel.parseTarget(target);

            if (parsed.relative) {
                var end    = this.items().length - 1,
                    scroll = Math.abs(parsed.target),
                    wrap   = this.options('wrap'),
                    current,
                    first,
                    index,
                    start,
                    curr,
                    isVisible,
                    props,
                    i;

                if (parsed.target > 0) {
                    var last = this.index(this._last);

                    if (last >= end && this.tail) {
                        if (!this.inTail) {
                            this._scrollTail(animate, callback);
                        } else {
                            if (wrap === 'both' || wrap === 'last') {
                                this._scroll(0, animate, callback);
                            } else {
                                if ($.isFunction(callback)) {
                                    callback.call(this, false);
                                }
                            }
                        }
                    } else {
                        current = this.index(this._target);

                        if ((this.underflow && current === end && (wrap === 'circular' || wrap === 'both' || wrap === 'last')) ||
                            (!this.underflow && last === end && (wrap === 'both' || wrap === 'last'))) {
                            this._scroll(0, animate, callback);
                        } else {
                            index = current + scroll;

                            if (this.circular && index > end) {
                                i = end;
                                curr = this.items().get(-1);

                                while (i++ < index) {
                                    curr = this.items().eq(0);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().append(curr);

                                    if (!isVisible) {
                                        props = {};
                                        props[this.lt] = this.dimension(curr);
                                        this.moveBy(props);
                                    }

                                    // Force items reload
                                    this._items = null;
                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.min(index, end), animate, callback);
                            }
                        }
                    }
                } else {
                    if (this.inTail) {
                        this._scroll(Math.max((this.index(this._first) - scroll) + 1, 0), animate, callback);
                    } else {
                        first  = this.index(this._first);
                        current = this.index(this._target);
                        start  = this.underflow ? current : first;
                        index  = start - scroll;

                        if (start <= 0 && ((this.underflow && wrap === 'circular') || wrap === 'both' || wrap === 'first')) {
                            this._scroll(end, animate, callback);
                        } else {
                            if (this.circular && index < 0) {
                                i    = index;
                                curr = this.items().get(0);

                                while (i++ < 0) {
                                    curr = this.items().eq(-1);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().prepend(curr);

                                    // Force items reload
                                    this._items = null;

                                    var dim = this.dimension(curr);

                                    props = {};
                                    props[this.lt] = -dim;
                                    this.moveBy(props);

                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.max(index, 0), animate, callback);
                            }
                        }
                    }
                }
            } else {
                this._scroll(parsed.target, animate, callback);
            }

            this._trigger('scrollend');

            return this;
        },
        moveBy: function(properties, opts) {
            var position = this.list().position(),
                multiplier = 1,
                correction = 0;

            if (this.rtl && !this.vertical) {
                multiplier = -1;

                if (this.relative) {
                    correction = this.list().width() - this.clipping();
                }
            }

            if (properties.left) {
                properties.left = (position.left + correction + toFloat(properties.left) * multiplier) + 'px';
            }

            if (properties.top) {
                properties.top = (position.top + correction + toFloat(properties.top) * multiplier) + 'px';
            }

            return this.move(properties, opts);
        },
        move: function(properties, opts) {
            opts = opts || {};

            var option       = this.options('transitions'),
                transitions  = !!option,
                transforms   = !!option.transforms,
                transforms3d = !!option.transforms3d,
                duration     = opts.duration || 0,
                list         = this.list();

            if (!transitions && duration > 0) {
                list.animate(properties, opts);
                return;
            }

            var complete = opts.complete || $.noop,
                css = {};

            if (transitions) {
                var backup = {
                        transitionDuration: list.css('transitionDuration'),
                        transitionTimingFunction: list.css('transitionTimingFunction'),
                        transitionProperty: list.css('transitionProperty')
                    },
                    oldComplete = complete;

                complete = function() {
                    $(this).css(backup);
                    oldComplete.call(this);
                };
                css = {
                    transitionDuration: (duration > 0 ? duration / 1000 : 0) + 's',
                    transitionTimingFunction: option.easing || opts.easing,
                    transitionProperty: duration > 0 ? (function() {
                        if (transforms || transforms3d) {
                            // We have to use 'all' because jQuery doesn't prefix
                            // css values, like transition-property: transform;
                            return 'all';
                        }

                        return properties.left ? 'left' : 'top';
                    })() : 'none',
                    transform: 'none'
                };
            }

            if (transforms3d) {
                css.transform = 'translate3d(' + (properties.left || 0) + ',' + (properties.top || 0) + ',0)';
            } else if (transforms) {
                css.transform = 'translate(' + (properties.left || 0) + ',' + (properties.top || 0) + ')';
            } else {
                $.extend(css, properties);
            }

            if (transitions && duration > 0) {
                list.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', complete);
            }

            list.css(css);

            if (duration <= 0) {
                list.each(function() {
                    complete.call(this);
                });
            }
        },
        _scroll: function(item, animate, callback) {
            if (this.animating) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            if (typeof item !== 'object') {
                item = this.items().eq(item);
            } else if (typeof item.jquery === 'undefined') {
                item = $(item);
            }

            if (item.length === 0) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            this.inTail = false;

            this._prepare(item);

            var pos     = this._position(item),
                currPos = this.list().position()[this.lt];

            if (pos === currPos) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._animate(properties, animate, callback);

            return this;
        },
        _scrollTail: function(animate, callback) {
            if (this.animating || !this.tail) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var pos = this.list().position()[this.lt];

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            if (this.rtl && !this.vertical) {
                pos += this.tail;
            } else {
                pos -= this.tail;
            }

            this.inTail = true;

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._update({
                target:       this._target.next(),
                fullyvisible: this._fullyvisible.slice(1).add(this._visible.last())
            });

            this._animate(properties, animate, callback);

            return this;
        },
        _animate: function(properties, animate, callback) {
            callback = callback || $.noop;

            if (false === this._trigger('animate')) {
                callback.call(this, false);
                return this;
            }

            this.animating = true;

            var animation = this.options('animation'),
                complete  = $.proxy(function() {
                    this.animating = false;

                    var c = this.list().find('[data-jcarousel-clone]');

                    if (c.length > 0) {
                        c.remove();
                        this._reload();
                    }

                    this._trigger('animateend');

                    callback.call(this, true);
                }, this);

            var opts = typeof animation === 'object' ?
                           $.extend({}, animation) :
                           {duration: animation},
                oldComplete = opts.complete || $.noop;

            if (animate === false) {
                opts.duration = 0;
            } else if (typeof $.fx.speeds[opts.duration] !== 'undefined') {
                opts.duration = $.fx.speeds[opts.duration];
            }

            opts.complete = function() {
                complete();
                oldComplete.call(this);
            };

            this.move(properties, opts);

            return this;
        },
        _prepare: function(item) {
            var index  = this.index(item),
                idx    = index,
                wh     = this.dimension(item),
                clip   = this.clipping(),
                lrb    = this.vertical ? 'bottom' : (this.rtl ? 'left'  : 'right'),
                center = this.options('center'),
                update = {
                    target:       item,
                    first:        item,
                    last:         item,
                    visible:      item,
                    fullyvisible: wh <= clip ? item : $()
                },
                curr,
                isVisible,
                margin,
                dim;

            if (center) {
                wh /= 2;
                clip /= 2;
            }

            if (wh < clip) {
                while (true) {
                    curr = this.items().eq(++idx);

                    if (curr.length === 0) {
                        if (!this.circular) {
                            break;
                        }

                        curr = this.items().eq(0);

                        if (item.get(0) === curr.get(0)) {
                            break;
                        }

                        isVisible = this._visible.index(curr) >= 0;

                        if (isVisible) {
                            curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                        }

                        this.list().append(curr);

                        if (!isVisible) {
                            var props = {};
                            props[this.lt] = this.dimension(curr);
                            this.moveBy(props);
                        }

                        // Force items reload
                        this._items = null;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.last    = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            if (!this.circular && !center && wh < clip) {
                idx = index;

                while (true) {
                    if (--idx < 0) {
                        break;
                    }

                    curr = this.items().eq(idx);

                    if (curr.length === 0) {
                        break;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.first   = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            this._update(update);

            this.tail = 0;

            if (!center &&
                this.options('wrap') !== 'circular' &&
                this.options('wrap') !== 'custom' &&
                this.index(update.last) === (this.items().length - 1)) {

                // Remove right/bottom margin from total width
                wh -= toFloat(update.last.css('margin-' + lrb));

                if (wh > clip) {
                    this.tail = wh - clip;
                }
            }

            return this;
        },
        _position: function(item) {
            var first  = this._first,
                pos    = first.position()[this.lt],
                center = this.options('center'),
                centerOffset = center ? (this.clipping() / 2) - (this.dimension(first) / 2) : 0;

            if (this.rtl && !this.vertical) {
                if (this.relative) {
                    pos -= this.list().width() - this.dimension(first);
                } else {
                    pos -= this.clipping() - this.dimension(first);
                }

                pos += centerOffset;
            } else {
                pos -= centerOffset;
            }

            if (!center &&
                (this.index(item) > this.index(first) || this.inTail) &&
                this.tail) {
                pos = this.rtl && !this.vertical ? pos - this.tail : pos + this.tail;
                this.inTail = true;
            } else {
                this.inTail = false;
            }

            return -pos;
        },
        _update: function(update) {
            var self = this,
                current = {
                    target:       this._target,
                    first:        this._first,
                    last:         this._last,
                    visible:      this._visible,
                    fullyvisible: this._fullyvisible
                },
                back = this.index(update.first || current.first) < this.index(current.first),
                key,
                doUpdate = function(key) {
                    var elIn  = [],
                        elOut = [];

                    update[key].each(function() {
                        if (current[key].index(this) < 0) {
                            elIn.push(this);
                        }
                    });

                    current[key].each(function() {
                        if (update[key].index(this) < 0) {
                            elOut.push(this);
                        }
                    });

                    if (back) {
                        elIn = elIn.reverse();
                    } else {
                        elOut = elOut.reverse();
                    }

                    self._trigger(key + 'in', $(elIn));
                    self._trigger(key + 'out', $(elOut));

                    self['_' + key] = update[key];
                };

            for (key in update) {
                doUpdate(key);
            }

            return this;
        }
    });
}(jQuery, window));

(function($) {
    'use strict';

    $.jcarousel.fn.scrollIntoView = function(target, animate, callback) {
        var parsed = $.jCarousel.parseTarget(target),
            first  = this.index(this._fullyvisible.first()),
            last   = this.index(this._fullyvisible.last()),
            index;

        if (parsed.relative) {
            index = parsed.target < 0 ? Math.max(0, first + parsed.target) : last + parsed.target;
        } else {
            index = typeof parsed.target !== 'object' ? parsed.target : this.index(parsed.target);
        }

        if (index < first) {
            return this.scroll(index, animate, callback);
        }

        if (index >= first && index <= last) {
            if ($.isFunction(callback)) {
                callback.call(this, false);
            }

            return this;
        }

        var items = this.items(),
            clip = this.clipping(),
            lrb  = this.vertical ? 'bottom' : (this.rtl ? 'left'  : 'right'),
            wh   = 0,
            curr;

        while (true) {
            curr = items.eq(index);

            if (curr.length === 0) {
                break;
            }

            wh += this.dimension(curr);

            if (wh >= clip) {
                var margin = parseFloat(curr.css('margin-' + lrb)) || 0;
                if ((wh - margin) !== clip) {
                    index++;
                }
                break;
            }

            if (index <= 0) {
                break;
            }

            index--;
        }

        return this.scroll(index, animate, callback);
    };
}(jQuery));

(function($) {
    'use strict';

    $.jCarousel.plugin('jcarouselControl', {
        _options: {
            target: '+=1',
            event:  'click',
            method: 'scroll'
        },
        _active: null,
        _init: function() {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onEvent = $.proxy(function(e) {
                e.preventDefault();

                var method = this.options('method');

                if ($.isFunction(method)) {
                    method.call(this);
                } else {
                    this.carousel()
                        .jcarousel(this.options('method'), this.options('target'));
                }
            }, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend jcarousel:scrollend', this.onReload);

            this._element
                .on(this.options('event') + '.jcarouselcontrol', this.onEvent);

            this._reload();
        },
        _destroy: function() {
            this._element
                .off('.jcarouselcontrol', this.onEvent);

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend jcarousel:scrollend', this.onReload);
        },
        _reload: function() {
            var parsed   = $.jCarousel.parseTarget(this.options('target')),
                carousel = this.carousel(),
                active;

            if (parsed.relative) {
                active = carousel
                    .jcarousel(parsed.target > 0 ? 'hasNext' : 'hasPrev');
            } else {
                var target = typeof parsed.target !== 'object' ?
                                carousel.jcarousel('items').eq(parsed.target) :
                                parsed.target;

                active = carousel.jcarousel('target').index(target) >= 0;
            }

            if (this._active !== active) {
                this._trigger(active ? 'active' : 'inactive');
                this._active = active;
            }

            return this;
        }
    });
}(jQuery));

(function($) {
    'use strict';

    $.jCarousel.plugin('jcarouselPagination', {
        _options: {
            perPage: null,
            item: function(page) {
                return '<a href="#' + page + '">' + page + '</a>';
            },
            event:  'click',
            method: 'scroll'
        },
        _carouselItems: null,
        _pages: {},
        _items: {},
        _currentPage: null,
        _init: function() {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onScroll = $.proxy(this._update, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend', this.onReload)
                .on('jcarousel:scrollend', this.onScroll);

            this._reload();
        },
        _destroy: function() {
            this._clear();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend', this.onReload)
                .off('jcarousel:scrollend', this.onScroll);

            this._carouselItems = null;
        },
        _reload: function() {
            var perPage = this.options('perPage');

            this._pages = {};
            this._items = {};

            // Calculate pages
            if ($.isFunction(perPage)) {
                perPage = perPage.call(this);
            }

            if (perPage == null) {
                this._pages = this._calculatePages();
            } else {
                var pp    = parseInt(perPage, 10) || 0,
                    items = this._getCarouselItems(),
                    page  = 1,
                    i     = 0,
                    curr;

                while (true) {
                    curr = items.eq(i++);

                    if (curr.length === 0) {
                        break;
                    }

                    if (!this._pages[page]) {
                        this._pages[page] = curr;
                    } else {
                        this._pages[page] = this._pages[page].add(curr);
                    }

                    if (i % pp === 0) {
                        page++;
                    }
                }
            }

            this._clear();

            var self     = this,
                carousel = this.carousel().data('jcarousel'),
                element  = this._element,
                item     = this.options('item'),
                numCarouselItems = this._getCarouselItems().length;

            $.each(this._pages, function(page, carouselItems) {
                var currItem = self._items[page] = $(item.call(self, page, carouselItems));

                currItem.on(self.options('event') + '.jcarouselpagination', $.proxy(function() {
                    var target = carouselItems.eq(0);

                    // If circular wrapping enabled, ensure correct scrolling direction
                    if (carousel.circular) {
                        var currentIndex = carousel.index(carousel.target()),
                            newIndex     = carousel.index(target);

                        if (parseFloat(page) > parseFloat(self._currentPage)) {
                            if (newIndex < currentIndex) {
                                target = '+=' + (numCarouselItems - currentIndex + newIndex);
                            }
                        } else {
                            if (newIndex > currentIndex) {
                                target = '-=' + (currentIndex + (numCarouselItems - newIndex));
                            }
                        }
                    }

                    carousel[this.options('method')](target);
                }, self));

                element.append(currItem);
            });

            this._update();
        },
        _update: function() {
            var target = this.carousel().jcarousel('target'),
                currentPage;

            $.each(this._pages, function(page, carouselItems) {
                carouselItems.each(function() {
                    if (target.is(this)) {
                        currentPage = page;
                        return false;
                    }
                });

                if (currentPage) {
                    return false;
                }
            });

            if (this._currentPage !== currentPage) {
                this._trigger('inactive', this._items[this._currentPage]);
                this._trigger('active', this._items[currentPage]);
            }

            this._currentPage = currentPage;
        },
        items: function() {
            return this._items;
        },
        reloadCarouselItems: function() {
            this._carouselItems = null;
            return this;
        },
        _clear: function() {
            this._element.empty();
            this._currentPage = null;
        },
        _calculatePages: function() {
            var carousel = this.carousel().data('jcarousel'),
                items    = this._getCarouselItems(),
                clip     = carousel.clipping(),
                wh       = 0,
                idx      = 0,
                page     = 1,
                pages    = {},
                curr,
                dim;

            while (true) {
                curr = items.eq(idx++);

                if (curr.length === 0) {
                    break;
                }

                dim = carousel.dimension(curr);

                if ((wh + dim) > clip) {
                    page++;
                    wh = 0;
                }

                wh += dim;

                if (!pages[page]) {
                    pages[page] = curr;
                } else {
                    pages[page] = pages[page].add(curr);
                }
            }

            return pages;
        },
        _getCarouselItems: function() {
            if (!this._carouselItems) {
                this._carouselItems = this.carousel().jcarousel('items');
            }

            return this._carouselItems;
        }
    });
}(jQuery));

(function($, document) {
    'use strict';

    var hiddenProp,
        visibilityChangeEvent,
        visibilityChangeEventNames = {
            hidden: 'visibilitychange',
            mozHidden: 'mozvisibilitychange',
            msHidden: 'msvisibilitychange',
            webkitHidden: 'webkitvisibilitychange'
        }
    ;

    $.each(visibilityChangeEventNames, function(key, val) {
        if (typeof document[key] !== 'undefined') {
            hiddenProp = key;
            visibilityChangeEvent = val;
            return false;
        }
    });

    $.jCarousel.plugin('jcarouselAutoscroll', {
        _options: {
            target:    '+=1',
            interval:  3000,
            autostart: true
        },
        _timer: null,
        _started: false,
        _init: function () {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);

            this.onAnimateEnd = $.proxy(this._start, this);

            this.onVisibilityChange = $.proxy(function() {
                if (document[hiddenProp]) {
                    this._stop();
                } else {
                    this._start();
                }
            }, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy);

            $(document)
                .on(visibilityChangeEvent, this.onVisibilityChange);

            if (this.options('autostart')) {
                this.start();
            }
        },
        _destroy: function() {
            this._stop();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy);

            $(document)
                .off(visibilityChangeEvent, this.onVisibilityChange);
        },
        _start: function() {
            this._stop();

            if (!this._started) {
                return;
            }

            this.carousel()
                .one('jcarousel:animateend', this.onAnimateEnd);

            this._timer = setTimeout($.proxy(function() {
                this.carousel().jcarousel('scroll', this.options('target'));
            }, this), this.options('interval'));

            return this;
        },
        _stop: function() {
            if (this._timer) {
                this._timer = clearTimeout(this._timer);
            }

            this.carousel()
                .off('jcarousel:animateend', this.onAnimateEnd);

            return this;
        },
        start: function() {
            this._started = true;
            this._start();

            return this;
        },
        stop: function() {
            this._started = false;
            this._stop();

            return this;
        }
    });
}(jQuery, document));
/** * @license * lodash lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE */;(function(){function n(n,t){return n.set(t[0],t[1]),n}function t(n,t){return n.add(t),n}function r(n,t,r){switch(r.length){case 0:return n.call(t);case 1:return n.call(t,r[0]);case 2:return n.call(t,r[0],r[1]);case 3:return n.call(t,r[0],r[1],r[2])}return n.apply(t,r)}function e(n,t,r,e){for(var u=-1,i=null==n?0:n.length;++u<i;){var o=n[u];t(e,o,r(o),n)}return e}function u(n,t){for(var r=-1,e=null==n?0:n.length;++r<e&&false!==t(n[r],r,n););return n}function i(n,t){for(var r=null==n?0:n.length;r--&&false!==t(n[r],r,n););    return n}function o(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(!t(n[r],r,n))return false;return true}function f(n,t){for(var r=-1,e=null==n?0:n.length,u=0,i=[];++r<e;){var o=n[r];t(o,r,n)&&(i[u++]=o)}return i}function c(n,t){return!(null==n||!n.length)&&-1<d(n,t,0)}function a(n,t,r){for(var e=-1,u=null==n?0:n.length;++e<u;)if(r(t,n[e]))return true;return false}function l(n,t){for(var r=-1,e=null==n?0:n.length,u=Array(e);++r<e;)u[r]=t(n[r],r,n);return u}function s(n,t){for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];    return n}function h(n,t,r,e){var u=-1,i=null==n?0:n.length;for(e&&i&&(r=n[++u]);++u<i;)r=t(r,n[u],u,n);return r}function p(n,t,r,e){var u=null==n?0:n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r}function _(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(t(n[r],r,n))return true;return false}function v(n,t,r){var e;return r(n,function(n,r,u){if(t(n,r,u))return e=r,false}),e}function g(n,t,r,e){var u=n.length;for(r+=e?1:-1;e?r--:++r<u;)if(t(n[r],r,n))return r;return-1}function d(n,t,r){if(t===t)n:{    --r;for(var e=n.length;++r<e;)if(n[r]===t){n=r;break n}n=-1}else n=g(n,b,r);return n}function y(n,t,r,e){--r;for(var u=n.length;++r<u;)if(e(n[r],t))return r;return-1}function b(n){return n!==n}function x(n,t){var r=null==n?0:n.length;return r?k(n,t)/r:P}function j(n){return function(t){return null==t?F:t[n]}}function w(n){return function(t){return null==n?F:n[t]}}function m(n,t,r,e,u){return u(n,function(n,u,i){r=e?(e=false,n):t(r,n,u,i)}),r}function A(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].c;    return n}function k(n,t){for(var r,e=-1,u=n.length;++e<u;){var i=t(n[e]);i!==F&&(r=r===F?i:r+i)}return r}function E(n,t){for(var r=-1,e=Array(n);++r<n;)e[r]=t(r);return e}function O(n,t){return l(t,function(t){return[t,n[t]]})}function S(n){return function(t){return n(t)}}function I(n,t){return l(t,function(t){return n[t]})}function R(n,t){return n.has(t)}function z(n,t){for(var r=-1,e=n.length;++r<e&&-1<d(t,n[r],0););return r}function W(n,t){for(var r=n.length;r--&&-1<d(t,n[r],0););return r}function B(n){    return"\\"+Tn[n]}function L(n){var t=-1,r=Array(n.size);return n.forEach(function(n,e){r[++t]=[e,n]}),r}function U(n,t){return function(r){return n(t(r))}}function C(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r];o!==t&&"__lodash_placeholder__"!==o||(n[r]="__lodash_placeholder__",i[u++]=r)}return i}function D(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=n}),r}function M(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=[n,n]}),r}function T(n){if(Bn.test(n)){    for(var t=zn.lastIndex=0;zn.test(n);)++t;n=t}else n=tt(n);return n}function $(n){return Bn.test(n)?n.match(zn)||[]:n.split("")}var F,N=1/0,P=NaN,Z=[["ary",128],["bind",1],["bindKey",2],["curry",8],["curryRight",16],["flip",512],["partial",32],["partialRight",64],["rearg",256]],q=/\b__p\+='';/g,V=/\b(__p\+=)''\+/g,K=/(__e\(.*?\)|\b__t\))\+'';/g,G=/&(?:amp|lt|gt|quot|#39);/g,H=/[&<>"']/g,J=RegExp(G.source),Y=RegExp(H.source),Q=/<%-([\s\S]+?)%>/g,X=/<%([\s\S]+?)%>/g,nn=/<%=([\s\S]+?)%>/g,tn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,rn=/^\w*$/,en=/^\./,un=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,on=/[\\^$.*+?()[\]{}|]/g,fn=RegExp(on.source),cn=/^\s+|\s+$/g,an=/^\s+/,ln=/\s+$/,sn=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,hn=/\{\n\/\* \[wrapped with (.+)\] \*/,pn=/,? & /,_n=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,vn=/\\(\\)?/g,gn=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,dn=/\w*$/,yn=/^[-+]0x[0-9a-f]+$/i,bn=/^0b[01]+$/i,xn=/^\[object .+?Constructor\]$/,jn=/^0o[0-7]+$/i,wn=/^(?:0|[1-9]\d*)$/,mn=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,An=/($^)/,kn=/['\n\r\u2028\u2029\\]/g,En="[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?)*",On="(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])"+En,Sn="(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]?|[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])",In=RegExp("['\u2019]","g"),Rn=RegExp("[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]","g"),zn=RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|"+Sn+En,"g"),Wn=RegExp(["[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?:['\u2019](?:d|ll|m|re|s|t|ve))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:d|ll|m|re|s|t|ve))?|[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?|\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)|\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)|\\d+",On].join("|"),"g"),Bn=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),Ln=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Un="Array Buffer DataView Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Math Object Promise RegExp Set String Symbol TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap _ clearTimeout isFinite parseInt setTimeout".split(" "),Cn={};    Cn["[object Float32Array]"]=Cn["[object Float64Array]"]=Cn["[object Int8Array]"]=Cn["[object Int16Array]"]=Cn["[object Int32Array]"]=Cn["[object Uint8Array]"]=Cn["[object Uint8ClampedArray]"]=Cn["[object Uint16Array]"]=Cn["[object Uint32Array]"]=true,Cn["[object Arguments]"]=Cn["[object Array]"]=Cn["[object ArrayBuffer]"]=Cn["[object Boolean]"]=Cn["[object DataView]"]=Cn["[object Date]"]=Cn["[object Error]"]=Cn["[object Function]"]=Cn["[object Map]"]=Cn["[object Number]"]=Cn["[object Object]"]=Cn["[object RegExp]"]=Cn["[object Set]"]=Cn["[object String]"]=Cn["[object WeakMap]"]=false;    var Dn={};Dn["[object Arguments]"]=Dn["[object Array]"]=Dn["[object ArrayBuffer]"]=Dn["[object DataView]"]=Dn["[object Boolean]"]=Dn["[object Date]"]=Dn["[object Float32Array]"]=Dn["[object Float64Array]"]=Dn["[object Int8Array]"]=Dn["[object Int16Array]"]=Dn["[object Int32Array]"]=Dn["[object Map]"]=Dn["[object Number]"]=Dn["[object Object]"]=Dn["[object RegExp]"]=Dn["[object Set]"]=Dn["[object String]"]=Dn["[object Symbol]"]=Dn["[object Uint8Array]"]=Dn["[object Uint8ClampedArray]"]=Dn["[object Uint16Array]"]=Dn["[object Uint32Array]"]=true,        Dn["[object Error]"]=Dn["[object Function]"]=Dn["[object WeakMap]"]=false;var Mn,Tn={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},$n=parseFloat,Fn=parseInt,Nn=typeof global=="object"&&global&&global.Object===Object&&global,Pn=typeof self=="object"&&self&&self.Object===Object&&self,Zn=Nn||Pn||Function("return this")(),qn=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Vn=qn&&typeof module=="object"&&module&&!module.nodeType&&module,Kn=Vn&&Vn.exports===qn,Gn=Kn&&Nn.h;    n:{try{Mn=Gn&&Gn.g("util");break n}catch(n){}Mn=void 0}var Hn=Mn&&Mn.isArrayBuffer,Jn=Mn&&Mn.isDate,Yn=Mn&&Mn.isMap,Qn=Mn&&Mn.isRegExp,Xn=Mn&&Mn.isSet,nt=Mn&&Mn.isTypedArray,tt=j("length"),rt=w({"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I",        "\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae","\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss","\u0100":"A","\u0102":"A","\u0104":"A","\u0101":"a","\u0103":"a","\u0105":"a","\u0106":"C","\u0108":"C","\u010a":"C","\u010c":"C",        "\u0107":"c","\u0109":"c","\u010b":"c","\u010d":"c","\u010e":"D","\u0110":"D","\u010f":"d","\u0111":"d","\u0112":"E","\u0114":"E","\u0116":"E","\u0118":"E","\u011a":"E","\u0113":"e","\u0115":"e","\u0117":"e","\u0119":"e","\u011b":"e","\u011c":"G","\u011e":"G","\u0120":"G","\u0122":"G","\u011d":"g","\u011f":"g","\u0121":"g","\u0123":"g","\u0124":"H","\u0126":"H","\u0125":"h","\u0127":"h","\u0128":"I","\u012a":"I","\u012c":"I","\u012e":"I","\u0130":"I","\u0129":"i","\u012b":"i","\u012d":"i","\u012f":"i",        "\u0131":"i","\u0134":"J","\u0135":"j","\u0136":"K","\u0137":"k","\u0138":"k","\u0139":"L","\u013b":"L","\u013d":"L","\u013f":"L","\u0141":"L","\u013a":"l","\u013c":"l","\u013e":"l","\u0140":"l","\u0142":"l","\u0143":"N","\u0145":"N","\u0147":"N","\u014a":"N","\u0144":"n","\u0146":"n","\u0148":"n","\u014b":"n","\u014c":"O","\u014e":"O","\u0150":"O","\u014d":"o","\u014f":"o","\u0151":"o","\u0154":"R","\u0156":"R","\u0158":"R","\u0155":"r","\u0157":"r","\u0159":"r","\u015a":"S","\u015c":"S","\u015e":"S",        "\u0160":"S","\u015b":"s","\u015d":"s","\u015f":"s","\u0161":"s","\u0162":"T","\u0164":"T","\u0166":"T","\u0163":"t","\u0165":"t","\u0167":"t","\u0168":"U","\u016a":"U","\u016c":"U","\u016e":"U","\u0170":"U","\u0172":"U","\u0169":"u","\u016b":"u","\u016d":"u","\u016f":"u","\u0171":"u","\u0173":"u","\u0174":"W","\u0175":"w","\u0176":"Y","\u0177":"y","\u0178":"Y","\u0179":"Z","\u017b":"Z","\u017d":"Z","\u017a":"z","\u017c":"z","\u017e":"z","\u0132":"IJ","\u0133":"ij","\u0152":"Oe","\u0153":"oe","\u0149":"'n",        "\u017f":"s"}),et=w({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}),ut=w({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"}),it=function w(En){function On(n){if(gu(n)&&!uf(n)&&!(n instanceof Mn)){if(n instanceof zn)return n;if(ui.call(n,"__wrapped__"))return Te(n)}return new zn(n)}function Sn(){}function zn(n,t){this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=F}function Mn(n){this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=false,        this.__iteratees__=[],this.__takeCount__=4294967295,this.__views__=[]}function Tn(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Nn(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Pn(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function qn(n){var t=-1,r=null==n?0:n.length;for(this.__data__=new Pn;++t<r;)this.add(n[t])}function Vn(n){this.size=(this.__data__=new Nn(n)).size;    }function Gn(n,t){var r,e=uf(n),u=!e&&ef(n),i=!e&&!u&&ff(n),o=!e&&!u&&!i&&hf(n),u=(e=e||u||i||o)?E(n.length,Qu):[],f=u.length;for(r in n)!t&&!ui.call(n,r)||e&&("length"==r||i&&("offset"==r||"parent"==r)||o&&("buffer"==r||"byteLength"==r||"byteOffset"==r)||Ae(r,f))||u.push(r);return u}function tt(n){var t=n.length;return t?n[cr(0,t-1)]:F}function ot(n,t){return Ue(Dr(n),gt(t,0,n.length))}function ft(n){return Ue(Dr(n))}function ct(n,t,r,e){return n===F||cu(n,ti[r])&&!ui.call(e,r)?t:n}function at(n,t,r){        (r===F||cu(n[t],r))&&(r!==F||t in n)||_t(n,t,r)}function lt(n,t,r){var e=n[t];ui.call(n,t)&&cu(e,r)&&(r!==F||t in n)||_t(n,t,r)}function st(n,t){for(var r=n.length;r--;)if(cu(n[r][0],t))return r;return-1}function ht(n,t,r,e){return ro(n,function(n,u,i){t(e,n,r(n),i)}),e}function pt(n,t){return n&&Mr(t,Ru(t),n)}function _t(n,t,r){"__proto__"==t&&wi?wi(n,t,{configurable:true,enumerable:true,value:r,writable:true}):n[t]=r}function vt(n,t){for(var r=-1,e=t.length,u=qu(e),i=null==n;++r<e;)u[r]=i?F:Su(n,t[r]);        return u}function gt(n,t,r){return n===n&&(r!==F&&(n=n<=r?n:r),t!==F&&(n=n>=t?n:t)),n}function dt(n,t,r,e,i,o,f){var c;if(e&&(c=o?e(n,i,o,f):e(n)),c!==F)return c;if(!vu(n))return n;if(i=uf(n)){if(c=xe(n),!t)return Dr(n,c)}else{var a=po(n),l="[object Function]"==a||"[object GeneratorFunction]"==a;if(ff(n))return zr(n,t);if("[object Object]"==a||"[object Arguments]"==a||l&&!o){if(c=je(l?{}:n),!t)return Tr(n,pt(c,n))}else{if(!Dn[a])return o?n:{};c=we(n,a,dt,t)}}if(f||(f=new Vn),o=f.get(n))return o;f.set(n,c);        var s=i?F:(r?he:Ru)(n);return u(s||n,function(u,i){s&&(i=u,u=n[i]),lt(c,i,dt(u,t,r,e,i,n,f))}),c}function yt(n){var t=Ru(n);return function(r){return bt(r,n,t)}}function bt(n,t,r){var e=r.length;if(null==n)return!e;for(n=Ju(n);e--;){var u=r[e],i=t[u],o=n[u];if(o===F&&!(u in n)||!i(o))return false}return true}function xt(n,t,r){if(typeof n!="function")throw new Xu("Expected a function");return go(function(){n.apply(F,r)},t)}function jt(n,t,r,e){var u=-1,i=c,o=true,f=n.length,s=[],h=t.length;if(!f)return s;r&&(t=l(t,S(r))),        e?(i=a,o=false):200<=t.length&&(i=R,o=false,t=new qn(t));n:for(;++u<f;){var p=n[u],_=null==r?p:r(p),p=e||0!==p?p:0;if(o&&_===_){for(var v=h;v--;)if(t[v]===_)continue n;s.push(p)}else i(t,_,e)||s.push(p)}return s}function wt(n,t){var r=true;return ro(n,function(n,e,u){return r=!!t(n,e,u)}),r}function mt(n,t,r){for(var e=-1,u=n.length;++e<u;){var i=n[e],o=t(i);if(null!=o&&(f===F?o===o&&!xu(o):r(o,f)))var f=o,c=i}return c}function At(n,t){var r=[];return ro(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function kt(n,t,r,e,u){        var i=-1,o=n.length;for(r||(r=me),u||(u=[]);++i<o;){var f=n[i];0<t&&r(f)?1<t?kt(f,t-1,r,e,u):s(u,f):e||(u[u.length]=f)}return u}function Et(n,t){return n&&uo(n,t,Ru)}function Ot(n,t){return n&&io(n,t,Ru)}function St(n,t){return f(t,function(t){return hu(n[t])})}function It(n,t){t=Ee(t,n)?[t]:Ir(t);for(var r=0,e=t.length;null!=n&&r<e;)n=n[Ce(t[r++])];return r&&r==e?n:F}function Rt(n,t,r){return t=t(n),uf(n)?t:s(t,r(n))}function zt(n){if(null==n)return n===F?"[object Undefined]":"[object Null]";n=Ju(n);        var t;if(ji&&ji in n){var r=ui.call(n,ji),e=n[ji];try{n[ji]=F,t=true}catch(n){}var u=fi.call(n);t&&(r?n[ji]=e:delete n[ji]),t=u}else t=fi.call(n);return t}function Wt(n,t){return n>t}function Bt(n,t){return null!=n&&ui.call(n,t)}function Lt(n,t){return null!=n&&t in Ju(n)}function Ut(n,t,r){for(var e=r?a:c,u=n[0].length,i=n.length,o=i,f=qu(i),s=1/0,h=[];o--;){var p=n[o];o&&t&&(p=l(p,S(t))),s=Li(p.length,s),f[o]=!r&&(t||120<=u&&120<=p.length)?new qn(o&&p):F}var p=n[0],_=-1,v=f[0];n:for(;++_<u&&h.length<s;){        var g=p[_],d=t?t(g):g,g=r||0!==g?g:0;if(v?!R(v,d):!e(h,d,r)){for(o=i;--o;){var y=f[o];if(y?!R(y,d):!e(n[o],d,r))continue n}v&&v.push(d),h.push(g)}}return h}function Ct(n,t,r){var e={};return Et(n,function(n,u,i){t(e,r(n),u,i)}),e}function Dt(n,t,e){return Ee(t,n)||(t=Ir(t),n=We(n,t),t=Ze(t)),t=null==n?n:n[Ce(t)],null==t?F:r(t,n,e)}function Mt(n){return gu(n)&&"[object Arguments]"==zt(n)}function Tt(n){return gu(n)&&"[object ArrayBuffer]"==zt(n)}function $t(n){return gu(n)&&"[object Date]"==zt(n)}        function Ft(n,t,r,e,u){if(n===t)t=true;else if(null==n||null==t||!vu(n)&&!gu(t))t=n!==n&&t!==t;else n:{var i=uf(n),o=uf(t),f="[object Array]",c="[object Array]";i||(f=po(n),f="[object Arguments]"==f?"[object Object]":f),o||(c=po(t),c="[object Arguments]"==c?"[object Object]":c);var a="[object Object]"==f,o="[object Object]"==c;if((c=f==c)&&ff(n)){if(!ff(t)){t=false;break n}i=true,a=false}if(c&&!a)u||(u=new Vn),t=i||hf(n)?ae(n,t,Ft,r,e,u):le(n,t,f,Ft,r,e,u);else{if(!(2&e)&&(i=a&&ui.call(n,"__wrapped__"),f=o&&ui.call(t,"__wrapped__"),            i||f)){n=i?n.value():n,t=f?t.value():t,u||(u=new Vn),t=Ft(n,t,r,e,u);break n}if(c)t:if(u||(u=new Vn),i=2&e,f=Ru(n),o=f.length,c=Ru(t).length,o==c||i){for(a=o;a--;){var l=f[a];if(!(i?l in t:ui.call(t,l))){t=false;break t}}if((c=u.get(n))&&u.get(t))t=c==t;else{c=true,u.set(n,t),u.set(t,n);for(var s=i;++a<o;){var l=f[a],h=n[l],p=t[l];if(r)var _=i?r(p,h,l,t,n,u):r(h,p,l,n,t,u);if(_===F?h!==p&&!Ft(h,p,r,e,u):!_){c=false;break}s||(s="constructor"==l)}c&&!s&&(r=n.constructor,e=t.constructor,r!=e&&"constructor"in n&&"constructor"in t&&!(typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)&&(c=false)),            u.delete(n),u.delete(t),t=c}}else t=false;else t=false}}return t}function Nt(n){return gu(n)&&"[object Map]"==po(n)}function Pt(n,t,r,e){var u=r.length,i=u,o=!e;if(null==n)return!i;for(n=Ju(n);u--;){var f=r[u];if(o&&f[2]?f[1]!==n[f[0]]:!(f[0]in n))return false}for(;++u<i;){var f=r[u],c=f[0],a=n[c],l=f[1];if(o&&f[2]){if(a===F&&!(c in n))return false}else{if(f=new Vn,e)var s=e(a,l,c,n,t,f);if(s===F?!Ft(l,a,e,3,f):!s)return false}}return true}function Zt(n){return!(!vu(n)||oi&&oi in n)&&(hu(n)?li:xn).test(De(n))}function qt(n){            return gu(n)&&"[object RegExp]"==zt(n)}function Vt(n){return gu(n)&&"[object Set]"==po(n)}function Kt(n){return gu(n)&&_u(n.length)&&!!Cn[zt(n)]}function Gt(n){return typeof n=="function"?n:null==n?Mu:typeof n=="object"?uf(n)?Xt(n[0],n[1]):Qt(n):Nu(n)}function Ht(n){if(!Se(n))return Wi(n);var t,r=[];for(t in Ju(n))ui.call(n,t)&&"constructor"!=t&&r.push(t);return r}function Jt(n,t){return n<t}function Yt(n,t){var r=-1,e=au(n)?qu(n.length):[];return ro(n,function(n,u,i){e[++r]=t(n,u,i)}),e}function Qt(n){            var t=de(n);return 1==t.length&&t[0][2]?Ie(t[0][0],t[0][1]):function(r){return r===n||Pt(r,n,t)}}function Xt(n,t){return Ee(n)&&t===t&&!vu(t)?Ie(Ce(n),t):function(r){var e=Su(r,n);return e===F&&e===t?Iu(r,n):Ft(t,e,F,3)}}function nr(n,t,r,e,u){n!==t&&uo(t,function(i,o){if(vu(i)){u||(u=new Vn);var f=u,c=n[o],a=t[o],l=f.get(a);if(l)at(n,o,l);else{var l=e?e(c,a,o+"",n,t,f):F,s=l===F;if(s){var h=uf(a),p=!h&&ff(a),_=!h&&!p&&hf(a),l=a;h||p||_?uf(c)?l=c:lu(c)?l=Dr(c):p?(s=false,l=zr(a,true)):_?(s=false,l=Br(a,true)):l=[]:yu(a)||ef(a)?(l=c,            ef(c)?l=Eu(c):(!vu(c)||r&&hu(c))&&(l=je(a))):s=false}s&&(f.set(a,l),nr(l,a,r,e,f),f.delete(a)),at(n,o,l)}}else f=e?e(n[o],i,o+"",n,t,u):F,f===F&&(f=i),at(n,o,f)},zu)}function tr(n,t){var r=n.length;if(r)return t+=0>t?r:0,Ae(t,r)?n[t]:F}function rr(n,t,r){var e=-1;return t=l(t.length?t:[Mu],S(ve())),n=Yt(n,function(n){return{a:l(t,function(t){return t(n)}),b:++e,c:n}}),A(n,function(n,t){var e;n:{e=-1;for(var u=n.a,i=t.a,o=u.length,f=r.length;++e<o;){var c=Lr(u[e],i[e]);if(c){e=e>=f?c:c*("desc"==r[e]?-1:1);            break n}}e=n.b-t.b}return e})}function er(n,t){return n=Ju(n),ur(n,t,function(t,r){return r in n})}function ur(n,t,r){for(var e=-1,u=t.length,i={};++e<u;){var o=t[e],f=n[o];r(f,o)&&_t(i,o,f)}return i}function ir(n){return function(t){return It(t,n)}}function or(n,t,r,e){var u=e?y:d,i=-1,o=t.length,f=n;for(n===t&&(t=Dr(t)),r&&(f=l(n,S(r)));++i<o;)for(var c=0,a=t[i],a=r?r(a):a;-1<(c=u(f,a,c,e));)f!==n&&yi.call(f,c,1),yi.call(n,c,1);return n}function fr(n,t){for(var r=n?t.length:0,e=r-1;r--;){var u=t[r];            if(r==e||u!==i){var i=u;if(Ae(u))yi.call(n,u,1);else if(Ee(u,n))delete n[Ce(u)];else{var u=Ir(u),o=We(n,u);null!=o&&delete o[Ce(Ze(u))]}}}}function cr(n,t){return n+Oi(Di()*(t-n+1))}function ar(n,t){var r="";if(!n||1>t||9007199254740991<t)return r;do t%2&&(r+=n),(t=Oi(t/2))&&(n+=n);while(t);return r}function lr(n,t){return yo(ze(n,t,Mu),n+"")}function sr(n){return tt(Bu(n))}function hr(n,t){var r=Bu(n);return Ue(r,gt(t,0,r.length))}function pr(n,t,r,e){if(!vu(n))return n;t=Ee(t,n)?[t]:Ir(t);for(var u=-1,i=t.length,o=i-1,f=n;null!=f&&++u<i;){            var c=Ce(t[u]),a=r;if(u!=o){var l=f[c],a=e?e(l,c,f):F;a===F&&(a=vu(l)?l:Ae(t[u+1])?[]:{})}lt(f,c,a),f=f[c]}return n}function _r(n){return Ue(Bu(n))}function vr(n,t,r){var e=-1,u=n.length;for(0>t&&(t=-t>u?0:u+t),r=r>u?u:r,0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,r=qu(u);++e<u;)r[e]=n[e+t];return r}function gr(n,t){var r;return ro(n,function(n,e,u){return r=t(n,e,u),!r}),!!r}function dr(n,t,r){var e=0,u=null==n?e:n.length;if(typeof t=="number"&&t===t&&2147483647>=u){for(;e<u;){var i=e+u>>>1,o=n[i];null!==o&&!xu(o)&&(r?o<=t:o<t)?e=i+1:u=i;        }return u}return yr(n,t,Mu,r)}function yr(n,t,r,e){t=r(t);for(var u=0,i=null==n?0:n.length,o=t!==t,f=null===t,c=xu(t),a=t===F;u<i;){var l=Oi((u+i)/2),s=r(n[l]),h=s!==F,p=null===s,_=s===s,v=xu(s);(o?e||_:a?_&&(e||h):f?_&&h&&(e||!p):c?_&&h&&!p&&(e||!v):p||v?0:e?s<=t:s<t)?u=l+1:i=l}return Li(i,4294967294)}function br(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r],f=t?t(o):o;if(!r||!cu(f,c)){var c=f;i[u++]=0===o?0:o}}return i}function xr(n){return typeof n=="number"?n:xu(n)?P:+n}function jr(n){            if(typeof n=="string")return n;if(uf(n))return l(n,jr)+"";if(xu(n))return no?no.call(n):"";var t=n+"";return"0"==t&&1/n==-N?"-0":t}function wr(n,t,r){var e=-1,u=c,i=n.length,o=true,f=[],l=f;if(r)o=false,u=a;else if(200<=i){if(u=t?null:ao(n))return D(u);o=false,u=R,l=new qn}else l=t?[]:f;n:for(;++e<i;){var s=n[e],h=t?t(s):s,s=r||0!==s?s:0;if(o&&h===h){for(var p=l.length;p--;)if(l[p]===h)continue n;t&&l.push(h),f.push(s)}else u(l,h,r)||(l!==f&&l.push(h),f.push(s))}return f}function mr(n,t,r,e){for(var u=n.length,i=e?u:-1;(e?i--:++i<u)&&t(n[i],i,n););            return r?vr(n,e?0:i,e?i+1:u):vr(n,e?i+1:0,e?u:i)}function Ar(n,t){var r=n;return r instanceof Mn&&(r=r.value()),h(t,function(n,t){return t.func.apply(t.thisArg,s([n],t.args))},r)}function kr(n,t,r){var e=n.length;if(2>e)return e?wr(n[0]):[];for(var u=-1,i=qu(e);++u<e;)for(var o=n[u],f=-1;++f<e;)f!=u&&(i[u]=jt(i[u]||o,n[f],t,r));return wr(kt(i,1),t,r)}function Er(n,t,r){for(var e=-1,u=n.length,i=t.length,o={};++e<u;)r(o,n[e],e<i?t[e]:F);return o}function Or(n){return lu(n)?n:[]}function Sr(n){return typeof n=="function"?n:Mu;        }function Ir(n){return uf(n)?n:bo(n)}function Rr(n,t,r){var e=n.length;return r=r===F?e:r,!t&&r>=e?n:vr(n,t,r)}function zr(n,t){if(t)return n.slice();var r=n.length,r=_i?_i(r):new n.constructor(r);return n.copy(r),r}function Wr(n){var t=new n.constructor(n.byteLength);return new pi(t).set(new pi(n)),t}function Br(n,t){return new n.constructor(t?Wr(n.buffer):n.buffer,n.byteOffset,n.length)}function Lr(n,t){if(n!==t){var r=n!==F,e=null===n,u=n===n,i=xu(n),o=t!==F,f=null===t,c=t===t,a=xu(t);if(!f&&!a&&!i&&n>t||i&&o&&c&&!f&&!a||e&&o&&c||!r&&c||!u)return 1;            if(!e&&!i&&!a&&n<t||a&&r&&u&&!e&&!i||f&&r&&u||!o&&u||!c)return-1}return 0}function Ur(n,t,r,e){var u=-1,i=n.length,o=r.length,f=-1,c=t.length,a=Bi(i-o,0),l=qu(c+a);for(e=!e;++f<c;)l[f]=t[f];for(;++u<o;)(e||u<i)&&(l[r[u]]=n[u]);for(;a--;)l[f++]=n[u++];return l}function Cr(n,t,r,e){var u=-1,i=n.length,o=-1,f=r.length,c=-1,a=t.length,l=Bi(i-f,0),s=qu(l+a);for(e=!e;++u<l;)s[u]=n[u];for(l=u;++c<a;)s[l+c]=t[c];for(;++o<f;)(e||u<i)&&(s[l+r[o]]=n[u++]);return s}function Dr(n,t){var r=-1,e=n.length;for(t||(t=qu(e));++r<e;)t[r]=n[r];            return t}function Mr(n,t,r,e){var u=!r;r||(r={});for(var i=-1,o=t.length;++i<o;){var f=t[i],c=e?e(r[f],n[f],f,r,n):F;c===F&&(c=n[f]),u?_t(r,f,c):lt(r,f,c)}return r}function Tr(n,t){return Mr(n,so(n),t)}function $r(n,t){return function(r,u){var i=uf(r)?e:ht,o=t?t():{};return i(r,n,ve(u,2),o)}}function Fr(n){return lr(function(t,r){var e=-1,u=r.length,i=1<u?r[u-1]:F,o=2<u?r[2]:F,i=3<n.length&&typeof i=="function"?(u--,i):F;for(o&&ke(r[0],r[1],o)&&(i=3>u?F:i,u=1),t=Ju(t);++e<u;)(o=r[e])&&n(t,o,e,i);return t;        })}function Nr(n,t){return function(r,e){if(null==r)return r;if(!au(r))return n(r,e);for(var u=r.length,i=t?u:-1,o=Ju(r);(t?i--:++i<u)&&false!==e(o[i],i,o););return r}}function Pr(n){return function(t,r,e){var u=-1,i=Ju(t);e=e(t);for(var o=e.length;o--;){var f=e[n?o:++u];if(false===r(i[f],f,i))break}return t}}function Zr(n,t,r){function e(){return(this&&this!==Zn&&this instanceof e?i:n).apply(u?r:this,arguments)}var u=1&t,i=Kr(n);return e}function qr(n){return function(t){t=Ou(t);var r=Bn.test(t)?$(t):F,e=r?r[0]:t.charAt(0);            return t=r?Rr(r,1).join(""):t.slice(1),e[n]()+t}}function Vr(n){return function(t){return h(Cu(Uu(t).replace(In,"")),n,"")}}function Kr(n){return function(){var t=arguments;switch(t.length){case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var r=to(n.prototype),t=n.apply(r,t);            return vu(t)?t:r}}function Gr(n,t,e){function u(){for(var o=arguments.length,f=qu(o),c=o,a=_e(u);c--;)f[c]=arguments[c];return c=3>o&&f[0]!==a&&f[o-1]!==a?[]:C(f,a),o-=c.length,o<e?ie(n,t,Yr,u.placeholder,F,f,c,F,F,e-o):r(this&&this!==Zn&&this instanceof u?i:n,this,f)}var i=Kr(n);return u}function Hr(n){return function(t,r,e){var u=Ju(t);if(!au(t)){var i=ve(r,3);t=Ru(t),r=function(n){return i(u[n],n,u)}}return r=n(t,r,e),-1<r?u[i?t[r]:r]:F}}function Jr(n){return se(function(t){var r=t.length,e=r,u=zn.prototype.thru;            for(n&&t.reverse();e--;){var i=t[e];if(typeof i!="function")throw new Xu("Expected a function");if(u&&!o&&"wrapper"==pe(i))var o=new zn([],true)}for(e=o?e:r;++e<r;)var i=t[e],u=pe(i),f="wrapper"==u?lo(i):F,o=f&&Oe(f[0])&&424==f[1]&&!f[4].length&&1==f[9]?o[pe(f[0])].apply(o,f[3]):1==i.length&&Oe(i)?o[u]():o.thru(i);return function(){var n=arguments,e=n[0];if(o&&1==n.length&&uf(e)&&200<=e.length)return o.plant(e).value();for(var u=0,n=r?t[u].apply(this,n):e;++u<r;)n=t[u].call(this,n);return n}})}function Yr(n,t,r,e,u,i,o,f,c,a){            function l(){for(var d=arguments.length,y=qu(d),b=d;b--;)y[b]=arguments[b];if(_){var x,j=_e(l),b=y.length;for(x=0;b--;)y[b]===j&&++x}if(e&&(y=Ur(y,e,u,_)),i&&(y=Cr(y,i,o,_)),d-=x,_&&d<a)return j=C(y,j),ie(n,t,Yr,l.placeholder,r,y,j,f,c,a-d);if(j=h?r:this,b=p?j[n]:n,d=y.length,f){x=y.length;for(var w=Li(f.length,x),m=Dr(y);w--;){var A=f[w];y[w]=Ae(A,x)?m[A]:F}}else v&&1<d&&y.reverse();return s&&c<d&&(y.length=c),this&&this!==Zn&&this instanceof l&&(b=g||Kr(b)),b.apply(j,y)}var s=128&t,h=1&t,p=2&t,_=24&t,v=512&t,g=p?F:Kr(n);            return l}function Qr(n,t){return function(r,e){return Ct(r,n,t(e))}}function Xr(n,t){return function(r,e){var u;if(r===F&&e===F)return t;if(r!==F&&(u=r),e!==F){if(u===F)return e;typeof r=="string"||typeof e=="string"?(r=jr(r),e=jr(e)):(r=xr(r),e=xr(e)),u=n(r,e)}return u}}function ne(n){return se(function(t){return t=l(t,S(ve())),lr(function(e){var u=this;return n(t,function(n){return r(n,u,e)})})})}function te(n,t){t=t===F?" ":jr(t);var r=t.length;return 2>r?r?ar(t,n):t:(r=ar(t,Ei(n/T(t))),Bn.test(t)?Rr($(r),0,n).join(""):r.slice(0,n));        }function re(n,t,e,u){function i(){for(var t=-1,c=arguments.length,a=-1,l=u.length,s=qu(l+c),h=this&&this!==Zn&&this instanceof i?f:n;++a<l;)s[a]=u[a];for(;c--;)s[a++]=arguments[++t];return r(h,o?e:this,s)}var o=1&t,f=Kr(n);return i}function ee(n){return function(t,r,e){e&&typeof e!="number"&&ke(t,r,e)&&(r=e=F),t=wu(t),r===F?(r=t,t=0):r=wu(r),e=e===F?t<r?1:-1:wu(e);var u=-1;r=Bi(Ei((r-t)/(e||1)),0);for(var i=qu(r);r--;)i[n?r:++u]=t,t+=e;return i}}function ue(n){return function(t,r){return typeof t=="string"&&typeof r=="string"||(t=ku(t),            r=ku(r)),n(t,r)}}function ie(n,t,r,e,u,i,o,f,c,a){var l=8&t,s=l?o:F;o=l?F:o;var h=l?i:F;return i=l?F:i,t=(t|(l?32:64))&~(l?64:32),4&t||(t&=-4),u=[n,t,u,h,s,i,o,f,c,a],r=r.apply(F,u),Oe(n)&&vo(r,u),r.placeholder=e,Be(r,n,t)}function oe(n){var t=Hu[n];return function(n,r){if(n=ku(n),r=Li(mu(r),292)){var e=(Ou(n)+"e").split("e"),e=t(e[0]+"e"+(+e[1]+r)),e=(Ou(e)+"e").split("e");return+(e[0]+"e"+(+e[1]-r))}return t(n)}}function fe(n){return function(t){var r=po(t);return"[object Map]"==r?L(t):"[object Set]"==r?M(t):O(t,n(t));        }}function ce(n,t,r,e,u,i,o,f){var c=2&t;if(!c&&typeof n!="function")throw new Xu("Expected a function");var a=e?e.length:0;if(a||(t&=-97,e=u=F),o=o===F?o:Bi(mu(o),0),f=f===F?f:mu(f),a-=u?u.length:0,64&t){var l=e,s=u;e=u=F}var h=c?F:lo(n);return i=[n,t,r,e,u,l,s,i,o,f],h&&(r=i[1],n=h[1],t=r|n,e=128==n&&8==r||128==n&&256==r&&i[7].length<=h[8]||384==n&&h[7].length<=h[8]&&8==r,131>t||e)&&(1&n&&(i[2]=h[2],t|=1&r?0:4),(r=h[3])&&(e=i[3],i[3]=e?Ur(e,r,h[4]):r,i[4]=e?C(i[3],"__lodash_placeholder__"):h[4]),        (r=h[5])&&(e=i[5],i[5]=e?Cr(e,r,h[6]):r,i[6]=e?C(i[5],"__lodash_placeholder__"):h[6]),(r=h[7])&&(i[7]=r),128&n&&(i[8]=null==i[8]?h[8]:Li(i[8],h[8])),null==i[9]&&(i[9]=h[9]),i[0]=h[0],i[1]=t),n=i[0],t=i[1],r=i[2],e=i[3],u=i[4],f=i[9]=null==i[9]?c?0:n.length:Bi(i[9]-a,0),!f&&24&t&&(t&=-25),Be((h?oo:vo)(t&&1!=t?8==t||16==t?Gr(n,t,f):32!=t&&33!=t||u.length?Yr.apply(F,i):re(n,t,r,e):Zr(n,t,r),i),n,t)}function ae(n,t,r,e,u,i){var o=2&u,f=n.length,c=t.length;if(f!=c&&!(o&&c>f))return false;if((c=i.get(n))&&i.get(t))return c==t;            var c=-1,a=true,l=1&u?new qn:F;for(i.set(n,t),i.set(t,n);++c<f;){var s=n[c],h=t[c];if(e)var p=o?e(h,s,c,t,n,i):e(s,h,c,n,t,i);if(p!==F){if(p)continue;a=false;break}if(l){if(!_(t,function(n,t){if(!R(l,t)&&(s===n||r(s,n,e,u,i)))return l.push(t)})){a=false;break}}else if(s!==h&&!r(s,h,e,u,i)){a=false;break}}return i.delete(n),i.delete(t),a}function le(n,t,r,e,u,i,o){switch(r){case"[object DataView]":if(n.byteLength!=t.byteLength||n.byteOffset!=t.byteOffset)break;n=n.buffer,t=t.buffer;case"[object ArrayBuffer]":            if(n.byteLength!=t.byteLength||!e(new pi(n),new pi(t)))break;return true;case"[object Boolean]":case"[object Date]":case"[object Number]":return cu(+n,+t);case"[object Error]":return n.name==t.name&&n.message==t.message;case"[object RegExp]":case"[object String]":return n==t+"";case"[object Map]":var f=L;case"[object Set]":if(f||(f=D),n.size!=t.size&&!(2&i))break;return(r=o.get(n))?r==t:(i|=1,o.set(n,t),t=ae(f(n),f(t),e,u,i,o),o.delete(n),t);case"[object Symbol]":if(Xi)return Xi.call(n)==Xi.call(t)}            return false}function se(n){return yo(ze(n,F,Ne),n+"")}function he(n){return Rt(n,Ru,so)}function pe(n){for(var t=n.name+"",r=Vi[t],e=ui.call(Vi,t)?r.length:0;e--;){var u=r[e],i=u.func;if(null==i||i==n)return u.name}return t}function _e(n){return(ui.call(On,"placeholder")?On:n).placeholder}function ve(){var n=On.iteratee||Tu,n=n===Tu?Gt:n;return arguments.length?n(arguments[0],arguments[1]):n}function ge(n,t){var r=n.__data__,e=typeof t;return("string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t)?r[typeof t=="string"?"string":"hash"]:r.map;        }function de(n){for(var t=Ru(n),r=t.length;r--;){var e=t[r],u=n[e];t[r]=[e,u,u===u&&!vu(u)]}return t}function ye(n,t){var r=null==n?F:n[t];return Zt(r)?r:F}function be(n,t,r){t=Ee(t,n)?[t]:Ir(t);for(var e=-1,u=t.length,i=false;++e<u;){var o=Ce(t[e]);if(!(i=null!=n&&r(n,o)))break;n=n[o]}return i||++e!=u?i:(u=null==n?0:n.length,!!u&&_u(u)&&Ae(o,u)&&(uf(n)||ef(n)))}function xe(n){var t=n.length,r=n.constructor(t);return t&&"string"==typeof n[0]&&ui.call(n,"index")&&(r.index=n.index,r.input=n.input),r}function je(n){            return typeof n.constructor!="function"||Se(n)?{}:to(vi(n))}function we(r,e,u,i){var o=r.constructor;switch(e){case"[object ArrayBuffer]":return Wr(r);case"[object Boolean]":case"[object Date]":return new o(+r);case"[object DataView]":return e=i?Wr(r.buffer):r.buffer,new r.constructor(e,r.byteOffset,r.byteLength);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":            case"[object Uint16Array]":case"[object Uint32Array]":return Br(r,i);case"[object Map]":return e=i?u(L(r),true):L(r),h(e,n,new r.constructor);case"[object Number]":case"[object String]":return new o(r);case"[object RegExp]":return e=new r.constructor(r.source,dn.exec(r)),e.lastIndex=r.lastIndex,e;case"[object Set]":return e=i?u(D(r),true):D(r),h(e,t,new r.constructor);case"[object Symbol]":return Xi?Ju(Xi.call(r)):{}}}function me(n){return uf(n)||ef(n)||!!(bi&&n&&n[bi])}function Ae(n,t){return t=null==t?9007199254740991:t,        !!t&&(typeof n=="number"||wn.test(n))&&-1<n&&0==n%1&&n<t}function ke(n,t,r){if(!vu(r))return false;var e=typeof t;return!!("number"==e?au(r)&&Ae(t,r.length):"string"==e&&t in r)&&cu(r[t],n)}function Ee(n,t){if(uf(n))return false;var r=typeof n;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=n&&!xu(n))||(rn.test(n)||!tn.test(n)||null!=t&&n in Ju(t))}function Oe(n){var t=pe(n),r=On[t];return typeof r=="function"&&t in Mn.prototype&&(n===r||(t=lo(r),!!t&&n===t[0]))}function Se(n){var t=n&&n.constructor;            return n===(typeof t=="function"&&t.prototype||ti)}function Ie(n,t){return function(r){return null!=r&&(r[n]===t&&(t!==F||n in Ju(r)))}}function Re(n,t,r,e,u,i){return vu(n)&&vu(t)&&(i.set(t,n),nr(n,t,F,Re,i),i.delete(t)),n}function ze(n,t,e){return t=Bi(t===F?n.length-1:t,0),function(){for(var u=arguments,i=-1,o=Bi(u.length-t,0),f=qu(o);++i<o;)f[i]=u[t+i];for(i=-1,o=qu(t+1);++i<t;)o[i]=u[i];return o[t]=e(f),r(n,this,o)}}function We(n,t){return 1==t.length?n:It(n,vr(t,0,-1))}function Be(n,t,r){var e=t+"";            t=yo;var u,i=Me;return u=(u=e.match(hn))?u[1].split(pn):[],r=i(u,r),(i=r.length)&&(u=i-1,r[u]=(1<i?"& ":"")+r[u],r=r.join(2<i?", ":" "),e=e.replace(sn,"{\n/* [wrapped with "+r+"] */\n")),t(n,e)}function Le(n){var t=0,r=0;return function(){var e=Ui(),u=16-(e-r);if(r=e,0<u){if(800<=++t)return arguments[0]}else t=0;return n.apply(F,arguments)}}function Ue(n,t){var r=-1,e=n.length,u=e-1;for(t=t===F?e:t;++r<t;){var e=cr(r,u),i=n[e];n[e]=n[r],n[r]=i}return n.length=t,n}function Ce(n){if(typeof n=="string"||xu(n))return n;            var t=n+"";return"0"==t&&1/n==-N?"-0":t}function De(n){if(null!=n){try{return ei.call(n)}catch(n){}return n+""}return""}function Me(n,t){return u(Z,function(r){var e="_."+r[0];t&r[1]&&!c(n,e)&&n.push(e)}),n.sort()}function Te(n){if(n instanceof Mn)return n.clone();var t=new zn(n.__wrapped__,n.__chain__);return t.__actions__=Dr(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t}function $e(n,t,r){var e=null==n?0:n.length;return e?(r=null==r?0:mu(r),0>r&&(r=Bi(e+r,0)),g(n,ve(t,3),r)):-1;        }function Fe(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e-1;return r!==F&&(u=mu(r),u=0>r?Bi(e+u,0):Li(u,e-1)),g(n,ve(t,3),u,true)}function Ne(n){return(null==n?0:n.length)?kt(n,1):[]}function Pe(n){return n&&n.length?n[0]:F}function Ze(n){var t=null==n?0:n.length;return t?n[t-1]:F}function qe(n,t){return n&&n.length&&t&&t.length?or(n,t):n}function Ve(n){return null==n?n:Mi.call(n)}function Ke(n){if(!n||!n.length)return[];var t=0;return n=f(n,function(n){if(lu(n))return t=Bi(n.length,t),true;        }),E(t,function(t){return l(n,j(t))})}function Ge(n,t){if(!n||!n.length)return[];var e=Ke(n);return null==t?e:l(e,function(n){return r(t,F,n)})}function He(n){return n=On(n),n.__chain__=true,n}function Je(n,t){return t(n)}function Ye(){return this}function Qe(n,t){return(uf(n)?u:ro)(n,ve(t,3))}function Xe(n,t){return(uf(n)?i:eo)(n,ve(t,3))}function nu(n,t){return(uf(n)?l:Yt)(n,ve(t,3))}function tu(n,t,r){return t=r?F:t,t=n&&null==t?n.length:t,ce(n,128,F,F,F,F,t)}function ru(n,t){var r;if(typeof t!="function")throw new Xu("Expected a function");            return n=mu(n),function(){return 0<--n&&(r=t.apply(this,arguments)),1>=n&&(t=F),r}}function eu(n,t,r){return t=r?F:t,n=ce(n,8,F,F,F,F,F,t),n.placeholder=eu.placeholder,n}function uu(n,t,r){return t=r?F:t,n=ce(n,16,F,F,F,F,F,t),n.placeholder=uu.placeholder,n}function iu(n,t,r){function e(t){var r=c,e=a;return c=a=F,_=t,s=n.apply(e,r)}function u(n){var r=n-p;return n-=_,p===F||r>=t||0>r||g&&n>=l}function i(){var n=Vo();if(u(n))return o(n);var r,e=go;r=n-_,n=t-(n-p),r=g?Li(n,l-r):n,h=e(i,r)}function o(n){            return h=F,d&&c?e(n):(c=a=F,s)}function f(){var n=Vo(),r=u(n);if(c=arguments,a=this,p=n,r){if(h===F)return _=n=p,h=go(i,t),v?e(n):s;if(g)return h=go(i,t),e(p)}return h===F&&(h=go(i,t)),s}var c,a,l,s,h,p,_=0,v=false,g=false,d=true;if(typeof n!="function")throw new Xu("Expected a function");return t=ku(t)||0,vu(r)&&(v=!!r.leading,l=(g="maxWait"in r)?Bi(ku(r.maxWait)||0,t):l,d="trailing"in r?!!r.trailing:d),f.cancel=function(){h!==F&&co(h),_=0,c=p=a=h=F},f.flush=function(){return h===F?s:o(Vo())},f}function ou(n,t){            function r(){var e=arguments,u=t?t.apply(this,e):e[0],i=r.cache;return i.has(u)?i.get(u):(e=n.apply(this,e),r.cache=i.set(u,e)||i,e)}if(typeof n!="function"||null!=t&&typeof t!="function")throw new Xu("Expected a function");return r.cache=new(ou.Cache||Pn),r}function fu(n){if(typeof n!="function")throw new Xu("Expected a function");return function(){var t=arguments;switch(t.length){case 0:return!n.call(this);case 1:return!n.call(this,t[0]);case 2:return!n.call(this,t[0],t[1]);case 3:return!n.call(this,t[0],t[1],t[2]);        }return!n.apply(this,t)}}function cu(n,t){return n===t||n!==n&&t!==t}function au(n){return null!=n&&_u(n.length)&&!hu(n)}function lu(n){return gu(n)&&au(n)}function su(n){if(!gu(n))return false;var t=zt(n);return"[object Error]"==t||"[object DOMException]"==t||typeof n.message=="string"&&typeof n.name=="string"&&!yu(n)}function hu(n){return!!vu(n)&&(n=zt(n),"[object Function]"==n||"[object GeneratorFunction]"==n||"[object AsyncFunction]"==n||"[object Proxy]"==n)}function pu(n){return typeof n=="number"&&n==mu(n);        }function _u(n){return typeof n=="number"&&-1<n&&0==n%1&&9007199254740991>=n}function vu(n){var t=typeof n;return null!=n&&("object"==t||"function"==t)}function gu(n){return null!=n&&typeof n=="object"}function du(n){return typeof n=="number"||gu(n)&&"[object Number]"==zt(n)}function yu(n){return!(!gu(n)||"[object Object]"!=zt(n))&&(n=vi(n),null===n||(n=ui.call(n,"constructor")&&n.constructor,typeof n=="function"&&n instanceof n&&ei.call(n)==ci))}function bu(n){return typeof n=="string"||!uf(n)&&gu(n)&&"[object String]"==zt(n);        }function xu(n){return typeof n=="symbol"||gu(n)&&"[object Symbol]"==zt(n)}function ju(n){if(!n)return[];if(au(n))return bu(n)?$(n):Dr(n);if(xi&&n[xi]){n=n[xi]();for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r}return t=po(n),("[object Map]"==t?L:"[object Set]"==t?D:Bu)(n)}function wu(n){return n?(n=ku(n),n===N||n===-N?1.7976931348623157e308*(0>n?-1:1):n===n?n:0):0===n?n:0}function mu(n){n=wu(n);var t=n%1;return n===n?t?n-t:n:0}function Au(n){return n?gt(mu(n),0,4294967295):0}function ku(n){            if(typeof n=="number")return n;if(xu(n))return P;if(vu(n)&&(n=typeof n.valueOf=="function"?n.valueOf():n,n=vu(n)?n+"":n),typeof n!="string")return 0===n?n:+n;n=n.replace(cn,"");var t=bn.test(n);return t||jn.test(n)?Fn(n.slice(2),t?2:8):yn.test(n)?P:+n}function Eu(n){return Mr(n,zu(n))}function Ou(n){return null==n?"":jr(n)}function Su(n,t,r){return n=null==n?F:It(n,t),n===F?r:n}function Iu(n,t){return null!=n&&be(n,t,Lt)}function Ru(n){return au(n)?Gn(n):Ht(n)}function zu(n){if(au(n))n=Gn(n,true);else if(vu(n)){            var t,r=Se(n),e=[];for(t in n)("constructor"!=t||!r&&ui.call(n,t))&&e.push(t);n=e}else{if(t=[],null!=n)for(r in Ju(n))t.push(r);n=t}return n}function Wu(n,t){return null==n?{}:ur(n,Rt(n,zu,ho),ve(t))}function Bu(n){return null==n?[]:I(n,Ru(n))}function Lu(n){return Mf(Ou(n).toLowerCase())}function Uu(n){return(n=Ou(n))&&n.replace(mn,rt).replace(Rn,"")}function Cu(n,t,r){return n=Ou(n),t=r?F:t,t===F?Ln.test(n)?n.match(Wn)||[]:n.match(_n)||[]:n.match(t)||[]}function Du(n){return function(){return n;        }}function Mu(n){return n}function Tu(n){return Gt(typeof n=="function"?n:dt(n,true))}function $u(n,t,r){var e=Ru(t),i=St(t,e);null!=r||vu(t)&&(i.length||!e.length)||(r=t,t=n,n=this,i=St(t,Ru(t)));var o=!(vu(r)&&"chain"in r&&!r.chain),f=hu(n);return u(i,function(r){var e=t[r];n[r]=e,f&&(n.prototype[r]=function(){var t=this.__chain__;if(o||t){var r=n(this.__wrapped__);return(r.__actions__=Dr(this.__actions__)).push({func:e,args:arguments,thisArg:n}),r.__chain__=t,r}return e.apply(n,s([this.value()],arguments));        })}),n}function Fu(){}function Nu(n){return Ee(n)?j(Ce(n)):ir(n)}function Pu(){return[]}function Zu(){return false}En=null==En?Zn:it.defaults(Zn.Object(),En,it.pick(Zn,Un));var qu=En.Array,Vu=En.Date,Ku=En.Error,Gu=En.Function,Hu=En.Math,Ju=En.Object,Yu=En.RegExp,Qu=En.String,Xu=En.TypeError,ni=qu.prototype,ti=Ju.prototype,ri=En["__core-js_shared__"],ei=Gu.prototype.toString,ui=ti.hasOwnProperty,ii=0,oi=function(){var n=/[^.]+$/.exec(ri&&ri.keys&&ri.keys.IE_PROTO||"");return n?"Symbol(src)_1."+n:""}(),fi=ti.toString,ci=ei.call(Ju),ai=Zn._,li=Yu("^"+ei.call(ui).replace(on,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),si=Kn?En.Buffer:F,hi=En.Symbol,pi=En.Uint8Array,_i=si?si.f:F,vi=U(Ju.getPrototypeOf,Ju),gi=Ju.create,di=ti.propertyIsEnumerable,yi=ni.splice,bi=hi?hi.isConcatSpreadable:F,xi=hi?hi.iterator:F,ji=hi?hi.toStringTag:F,wi=function(){            try{var n=ye(Ju,"defineProperty");return n({},"",{}),n}catch(n){}}(),mi=En.clearTimeout!==Zn.clearTimeout&&En.clearTimeout,Ai=Vu&&Vu.now!==Zn.Date.now&&Vu.now,ki=En.setTimeout!==Zn.setTimeout&&En.setTimeout,Ei=Hu.ceil,Oi=Hu.floor,Si=Ju.getOwnPropertySymbols,Ii=si?si.isBuffer:F,Ri=En.isFinite,zi=ni.join,Wi=U(Ju.keys,Ju),Bi=Hu.max,Li=Hu.min,Ui=Vu.now,Ci=En.parseInt,Di=Hu.random,Mi=ni.reverse,Ti=ye(En,"DataView"),$i=ye(En,"Map"),Fi=ye(En,"Promise"),Ni=ye(En,"Set"),Pi=ye(En,"WeakMap"),Zi=ye(Ju,"create"),qi=Pi&&new Pi,Vi={},Ki=De(Ti),Gi=De($i),Hi=De(Fi),Ji=De(Ni),Yi=De(Pi),Qi=hi?hi.prototype:F,Xi=Qi?Qi.valueOf:F,no=Qi?Qi.toString:F,to=function(){            function n(){}return function(t){return vu(t)?gi?gi(t):(n.prototype=t,t=new n,n.prototype=F,t):{}}}();On.templateSettings={escape:Q,evaluate:X,interpolate:nn,variable:"",imports:{_:On}},On.prototype=Sn.prototype,On.prototype.constructor=On,zn.prototype=to(Sn.prototype),zn.prototype.constructor=zn,Mn.prototype=to(Sn.prototype),Mn.prototype.constructor=Mn,Tn.prototype.clear=function(){this.__data__=Zi?Zi(null):{},this.size=0},Tn.prototype.delete=function(n){return n=this.has(n)&&delete this.__data__[n],            this.size-=n?1:0,n},Tn.prototype.get=function(n){var t=this.__data__;return Zi?(n=t[n],"__lodash_hash_undefined__"===n?F:n):ui.call(t,n)?t[n]:F},Tn.prototype.has=function(n){var t=this.__data__;return Zi?t[n]!==F:ui.call(t,n)},Tn.prototype.set=function(n,t){var r=this.__data__;return this.size+=this.has(n)?0:1,r[n]=Zi&&t===F?"__lodash_hash_undefined__":t,this},Nn.prototype.clear=function(){this.__data__=[],this.size=0},Nn.prototype.delete=function(n){var t=this.__data__;return n=st(t,n),!(0>n)&&(n==t.length-1?t.pop():yi.call(t,n,1),            --this.size,true)},Nn.prototype.get=function(n){var t=this.__data__;return n=st(t,n),0>n?F:t[n][1]},Nn.prototype.has=function(n){return-1<st(this.__data__,n)},Nn.prototype.set=function(n,t){var r=this.__data__,e=st(r,n);return 0>e?(++this.size,r.push([n,t])):r[e][1]=t,this},Pn.prototype.clear=function(){this.size=0,this.__data__={hash:new Tn,map:new($i||Nn),string:new Tn}},Pn.prototype.delete=function(n){return n=ge(this,n).delete(n),this.size-=n?1:0,n},Pn.prototype.get=function(n){return ge(this,n).get(n);        },Pn.prototype.has=function(n){return ge(this,n).has(n)},Pn.prototype.set=function(n,t){var r=ge(this,n),e=r.size;return r.set(n,t),this.size+=r.size==e?0:1,this},qn.prototype.add=qn.prototype.push=function(n){return this.__data__.set(n,"__lodash_hash_undefined__"),this},qn.prototype.has=function(n){return this.__data__.has(n)},Vn.prototype.clear=function(){this.__data__=new Nn,this.size=0},Vn.prototype.delete=function(n){var t=this.__data__;return n=t.delete(n),this.size=t.size,n},Vn.prototype.get=function(n){            return this.__data__.get(n)},Vn.prototype.has=function(n){return this.__data__.has(n)},Vn.prototype.set=function(n,t){var r=this.__data__;if(r instanceof Nn){var e=r.__data__;if(!$i||199>e.length)return e.push([n,t]),this.size=++r.size,this;r=this.__data__=new Pn(e)}return r.set(n,t),this.size=r.size,this};var ro=Nr(Et),eo=Nr(Ot,true),uo=Pr(),io=Pr(true),oo=qi?function(n,t){return qi.set(n,t),n}:Mu,fo=wi?function(n,t){return wi(n,"toString",{configurable:true,enumerable:false,value:Du(t),writable:true})}:Mu,co=mi||function(n){                return Zn.clearTimeout(n)},ao=Ni&&1/D(new Ni([,-0]))[1]==N?function(n){return new Ni(n)}:Fu,lo=qi?function(n){return qi.get(n)}:Fu,so=Si?U(Si,Ju):Pu,ho=Si?function(n){for(var t=[];n;)s(t,so(n)),n=vi(n);return t}:Pu,po=zt;(Ti&&"[object DataView]"!=po(new Ti(new ArrayBuffer(1)))||$i&&"[object Map]"!=po(new $i)||Fi&&"[object Promise]"!=po(Fi.resolve())||Ni&&"[object Set]"!=po(new Ni)||Pi&&"[object WeakMap]"!=po(new Pi))&&(po=function(n){var t=zt(n);if(n=(n="[object Object]"==t?n.constructor:F)?De(n):"")switch(n){            case Ki:return"[object DataView]";case Gi:return"[object Map]";case Hi:return"[object Promise]";case Ji:return"[object Set]";case Yi:return"[object WeakMap]"}return t});var _o=ri?hu:Zu,vo=Le(oo),go=ki||function(n,t){return Zn.setTimeout(n,t)},yo=Le(fo),bo=function(n){n=ou(n,function(n){return 500===t.size&&t.clear(),n});var t=n.cache;return n}(function(n){n=Ou(n);var t=[];return en.test(n)&&t.push(""),n.replace(un,function(n,r,e,u){t.push(e?u.replace(vn,"$1"):r||n)}),t}),xo=lr(function(n,t){return lu(n)?jt(n,kt(t,1,lu,true)):[];        }),jo=lr(function(n,t){var r=Ze(t);return lu(r)&&(r=F),lu(n)?jt(n,kt(t,1,lu,true),ve(r,2)):[]}),wo=lr(function(n,t){var r=Ze(t);return lu(r)&&(r=F),lu(n)?jt(n,kt(t,1,lu,true),F,r):[]}),mo=lr(function(n){var t=l(n,Or);return t.length&&t[0]===n[0]?Ut(t):[]}),Ao=lr(function(n){var t=Ze(n),r=l(n,Or);return t===Ze(r)?t=F:r.pop(),r.length&&r[0]===n[0]?Ut(r,ve(t,2)):[]}),ko=lr(function(n){var t=Ze(n),r=l(n,Or);return(t=typeof t=="function"?t:F)&&r.pop(),r.length&&r[0]===n[0]?Ut(r,F,t):[]}),Eo=lr(qe),Oo=se(function(n,t){            var r=null==n?0:n.length,e=vt(n,t);return fr(n,l(t,function(n){return Ae(n,r)?+n:n}).sort(Lr)),e}),So=lr(function(n){return wr(kt(n,1,lu,true))}),Io=lr(function(n){var t=Ze(n);return lu(t)&&(t=F),wr(kt(n,1,lu,true),ve(t,2))}),Ro=lr(function(n){var t=Ze(n),t=typeof t=="function"?t:F;return wr(kt(n,1,lu,true),F,t)}),zo=lr(function(n,t){return lu(n)?jt(n,t):[]}),Wo=lr(function(n){return kr(f(n,lu))}),Bo=lr(function(n){var t=Ze(n);return lu(t)&&(t=F),kr(f(n,lu),ve(t,2))}),Lo=lr(function(n){var t=Ze(n),t=typeof t=="function"?t:F;            return kr(f(n,lu),F,t)}),Uo=lr(Ke),Co=lr(function(n){var t=n.length,t=1<t?n[t-1]:F,t=typeof t=="function"?(n.pop(),t):F;return Ge(n,t)}),Do=se(function(n){function t(t){return vt(t,n)}var r=n.length,e=r?n[0]:0,u=this.__wrapped__;return!(1<r||this.__actions__.length)&&u instanceof Mn&&Ae(e)?(u=u.slice(e,+e+(r?1:0)),u.__actions__.push({func:Je,args:[t],thisArg:F}),new zn(u,this.__chain__).thru(function(n){return r&&!n.length&&n.push(F),n})):this.thru(t)}),Mo=$r(function(n,t,r){ui.call(n,r)?++n[r]:_t(n,r,1);        }),To=Hr($e),$o=Hr(Fe),Fo=$r(function(n,t,r){ui.call(n,r)?n[r].push(t):_t(n,r,[t])}),No=lr(function(n,t,e){var u=-1,i=typeof t=="function",o=Ee(t),f=au(n)?qu(n.length):[];return ro(n,function(n){var c=i?t:o&&null!=n?n[t]:F;f[++u]=c?r(c,n,e):Dt(n,t,e)}),f}),Po=$r(function(n,t,r){_t(n,r,t)}),Zo=$r(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]}),qo=lr(function(n,t){if(null==n)return[];var r=t.length;return 1<r&&ke(n,t[0],t[1])?t=[]:2<r&&ke(t[0],t[1],t[2])&&(t=[t[0]]),rr(n,kt(t,1),[])}),Vo=Ai||function(){                return Zn.Date.now()},Ko=lr(function(n,t,r){var e=1;if(r.length)var u=C(r,_e(Ko)),e=32|e;return ce(n,e,t,r,u)}),Go=lr(function(n,t,r){var e=3;if(r.length)var u=C(r,_e(Go)),e=32|e;return ce(t,e,n,r,u)}),Ho=lr(function(n,t){return xt(n,1,t)}),Jo=lr(function(n,t,r){return xt(n,ku(t)||0,r)});ou.Cache=Pn;var Yo=lr(function(n,t){t=1==t.length&&uf(t[0])?l(t[0],S(ve())):l(kt(t,1),S(ve()));var e=t.length;return lr(function(u){for(var i=-1,o=Li(u.length,e);++i<o;)u[i]=t[i].call(this,u[i]);return r(n,this,u);        })}),Qo=lr(function(n,t){return ce(n,32,F,t,C(t,_e(Qo)))}),Xo=lr(function(n,t){return ce(n,64,F,t,C(t,_e(Xo)))}),nf=se(function(n,t){return ce(n,256,F,F,F,t)}),tf=ue(Wt),rf=ue(function(n,t){return n>=t}),ef=Mt(function(){return arguments}())?Mt:function(n){return gu(n)&&ui.call(n,"callee")&&!di.call(n,"callee")},uf=qu.isArray,of=Hn?S(Hn):Tt,ff=Ii||Zu,cf=Jn?S(Jn):$t,af=Yn?S(Yn):Nt,lf=Qn?S(Qn):qt,sf=Xn?S(Xn):Vt,hf=nt?S(nt):Kt,pf=ue(Jt),_f=ue(function(n,t){return n<=t}),vf=Fr(function(n,t){if(Se(t)||au(t))Mr(t,Ru(t),n);else for(var r in t)ui.call(t,r)&&lt(n,r,t[r]);        }),gf=Fr(function(n,t){Mr(t,zu(t),n)}),df=Fr(function(n,t,r,e){Mr(t,zu(t),n,e)}),yf=Fr(function(n,t,r,e){Mr(t,Ru(t),n,e)}),bf=se(vt),xf=lr(function(n){return n.push(F,ct),r(df,F,n)}),jf=lr(function(n){return n.push(F,Re),r(Ef,F,n)}),wf=Qr(function(n,t,r){n[t]=r},Du(Mu)),mf=Qr(function(n,t,r){ui.call(n,t)?n[t].push(r):n[t]=[r]},ve),Af=lr(Dt),kf=Fr(function(n,t,r){nr(n,t,r)}),Ef=Fr(function(n,t,r,e){nr(n,t,r,e)}),Of=se(function(n,t){return null==n?{}:(t=l(t,Ce),er(n,jt(Rt(n,zu,ho),t)))}),Sf=se(function(n,t){            return null==n?{}:er(n,l(t,Ce))}),If=fe(Ru),Rf=fe(zu),zf=Vr(function(n,t,r){return t=t.toLowerCase(),n+(r?Lu(t):t)}),Wf=Vr(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()}),Bf=Vr(function(n,t,r){return n+(r?" ":"")+t.toLowerCase()}),Lf=qr("toLowerCase"),Uf=Vr(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()}),Cf=Vr(function(n,t,r){return n+(r?" ":"")+Mf(t)}),Df=Vr(function(n,t,r){return n+(r?" ":"")+t.toUpperCase()}),Mf=qr("toUpperCase"),Tf=lr(function(n,t){try{return r(n,F,t)}catch(n){return su(n)?n:new Ku(n);        }}),$f=se(function(n,t){return u(t,function(t){t=Ce(t),_t(n,t,Ko(n[t],n))}),n}),Ff=Jr(),Nf=Jr(true),Pf=lr(function(n,t){return function(r){return Dt(r,n,t)}}),Zf=lr(function(n,t){return function(r){return Dt(n,r,t)}}),qf=ne(l),Vf=ne(o),Kf=ne(_),Gf=ee(),Hf=ee(true),Jf=Xr(function(n,t){return n+t},0),Yf=oe("ceil"),Qf=Xr(function(n,t){return n/t},1),Xf=oe("floor"),nc=Xr(function(n,t){return n*t},1),tc=oe("round"),rc=Xr(function(n,t){return n-t},0);return On.after=function(n,t){if(typeof t!="function")throw new Xu("Expected a function");            return n=mu(n),function(){if(1>--n)return t.apply(this,arguments)}},On.ary=tu,On.assign=vf,On.assignIn=gf,On.assignInWith=df,On.assignWith=yf,On.at=bf,On.before=ru,On.bind=Ko,On.bindAll=$f,On.bindKey=Go,On.castArray=function(){if(!arguments.length)return[];var n=arguments[0];return uf(n)?n:[n]},On.chain=He,On.chunk=function(n,t,r){if(t=(r?ke(n,t,r):t===F)?1:Bi(mu(t),0),r=null==n?0:n.length,!r||1>t)return[];for(var e=0,u=0,i=qu(Ei(r/t));e<r;)i[u++]=vr(n,e,e+=t);return i},On.compact=function(n){for(var t=-1,r=null==n?0:n.length,e=0,u=[];++t<r;){            var i=n[t];i&&(u[e++]=i)}return u},On.concat=function(){var n=arguments.length;if(!n)return[];for(var t=qu(n-1),r=arguments[0];n--;)t[n-1]=arguments[n];return s(uf(r)?Dr(r):[r],kt(t,1))},On.cond=function(n){var t=null==n?0:n.length,e=ve();return n=t?l(n,function(n){if("function"!=typeof n[1])throw new Xu("Expected a function");return[e(n[0]),n[1]]}):[],lr(function(e){for(var u=-1;++u<t;){var i=n[u];if(r(i[0],this,e))return r(i[1],this,e)}})},On.conforms=function(n){return yt(dt(n,true))},On.constant=Du,            On.countBy=Mo,On.create=function(n,t){var r=to(n);return null==t?r:pt(r,t)},On.curry=eu,On.curryRight=uu,On.debounce=iu,On.defaults=xf,On.defaultsDeep=jf,On.defer=Ho,On.delay=Jo,On.difference=xo,On.differenceBy=jo,On.differenceWith=wo,On.drop=function(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===F?1:mu(t),vr(n,0>t?0:t,e)):[]},On.dropRight=function(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===F?1:mu(t),t=e-t,vr(n,0,0>t?0:t)):[]},On.dropRightWhile=function(n,t){return n&&n.length?mr(n,ve(t,3),true,true):[];        },On.dropWhile=function(n,t){return n&&n.length?mr(n,ve(t,3),true):[]},On.fill=function(n,t,r,e){var u=null==n?0:n.length;if(!u)return[];for(r&&typeof r!="number"&&ke(n,t,r)&&(r=0,e=u),u=n.length,r=mu(r),0>r&&(r=-r>u?0:u+r),e=e===F||e>u?u:mu(e),0>e&&(e+=u),e=r>e?0:Au(e);r<e;)n[r++]=t;return n},On.filter=function(n,t){return(uf(n)?f:At)(n,ve(t,3))},On.flatMap=function(n,t){return kt(nu(n,t),1)},On.flatMapDeep=function(n,t){return kt(nu(n,t),N)},On.flatMapDepth=function(n,t,r){return r=r===F?1:mu(r),            kt(nu(n,t),r)},On.flatten=Ne,On.flattenDeep=function(n){return(null==n?0:n.length)?kt(n,N):[]},On.flattenDepth=function(n,t){return null!=n&&n.length?(t=t===F?1:mu(t),kt(n,t)):[]},On.flip=function(n){return ce(n,512)},On.flow=Ff,On.flowRight=Nf,On.fromPairs=function(n){for(var t=-1,r=null==n?0:n.length,e={};++t<r;){var u=n[t];e[u[0]]=u[1]}return e},On.functions=function(n){return null==n?[]:St(n,Ru(n))},On.functionsIn=function(n){return null==n?[]:St(n,zu(n))},On.groupBy=Fo,On.initial=function(n){            return(null==n?0:n.length)?vr(n,0,-1):[]},On.intersection=mo,On.intersectionBy=Ao,On.intersectionWith=ko,On.invert=wf,On.invertBy=mf,On.invokeMap=No,On.iteratee=Tu,On.keyBy=Po,On.keys=Ru,On.keysIn=zu,On.map=nu,On.mapKeys=function(n,t){var r={};return t=ve(t,3),Et(n,function(n,e,u){_t(r,t(n,e,u),n)}),r},On.mapValues=function(n,t){var r={};return t=ve(t,3),Et(n,function(n,e,u){_t(r,e,t(n,e,u))}),r},On.matches=function(n){return Qt(dt(n,true))},On.matchesProperty=function(n,t){return Xt(n,dt(t,true))},On.memoize=ou,            On.merge=kf,On.mergeWith=Ef,On.method=Pf,On.methodOf=Zf,On.mixin=$u,On.negate=fu,On.nthArg=function(n){return n=mu(n),lr(function(t){return tr(t,n)})},On.omit=Of,On.omitBy=function(n,t){return Wu(n,fu(ve(t)))},On.once=function(n){return ru(2,n)},On.orderBy=function(n,t,r,e){return null==n?[]:(uf(t)||(t=null==t?[]:[t]),r=e?F:r,uf(r)||(r=null==r?[]:[r]),rr(n,t,r))},On.over=qf,On.overArgs=Yo,On.overEvery=Vf,On.overSome=Kf,On.partial=Qo,On.partialRight=Xo,On.partition=Zo,On.pick=Sf,On.pickBy=Wu,On.property=Nu,            On.propertyOf=function(n){return function(t){return null==n?F:It(n,t)}},On.pull=Eo,On.pullAll=qe,On.pullAllBy=function(n,t,r){return n&&n.length&&t&&t.length?or(n,t,ve(r,2)):n},On.pullAllWith=function(n,t,r){return n&&n.length&&t&&t.length?or(n,t,F,r):n},On.pullAt=Oo,On.range=Gf,On.rangeRight=Hf,On.rearg=nf,On.reject=function(n,t){return(uf(n)?f:At)(n,fu(ve(t,3)))},On.remove=function(n,t){var r=[];if(!n||!n.length)return r;var e=-1,u=[],i=n.length;for(t=ve(t,3);++e<i;){var o=n[e];t(o,e,n)&&(r.push(o),            u.push(e))}return fr(n,u),r},On.rest=function(n,t){if(typeof n!="function")throw new Xu("Expected a function");return t=t===F?t:mu(t),lr(n,t)},On.reverse=Ve,On.sampleSize=function(n,t,r){return t=(r?ke(n,t,r):t===F)?1:mu(t),(uf(n)?ot:hr)(n,t)},On.set=function(n,t,r){return null==n?n:pr(n,t,r)},On.setWith=function(n,t,r,e){return e=typeof e=="function"?e:F,null==n?n:pr(n,t,r,e)},On.shuffle=function(n){return(uf(n)?ft:_r)(n)},On.slice=function(n,t,r){var e=null==n?0:n.length;return e?(r&&typeof r!="number"&&ke(n,t,r)?(t=0,            r=e):(t=null==t?0:mu(t),r=r===F?e:mu(r)),vr(n,t,r)):[]},On.sortBy=qo,On.sortedUniq=function(n){return n&&n.length?br(n):[]},On.sortedUniqBy=function(n,t){return n&&n.length?br(n,ve(t,2)):[]},On.split=function(n,t,r){return r&&typeof r!="number"&&ke(n,t,r)&&(t=r=F),r=r===F?4294967295:r>>>0,r?(n=Ou(n))&&(typeof t=="string"||null!=t&&!lf(t))&&(t=jr(t),!t&&Bn.test(n))?Rr($(n),0,r):n.split(t,r):[]},On.spread=function(n,t){if(typeof n!="function")throw new Xu("Expected a function");return t=t===F?0:Bi(mu(t),0),            lr(function(e){var u=e[t];return e=Rr(e,0,t),u&&s(e,u),r(n,this,e)})},On.tail=function(n){var t=null==n?0:n.length;return t?vr(n,1,t):[]},On.take=function(n,t,r){return n&&n.length?(t=r||t===F?1:mu(t),vr(n,0,0>t?0:t)):[]},On.takeRight=function(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===F?1:mu(t),t=e-t,vr(n,0>t?0:t,e)):[]},On.takeRightWhile=function(n,t){return n&&n.length?mr(n,ve(t,3),false,true):[]},On.takeWhile=function(n,t){return n&&n.length?mr(n,ve(t,3)):[]},On.tap=function(n,t){return t(n),            n},On.throttle=function(n,t,r){var e=true,u=true;if(typeof n!="function")throw new Xu("Expected a function");return vu(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),iu(n,t,{leading:e,maxWait:t,trailing:u})},On.thru=Je,On.toArray=ju,On.toPairs=If,On.toPairsIn=Rf,On.toPath=function(n){return uf(n)?l(n,Ce):xu(n)?[n]:Dr(bo(n))},On.toPlainObject=Eu,On.transform=function(n,t,r){var e=uf(n),i=e||ff(n)||hf(n);if(t=ve(t,4),null==r){var o=n&&n.constructor;r=i?e?new o:[]:vu(n)&&hu(o)?to(vi(n)):{};        }return(i?u:Et)(n,function(n,e,u){return t(r,n,e,u)}),r},On.unary=function(n){return tu(n,1)},On.union=So,On.unionBy=Io,On.unionWith=Ro,On.uniq=function(n){return n&&n.length?wr(n):[]},On.uniqBy=function(n,t){return n&&n.length?wr(n,ve(t,2)):[]},On.uniqWith=function(n,t){return t=typeof t=="function"?t:F,n&&n.length?wr(n,F,t):[]},On.unset=function(n,t){var r;if(null==n)r=true;else{r=n;var e=t,e=Ee(e,r)?[e]:Ir(e);r=We(r,e),e=Ce(Ze(e)),r=!(null!=r&&ui.call(r,e))||delete r[e]}return r},On.unzip=Ke,On.unzipWith=Ge,            On.update=function(n,t,r){return null==n?n:pr(n,t,Sr(r)(It(n,t)),void 0)},On.updateWith=function(n,t,r,e){return e=typeof e=="function"?e:F,null!=n&&(n=pr(n,t,Sr(r)(It(n,t)),e)),n},On.values=Bu,On.valuesIn=function(n){return null==n?[]:I(n,zu(n))},On.without=zo,On.words=Cu,On.wrap=function(n,t){return Qo(Sr(t),n)},On.xor=Wo,On.xorBy=Bo,On.xorWith=Lo,On.zip=Uo,On.zipObject=function(n,t){return Er(n||[],t||[],lt)},On.zipObjectDeep=function(n,t){return Er(n||[],t||[],pr)},On.zipWith=Co,On.entries=If,            On.entriesIn=Rf,On.extend=gf,On.extendWith=df,$u(On,On),On.add=Jf,On.attempt=Tf,On.camelCase=zf,On.capitalize=Lu,On.ceil=Yf,On.clamp=function(n,t,r){return r===F&&(r=t,t=F),r!==F&&(r=ku(r),r=r===r?r:0),t!==F&&(t=ku(t),t=t===t?t:0),gt(ku(n),t,r)},On.clone=function(n){return dt(n,false,true)},On.cloneDeep=function(n){return dt(n,true,true)},On.cloneDeepWith=function(n,t){return t=typeof t=="function"?t:F,dt(n,true,true,t)},On.cloneWith=function(n,t){return t=typeof t=="function"?t:F,dt(n,false,true,t)},On.conformsTo=function(n,t){                return null==t||bt(n,t,Ru(t))},On.deburr=Uu,On.defaultTo=function(n,t){return null==n||n!==n?t:n},On.divide=Qf,On.endsWith=function(n,t,r){n=Ou(n),t=jr(t);var e=n.length,e=r=r===F?e:gt(mu(r),0,e);return r-=t.length,0<=r&&n.slice(r,e)==t},On.eq=cu,On.escape=function(n){return(n=Ou(n))&&Y.test(n)?n.replace(H,et):n},On.escapeRegExp=function(n){return(n=Ou(n))&&fn.test(n)?n.replace(on,"\\$&"):n},On.every=function(n,t,r){var e=uf(n)?o:wt;return r&&ke(n,t,r)&&(t=F),e(n,ve(t,3))},On.find=To,On.findIndex=$e,            On.findKey=function(n,t){return v(n,ve(t,3),Et)},On.findLast=$o,On.findLastIndex=Fe,On.findLastKey=function(n,t){return v(n,ve(t,3),Ot)},On.floor=Xf,On.forEach=Qe,On.forEachRight=Xe,On.forIn=function(n,t){return null==n?n:uo(n,ve(t,3),zu)},On.forInRight=function(n,t){return null==n?n:io(n,ve(t,3),zu)},On.forOwn=function(n,t){return n&&Et(n,ve(t,3))},On.forOwnRight=function(n,t){return n&&Ot(n,ve(t,3))},On.get=Su,On.gt=tf,On.gte=rf,On.has=function(n,t){return null!=n&&be(n,t,Bt)},On.hasIn=Iu,On.head=Pe,            On.identity=Mu,On.includes=function(n,t,r,e){return n=au(n)?n:Bu(n),r=r&&!e?mu(r):0,e=n.length,0>r&&(r=Bi(e+r,0)),bu(n)?r<=e&&-1<n.indexOf(t,r):!!e&&-1<d(n,t,r)},On.indexOf=function(n,t,r){var e=null==n?0:n.length;return e?(r=null==r?0:mu(r),0>r&&(r=Bi(e+r,0)),d(n,t,r)):-1},On.inRange=function(n,t,r){return t=wu(t),r===F?(r=t,t=0):r=wu(r),n=ku(n),n>=Li(t,r)&&n<Bi(t,r)},On.invoke=Af,On.isArguments=ef,On.isArray=uf,On.isArrayBuffer=of,On.isArrayLike=au,On.isArrayLikeObject=lu,On.isBoolean=function(n){                return true===n||false===n||gu(n)&&"[object Boolean]"==zt(n)},On.isBuffer=ff,On.isDate=cf,On.isElement=function(n){return gu(n)&&1===n.nodeType&&!yu(n)},On.isEmpty=function(n){if(null==n)return true;if(au(n)&&(uf(n)||typeof n=="string"||typeof n.splice=="function"||ff(n)||hf(n)||ef(n)))return!n.length;var t=po(n);if("[object Map]"==t||"[object Set]"==t)return!n.size;if(Se(n))return!Ht(n).length;for(var r in n)if(ui.call(n,r))return false;return true},On.isEqual=function(n,t){return Ft(n,t)},On.isEqualWith=function(n,t,r){                var e=(r=typeof r=="function"?r:F)?r(n,t):F;return e===F?Ft(n,t,r):!!e},On.isError=su,On.isFinite=function(n){return typeof n=="number"&&Ri(n)},On.isFunction=hu,On.isInteger=pu,On.isLength=_u,On.isMap=af,On.isMatch=function(n,t){return n===t||Pt(n,t,de(t))},On.isMatchWith=function(n,t,r){return r=typeof r=="function"?r:F,Pt(n,t,de(t),r)},On.isNaN=function(n){return du(n)&&n!=+n},On.isNative=function(n){if(_o(n))throw new Ku("Unsupported core-js use. Try https://github.com/es-shims.");return Zt(n)},            On.isNil=function(n){return null==n},On.isNull=function(n){return null===n},On.isNumber=du,On.isObject=vu,On.isObjectLike=gu,On.isPlainObject=yu,On.isRegExp=lf,On.isSafeInteger=function(n){return pu(n)&&-9007199254740991<=n&&9007199254740991>=n},On.isSet=sf,On.isString=bu,On.isSymbol=xu,On.isTypedArray=hf,On.isUndefined=function(n){return n===F},On.isWeakMap=function(n){return gu(n)&&"[object WeakMap]"==po(n)},On.isWeakSet=function(n){return gu(n)&&"[object WeakSet]"==zt(n)},On.join=function(n,t){                return null==n?"":zi.call(n,t)},On.kebabCase=Wf,On.last=Ze,On.lastIndexOf=function(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e;if(r!==F&&(u=mu(r),u=0>u?Bi(e+u,0):Li(u,e-1)),t===t){for(r=u+1;r--&&n[r]!==t;);n=r}else n=g(n,b,u,true);return n},On.lowerCase=Bf,On.lowerFirst=Lf,On.lt=pf,On.lte=_f,On.max=function(n){return n&&n.length?mt(n,Mu,Wt):F},On.maxBy=function(n,t){return n&&n.length?mt(n,ve(t,2),Wt):F},On.mean=function(n){return x(n,Mu)},On.meanBy=function(n,t){return x(n,ve(t,2))},On.min=function(n){                return n&&n.length?mt(n,Mu,Jt):F},On.minBy=function(n,t){return n&&n.length?mt(n,ve(t,2),Jt):F},On.stubArray=Pu,On.stubFalse=Zu,On.stubObject=function(){return{}},On.stubString=function(){return""},On.stubTrue=function(){return true},On.multiply=nc,On.nth=function(n,t){return n&&n.length?tr(n,mu(t)):F},On.noConflict=function(){return Zn._===this&&(Zn._=ai),this},On.noop=Fu,On.now=Vo,On.pad=function(n,t,r){n=Ou(n);var e=(t=mu(t))?T(n):0;return!t||e>=t?n:(t=(t-e)/2,te(Oi(t),r)+n+te(Ei(t),r))},On.padEnd=function(n,t,r){                n=Ou(n);var e=(t=mu(t))?T(n):0;return t&&e<t?n+te(t-e,r):n},On.padStart=function(n,t,r){n=Ou(n);var e=(t=mu(t))?T(n):0;return t&&e<t?te(t-e,r)+n:n},On.parseInt=function(n,t,r){return r||null==t?t=0:t&&(t=+t),Ci(Ou(n).replace(an,""),t||0)},On.random=function(n,t,r){if(r&&typeof r!="boolean"&&ke(n,t,r)&&(t=r=F),r===F&&(typeof t=="boolean"?(r=t,t=F):typeof n=="boolean"&&(r=n,n=F)),n===F&&t===F?(n=0,t=1):(n=wu(n),t===F?(t=n,n=0):t=wu(t)),n>t){var e=n;n=t,t=e}return r||n%1||t%1?(r=Di(),Li(n+r*(t-n+$n("1e-"+((r+"").length-1))),t)):cr(n,t);            },On.reduce=function(n,t,r){var e=uf(n)?h:m,u=3>arguments.length;return e(n,ve(t,4),r,u,ro)},On.reduceRight=function(n,t,r){var e=uf(n)?p:m,u=3>arguments.length;return e(n,ve(t,4),r,u,eo)},On.repeat=function(n,t,r){return t=(r?ke(n,t,r):t===F)?1:mu(t),ar(Ou(n),t)},On.replace=function(){var n=arguments,t=Ou(n[0]);return 3>n.length?t:t.replace(n[1],n[2])},On.result=function(n,t,r){t=Ee(t,n)?[t]:Ir(t);var e=-1,u=t.length;for(u||(n=F,u=1);++e<u;){var i=null==n?F:n[Ce(t[e])];i===F&&(e=u,i=r),n=hu(i)?i.call(n):i;            }return n},On.round=tc,On.runInContext=w,On.sample=function(n){return(uf(n)?tt:sr)(n)},On.size=function(n){if(null==n)return 0;if(au(n))return bu(n)?T(n):n.length;var t=po(n);return"[object Map]"==t||"[object Set]"==t?n.size:Ht(n).length},On.snakeCase=Uf,On.some=function(n,t,r){var e=uf(n)?_:gr;return r&&ke(n,t,r)&&(t=F),e(n,ve(t,3))},On.sortedIndex=function(n,t){return dr(n,t)},On.sortedIndexBy=function(n,t,r){return yr(n,t,ve(r,2))},On.sortedIndexOf=function(n,t){var r=null==n?0:n.length;if(r){                var e=dr(n,t);if(e<r&&cu(n[e],t))return e}return-1},On.sortedLastIndex=function(n,t){return dr(n,t,true)},On.sortedLastIndexBy=function(n,t,r){return yr(n,t,ve(r,2),true)},On.sortedLastIndexOf=function(n,t){if(null==n?0:n.length){var r=dr(n,t,true)-1;if(cu(n[r],t))return r}return-1},On.startCase=Cf,On.startsWith=function(n,t,r){return n=Ou(n),r=gt(mu(r),0,n.length),t=jr(t),n.slice(r,r+t.length)==t},On.subtract=rc,On.sum=function(n){return n&&n.length?k(n,Mu):0},On.sumBy=function(n,t){return n&&n.length?k(n,ve(t,2)):0;            },On.template=function(n,t,r){var e=On.templateSettings;r&&ke(n,t,r)&&(t=F),n=Ou(n),t=df({},t,e,ct),r=df({},t.imports,e.imports,ct);var u,i,o=Ru(r),f=I(r,o),c=0;r=t.interpolate||An;var a="__p+='";r=Yu((t.escape||An).source+"|"+r.source+"|"+(r===nn?gn:An).source+"|"+(t.evaluate||An).source+"|$","g");var l="sourceURL"in t?"//# sourceURL="+t.sourceURL+"\n":"";if(n.replace(r,function(t,r,e,o,f,l){return e||(e=o),a+=n.slice(c,l).replace(kn,B),r&&(u=true,a+="'+__e("+r+")+'"),f&&(i=true,a+="';"+f+";\n__p+='"),                e&&(a+="'+((__t=("+e+"))==null?'':__t)+'"),c=l+t.length,t}),a+="';",(t=t.variable)||(a="with(obj){"+a+"}"),a=(i?a.replace(q,""):a).replace(V,"$1").replace(K,"$1;"),a="function("+(t||"obj")+"){"+(t?"":"obj||(obj={});")+"var __t,__p=''"+(u?",__e=_.escape":"")+(i?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+a+"return __p}",t=Tf(function(){return Gu(o,l+"return "+a).apply(F,f)}),t.source=a,su(t))throw t;return t},On.times=function(n,t){if(n=mu(n),1>n||9007199254740991<n)return[];                var r=4294967295,e=Li(n,4294967295);for(t=ve(t),n-=4294967295,e=E(e,t);++r<n;)t(r);return e},On.toFinite=wu,On.toInteger=mu,On.toLength=Au,On.toLower=function(n){return Ou(n).toLowerCase()},On.toNumber=ku,On.toSafeInteger=function(n){return gt(mu(n),-9007199254740991,9007199254740991)},On.toString=Ou,On.toUpper=function(n){return Ou(n).toUpperCase()},On.trim=function(n,t,r){return(n=Ou(n))&&(r||t===F)?n.replace(cn,""):n&&(t=jr(t))?(n=$(n),r=$(t),t=z(n,r),r=W(n,r)+1,Rr(n,t,r).join("")):n},On.trimEnd=function(n,t,r){                return(n=Ou(n))&&(r||t===F)?n.replace(ln,""):n&&(t=jr(t))?(n=$(n),t=W(n,$(t))+1,Rr(n,0,t).join("")):n},On.trimStart=function(n,t,r){return(n=Ou(n))&&(r||t===F)?n.replace(an,""):n&&(t=jr(t))?(n=$(n),t=z(n,$(t)),Rr(n,t).join("")):n},On.truncate=function(n,t){var r=30,e="...";if(vu(t))var u="separator"in t?t.separator:u,r="length"in t?mu(t.length):r,e="omission"in t?jr(t.omission):e;n=Ou(n);var i=n.length;if(Bn.test(n))var o=$(n),i=o.length;if(r>=i)return n;if(i=r-T(e),1>i)return e;if(r=o?Rr(o,0,i).join(""):n.slice(0,i),                u===F)return r+e;if(o&&(i+=r.length-i),lf(u)){if(n.slice(i).search(u)){var f=r;for(u.global||(u=Yu(u.source,Ou(dn.exec(u))+"g")),u.lastIndex=0;o=u.exec(f);)var c=o.index;r=r.slice(0,c===F?i:c)}}else n.indexOf(jr(u),i)!=i&&(u=r.lastIndexOf(u),-1<u&&(r=r.slice(0,u)));return r+e},On.unescape=function(n){return(n=Ou(n))&&J.test(n)?n.replace(G,ut):n},On.uniqueId=function(n){var t=++ii;return Ou(n)+t},On.upperCase=Df,On.upperFirst=Mf,On.each=Qe,On.eachRight=Xe,On.first=Pe,$u(On,function(){var n={};return Et(On,function(t,r){                ui.call(On.prototype,r)||(n[r]=t)}),n}(),{chain:false}),On.VERSION="4.16.6",u("bind bindKey curry curryRight partial partialRight".split(" "),function(n){On[n].placeholder=On}),u(["drop","take"],function(n,t){Mn.prototype[n]=function(r){var e=this.__filtered__;if(e&&!t)return new Mn(this);r=r===F?1:Bi(mu(r),0);var u=this.clone();return e?u.__takeCount__=Li(r,u.__takeCount__):u.__views__.push({size:Li(r,4294967295),type:n+(0>u.__dir__?"Right":"")}),u},Mn.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse();            }}),u(["filter","map","takeWhile"],function(n,t){var r=t+1,e=1==r||3==r;Mn.prototype[n]=function(n){var t=this.clone();return t.__iteratees__.push({iteratee:ve(n,3),type:r}),t.__filtered__=t.__filtered__||e,t}}),u(["head","last"],function(n,t){var r="take"+(t?"Right":"");Mn.prototype[n]=function(){return this[r](1).value()[0]}}),u(["initial","tail"],function(n,t){var r="drop"+(t?"":"Right");Mn.prototype[n]=function(){return this.__filtered__?new Mn(this):this[r](1)}}),Mn.prototype.compact=function(){                return this.filter(Mu)},Mn.prototype.find=function(n){return this.filter(n).head()},Mn.prototype.findLast=function(n){return this.reverse().find(n)},Mn.prototype.invokeMap=lr(function(n,t){return typeof n=="function"?new Mn(this):this.map(function(r){return Dt(r,n,t)})}),Mn.prototype.reject=function(n){return this.filter(fu(ve(n)))},Mn.prototype.slice=function(n,t){n=mu(n);var r=this;return r.__filtered__&&(0<n||0>t)?new Mn(r):(0>n?r=r.takeRight(-n):n&&(r=r.drop(n)),t!==F&&(t=mu(t),r=0>t?r.dropRight(-t):r.take(t-n)),                r)},Mn.prototype.takeRightWhile=function(n){return this.reverse().takeWhile(n).reverse()},Mn.prototype.toArray=function(){return this.take(4294967295)},Et(Mn.prototype,function(n,t){var r=/^(?:filter|find|map|reject)|While$/.test(t),e=/^(?:head|last)$/.test(t),u=On[e?"take"+("last"==t?"Right":""):t],i=e||/^find/.test(t);u&&(On.prototype[t]=function(){function t(n){return n=u.apply(On,s([n],f)),e&&h?n[0]:n}var o=this.__wrapped__,f=e?[1]:arguments,c=o instanceof Mn,a=f[0],l=c||uf(o);l&&r&&typeof a=="function"&&1!=a.length&&(c=l=false);                var h=this.__chain__,p=!!this.__actions__.length,a=i&&!h,c=c&&!p;return!i&&l?(o=c?o:new Mn(this),o=n.apply(o,f),o.__actions__.push({func:Je,args:[t],thisArg:F}),new zn(o,h)):a&&c?n.apply(this,f):(o=this.thru(t),a?e?o.value()[0]:o.value():o)})}),u("pop push shift sort splice unshift".split(" "),function(n){var t=ni[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|shift)$/.test(n);On.prototype[n]=function(){var n=arguments;if(e&&!this.__chain__){var u=this.value();return t.apply(uf(u)?u:[],n);            }return this[r](function(r){return t.apply(uf(r)?r:[],n)})}}),Et(Mn.prototype,function(n,t){var r=On[t];if(r){var e=r.name+"";(Vi[e]||(Vi[e]=[])).push({name:t,func:r})}}),Vi[Yr(F,2).name]=[{name:"wrapper",func:F}],Mn.prototype.clone=function(){var n=new Mn(this.__wrapped__);return n.__actions__=Dr(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=Dr(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=Dr(this.__views__),n},Mn.prototype.reverse=function(){                if(this.__filtered__){var n=new Mn(this);n.__dir__=-1,n.__filtered__=true}else n=this.clone(),n.__dir__*=-1;return n},Mn.prototype.value=function(){var n,t=this.__wrapped__.value(),r=this.__dir__,e=uf(t),u=0>r,i=e?t.length:0;n=i;for(var o=this.__views__,f=0,c=-1,a=o.length;++c<a;){var l=o[c],s=l.size;switch(l.type){case"drop":f+=s;break;case"dropRight":n-=s;break;case"take":n=Li(n,f+s);break;case"takeRight":f=Bi(f,n-s)}}if(n={start:f,end:n},o=n.start,f=n.end,n=f-o,u=u?f:o-1,o=this.__iteratees__,f=o.length,                    c=0,a=Li(n,this.__takeCount__),!e||200>i||i==n&&a==n)return Ar(t,this.__actions__);e=[];n:for(;n--&&c<a;){for(u+=r,i=-1,l=t[u];++i<f;){var h=o[i],s=h.type,h=(0,h.iteratee)(l);if(2==s)l=h;else if(!h){if(1==s)continue n;break n}}e[c++]=l}return e},On.prototype.at=Do,On.prototype.chain=function(){return He(this)},On.prototype.commit=function(){return new zn(this.value(),this.__chain__)},On.prototype.next=function(){this.__values__===F&&(this.__values__=ju(this.value()));var n=this.__index__>=this.__values__.length;                return{done:n,value:n?F:this.__values__[this.__index__++]}},On.prototype.plant=function(n){for(var t,r=this;r instanceof Sn;){var e=Te(r);e.__index__=0,e.__values__=F,t?u.__wrapped__=e:t=e;var u=e,r=r.__wrapped__}return u.__wrapped__=n,t},On.prototype.reverse=function(){var n=this.__wrapped__;return n instanceof Mn?(this.__actions__.length&&(n=new Mn(this)),n=n.reverse(),n.__actions__.push({func:Je,args:[Ve],thisArg:F}),new zn(n,this.__chain__)):this.thru(Ve)},On.prototype.toJSON=On.prototype.valueOf=On.prototype.value=function(){                return Ar(this.__wrapped__,this.__actions__)},On.prototype.first=On.prototype.head,xi&&(On.prototype[xi]=Ye),On}();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(Zn._=it, define(function(){return it})):Vn?((Vn.exports=it)._=it,qn._=it):Zn._=it}).call(this);/** * Created by Сергей on 11.11.2016. */var data = [    {        "guid": "701b29c3-b35d-4cf1-a5f6-8b12b29a5081",        "index": 0,        "favoriteFruit": "banana",        "latitude": 58.161524999999997,        "company": "INDEXIA",        "email": "moorehensley@indexia.com",        "picture": "http://placehold.it/32x32",        "registered": "2015-07-03T08:30:59 -03:00",        "eyeColor": "blue",        "phone": "+1 (848) 556-2344",        "address": "268 Debevoise Street, Fidelis, North Carolina, 3606",        "friends": [            {                "id": 0,                "name": "Sharron Pace"            }        ],        "isActive": false,        "about": "Velit laborum aliquip voluptate incididunt dolore qui proident velit adipisicing. Pariatur sint fugiat aute eiusmod aute aliquip dolor culpa enim quis. Ea elit ad duis cillum et aliquip. Elit aliquip enim ut quis tempor. Veniam irure minim esse proident culpa Lorem duis veniam dolor anim quis laboris id laboris. Enim minim eiusmod labore do consectetur voluptate pariatur cillum fugiat dolore magna incididunt. Qui eiusmod Lorem qui irure consequat.\r\n",        "balance": "$2,811.93",        "name": "Moore Hensley",        "skills": [            "ea",            "ipsum",            "Lorem"        ],        "gender": "male",        "age": 37,        "greeting": "Hello, Moore Hensley! You have 5 unread messages.",        "longitude": -10.931599,        "_id": "56bdc339702f16daa316d2eb"    },    {        "guid": "7a3cbd18-57a1-4534-8e12-1caad921bda1",        "index": 1,        "favoriteFruit": "banana",        "latitude": 14.810798999999999,        "company": "TUBESYS",        "email": "sharlenebush@tubesys.com",        "picture": "http://placehold.it/32x32",        "registered": "2014-03-22T11:03:44 -02:00",        "eyeColor": "blue",        "phone": "+1 (855) 582-2464",        "address": "848 Hicks Street, Chestnut, Palau, 5667",        "friends": [            {                "id": 0,                "name": "Briana Decker"            },            {                "id": 1,                "name": "Sharron Pace"            }        ],        "isActive": true,        "about": "Consectetur velit officia eiusmod esse labore sint anim nostrud elit nulla dolore dolor. In aute ad incididunt pariatur cupidatat do deserunt irure. Exercitation cillum enim incididunt amet Lorem ut Lorem nulla.\r\n",        "balance": "$3,821.77",        "name": "Sharlene Bush",        "skills": [            "tempor",            "mollit",            "velit",            "commodo",            "veniam",            "cupidatat",            "laborum"        ],        "gender": "female",        "age": 34,        "greeting": "Hello, Sharlene Bush! You have 2 unread messages.",        "longitude": 65.625151000000002,        "_id": "56bdc33986e3357811d1a81e"    },    {        "guid": "88beb2f3-e4c2-49f3-a0a0-ecf957a95af3",        "index": 2,        "favoriteFruit": "apple",        "latitude": 73.588680999999994,        "company": "XINWARE",        "email": "rossvazquez@xinware.com",        "picture": "http://placehold.it/32x32",        "registered": "2014-06-14T03:11:08 -03:00",        "eyeColor": "green",        "phone": "+1 (814) 593-3825",        "address": "680 Pooles Lane, Sattley, Maine, 3025",        "friends": [            {                "id": 0,                "name": "Marilyn Mcintosh"            },            {                "id": 1,                "name": "Padilla Garrison"            },            {                "id": 2,                "name": "Naomi Buckner"            }        ],        "isActive": false,        "about": "Ut dolor nostrud enim ullamco sit reprehenderit nisi commodo eiusmod amet esse ea. Lorem amet duis in culpa do laboris deserunt esse culpa irure est. Lorem tempor officia amet amet magna ea pariatur. Occaecat qui minim commodo quis excepteur eiusmod in minim deserunt occaecat dolor. Ipsum dolore elit pariatur exercitation anim.\r\n",        "balance": "$3,793.59",        "name": "Ross Vazquez",        "skills": [            "nulla",            "anim",            "proident",            "ipsum",            "ad",            "consectetur",            "elit"        ],        "gender": "male",        "age": 24,        "greeting": "Hello, Ross Vazquez! You have 9 unread messages.",        "longitude": 139.45094800000001,        "_id": "56bdc3397558ab111683cfd6"    },    {        "guid": "249b6175-5c30-44c6-b154-f120923736f5",        "index": 3,        "favoriteFruit": "banana",        "latitude": -76.562336000000002,        "company": "OMATOM",        "email": "elmahead@omatom.com",        "picture": "http://placehold.it/32x32",        "registered": "2014-01-15T06:51:52 -02:00",        "eyeColor": "green",        "phone": "+1 (909) 547-2687",        "address": "956 Roebling Street, Fairforest, Virgin Islands, 2586",        "friends": [            {                "id": 0,                "name": "Goldie Gentry"            },            {                "id": 1,                "name": "Aisha Tran"            }        ],        "isActive": true,        "about": "Anim mollit tempor ullamco adipisicing ipsum labore incididunt occaecat aliquip sint et enim. Ad nulla labore commodo proident aute. Nisi elit aute labore magna fugiat aliqua. Voluptate cupidatat duis est laboris. Quis ut amet nulla sit esse commodo commodo fugiat dolor tempor enim velit. In pariatur ex labore ea tempor proident proident. Sint excepteur excepteur dolor tempor nostrud nisi proident cupidatat excepteur laborum incididunt culpa aliqua.\r\n",        "balance": "$2,278.75",        "name": "Elma Head",        "skills": [            "adipisicing",            "irure",            "sit",            "quis",            "velit"        ],        "gender": "female",        "age": 21,        "greeting": "Hello, Elma Head! You have 8 unread messages.",        "longitude": -131.352147,        "_id": "56bdc3395273667c0f89b902"    },    {        "guid": "334f8cb3-eb04-45e6-abf4-4935dd439b70",        "index": 4,        "favoriteFruit": "banana",        "latitude": 19.039227,        "company": "NURALI",        "email": "careybarr@nurali.com",        "picture": "http://placehold.it/32x32",        "registered": "2015-04-03T01:25:56 -03:00",        "eyeColor": "blue",        "phone": "+1 (956) 512-2693",        "address": "500 Harbor Court, Wilmington, District Of Columbia, 4946",        "friends": [            {                "id": 0,                "name": "Jordan Sampson"            },            {                "id": 1,                "name": "Eddie Strong"            }        ],        "isActive": true,        "about": "Deserunt anim esse duis labore enim ex ullamco. Commodo enim fugiat dolore qui aliquip. Est voluptate sit fugiat est. Duis eu exercitation amet cillum esse aliquip quis culpa mollit commodo anim.\r\n",        "balance": "$3,951.17",        "name": "Carey Barr",        "skills": [            "ex",            "culpa",            "nostrud",            "et"        ],        "gender": "male",        "age": 27,        "greeting": "Hello, Carey Barr! You have 4 unread messages.",        "longitude": -100.85060199999999,        "_id": "56bdc3398f16bb4615b26c69"    },    {        "guid": "150b00fb-dd82-427d-9faf-2879ea87c695",        "index": 5,        "favoriteFruit": "apple",        "latitude": -33.762830999999998,        "company": "FURNIGEER",        "email": "blackburndotson@furnigeer.com",        "picture": "http://placehold.it/32x32",        "registered": "2014-12-19T02:55:31 -02:00",        "eyeColor": "brown",        "phone": "+1 (876) 411-2433",        "address": "219 Bijou Avenue, Finzel, Wisconsin, 9092",        "friends": [            {                "id": 0,                "name": "Jacklyn Lucas"            },            {                "id": 1,                "name": "Linda Chapman"            }        ],        "isActive": false,        "about": "Qui consequat exercitation incididunt elit non est est ea amet. Ad veniam eiusmod nostrud esse occaecat nulla dolor velit deserunt. Aliquip ex minim amet id id ullamco fugiat. Non exercitation duis fugiat consectetur amet cupidatat veniam id sint enim Lorem amet sit aute. Voluptate minim dolor exercitation id incididunt ullamco proident sit. Velit ut id eu dolore laboris consectetur aute consequat tempor. Sunt aliquip proident officia magna veniam voluptate.\r\n",        "balance": "$1,498.77",        "name": "Blackburn Dotson",        "skills": [            "non",            "do",            "non",            "amet",            "ipsum"        ],        "gender": "male",        "age": 38,        "greeting": "Hello, Blackburn Dotson! You have 6 unread messages.",        "longitude": 32.616394999999997,        "_id": "56bdc33939066929c893b269"    },    {        "guid": "e1bf46ab-7168-491e-925e-f01e21394812",        "index": 6,        "favoriteFruit": "strawberry",        "latitude": 15.419051,        "company": "KOG",        "email": "shereeanthony@kog.com",        "picture": "http://placehold.it/32x32",        "registered": "2015-02-25T01:02:55 -02:00",        "eyeColor": "brown",        "phone": "+1 (979) 504-2554",        "address": "702 Highland Avenue, Caberfae, Minnesota, 5570",        "friends": [            {                "id": 0,                "name": "Goldie Gentry"            },            {                "id": 1,                "name": "Briana Decker"            }        ],        "isActive": true,        "about": "Cillum fugiat officia exercitation nulla quis consequat eu irure ut magna irure. Mollit laborum nulla in laboris officia sit. Nisi cupidatat velit ad deserunt commodo minim minim ullamco adipisicing qui dolore adipisicing esse.\r\n",        "balance": "$2,764.03",        "name": "Sheree Anthony",        "skills": [            "Lorem",            "veniam",            "excepteur",            "culpa"        ],        "gender": "female",        "age": 39,        "greeting": "Hello, Sheree Anthony! You have 5 unread messages.",        "longitude": 37.385548,        "_id": "56bdc3396fdbaec5ee4ca929"    }];var arr = JSON.stringify(data);var users = JSON.parse(arr);//----------skills by alphabet---------------------//var skills = _.map(users, 'skills');var flatten = _.flatten(skills);var uniqSkills = _.uniq(flatten, false).sort();console.log('uniqSkills=', uniqSkills);//------------------friends----------------//var friend = _.sortBy(users, 'friends.length');finalNames = _.map(friend, 'name');console.log(finalNames);//------------------uniq friends-------------------//var fr = _.flatten(_.map(users, 'friends') ),    uniqFriends =_.uniq( _.map(fr, 'name') );console.log(uniqFriends);