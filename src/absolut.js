/**
 * _titl
 * 
 * _desc
 * 
 * @version _ver
 * 
 * @author _auth
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

			not : function(obj) {
				return !obj;
			},

			isDefined : function(obj) {
				return obj !== undefined;
			},

			notDefined : function(obj) {
				return obj === undefined;
			},

			typeOf : function(obj) {
				return this.isFunction(obj)
						? obj.name || Function.name
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
					width : this.getWidth(),
					height : this.getHeight()
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
					type = [type];

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
	 * elem(ent) utils
	 * 
	 * @author manuelbarzi
	 * @version r1
	 */
	var elem;
	(function() {
		elem = {

			isVisible : function(elem) {
				return elem.style.visibility !== 'hidden';
			},

			setVisible : function(elem, visible) {
				elem.style.visibility = visible ? 'visible' : 'hidden';
			},

			_px : function(val) {
				return val + 'px';
			},

			getX : function(elem) {
				return elem.offsetLeft;
			},

			setX : function(elem, x) {
				elem.style.left = this._px(x);
			},

			getY : function(elem) {
				return elem.offsetTop;
			},

			setY : function(elem, y) {
				elem.style.top = this._px(y);
			},

			getWidth : function(elem) {
				return elem.offsetWidth;
			},

			setWidth : function(elem, width) {
				elem.style.width = this._px(width);
			},

			getHeight : function(elem) {
				return elem.offsetHeight;
			},

			setHeight : function(elem, height) {
				elem.style.height = this._px(height);
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
	var Component, Behavior, Panel, Button, View, MouseDown, MouseMove, MouseClick, MouseUp, MouseDrag, KeyDown, KeyUp, KeyPress;
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
				this._visible = this._isVisible();
				this._location = new Point(this._getX(), this._getY());
				this._size = new Size(this._getWidth(), this._getHeight());
				this._mouse = {};
				this._children = [];
				this._behaviors = [];
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
				if (this.isVisible()) {
					this._event(Resize, event);
					if (js.notEmpty(this._children)) {
						for ( var i in this._children) {
							this._children[i]._resize(event);
						}
					}
				}
			},

			// mouse event handling

			_isPointed : function(p) {
				var pos = this.absoluteLocation(), pointed = pos.x <= p.x
						&& p.x <= pos.x + this._getWidth() && pos.y <= p.y
						&& p.y <= pos.y + this._getHeight();
				return pointed;
			},

			_mouseMove : function(event) {
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
						for ( var i in this._children) {
							this._children[i]._mouseMove(event);
						}
					}
				}
			},

			_mouseDown : function(event) {
				if (this.isVisible()) {
					if (this._isPointed(event.location)) {
						this._mouse.pressed = true;
						this._event(MouseDown, event);
					}
					if (js.notEmpty(this._children)) {
						for ( var i in this._children) {
							this._children[i]._mouseDown(event);
						}
					}
				}
			},

			_mouseUp : function(event) {
				this._releaseMouse();
				if (this.isVisible()) {
					if (this._isPointed(event.location)) {
						this._event(MouseUp, event);
					}
					if (js.notEmpty(this._children)) {
						for ( var i in this._children) {
							this._children[i]._mouseUp(event);
						}
					}
				}
			},

			_releaseMouse : function() {
				this._mouse.pressed = false;
				this._mouse.dragging = false;
				if (js.notEmpty(this._children)) {
					for ( var i in this._children) {
						this._children[i]._releaseMouse();
					}
				}
			},

			_mouseClick : function(event) {
				if (this.isVisible()) {
					if (this._isPointed(event.location)) {
						this._event(MouseClick, event);
					}
					if (js.notEmpty(this._children)) {
						for ( var i in this._children) {
							this._children[i]._mouseClick(event);
						}
					}
				}
			},

			// key event handling

			_keyDown : function(event) {
				if (this.isVisible()) {
					this._event(KeyDown, event);
					if (js.notEmpty(this._children)) {
						for ( var i in this._children) {
							this._children[i]._keyDown(event);
						}
					}
				}
			},

			_keyUp : function(event) {
				if (this.isVisible()) {
					this._event(KeyUp, event);
					if (js.notEmpty(this._children)) {
						for ( var i in this._children) {
							this._children[i]._keyUp(event);
						}
					}
				}
			},

			_keyPress : function(event) {
				if (this.isVisible()) {
					this._event(KeyPress, event);
					if (js.notEmpty(this._children)) {
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

			// visibility

			_isVisible : function() {
				return elem.isVisible(this._elem);
			},

			_setVisible : function(visible) {
				elem.setVisible(this._elem, visible);
			},

			visible : function(visible) {
				if (js.notDefined(visible))
					return this.isVisible();
				this.setVisible(visible);
			},

			isVisible : function() {
				return this._visible;
			},

			setVisible : function(visible) {
				this._visible = visible;
				this._setVisible(visible);
			},

			// location

			location : function() {
				if (js.empty(arguments))
					return this.getLocation();
				this.setLocation.apply(this, arguments);
			},

			getLocation : function() {
				return new Point(this.getX(), this.getY());
			},

			setLocation : function() {
				switch (arguments.length) {
					case 1 :
						var loc = arguments[0];
						this.setX(loc.x);
						this.setY(loc.y);
						break;
					case 2 :
						this.setX(arguments[0]);
						this.setY(arguments[1]);
				}
			},

			_getX : function() {
				return elem.getX(this._elem);
			},

			_setX : function(x) {
				elem.setX(this._elem, x);
			},

			x : function(x) {
				if (js.notDefined(x))
					return this.getX();
				this.setX(x);
			},

			getX : function() {
				return this._location.x || this._getX();
			},

			setX : function(x) {
				this._location.x = x;
				this._setX(x);
			},

			_getY : function() {
				return elem.getY(this._elem);
			},

			_setY : function(y) {
				elem.setY(this._elem, y);
			},

			y : function(y) {
				if (js.notDefined(y))
					return this.getY();
				this.setY(y);
			},

			getY : function() {
				return this._location.y || this._getY();
			},

			setY : function(y) {
				this._location.y = y;
				this._setY(y);
			},

			absoluteLocation : function() {
				return elem.absoluteLocation(this._elem);
			},

			// dimensions

			_getWidth : function() {
				return elem.getWidth(this._elem);
			},

			_setWidth : function(width) {
				elem.setWidth(this._elem, width);
			},

			width : function(width) {
				if (js.notDefined(width))
					return this.getWidth();
				this.setWidth(width);
			},

			getWidth : function() {
				return this._size.width || this._getWidth();
			},

			setWidth : function(width) {
				this._size.width = width;
				this._setWidth(width);
			},

			_getHeight : function() {
				return elem.getHeight(this._elem);
			},

			_setHeight : function(height) {
				elem.setHeight(this._elem, height);
			},

			height : function(height) {
				if (js.notDefined(height))
					return this.getHeight();
				this.setHeight(height);
			},

			getHeight : function() {
				return this._size.height || this._getHeight();
			},

			setHeight : function(height) {
				this._size.height = height;
				this._setHeight(height);
			},

			size : function() {
				if (js.empty(arguments))
					return this.getSize();
				this.setSize.apply(this, arguments);
			},

			getSize : function() {
				return new Size(this.getWidth(), this.getHeight());
			},

			setSize : function(width, height) {
				this.setWidth(width);
				this.setHeight(height);
			},

			// composition

			parent : function() {
				return this._parent;
			},

			children : function() {
				return this._children;
			},

			add : function(that) {
				ass.isType(that, [Component, Behavior]);
				if (that instanceof Component) {
					this._children.push(that);
					that._parent = this;
				} else if (that instanceof Behavior) {
					this._behaviors.push(that);
				}
				return that;
			},

			// update

			_update : function() {
				this._setVisible(this.parent() ? this.parent().isVisible()
						&& this.isVisible() : this.isVisible());
				this._setX(this.getX());
				this._setY(this.getY());
				this._setWidth(this.getWidth());
				this._setHeight(this.getHeight());
				if (js.notEmpty(this._children)) {
					for ( var i in this._children) {
						this._children[i]._update();
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
		 * Button
		 */
		Button = Border.extend({

			init : function Button(elem, onClick) {
				this._super(elem);
				if (js.isDefined(onClick))
					this.add(new MouseClick(onClick));
			}

		});

		/**
		 * Link
		 */
		Link = Component.extend({
			init : function Link(elem, onClick) {
				this._super(elem);
				if (js.isDefined(onClick))
					this.add(new MouseClick(onClick));
			}
		});

		/**
		 * View
		 */
		View = Panel.extend({

			init : function View(elem_) {

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
					this.key = event.which || event.keyCode;
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

				// view refreshing cycle

				setInterval(function() {
					self.refresh();
				}, 10);

			},

			refresh : function() {
				this._update();
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
		Button : Button,
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