(function () {
    'use strict';
    angular.module('Bulkload.fileBrowse', []).directive('fileModel', fileModel);
function fileModel($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            scope.modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    scope.modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
   }
})();