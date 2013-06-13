(function () {

    var assert = require("assert");

    describe('Model test', function() {
        it('get("string")で値が取り出せる', function() {
            var model = new Model();
            model.set('hoge', 'fuga');
            assert('fuga', model.get('hoge'));
        });
    });
}());
