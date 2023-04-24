(function () {
    'use strict';
    angular.module('Bulkload.CorrectionPopupController', []).controller('CorrectionPopupController', CorrectionPopupController);

    function CorrectionPopupController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$modalInstance) {
    	
    	$scope.record=bulkloadServices.getFileName();
    	$scope.fileName=$scope.record.fileName;
    	$scope.errMsg="";
		$scope.errSucc="";
		$scope.correction={
			'busJust':''	
		};
    	$scope.update=function(){
    		//$modalInstance.dismiss('cancel');
    		//window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
    		if($scope.correction.busJust && $scope.myFile){
    		$rootScope.uploadCCClicked=true;
    		$scope.errMsg="";
    		$scope.errSucc="";
    		$scope.data={
    				'fileIDs':$scope.record.fileId,
    				'fileDesc':$scope.correction.busJust,
    				'lastUpdateBy':bulkloadServices.getUser()
    		};
    		bulkloadServices.uploadCorrectionFile($scope.myFile,$scope.data).then(function(res){
    			if(res.status && res.status[0].code==400){
    				$scope.errMsg=res.status[0].message;
    				$scope.error=true;
    			}
    			else{
    				$scope.uploadSuccess=true;
    				$scope.errSucc="Correction file uploaded successfully.";
    			}
    			$rootScope.uploadCCClicked=false;
    		},
    		function(error){
    			$rootScope.uploadCCClicked=false;
    		});
    	}
    	else{
    		$scope.errMsg="Mandatory fields are empty";
			$scope.error=true;
    	}
    		
    	};
    	$scope.close=function(){
    		$modalInstance.dismiss('cancel');
    		$rootScope.$broadcast("refreshTable", {'data':'','record':''});
    		window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
    		
    	};
    	$scope.downloadSampleTemplate=function(){
     	   $scope.csvString="ACCOUNT_NUM,ACTION,PACKAGE_BILLING_CODE,COMMENT,ACCOUNT_ACTION\n";
     	   var fileBlob = new Blob([$scope.csvString], {type: 'application/pdf'});
     	   var fileName="SampleTemplate.csv";
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
        };
        $scope.fileChanged = function(files) {
        	document.getElementById("uploadCrctFile").value = files.value;
        	$scope.displayHideMessages();
        };
        $scope.displayHideMessages=function(){
     	   $scope.errMsg="";
     	   $scope.errSucc="";
        };
    }
    CorrectionPopupController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$modalInstance"];
})();
    