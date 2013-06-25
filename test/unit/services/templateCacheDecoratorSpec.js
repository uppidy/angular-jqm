"use strict";
describe('templateCacheDecorator', function() {
    it('adds a keys() function to the $templateCache', inject(function($templateCache) {
        // get a clone
        var oldKeys = $templateCache.keys().concat([]);
        $templateCache.put('someKey', null);
        oldKeys.push('someKey');
        expect($templateCache.keys()).toEqual(oldKeys);
    }));
});