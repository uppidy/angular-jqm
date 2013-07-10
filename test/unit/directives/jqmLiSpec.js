"use strict";
describe('jqmLi directives', function() {
    var ng, jqm, ngElement, jqmElement;
    beforeEach(function() {
        ng = testutils.ng;
        jqm = testutils.jqm;
        module('templates/jqmListview.html');
        module('templates/jqmListview.html');
    });

    describe('markup compared to jqm', function() {
        function compileAndCompare(one, two) {
            ngElement = ng.init('<ul jqm-listview>'+one+'</ul>');
            jqmElement = jqm.init('<ul data-role="listview">'+two+'</ul>');
            testutils.compareElementRecursive(ngElement, jqmElement);
        }
        it('should work for entries', function() {
            compileAndCompare(
                '<li jqm-li-entry><b>Stuff</b></li>',
                '<li><b>Stuff</b></li>'
            );
        });
        it('should work for dividers', function() {
            compileAndCompare(
                '<li jqm-li-divider><h4 class="ui-li-heading">Woah!</h4></li>',
                '<li data-role="list-divider" data-theme="c"><h4>Woah!</h4></li>'
            );
        });
        it('should work for links', function() {
            compileAndCompare(
                '<li jqm-li-link="hello"><i>Whattt</i></li>',
                '<li><a href="hello"><i>Whattt</i></a></li>'
            );
        });
        it('should work with thumbnails', function() {
            compileAndCompare(
                '<li jqm-li-link="stuff" has-thumb="true">' +
                    '<img class="ui-li-thumb" src="src"><h2 class="ui-li-heading">Title</h2><p class="ui-li-desc">Content</p>' +
                '</li>',
                '<li><a href="stuff">' +
                    '<img src="src"><h2>Title</h2><p>Content</p>' +
                '</a></li>'
            );
        });
    });

    it('should allow any icon class', function() {
        var el = ng.init('<ul jqm-listview><li jqm-li-link icon="icon-custom"></li></ul>');
        expect(angular.element(el[0].querySelector('.icon-custom')).length).toBe(1);
    });
});
