/**
 * AbsolutJS
 * 
 * JavaScript UI framework that works on absolute HTML, inspired on Java Swing.
 * 
 * @version 0.1.0
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

			// existence

			not : function(obj) {
				return !obj;
			},

			notDefined : function(obj) {
				return obj === undefined;
			},

			// objects

			typeOf : function(obj) {
				return this.isFunction(obj) ? obj.name || Function.name
						: obj.constructor.name || Object.name;
			},

			isType : function(obj, type) {
				return obj instanceof type;
			},

			// arrays

			empty : function(arr) {
				return arr.length === 0;
			},

			notEmpty : function(arr) {
				return arr.length !== 0;
			},

			// functions

			/**
			 * Checks whether the object is a function
			 */

			isFunction : function(obj) {
				return typeof obj === 'function';
			},

			// dom about

			/**
			 * Safety run on DOM loaded
			 */
			run : function(func) {
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
					for ( var i in js.run._running)
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

			width : function() {
				return Math.max(document.documentElement.clientWidth,
						window.innerWidth || 0);
			},

			height : function() {
				return Math.max(document.documentElement.clientHeight,
						window.innerHeight || 0);
			},

			size : function() {
				return {
					width : this.width(),
					height : this.height()
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

			isTrue : function(condition, message) {
				this.isFalse(!condition, message);
			},

			isFalse : function(condition, message) {
				if (condition)
					throw new Error(message);
			},

			isType : function(obj, type) {

				if (!js.isType(type, Array))
					type = [ type ];

				var expected = js.typeOf(type[0]);
				var passes = js.isType(obj, type[0]);

				for (var i = 1; i < type.length; i++) {
					expected += ' or ' + js.typeOf(type[i]);
					passes |= js.isType(obj, type[i]);
				}

				this.isTrue(passes, 'expected ' + expected + ', but got '
						+ js.typeOf(obj));
			}
		};

	})();

	/**
	 * Elem(ent) utils
	 */
	var elem;
	(function() {
		elem = {

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
			absoluteLocation : function(elem) {
				var rect = elem.getBoundingClientRect();
				return {
					x : Math.abs(rect.left),
					y : Math.abs(rect.top)
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

		var initializing = false, fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/;

		// The base Class implementation (does nothing)
		Class = function Class() {
		};

		// Create a new Class that inherits from this class
		Class.extend = function(prop) {
			var _super = this.prototype;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			var prototype = new this();
			initializing = false;

			// Copy the properties over onto the new prototype
			for ( var name in prop) {
				// Check if we're overwriting an existing function
				prototype[name] = typeof prop[name] == "function"
						&& typeof _super[name] == "function"
						&& fnTest.test(prop[name]) ? (function(name, fn) {
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
			eval('Class = function '
					+ (prop.init && prop.init.name ? prop.init.name : 'Class')
					+ '() { construct.apply(this, arguments); };');

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

			init : function Point(x, y) {
				this.x = x || 0;
				this.y = y || 0;
			},

			toString : function() {
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

			init : function Size(width, height) {
				this.width = width || 0;
				this.height = height || 0;
			},

			toString : function() {
				return JSON.stringify(this);
			}

		});

	})();

	/**
	 * Absolut core
	 */
	var Component, Behavior, Panel, View, MouseDown, MouseMove, MouseClick, MouseUp, MouseDrag, KeyDown, KeyUp, KeyPress;
	(function() {

		/**
		 * Component class
		 */
		Component = Class.extend({

			init : function Component(elem) {

				ass.isType(elem, HTMLElement);

				elem.style.position = 'absolute';
				elem.style.margin = '0';
				elem.style.padding = '0';

				this._elem = elem;
				this._mouse = {};
				this._children = [];
				this._behaviors = [];
				this._prevDisplay = '';
			},

			// element

			element : function() {
				return this._elem;
			},

			// event handling

			_event : function(behavior, event) {
				if (this._behaviors.length > 0) {
					for ( var i in this._behaviors) {
						var b = this._behaviors[i];
						if (b instanceof behavior) {
							b.action(event);
						}
					}
				}
			},

			// window event handling

			_resize : function(event) {
				if (this.visible()) {
					this._event(Resize, event);
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._resize(event);
						}
					}
				}
			},

			// mouse event handling

			_isPointed : function(p) {
				var pos = this.absoluteLocation(), pointed = pos.x <= p.x
						&& p.x <= pos.x + this._elem.offsetWidth
						&& pos.y <= p.y
						&& p.y <= pos.y + this._elem.offsetHeight;
				return pointed;
			},

			_mouseMove : function(event) {
				if (this.visible()) {
					if (this._isPointed(event.location)) {
						this._event(MouseMove, event);
						if (this._mouse.pressed) {
							this._mouse.dragging = true;
							this._event(MouseDrag, event);
						}
					} else if (this._mouse.dragging)
						this._event(MouseDrag, event);
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._mouseMove(event);
						}
					}
				}
			},

			_mouseDown : function(event) {
				if (this.visible()) {
					if (this._isPointed(event.location)) {
						this._mouse.pressed = true;
						this._event(MouseDown, event);
					}
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._mouseDown(event);
						}
					}
				}
			},

			_mouseUp : function(event) {
				this._releaseMouse();
				if (this.visible()) {
					if (this._isPointed(event.location)) {
						this._event(MouseUp, event);
					}
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._mouseUp(event);
						}
					}
				}
			},

			_releaseMouse : function() {
				this._mouse.pressed = false;
				this._mouse.dragging = false;
				if (this._children.length > 0) {
					for ( var i in this._children) {
						this._children[i]._releaseMouse();
					}
				}
			},

			_mouseClick : function(event) {
				if (this.visible()) {
					if (this._isPointed(event.location)) {
						this._event(MouseClick, event);
					}
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._mouseClick(event);
						}
					}
				}
			},

			// key event handling

			_keyDown : function(event) {
				if (this.visible()) {
					this._event(KeyDown, event);
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._keyDown(event);
						}
					}
				}
			},

			_keyUp : function(event) {
				if (this.visible()) {
					this._event(KeyUp, event);
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._keyUp(event);
						}
					}
				}
			},

			_keyPress : function(event) {
				if (this.visible()) {
					this._event(KeyPress, event);
					if (this._children.length > 0) {
						for ( var i in this._children) {
							this._children[i]._keyPress(event);
						}
					}
				}
			},

			// default string representation

			toString : function() {
				return this._elem.toString();
			},

			// dimensions

			_px : function(val) {
				return val + 'px';
			},

			width : function(width) {
				if (js.notDefined(width))
					return this._elem.offsetWidth;
				this._elem.style.width = this._px(width);
			},

			height : function(height) {
				if (js.notDefined(height))
					return this._elem.offsetHeight;
				this._elem.style.height = this._px(height);
			},

			size : function(width, height) {
				if (js.empty(arguments))
					return new Size(this._elem.offsetWidth,
							this._elem.offsetHeight);
				this.width(width);
				this.height(height);
			},

			// composition

			parent : function() {
				return this._parent;
			},

			children : function() {
				return this._children;
			},

			add : function(that) {

				ass.isType(that, [ Component, Behavior ]);

				if (that instanceof Component) {
					this._children.push(that);
					that._parent = this;
				} else if (that instanceof Behavior) {
					this._behaviors.push(that);
				}

				return that;
			},

			// visibility

			visible : function(visible) {

				if (visible === undefined)
					return this._elem.style.display !== 'none';

				var style = this._elem.style;

				if (style.display !== 'none') {
					this._prevDisplay = style.display;
				}

				if (visible) {

					if (this._prevDisplay && this._prevDisplay !== 'none') {
						style.display = this._prevDisplay;
					} else {
						style.display = 'block';
					}

				} else {

					if (style.display && style.display !== 'none') {
						this._prevDisplay = style.display;
					}

					style.display = 'none';
				}

			},

			// location

			location : function() {

				switch (arguments.length) {
				case 0:
					return new Point(this._elem.offsetLeft,
							this._elem.offsetTop);
				case 1:
					var loc = arguments[0];
					this._elem.style.left = this._px(loc.x);
					this._elem.style.top = this._px(loc.y);
					break;
				case 2:
					this._elem.style.left = this._px(arguments[0]);
					this._elem.style.top = this._px(arguments[1]);
				}

			},

			absoluteLocation : function() {
				return elem.absoluteLocation(this._elem);
			}

		});

		/**
		 * Behavior
		 * 
		 * @param action,
		 *            the behavior associated action.
		 */
		Behavior = Class.extend({
			init : function Behavior(action) {
				this.action = action;
			}
		});

		// window behaviors

		Resize = Behavior.extend({
			init : function Resize(action) {
				this._super(action);
			}
		});

		// mouse behaviors

		MouseDown = Behavior.extend({
			init : function MouseDown(action) {
				this._super(action);
			}
		});

		MouseMove = Behavior.extend({
			init : function MouseMove(action) {
				this._super(action);
			}
		});

		MouseUp = Behavior.extend({
			init : function MouseUp(action) {
				this._super(action);
			}
		});

		MouseDrag = Behavior.extend({
			init : function MouseDrag(action) {
				this._super(action);
			}
		});

		MouseClick = Behavior.extend({
			init : function MouseClick(action) {
				this._super(action);
			}
		});

		// key behaviors

		KeyDown = Behavior.extend({
			init : function KeyDown(action) {
				this._super(action);
			}
		});

		KeyUp = Behavior.extend({
			init : function KeyUp(action) {
				this._super(action);
			}
		});

		KeyPress = Behavior.extend({
			init : function KeyPressed(action) {
				this._super(action);
			}
		});

		// base components

		/**
		 * Border
		 */
		Border = Component
				.extend({

					init : function Border(elem) {
						this._super(elem);
						this._color = 'transparent';
						this._borderColor = 'magenta';
						this._borderWidth = 1;
					},

					color : function(color) {
						if (js.not(color))
							return this._color;
						this._elem.style.backgroundColor = this._color = color;
					},

					borderColor : function(borderColor) {
						if (js.not(borderColor))
							return this._borderColor;
						this._elem.style.borderColor = this._borderColor = borderColor;
					},

					borderWidth : function(borderWidth) {
						if (js.not(borderWidth))
							return this._borderWidth;
						this._elem.style.borderWidth = (this._borderWidth = borderWidth)
								+ 'px';
					}

				});

		/**
		 * Panel
		 */
		Panel = Border.extend({

			init : function Panel(elem) {
				this._super(elem);
			}

		});

		/**
		 * Link
		 */
		Link = Component.extend({
			init : function Link(elem, action) {
				this._super(elem);
				this.add(new MouseDown(action));
			}
		});

		/**
		 * View
		 */
		View = Panel.extend({

			init : function View(elem_) {

				this._super(elem_);

				var view = this;

				/**
				 * Window Event
				 */
				function WindowEvent(event) {
					this.event = event;
				}

				// window event handling through view component's tree

				window.addEventListener('resize', function(event) {
					view._resize(new WindowEvent(event));
				});

				/**
				 * Mouse Event
				 */
				function MouseEvent(event) {
					this.location = new Point(event.clientX, event.clientY);
				}

				// mouse event handling through view component's tree

				window.addEventListener('mousemove', function(event) {
					view._mouseMove(new MouseEvent(event));
				});

				window.addEventListener('mousedown', function(event) {
					view._mouseDown(new MouseEvent(event));
				});

				window.addEventListener('mouseup', function(event) {
					view._mouseUp(new MouseEvent(event));
				});

				window.addEventListener('click', function(event) {
					view._mouseClick(new MouseEvent(event));
				});

				/**
				 * Key Event
				 */
				function KeyEvent(event) {
					this.key = event.which || event.keyCode;
				}

				// key event handling through view component's tree.

				window.addEventListener('keydown', function(event) {
					view._keyDown(new KeyEvent(event));
				});

				window.addEventListener('keyup', function(event) {
					view._keyUp(new KeyEvent(event));
				});

				window.addEventListener('keypress', function(event) {
					view._keyPress(new KeyEvent(event));
				});

			}

		});

	})();

	// globalization

	Absolut = {
		run : js.run,
		window : win,
		Class : Class,
		Point : Point,
		Component : Component,
		Behavior : Behavior,
		Border : Border,
		Panel : Panel,
		Link : Link,
		View : View,
		Resize : Resize,
		MouseDown : MouseDown,
		MouseMove : MouseMove,
		MouseClick : MouseClick,
		MouseUp : MouseUp,
		MouseDrag : MouseDrag,
		KeyDown : KeyDown,
		KeyUp : KeyUp,
		KeyPress : KeyPress
	};

})();

// export

if (typeof module === 'object' && module.exports)
	module.exports = Absolut;