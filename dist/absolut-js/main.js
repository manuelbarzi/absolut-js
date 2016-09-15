(function() {
    'use strict';

    Absolut.run(function() {

        /**
         * View
         */

        var view = new Absolut.View(document.getElementById('view'));
        view.borderWidth(0);
        view.visible(true);
        view.size(500, 1000);
        view.location((Absolut.window.width() - view.width()) / 2, 0);
        view.add(new Absolut.Resize(function(event) {
            view.location((Absolut.window.width() - view.width()) / 2, 0);
        }));
        view.backgroundColor('transparent');

        // custom panel (with no border and transparent background)

        var Panel = Absolut.Panel.extend({
            init: function Panel(elem) {
                this._super(elem);
                this.backgroundColor('transparent');
                this.borderWidth(0);
            }
        });

        // logo

        var logo = new Panel(document.getElementById('logo'));

        logo.width(400);
        logo.location((view.width() - logo.width()) / 2, 50);

        view.add(logo);

        // description

        var desc = new Panel(document.getElementById('desc'));

        desc.location((view.width() - desc.width()) / 2, logo.location().y +
            logo.height() + 50);

        view.add(desc);

        // moving body title
        var movingBodyTitle = new Panel(document
            .getElementById('moving-body-title'));

        movingBodyTitle.location((view.width() - movingBodyTitle.width()) / 2,
            desc.location().y + desc.height() + 50);

        view.add(movingBodyTitle);

        // moving body description

        var movingBodyDesc = new Panel(document
            .getElementById('moving-body-desc'));

        movingBodyDesc.width(300);
        movingBodyDesc.location((view.width() - movingBodyDesc.width()) / 2,
            movingBodyTitle.location().y + movingBodyTitle.height() + 5);
        view.add(movingBodyDesc);

        // moving body component implementation

        /**
         * MovingBody
         * 
         * Animated body parts that can be mouse-dragged.
         * 
         */

        var MovingBody = Panel.extend({

            init: function MovingBody(bodyElem) {

                this._super(bodyElem);

                var body = this;

                body.size(20, 200);
                body.backgroundColor('black');

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

                var Eye = Panel.extend({

                    init: function Eye(eyeElem) {

                        this._super(eyeElem);

                        var eye = this;

                        eye.size(50, 50);
                        eye.backgroundColor('white');

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

                        var Iris = Panel.extend({

                            init: function Iris(elem) {

                                this._super(elem);

                                var iris = this;

                                iris.location(0, 30);
                                iris.size(20, 20);
                                iris.backgroundColor('black');

                                var loc = iris.location(),
                                    i = 0,
                                    step = 1;

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

                        var iris = new Iris(document.getElementById(eyeElem.id +
                            '-iris'));

                        eye.add(iris);

                        return eye;
                    }

                });

                var Mouth = Panel.extend({

                    init: function Mouth(mouthElem) {

                        this._super(mouthElem);

                        var mouth = this;

                        mouth.size(50, 50);
                        mouth.backgroundColor('transparent');

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

                        var Lip = Panel.extend({

                            init: function Lip(elem) {

                                this._super(elem);

                                var lip = this;

                                lip.size(mouth.width(), mouth.height() / 3);
                                lip.backgroundColor('red');
                            }

                        });

                        var lip = new Lip(document.getElementById(mouthElem.id +
                            '-lip-1'));

                        lip.location((-lip.width() + mouth.width()) / 2, 0);

                        mouth.add(lip);

                        lip = new Lip(document.getElementById(mouthElem.id +
                            '-lip-2'));

                        lip.location((-lip.width() + mouth.width()) / 2, mouth
                            .height() -
                            lip.height());

                        var size = mouth.size(),
                            step = -1,
                            i = 0;

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

                var eye = new Eye(document.getElementById(bodyElem.id +
                    '-eye-1'));

                eye.location(-eye.width() + body.width() / 3, eye.height());

                body.add(eye);

                eye = new Eye(document.getElementById(bodyElem.id + '-eye-2'));

                eye.location(body.width() * 2 / 3, eye.height() / 2);

                body.add(eye);

                var mouth = new Mouth(document.getElementById(bodyElem.id +
                    '-mouth'));

                mouth.location(body.width() / 2, body.height() - mouth.height() *
                    3 / 2);

                body.add(mouth);
            }

        });

        // moving body panel

        var movingBodyPanel = new Panel(document
            .getElementById('moving-body-panel'));

        movingBodyPanel.size(300, 300);
        movingBodyPanel.location((view.width() - movingBodyPanel.width()) / 2,
            movingBodyDesc.y() + movingBodyDesc.height() + 5);
        movingBodyPanel.backgroundColor('lightgray');

        // moving body instantiation and inclusion to the view

        var movingBody = new MovingBody(document.getElementById('body'));

        movingBody.location((movingBodyPanel.width() - movingBody.width()) / 2,
            (movingBodyPanel.height() - movingBody.height()) / 2);

        movingBodyPanel.add(movingBody);

        view.add(movingBodyPanel);

        // moving body footer

        var movingBodyFooter = new Panel(document
            .getElementById('moving-body-footer'));

        movingBodyFooter.location(
            (view.width() - movingBodyFooter.width()) / 2, movingBodyPanel
            .location().y +
            movingBodyPanel.height() + 5);

        view.add(movingBodyFooter);

        /**
         * ... View
         */

        // footer
        var footer = new Panel(document.getElementById('footer'));

        footer.location((view.width() - footer.width()) / 2, movingBodyFooter
            .location().y +
            movingBodyFooter.height() + 50);

        view.add(footer);
    });

})();
