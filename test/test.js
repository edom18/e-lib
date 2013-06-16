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
        it('addChildで追加することができる', function () {
            parent.addChild(child1);
            assert.equal(child1, parent.children[0]);
        });

        it('addChildで元の親から削除される', function () {
            var parent2 = new Component();
            parent.addChild(child1);
            assert.equal(child1, parent.children[0]);
            parent2.addChild(child1);
            assert.equal(child1, parent2.children[0]);
            assert.equal(parent.children.length, 0);
        });

        it('removeChildで削除できる', function () {
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

    //document.addEventListener('DOMContentLoaded', function () {
    //    var NewView = View.extend({
    //        events: {
    //            '#div3': {
    //                click: {
    //                    handler: function (e) {
    //                        console.log('div3', e);
    //                    },
    //                    capture: false
    //                }
    //            },
    //            '#div1': {
    //                click: {
    //                    handler: function (e) {
    //                        console.log('div1', e);
    //                    }
    //                }
    //            },
    //            '#div2': {
    //                mousemove: {
    //                    handler: function (e) {
    //                        if (this._dragging) {
    //                            console.log(e);
    //                        }
    //                    }
    //                },
    //                mousedown: {
    //                    handler: function (e) {
    //                        this._dragging = true;
    //                    }
    //                },
    //                mouseup: {
    //                    handler: function (e) {
    //                        this._dragging = false;
    //                    }
    //                }
    //            }
    //        },
    //        initialize: function () {
    //            var div1 = document.createElement('div');
    //            var div2 = document.createElement('div');
    //            var div3 = document.createElement('div');

    //            div1.id = 'div1';
    //            div2.id = 'div2';
    //            div3.id = 'div3';

    //            div1.appendChild(div2);
    //            div2.appendChild(div3);

    //            div2.style.height = '300px';
    //            div2.style.background = 'red';
    //            div2.style.position = 'relative';

    //            div3.style.position = 'absolute';
    //            div3.style.right = '10px';
    //            div3.style.top = '10px';
    //            div3.style.background = 'blue';
    //            div3.style.width = '20px';
    //            div3.style.height = '20px';

    //            this.el.appendChild(div1);

    //            document.body.appendChild(this.el);
    //        }
    //    });

    //    window.nview = new NewView();
    //}, false);
}());
