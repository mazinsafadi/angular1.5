(function () {
    'use strict';
    angular.module('Bulkload.FailedAccPopupController', []).controller('FailedAccPopupController', FailedAccPopupController);

    function FailedAccPopupController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$modalInstance) {
    	$rootScope.searchbuttonclicked=true;
    	$scope.record=bulkloadServices.getFileName();
    	$scope.fileName=$scope.record.fileName;
    	$scope.data={
    				'fileId':$scope.record.fileId
    	};
    	bulkloadServices.searchCCDashboardAcc($scope.data).then(function(data){
    		$scope.FailedAccounts=data.bulkAccounts;
    		$rootScope.searchbuttonclicked=false;
    	},
    	function(error){
    		$scope.FailedAccounts=[];
    		$rootScope.searchbuttonclicked=false;
    	});
    	$scope.ExportAll=function(){
    		//$modalInstance.dismiss('cancel');
    		//window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
    		bulkloadServices.ExportFailedAccs($scope.data).then(function(data){
    			$scope.csvString="ACCOUNT_NUM,PACKAGE_BILLING_CODE,ACTION,ERROR DESCRIPTION\n";
    			$scope.csvString=$scope.csvString+data.jsonStr;
    	    	   var fileBlob = new Blob([$scope.csvString], {type: 'application/pdf'});
    	    	   var fileName=$scope.fileName+"FailedAccounts.csv";
    	    	   if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
    	               window.navigator.msSaveOrOpenBlob(fileBlob, fileName);
    	           } else { // for other browsers
    	               var fileURL = window.URL.createObjectURL(fileBlob);
    	               var element = document.createElement('a');
    	               element.setAttribute('href', 'data:attachment/csv,' + encodeURIComponent($scope.csvString));
    	               element.setAttribute('download', fileName);

    	               element.style.display = 'none';
    	               document.body.appendChild(element);

    	               element.click();

    	               document.body.removeChild(element);
    	           }
    			$rootScope.searchbuttonclicked=false;
    		},
    		function(error){
    			$rootScope.searchbuttonclicked=false;
    		});
    		
    	};
    	$scope.close=function(){
    		$modalInstance.dismiss('cancel');
    		window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
    		
    	};
    }
    FailedAccPopupController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$modalInstance"];
})();
    