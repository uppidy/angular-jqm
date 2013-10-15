"use strict";
describe('jqmHeaderFooter', function () {
  var ng, jqm, ngElement, jqmElement, headerElement;
  beforeEach(function () {
    ng = testutils.ng;
    jqm = testutils.jqm;
  });


  makeTests('header', 'jqm-header', '$header');
  makeTests('footer', 'jqm-footer', '$footer');

  function makeTests(name, directive, scopeName) {
    function compile(ngAttrs, jqmAttrs, content) {
      ngElement = ng.init('<div jqm-page><div ' + directive + ' ' + ngAttrs + '>' + content + '</div></div>');
      jqmElement = jqm.init('<div data-role="page"><div data-role="'+name+'" ' + jqmAttrs + '>' + content + '</div><div data-role="content"></div>');
    }

    describe(name + ' markup compared to jqm', function () {

      it("has same markup", function () {
        compile('', '', '');
        testutils.compareElementRecursive(ngElement, jqmElement);
      });
      it("has same markup with explicit theme", function () {
        compile('jqm-theme="b"', 'data-theme="b"', '');
        testutils.compareElementRecursive(ngElement, jqmElement);
      });
      it("has same markup with <h1>, ... tags", function () {
        compile('', '', '<h1>test</h1>');
        testutils.compareElementRecursive(ngElement, jqmElement);
      });
    });

    describe(name +' sets scope.'+ scopeName, function() {
      function findHeader() {
        return jqm.$(ngElement[0]).children('.ui-'+name);
      }
          
      it('sets true/false if exists', function() {
        compile('ng-if="hasHeader"', '', 'Header!');
        var pageScope = ngElement.children().scope();

        expect(findHeader().length).toBe(0);
        expect(pageScope[scopeName]).toBeFalsy();

        pageScope.$apply('hasHeader = true');
        expect(findHeader().length).toBe(1);
        expect(pageScope[scopeName]).toBe(true);

        pageScope.$apply('hasHeader = false');
        expect(findHeader().length).toBe(0);
        expect(pageScope[scopeName]).toBe(false);
      });
    });
  }

});
