(function () {

    var assert = require("assert");

    describe('Model Spec', function() {

        var model = null;

        beforeEach(function () {
            model = new Model();
        });

        it('defaultsで指定した値がデフォルトになる', function () {
            var NewModel = Model.extend({
                defaults: {
                    hoge: 'fuga',
                    foo: 'bar',
                    baz: {
                        test: 1
                    }
                }
            });

            var nmodel = new NewModel();

            assert.equal('fuga', nmodel.get('hoge'));
            assert.equal('bar', nmodel.get('foo'));
            assert.equal(undefined, model.get('fugafuga'));
            assert.equal(1, nmodel.get('baz').test);
        });

        it('set(obj)形式でセット、get("string")で各値が取り出せる', function() {
            var obj = {
                test: 'test'
            };

            model.set({
                foo: 'bar',
                baz: obj
            });

            assert.equal('bar', model.get('foo'));
            assert.equal(obj, model.get('baz'));
        });

        it('set("string", obj)形式でセット、get("string")で値が取り出せる', function() {
            model.set('hoge', 'fuga');
            assert.equal('fuga', model.get('hoge'));
        });

        it('previousで前回の値が参照できる', function () {
            model.set('hoge', 'hoge1');

            model.on('change', function (evt) {
                assert.equal('hoge1', this.previous('hoge'));
            });

            model.set('hoge', 'hoge2');
        });

        it('disposeで内容を破棄できる', function () {
            var called = false;
            model.set('hoge', 'hoge2');
            model.on('change', function () {
                called = true;
            });
            model.dispose();
            model.trigger('change');

            assert.equal(null, model.attributes);
            assert.equal(null, model._previousAttributes);
            assert.equal(false, called);
        });
    });

    describe('View Spec', function () {
    });

    describe('Component Spec', function () {
        var parent = null;
        var child1 = null;
        var child2 = null;
        var child3 = null;

        beforeEach(function () {
            parent = new Component();
            child1 = new Component();
            child2 = new Component();
            child3 = new Component();
        });

        it('length()でchildrenの要素数を取得することができる', function () {
            parent.addChild(child1);
            parent.addChild(child2);
            parent.addChild(child3);

            assert.equal(3, parent.length());
        });

        it('addChild()で追加することができる', function () {
            parent.addChild(child1);
            assert.equal(child1, parent.children[0]);
        });

        it('addChild()で元の親から削除される', function () {
            var parent2 = new Component();
            parent.addChild(child1);
            assert.equal(child1, parent.children[0]);
            parent2.addChild(child1);
            assert.equal(child1, parent2.children[0]);
            assert.equal(parent.children.length, 0);
        });

        it('removeChild()で削除できる', function () {
            parent.addChild(child1);
            parent.addChild(child2);
            parent.addChild(child3);

            parent.removeChild(child2);
            assert.equal(child1, parent.children[0]);
            assert.equal(child3, parent.children[1]);
        });

        it('Eventがバブリングする', function () {
            parent.addChild(child1);

            var all_called = 0;
            parent.on('child2-event', function (evt) {
                all_called++;
            });

            child1.addChild(child2);

            child1.on('child2-event', function (evt) {
                all_called++;
            });

            child2.trigger('child2-event', {
                data: 'data'
            });

            assert.equal(2, all_called);
        });

        it('stopPropagationでバブリングをキャンセルできる', function () {

            var not_called = true;

            parent.addChild(child1);
            parent.on('child2-event', function (evt) {
                not_called = false;
            });

            child1.addChild(child2);

            child1.on('child2-event', function (evt) {
                evt.stopPropagation();
            });

            child2.trigger('child2-event', {
                data: 'data'
            });

            assert.equal(true, not_called);
        });

        it('targetで発生元、currentTargetで監視要素を参照できる', function () {
            parent.addChild(child1);
            child1.addChild(child2);
            child2.addChild(child3);

            parent.on('reftest', function (evt) {
                assert.equal(parent, evt.currentTarget);
                assert.equal(child3, evt.target);
            });

            child2.on('reftest', function (evt) {
                assert.equal(child2, evt.currentTarget);
                assert.equal(child3, evt.target);
            });

            child3.trigger('reftest');
        });

        it('disposeで子孫要素を削除し、自身の親要素から削除される', function () {
            parent.addChild(child1);
            child1.addChild(child2);
            child2.addChild(child3);

            parent.dispose();

            assert.equal(null, parent.children);
            assert.equal(null, parent.parent);
            assert.equal(null, child1.parent);
            assert.equal(null, child1.children);
            assert.equal(null, child2.parent);
            assert.equal(null, child2.children);
            assert.equal(null, child3.parent);
            assert.equal(null, child3.children);
        });
    });

    describe('View Spec', function () {
        it('ViewはaddClassでclassNameを追加できる。', function () {
            var view = new View();
            view.addClass('hoge');
            assert.equal(true, /hoge/.test(view.el.className));
        });

        it('ViewはremoveClassでclassNameを追加できる。', function () {
            var view = new View();
            view.addClass('hoge');
            assert.equal(true, /hoge/.test(view.el.className));
            view.removeClass('hoge');
            assert.equal(false, /hoge/.test(view.el.className));
        });
    });

    describe('EventDispatcher Spec', function () {

        var evt = null;

        beforeEach(function () {
            evt = new EventDispatcher();
        });

        it('onでイベントハンドラが登録でき、triggerでイベントが発火しデータを送信できる', function (done) {
            evt.on('hoge', function (evt) {
                assert.equal('hoge', evt.type);
                assert.equal('data', evt.data);
                done();
            });

            evt.trigger('hoge', {
                data: 'data'
            });
        });

        it('off(type, func)で該当ハンドラを削除できる', function () {

            var not_called = true;

            function calledTest() {
                not_called = false;
            }
            evt.on('calledcheck', calledTest);
            evt.off('calledcheck', calledTest);
            evt.trigger('calledcheck');

            assert.equal(true, not_called);
        });

        it('off(type)で該当イベントのハンドラをすべて削除できる', function () {

            var not_called = true;

            function calledTest1() {
                not_called = false;
            }
            function calledTest2() {
                not_called = false;
            }
            function calledTest3() {
                not_called = false;
            }
            evt.on('calledcheck', calledTest1);
            evt.on('calledcheck', calledTest2);
            evt.on('calledcheck', calledTest3);
            evt.off('calledcheck');
            evt.trigger('calledcheck');

            assert.equal(true, not_called);
        });

        it('off()で全イベントハンドラを削除できる', function () {

            var not_called = true;

            function calledTest1() {
                not_called = false;
            }
            function calledTest2() {
                not_called = false;
            }
            function calledTest3() {
                not_called = false;
            }
            evt.on('calledcheck1', calledTest1);
            evt.on('calledcheck2', calledTest2);
            evt.on('calledcheck3', calledTest3);
            evt.off();
            evt.trigger('calledcheck1');
            evt.trigger('calledcheck2');
            evt.trigger('calledcheck3');

            assert.equal(true, not_called);
        });

        it('oneで一度だけのハンドラを登録できる', function () {
            var count = 0;

            function countcheck() {
                count++;
            }

            evt.one('countcheck', countcheck);
            evt.trigger('countcheck');
            evt.trigger('countcheck');
            evt.trigger('countcheck');

            assert.equal(1, count);
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        var NewView = View.extend({
            events: {
                '&': {
                    mouseout: function (e) {
                        console.log(this, e);
                    },
                    click: function (e) {
                        console.log('& click');
                    }
                },
                '#div3': {
                    click: {
                        handler: function (e) {
                            var bg = ['red', 'blue', 'green', 'yellow', 'white', 'black'];
                            this.model.set('background', bg[~~(Math.random() * bg.length)]);
                        },
                        capture: true
                    }
                },
                '#div1': {
                    click: function (e) {
                        console.log('div1', e);
                    },
                    mousedown: 'mousedownHanlder'
                },
                '#div2': {
                    mousemove: function (e) {
                        if (this._dragging) {
                            console.log(e);
                        }
                    },
                    mousedown: function (e) {
                        this._dragging = true;
                    },
                    mouseup: function (e) {
                        this._dragging = false;
                    }
                }
            },
            initialize: function () {
                var view1 = new View({ id: 'div1' });
                var view2 = new View({
                    id: 'div2',
                    html: util.getTemplate('sample', {templatevalue: 'これはサンプルです'})
                });
                var view3 = new View({ id: 'div3' });

                this.addChild(view1);
                view1.addChild(view2);
                view2.addChild(view3);

                view2.css('height', '300px');
                view2.css('position', 'relative');

                view2.attr('class', 'attr-test');
                view2.attr({
                    'data-test': 'hoge',
                    'data-test-2': 'hoge2'
                });

                view3.css({
                    'position'  : 'absolute',
                    'right'     : '10px',
                    'top'       : '10px',
                    'background': 'blue',
                    'width'     : '20px',
                    'height'    : '20px'
                });

                view1.on('hoge', function (e) {
                    console.log(e);
                });
                view2.on('hoge', function (e) {
                    console.log(e);
                });
                view3.trigger('hoge');

                view1.appendTo(this);
                this.appendTo(document.body);

                this.model.on('change', this.render, this);
                this.on('mouseover', '#div3', function (e) {
                    console.log(this);
                });

                this.render();
            },

            render: function () {
                var color = this.model.get('background');
                this.el.style.background = color;
            },

            mousedownHanlder: function (e) {
                console.log('this: %o, e: %o', this, e);
            }
        });

        var model = new Model({
            background: 'red'
        });
        window.nview = new NewView({
            model: model,
            events: {
                '&': {
                    mouseover: 'mouseover',
                    dblclick: function (e) {
                        console.log('this event is defined in instancing as inline');
                    }
                }
            },
            mouseover: function () {
                console.log('this event is defined in instancing.');
            }
        });
    }, false);
}());
