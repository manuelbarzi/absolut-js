(function() {
	'use strict';

	js
			.run(function() {

				var content = document.getElementById('content');

				easy.visible(true, content);

				var view = new Absolut.View(content);

				var parts = new Absolut.Component(document
						.getElementById('body-parts'));

				parts.location((view.width() - parts.width()) / 2, (view
						.height() - parts.height()) / 2);

				view.add(parts);

				var body = new Absolut.Component(document
						.getElementById('body'));

				parts.add(body);

				var diff;

				body.add(new Absolut.MouseDown(function(event) {
					var loc = body.location();
					diff = new Absolut.Point(event.location.x - loc.x,
							event.location.y - loc.y);
				}));

				body.add(new Absolut.MouseDrag(function(event) {
					if (diff)
						body.location(event.location.x - diff.x,
								event.location.y - diff.y);
				}));

				var eye = new Absolut.Component(document.getElementById('eye'));

				view.add(eye);

				var iris = new Absolut.Component(document
						.getElementById('iris'));

				view.add(iris);

			});

	js.run(function() {

		var content = document.getElementById('content');

		easy.visible(true, content);

		var view = new Absolut.View(content);

		var BodyParts = Absolut.Panel.extend({

			init : function BodyParts(bodyElem) {

				this._super(bodyElem);

				var body = this;

				body.size(20, 200);
				body.color('black');
				// body.borderColor('transparent');

				var diff;

				body.add(new Absolut.MouseDown(function(event) {
					var loc = body.location();
					diff = new Absolut.Point(event.location.x - loc.x,
							event.location.y - loc.y);
				}));

				body.add(new Absolut.MouseDrag(function(event) {
					if (diff)
						body.location(event.location.x - diff.x,
								event.location.y - diff.y);
				}));

				var Eye = Absolut.Panel.extend({

					init : function Eye(eyeElem) {

						this._super(eyeElem);

						var eye = this;

						eye.size(50, 50);
						eye.color('white');
						// eye.borderColor('transparent');

						var diff;

						eye.add(new Absolut.MouseDown(function(event) {
							var loc = eye.location();
							diff = new Absolut.Point(event.location.x - loc.x,
									event.location.y - loc.y);
						}));

						eye.add(new Absolut.MouseDrag(function(event) {
							if (diff)
								eye.location(event.location.x - diff.x,
										event.location.y - diff.y);
						}));

						var Iris = Absolut.Panel.extend({

							init : function Iris(elem) {

								this._super(elem);

								var iris = this;

								iris.location(0, 30);
								iris.size(20, 20);
								iris.color('black');
								// iris.borderColor('transparent');

								var loc = iris.location(), i = 0, step = 1;

								setInterval(function() {

									iris.location(loc.x + i, loc.y);
									i += step;

									if (i === eye.width() - iris.width())
										step = -1;
									else if (i === -1)
										step = 1;

								}, 30);

							}
						});

						var iris = new Iris(document.getElementById(eyeElem.id
								+ '-iris'));

						eye.add(iris);

						return eye;
					}

				});

				var Mouth = Absolut.Panel.extend({

					init : function Mouth(mouthElem) {

						this._super(mouthElem);

						var mouth = this;

						mouth.size(50, 50);
						mouth.color('transparent');
						// mouth.borderColor('blue');
						// mouth.borderWidth(10);

						var diff;

						mouth.add(new Absolut.MouseDown(function(event) {
							var loc = mouth.location();
							diff = new Absolut.Point(event.location.x - loc.x,
									event.location.y - loc.y);
						}));

						mouth.add(new Absolut.MouseDrag(function(event) {
							if (diff)
								mouth.location(event.location.x - diff.x,
										event.location.y - diff.y);
						}));

						var Lip = Absolut.Panel.extend({

							init : function Lip(elem) {

								this._super(elem);

								var lip = this;

								lip.size(mouth.width(), mouth.height() / 3);
								lip.color('magenta');
								// lip.borderColor('transparent');
							}

						});

						var lip = new Lip(document.getElementById(mouthElem.id
								+ '-lip-1'));

						lip.location((-lip.width() + mouth.width()) / 2, 0);

						mouth.add(lip);

						lip = new Lip(document.getElementById(mouthElem.id
								+ '-lip-2'));

						lip.location((-lip.width() + mouth.width()) / 2, mouth
								.height()
								- lip.height());

						var size = mouth.size(), step = -1, i = 0;

						mouth.add(lip);

						setInterval(function() {

							mouth.size(size.width, size.height + i);

							lip.location((-lip.width() + mouth.width()) / 2,
									mouth.height() - lip.height());

							i += step;
							if (i < -lip.height())
								step = 1;
							else if (i > 0)
								step = -1;
						}, 20);

						return mouth;
					}

				});

				var eye = new Eye(document.getElementById(bodyElem.id
						+ '-eye-1'));

				eye.location(-eye.width() + body.width() / 3, eye.height());

				body.add(eye);

				eye = new Eye(document.getElementById(bodyElem.id + '-eye-2'));

				eye.location(body.width() * 2 / 3, eye.height() / 2);

				body.add(eye);

				var mouth = new Mouth(document.getElementById(bodyElem.id
						+ '-mouth'));

				mouth.location(body.width() / 2, body.height() - mouth.height()
						* 3 / 2);

				body.add(mouth);
			}

		});

		var parts = new Absolut.Panel(document.getElementById('body-parts-1'));

		parts.size(300, 300);
		parts.color('cyan');

		parts.location((view.width() - parts.width()) / 2,
				(view.height() - parts.height()) / 2);

		var body = new BodyParts(document.getElementById('parts'));

		body.location((parts.width() - body.width()) / 2,
				(parts.height() - body.height()) / 2);

		parts.add(body);

		view.add(parts);
	});

})();