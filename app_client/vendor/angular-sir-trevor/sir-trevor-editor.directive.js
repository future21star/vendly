(function() {
    'use strict';
    angular.module('angular-sir-trevor')
        .directive('sirTrevorEditor', sirTrevorEditor);

    sirTrevorEditor.$inject = ['sirTrevorService'];

    function sirTrevorEditor(sirTrevorService) {
        var editor = null;

        var directive = {
            "restrict": 'A',
            "link": linkFn,
            "require": "?ngModel"
        }

        return directive;

        function linkFn(scope, element, attrs, ngModelCtrl) {

            editor = new sirTrevorService.Editor({
                el: element,
                blockTypes: [
                    "Heading",
                    "Text",
                    "List",
                    "Quote",
                    "Image",
                    "Video",
                    "Tweet"
                ]
            });

            if (ngModelCtrl !== null) {
                ngModelCtrl.$render = renderEditorContent;
                ngModelCtrl.$parsers.push(editorModelParser);
                editor.$form.on('submit', editorOnChange);
            }

            /////

            function editorOnChange() {
                var value = editor.$el.val();
                ngModelCtrl.$setViewValue(value);
            }

            function editorModelParser(viewValue) {
                var modelValue = JSON.parse(viewValue);
                return modelValue;
            }

            function renderEditorContent() {
                if (typeof ngModelCtrl.$modelValue !== "undefined") {
                    var content = ngModelCtrl.$modelValue;
                    angular.forEach(content.data, function(block, key) {
                        editor.mediator.trigger('block:create', block.type, block.data)
                    })
                }
            }
        }
    }
})();
