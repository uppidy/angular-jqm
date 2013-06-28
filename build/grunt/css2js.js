/*
 * grunt-css2js
 * Adapted version from
 * https://github.com/ragiragi/grunt-css2js
 * and
 * https://github.com/angular/angular.js/blob/master/lib/grunt/utils.js
 */
(function () {
    module.exports = function (grunt) {
        'use strict';

        grunt.registerMultiTask('css2js', 'Convert a CSS File to JS DOM Script.', function () {

            // Iterate of the Files Array
            this.files.forEach(function (file) {

                var css = file.src.filter(function (filepath) {
                    // Remove nonexistent files (it's up to you to filter or warn here).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                }).map(function (filepath) {
                        // Read and return the file's source.
                        return grunt.file.read(filepath);
                    }).join('\n');

                css = css
                    .replace(/\\/g, '\\\\')
                    .replace(/'/g, "\\'")
                    .replace(/\r?\n/g, '\\n');
                var js = "angular.element(window.document).find('head').append('<style type=\"text/css\">" + css + "</style>');";
                grunt.file.write(file.dest, js);
                grunt.log.writeln('File "' + file.dest + '" created.');

            });

            return true;
        });
    };
}());