/**
 * Component class.
 * 
 * TODO: learn the use window.requestAnimationFrame(callback); for pre-rendering
 * calculations.
 * 
 * TODO: take into account Element.getBoundingClientRect for getting its
 * location. see example http://jsfiddle.net/AbdiasSoftware/ds9s7/ and doc
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
 * 
 * @author manuelbarzi
 */
(function() {
	'use strict';

	this.Component = Class.extend({

		init : function Component(elem) {

			assert.isType(elem, HTMLElement);

			this._elem = elem;
			this._mouse = {};
			this._children = [];
			this._behaviors = [];
			this._prevDisplay = '';
		},

		_isPointed : function(p) {
			var pos = elem.absoluteLocation(this._elem);
			return pos.x <= p.x && p.x <= pos.x + this._elem.offsetWidth
					&& pos.y <= p.y && p.y <= pos.y + this._elem.offsetHeight;
		},

		_mouseEvent : function(behavior, event) {

			assert.isType(event, ViewEvent);

			if (this.visible()) {
				if (this._behaviors.length > 0) {
					if (this._isPointed(event.location)) {
						for ( var i in this._behaviors) {
							var b = this._behaviors[i];
							if (b instanceof behavior) {
								b.action(event);
							}
						}
					}
				}
				if (this._children.length > 0) {
					for ( var i in this._children) {
						this._children[i]._mouseEvent(behavior, event);
					}
				}
			}
		},

		toString : function() {
			return this._elem.toString();
		},

		add : function(that) {

			assert.isType(that, [ Component, Behavior ]);

			if (that instanceof Component) {
				this._children.push(that);
			} else if (that instanceof Behavior) {
				this._behaviors.push(that);
			}

			return that;
		},

		visible : function(visible) {

			if (visible === undefined)
				return this._elem.style.display !== 'none';

			var style = elem.style;

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

		location : function(location) {
			if (location === undefined)
				return new Point(this._elem.offsetLeft, this._elem.offsetTop);
			this._elem.style.left = location.x;
			this._elem.style.top = location.y;
		},

		absoluteLocation : function() {
			return elem.absoluteLocation(this._elem);
		}

	});

	/**
	 * View Event.
	 * 
	 * @author manuelbarzi
	 */
	function ViewEvent(event) {
		assert.isType(event, Event);
		this.location = new Point(event.clientX, event.clientY);
	}

	/**
	 * Behavior.
	 * 
	 * @param action
	 *            the behavior associated action
	 * 
	 * @author manuelbarzi
	 */
	this.Behavior = Class.extend({
		init : function Behavior(action) {
			this.action = action;
		}
	});

	// base behaviors

	this.MouseDown = Behavior.extend({
		init : function MouseDown(action) {
			this._super(action);
		}
	});

	this.MouseUp = Behavior.extend({
		init : function MouseUp(action) {
			this._super(action);
		}
	});

	this.MouseMove = Behavior.extend({
		init : function MouseMove(action) {
			this._super(action);
		}
	});

	this.MouseClick = Behavior.extend({
		init : function MouseClick(action) {
			this._super(action);
		}
	});

	this.MouseDrag = Behavior.extend({
		init : function MouseDrag(action) {
			this._super(action);
		}
	});

	// other comps

	/**
	 * Panel.
	 * 
	 * @author manuelbarzi
	 */

	this.Panel = Component.extend({
		init : function Panel(elem) {
			this._super(elem);
		}
	});

	/**
	 * Link.
	 * 
	 * @author manuelbarzi
	 */

	this.Link = Component.extend({
		init : function Link(elem, action) {
			this._super(elem);
			this.add(new MouseDown(action));
		}
	});

	/**
	 * Mouse Reaction.
	 * 
	 * @author manuelbarzi
	 */

	function MouseReaction(action, interval) {
		this._action = action;
		this._interval = interval;
		this._before = Date.now();
		this._now = null;
	}

	MouseReaction.prototype = {
		react : function(arg) {
			this._now = Date.now();
			if (this._now - this._before > this._interval) {
				this._action(arg);
				this._before = this._now;
			}
		}
	};

	/**
	 * View.
	 * 
	 * @author manuelbarzi
	 */

	this.View = Component.extend({

		init : function View(elem) {

			this._super(elem);

			var self = this;

			/**
			 * events handling through view component's tree.
			 * 
			 */

			var mouseMove = new MouseReaction(function(event) {
				self._mouseEvent(MouseMove, new ViewEvent(event));
			}, -1);

			window.addEventListener('mousemove', function(event) {
				mouseMove.react(event);
			});

			var mouseDown = new MouseReaction(function(event) {
				self._mouseEvent(MouseDown, new ViewEvent(event));
			}, -1);

			window.addEventListener('mousedown', function(event) {
				mouseDown.react(event);
			});

		}
	});

}).apply(window);