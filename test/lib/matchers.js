// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function() {
    this.addMatchers({
        toHaveClass: function(cls) {
            var not = this.isNot ? "not " : "";
            this.message = function() {
                return "Expected '" + angular.mock.dump(this.actual) + "' " + not + "to have class '" + cls + "'.";
            };

            var self = this;
            if (!angular.isArray(cls)) {
                cls = cls.split(" ");
            }
            var res = not?false:true;
            angular.forEach(cls, function(cls) {
                if (not) {
                    res = res || self.actual.hasClass(cls);
                } else {
                    res = res && self.actual.hasClass(cls);
                }
            });
            return res;
        }
    });
});
