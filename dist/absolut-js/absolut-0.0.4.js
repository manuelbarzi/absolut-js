/**
 * AbsolutJS
 * 
 * JavaScript UI framework that works on absolute HTML.
 * 
 * @version 0.0.4
 * 
 * @author manuelbarzi
 */
var Absolut;
(function() {

    /**
     * J(ava)S(cript) utils
     */
    var js;
    (function() {
        'use strict';

        js = {

            // objects

            not: function(obj) {
                return !obj;
            },

            isDefined: function(obj) {
                return obj !== undefined;
            },

            notDefined: function(obj) {
                return obj === undefined;
            },

            typeOf: function(obj) {
                return this.isFunction(obj) ?
                    obj.name || Function.name :
                    obj.constructor.name || Object.name;
            },

            isType: function(obj, type) {
                return obj instanceof type;
            },

            // arrays

            empty: function(arr) {
                return arr.length === 0;
            },

            notEmpty: function(arr) {
                return arr.length !== 0;
            },

            // functions

            /**
             * Checks whether the object is a function
             */

            isFunction: function(obj) {
                return typeof obj === 'function';
            },

            // dom about

            /**
             * Safety run on DOM loaded
             */
            run: function(func) {
                if (js.not(js.run._waiting))
                    js.run._waiting = [];
                if (js.isFunction(func))
                    js.run._waiting.push(func);
                if (js.not(js.run._firstCalled)) {
                    window.addEventListener('load', js.run);
                    return js.run._firstCalled = true;
                }
                if (js.not(document.body))
                    return setTimeout(js.run, 1);
                if (js.not(js.run._running)) {
                    js.run._running = js.run._waiting;
                    js.run._waiting = [];
                    for (var i in js.run._running)
                        js.run._running[i]();
                    js.run._running = undefined;
                    if (js.notEmpty(js.run._waiting))
                        js.run();
                }
            }

        };
    })();

    /**
     * Win(dow) utils
     */
    var win;
    (function() {

        win = {

            width: function() {
                return Math.max(document.documentElement.clientWidth,
                    window.innerWidth || 0);
            },

            height: function() {
                return Math.max(document.documentElement.clientHeight,
                    window.innerHeight || 0);
            },

            size: function() {
                return {
                    width: this.getWidth(),
                    height: this.getHeight()
                };
            }

        };

    })();

    /**
     * Ass(ertion) utils
     */
    var ass;
    (function() {

        ass = {

            isTrue: function(condition, message) {
                this.isFalse(!condition, message);
            },

            isFalse: function(condition, message) {
                if (condition)
                    throw new Error(message);
            },

            isType: function(obj, type) {

                if (!js.isType(type, Array))
                    type = [type];

                var expected = js.typeOf(type[0]);
                var passes = js.isType(obj, type[0]);

                for (var i = 1; i < type.length; i++) {
                    expected += ' or ' + js.typeOf(type[i]);
                    passes |= js.isType(obj, type[i]);
                }

                this.isTrue(passes, 'expected ' + expected + ', but got ' +
                    js.typeOf(obj));
            }
        };

    })();

    /**
     * elem(ent) utils
     * 
     * @author manuelbarzi
     * @version r1
     */
    var elem;
    (function() {
        elem = {

            isVisible: function(elem) {
                return elem.style.visibility !== 'hidden';
            },

            setVisible: function(elem, visible) {
                elem.style.visibility = visible ? 'inherit' : 'hidden';
            },

            getX: function(elem) {
                return elem.offsetLeft;
            },

            setX: function(elem, x) {
                elem.style.left = x;
            },

            getY: function(elem) {
                return elem.offsetTop;
            },

            setY: function(elem, y) {
                elem.style.top = y;
            },

            getWidth: function(elem) {
                return elem.offsetWidth;
            },

            setWidth: function(elem, width) {
                elem.style.width = width;
            },

            getHeight: function(elem) {
                return elem.offsetHeight;
            },

            setHeight: function(elem, height) {
                elem.style.height = height;
            },

            /**
             * Gets element absolute location.
             * 
             * Raw alternative:
             * 
             * absoluteLocation : function(elem) { var loc = { x : 0, y : 0 };
             * while (elem) { loc.x += (elem.offsetLeft - elem.scrollLeft +
             * elem.clientLeft); loc.y += (elem.offsetTop - elem.scrollTop +
             * elem.clientTop); elem = elem.offsetParent; } return loc; }
             * 
             */
            absoluteLocation: function(elem) {
                var rect = elem.getBoundingClientRect();
                return {
                    x: Math.abs(rect.left),
                    y: Math.abs(rect.top)
                };
            }

        };

    })();

    /**
     * Class
     * 
     * An upgrade on simple class inheritance.
     */
    var Class;
    (function() {

        var initializing = false,
            fnTest = /xyz/.test(function() {
                xyz;
            }) ? /\b_super\b/ : /.*/;

        // The base Class implementation (does nothing)
        Class = function Class() {};

        // Create a new Class that inherits from this class
        Class.extend = function(prop) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == 'function' &&
                    typeof _super[name] == 'function' &&
                    fnTest.test(prop[name]) ? (function(name, fn) {
                        return function() {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) : prop[name];
            }

            // The dummy class constructor

            var Class;

            // All construction is actually done in the init method

            function construct() {
                if (!initializing && this.init)
                    this.init.apply(this, arguments);
            }

            // Force eval to correctly inherit the name of the constructor
            // (named
            // function assigned to init), otherwise is not possible to set it
            // (the
            // name of a function is read-only and it can only be defined at the
            // time it is declared; See https://
            // developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
            eval('Class = function ' +
                (prop.init && prop.init.name ? prop.init.name : 'Class') +
                '() { construct.apply(this, arguments); };');

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            // And make this class extendable
            Class.extend = arguments.callee;

            return Class;
        };

    })();

    /**
     * 2D utils
     */
    var Point, Size;
    (function() {

        /**
         * Point
         */
        Point = Class.extend({

            init: function Point(x, y) {
                this.x = x || 0;
                this.y = y || 0;
            },

            toString: function() {
                return JSON.stringify(this);
            }
        });

        Point.sum = function(p, p2) {
            return new Point(p.x + p2.x, p.y + p2.y);
        };

        /**
         * Size
         */
        Size = Class.extend({

            init: function Size(width, height) {
                this.width = width || 0;
                this.height = height || 0;
            },

            toString: function() {
                return JSON.stringify(this);
            }

        });

    })();

    /**
     * Absolut core
     */
    var Component, Behavior, Panel, Button, View, MouseDown, MouseMove, MouseClick, MouseUp, MouseDrag, KeyDown, KeyUp, KeyPress;
    (function() {

        /**
         * Component class
         */
        Component = Class.extend({

            init: function Component(elem) {

                ass.isType(elem, HTMLElement);

                elem.style.position = 'absolute';

                this._elem = elem;
                this._mouse = {};
                this._children = [];
                this._behaviors = [];
            },

            // element

            element: function() {
                return this._elem;
            },

            // event handling

            _event: function(behavior, event) {
                if (this._behaviors.length > 0) {
                    for (var i in this._behaviors) {
                        var b = this._behaviors[i];
                        if (b instanceof behavior) {
                            b.action(event);
                        }
                    }
                }
            },

            // window event handling

            _resize: function(event) {
                if (this.isVisible()) {
                    this._event(WindowResize, event);
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._resize(event);
                        }
                    }
                }
            },

            // mouse event handling

            _isPointed: function(p) {
                var pos = this.absoluteLocation(),
                    pointed = pos.x <= p.x &&
                    p.x <= pos.x + this.getWidth() && pos.y <= p.y &&
                    p.y <= pos.y + this.getHeight();
                return pointed;
            },

            _mouseMove: function(event) {
                if (this.isVisible()) {
                    if (this._isPointed(event.location)) {
                        this._event(MouseMove, event);
                        if (this._mouse.pressed) {
                            this._mouse.dragging = true;
                            this._event(MouseDrag, event);
                        }
                    } else if (this._mouse.dragging)
                        this._event(MouseDrag, event);
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._mouseMove(event);
                        }
                    }
                }
            },

            _mouseDown: function(event) {
                if (this.isVisible()) {
                    if (this._isPointed(event.location)) {
                        this._mouse.pressed = true;
                        this._event(MouseDown, event);
                    }
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._mouseDown(event);
                        }
                    }
                }
            },

            _mouseUp: function(event) {
                this._releaseMouse();
                if (this.isVisible()) {
                    if (this._isPointed(event.location)) {
                        this._event(MouseUp, event);
                    }
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._mouseUp(event);
                        }
                    }
                }
            },

            _releaseMouse: function() {
                this._mouse.pressed = false;
                this._mouse.dragging = false;
                if (js.notEmpty(this._children)) {
                    for (var i in this._children) {
                        this._children[i]._releaseMouse();
                    }
                }
            },

            _mouseClick: function(event) {
                if (this.isVisible()) {
                    if (this._isPointed(event.location)) {
                        this._event(MouseClick, event);
                    }
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._mouseClick(event);
                        }
                    }
                }
            },

            // key event handling

            _keyDown: function(event) {
                if (this.isVisible()) {
                    this._event(KeyDown, event);
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._keyDown(event);
                        }
                    }
                }
            },

            _keyUp: function(event) {
                if (this.isVisible()) {
                    this._event(KeyUp, event);
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._keyUp(event);
                        }
                    }
                }
            },

            _keyPress: function(event) {
                if (this.isVisible()) {
                    this._event(KeyPress, event);
                    if (js.notEmpty(this._children)) {
                        for (var i in this._children) {
                            this._children[i]._keyPress(event);
                        }
                    }
                }
            },

            // default string representation

            toString: function() {
                return this._elem.toString();
            },

            // visibility

            isVisible: function() {
                return js.notDefined(this._visible) ? elem.isVisible(this._elem) : this._visible;
            },

            setVisible: function(visible) {
                if (js.isDefined(visible))
                    elem.setVisible(this._elem, this._visible = visible);
            },

            visible: function(visible) {
                if (js.notDefined(visible))
                    return this.isVisible();
                this.setVisible(visible);
            },

            // location

            location: function() {
                if (js.empty(arguments))
                    return this.getLocation();
                this.setLocation.apply(this, arguments);
            },

            getLocation: function() {
                return new Point(this.getX(), this.getY());
            },

            setLocation: function() {
                switch (arguments.length) {
                    case 1:
                        var loc = arguments[0];
                        this.setX(loc.x);
                        this.setY(loc.y);
                        break;
                    case 2:
                        this.setX(arguments[0]);
                        this.setY(arguments[1]);
                }
            },

            getX: function() {
                return js.notDefined(this._x) ? elem.getX(this._elem) : this._x;
            },

            setX: function(x) {
                if (js.isDefined(x))
                    elem.setX(this._elem, this._x = x);
            },

            x: function(x) {
                if (js.notDefined(x))
                    return this.getX();
                this.setX(x);
            },

            getY: function() {
                return js.notDefined(this._y) ? elem.getY(this._elem) : this._y;
            },

            setY: function(y) {
                if (js.isDefined(y))
                    elem.setY(this._elem, this._y = y);
            },

            y: function(y) {
                if (js.notDefined(y))
                    return this.getY();
                this.setY(y);
            },

            absoluteLocation: function() {
                return elem.absoluteLocation(this._elem);
            },

            // dimensions

            getWidth: function() {
                return js.notDefined(this._width) ? elem.getWidth(this._elem) : this._width;
            },

            setWidth: function(width) {
                if (js.isDefined(width))
                    elem.setWidth(this._elem, this._width = width);
            },

            width: function(width) {
                if (js.notDefined(width))
                    return this.getWidth();
                this.setWidth(width);
            },

            getHeight: function() {
                return js.notDefined(this._height) ? elem.getHeight(this._elem) : this._height;
            },

            setHeight: function(height) {
                if (js.isDefined(height))
                    elem.setHeight(this._elem, this._height = height);
            },

            height: function(height) {
                if (js.notDefined(height))
                    return this.getHeight();
                this.setHeight(height);
            },

            size: function() {
                if (js.empty(arguments))
                    return this.getSize();
                this.setSize.apply(this, arguments);
            },

            getSize: function() {
                return new Size(this.getWidth(), this.getHeight());
            },

            setSize: function(width, height) {
                this.setWidth(width);
                this.setHeight(height);
            },

            // composition

            parent: function() {
                return this._parent;
            },

            children: function() {
                return this._children;
            },

            add: function(that) {
                ass.isType(that, [Component, Behavior]);
                if (that instanceof Component) {
                    this._children.push(that);
                    that._parent = this;
                } else if (that instanceof Behavior) {
                    this._behaviors.push(that);
                }
                return that;
            },

            // refreshing

            isAutoRefreshable: function() {
                return this._refreshable;
            },

            setAutoRefreshable: function(autoRefreshable) {
                this._refreshable = autoRefreshable;
            },

            autoRefreshable: function(autoRefreshable) {
                if (js.notDefined(autoRefreshable))
                    return this.isAutoRefreshable();
                this.setAutoRefreshable(autoRefreshable);
            },

            refresh: function() {
                this.setVisible(this.isVisible());
                this.setX(this.getX());
                this.setY(this.getY());
                this.setWidth(this.getWidth());
                this.setHeight(this.getHeight());
            },

            _tryAutoRefresh: function() {
                if (this.isAutoRefreshable()) {
                    this.refresh();
                }
                if (js.notEmpty(this._children)) {
                    for (var i in this._children) {
                        this._children[i]._tryAutoRefresh();
                    }
                }
            }
        });

        /**
         * Behavior
         * 
         * @param action,
         *            the behavior associated action.
         */
        Behavior = Class.extend({
            init: function Behavior(action) {
                this.action = action;
            }
        });

        // window behaviors

        WindowResize = Behavior.extend({
            init: function WindowResize(action) {
                this._super(action);
            }
        });

        // mouse behaviors

        MouseDown = Behavior.extend({
            init: function MouseDown(action) {
                this._super(action);
            }
        });

        MouseMove = Behavior.extend({
            init: function MouseMove(action) {
                this._super(action);
            }
        });

        MouseUp = Behavior.extend({
            init: function MouseUp(action) {
                this._super(action);
            }
        });

        MouseDrag = Behavior.extend({
            init: function MouseDrag(action) {
                this._super(action);
            }
        });

        MouseClick = Behavior.extend({
            init: function MouseClick(action) {
                this._super(action);
            }
        });

        // key behaviors

        KeyDown = Behavior.extend({
            init: function KeyDown(action) {
                this._super(action);
            }
        });

        KeyUp = Behavior.extend({
            init: function KeyUp(action) {
                this._super(action);
            }
        });

        KeyPress = Behavior.extend({
            init: function KeyPressed(action) {
                this._super(action);
            }
        });

        // base components

        /**
         * Panel
         */
        Panel = Component
            .extend({

                init: function Panel(elem) {
                    this._super(elem);
                    this.backgroundColor('white');
                    this.borderColor('black');
                    this.borderWidth(1);
                    this.borderStyle('solid');
                },

                backgroundColor: function(backgroundColor) {
                    if (js.not(backgroundColor))
                        return this._elem.style.backgroundColor;
                    this._elem.style.backgroundColor = backgroundColor;
                },

                borderColor: function(borderColor) {
                    if (js.notDefined(borderColor))
                        return this._elem.style.borderColor;
                    this._elem.style.borderColor = borderColor;
                },

                borderWidth: function(borderWidth) {
                    if (js.notDefined(borderWidth))
                        return this._elem.style.borderWidth;
                    this._elem.style.borderWidth = borderWidth;
                },

                borderStyle: function(borderStyle) {
                    if (js.notDefined(borderStyle))
                        return this._elem.style.borderStyle;
                    this._elem.style.borderStyle = borderStyle;
                }

            });

        /**
         * Button
         */
        Button = Panel.extend({

            init: function Button(elem, click) {
                this._super(elem);
                if (js.isDefined(click))
                    this.add(new MouseClick(click));
            }

        });

        /**
         * Link
         */
        Link = Component.extend({
            init: function Link(elem, click) {
                this._super(elem);
                if (js.isDefined(click))
                    this.add(new MouseClick(click));
            }
        });

        /**
         * View
         */
        View = Panel.extend({
            init: function View(elem_) {
                this._super(elem_);
                var self = this;

                /**
                 * Window Event
                 */
                function WindowEvent(event) {
                    this.event = event;
                }

                // window event handling through view component's tree

                window.addEventListener('resize', function(event) {
                    self._resize(new WindowEvent(event));
                });

                /**
                 * Mouse Event
                 */
                function MouseEvent(event) {
                    this.location = new Point(event.clientX, event.clientY);
                }

                // mouse event handling through view component's tree

                window.addEventListener('mousemove', function(event) {
                    self._mouseMove(new MouseEvent(event));
                });

                window.addEventListener('mousedown', function(event) {
                    self._mouseDown(new MouseEvent(event));
                });

                window.addEventListener('mouseup', function(event) {
                    self._mouseUp(new MouseEvent(event));
                });

                window.addEventListener('click', function(event) {
                    self._mouseClick(new MouseEvent(event));
                });

                /**
                 * Key Event
                 */
                function KeyEvent(event) {
                    this.key = js.notDefined(event.which) ? event.keyCode : event.which;
                }

                // key event handling through view component's tree.

                window.addEventListener('keydown', function(event) {
                    self._keyDown(new KeyEvent(event));
                });

                window.addEventListener('keyup', function(event) {
                    self._keyUp(new KeyEvent(event));
                });

                window.addEventListener('keypress', function(event) {
                    self._keyPress(new KeyEvent(event));
                });

                // auto refresh

                this.setAutoRefreshInterval(40);
            },

            setAutoRefreshInterval: function(interval) {
                if (this._autoRefreshIntervalId)
                    clearInterval(this._autoRefreshIntervalId);
                var self = this;
                this._autoRefreshIntervalId = setInterval(function() {
                    self._tryAutoRefresh();
                }, this._autoRefreshInterval = interval);
            },

            getAutoRefreshInterval: function() {
                return this._autoRefreshInterval;
            },

            autoRefreshInterval: function(interval) {
                if (js.notDefined(interval))
                    return this.getAutoRefreshInterval();
                this.setAutoRefreshInterval(interval);
            }
        });
    })();

    // globalization

    Absolut = {
        run: js.run,
        Window: win,
        Class: Class,
        Point: Point,
        Component: Component,
        Behavior: Behavior,
        Panel: Panel,
        Button: Button,
        Link: Link,
        View: View,
        WindowResize: WindowResize,
        MouseDown: MouseDown,
        MouseMove: MouseMove,
        MouseClick: MouseClick,
        MouseUp: MouseUp,
        MouseDrag: MouseDrag,
        KeyDown: KeyDown,
        KeyUp: KeyUp,
        KeyPress: KeyPress
    };

})();

// export

if (typeof module === 'object' && module.exports)
    module.exports = Absolut;
