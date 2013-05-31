(function(window, document) {
    var iframe, exports,
        IGNORE_CSS_CLASSES = /(ng-.*)/;
    beforeEach(createIframeIfNeeded);

    // API
    exports = window.markupValidator = markupValidator;

    // ---------
    function createIframeIfNeeded() {
        runs(function() {
            if (iframe) {
                return;
            }
            iframe = document.createElement("iframe");
            iframe.src = "/base/test/lib/emptyJqmPage.html";
            // Cross browser way for onload iframe handler
            if (iframe.attachEvent) {
                iframe.attachEvent('onload', setIframeLoaded);
            } else {
                iframe.onload = setIframeLoaded;
            }
            document.body.appendChild(iframe);
        });
        waitsFor(function() {
            return exports.win;
        });
    }

    function setIframeLoaded() {
        exports.win = iframe.contentWindow;
        exports.$ = exports.win.jQuery;
    }

    function markupValidator(data) {
        var result = {
            check: checkMarkup
        };
        inject(function($compile, $rootScope) {
            result.jqmPage = exports.$(data.jqm).page();
            result.scope = $rootScope.$new();
            result.ngPage = $compile(data.ng)(result.scope);
        });
        return result;
    }

    function checkMarkup() {
        var res = checkElementRecursive(this.jqmPage, this.ngPage);
        if (res) {
            throw new Error(res);
        }

        function checkElementRecursive(el1, el2) {
            var res,
                i,
                children1 = el1.children(),
                children2 = el2.children(),
                maxLen = Math.max(children1.length, children2.length);
            res = checkElement(el1, el2);
            if (res) {
                return res;
            }
            for (i=0; i<maxLen; i++) {
                res = checkElementRecursive(children1.eq(i), children2.eq(i));
                if (res) {
                    return res;
                }
            }
            return "";
        }

        function checkElement(el1, el2) {
            if (el1[0].nodeName !== el2[0].nodeName) {
                return error("node names differ", el1, el2);
            }
            if (el1.text()!==el2.text()) {
                error("text differs", el1, el2);
            }
            var el1Classes = convertListToHash(el1[0].className.split(' ')),
                el2Classes = convertListToHash(el2[0].className.split(' '));

            containsAllClasses(el1Classes, el2Classes);
            containsAllClasses(el2Classes, el1Classes);
            return "";

            function containsAllClasses(el1Classes, el2Classes) {
                var prop;
                for (prop in el2Classes) {
                    if (!IGNORE_CSS_CLASSES.test(prop) && !(prop in el1Classes)) {
                        error("classes differ", el1, el2);
                    }
                }
            }
        }

        function convertListToHash(list) {
            var i, res = {};
            for (i=0; i<list.length; i++) {
                res[list[i]] = true;
            }
            return res;
        }

        function error(text, el1, el2) {
            throw new Error(text+". "+elementToString(el1)+" "+elementToString(el2));
        }

        function elementToString(el) {
            var str = exports.$("<p></p>").append(el.clone()).html();
            return str.replace(/<\/.*/g,'');
        }

    }
})(window, document);
