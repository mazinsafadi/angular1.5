(function () {
    'use strict';
    angular.module('Bulkload.DeletePopupController', []).controller('DeletePopupController', DeletePopupController);

    function DeletePopupController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$modalInstance) {
    	
    	$scope.deleteRecord=bulkloadServices.getData();
    	$scope.data={
    				'fileIDs':$scope.deleteRecord.fileId,
    				'lastUpdateBy':bulkloadServices.getUser()
    	};
    	$scope.confirm=function(){
    		$modalInstance.dismiss('cancel');
    		window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
    		$rootScope.uploadDNSClicked=true;
    		$rootScope.uploadCCClicked=true;
    		bulkloadServices.deleteDNSFile($scope.data).then(function(data){
    			$rootScope.$broadcast("refreshTable", {'data':data,'record':$scope.deleteRecord});
    		},
    		function(error){
    			$rootScope.uploadDNSClicked=false;
    			$rootScope.uploadCCClicked=false;
    		});
    		
    	};
    	$scope.close=function(){
    		$modalInstance.dismiss('cancel');
    		window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
    		
    	};
    }
    DeletePopupController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$modalInstance"];
})();
    