(function() {
	'use strict';

	js.run(function() {

		var view = new View(document.getElementsByTagName('body')[0]);

		var box = new Component(document.getElementById('yellow-box'));

		view.add(box);

		var diff;

		box.add(new MouseDown(function(event) {
			if (diff) {
				diff = null;
			} else {
				var elemLoc = box.absoluteLocation();
				diff = new Point(event.location.x - elemLoc.x, event.location.y
						- elemLoc.y);
			}
		}));

		box.add(new MouseMove(function(event) {
			if (diff) {
				var reloc = new Point(event.location.x - diff.x,
						event.location.y - diff.y);
				box.location(reloc);
			}
		}));

		var Link2 = Link.extend({
			init : function(elem, action) {
				this._super(elem, action);
			}
		});

		var box2 = new Link2(document.getElementById('blue-box'), function() {
			console.log('blue!');
		});

		view.add(box2);

		var box3 = new Link2(document.getElementById('red-box'), function() {
			console.log('red!');
		});

		view.add(box3);

	});

}).apply(window);