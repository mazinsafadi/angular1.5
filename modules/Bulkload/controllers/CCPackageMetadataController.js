(function () {
	'use strict';
	angular.module('Bulkload.CCPackageMetadataController', []).controller('CCPackageMetadataController', CCPackageMetadataController);

	function CCPackageMetadataController($scope, $modal, $window, $timeout, $compile, bulkloadServices,compChannelServices,$rootScope,$state) {

		$rootScope.showSpinner=true;
		$scope.CCPackageMetadata=[];
		$scope.pkgBillingCode="";
		$scope.channelName="";
		$scope.chlType="";
		$scope.propValue="";
		 
		$scope.initLoad=function(){
			$rootScope.showSpinner=true;

			compChannelServices.getCompPackages().then(function(data){  
				$scope.packageBillingCodesArray = [];
				if(data && data.packageDetails.length>0){
					data.packageDetails.forEach(function(item){
					$scope.packageBillingCodesArray.push(item.packageBillingCode);
				});
				}
				$('#pkgBlngCode').dfwTypeAhead($scope.packageBillingCodesArray);
				$rootScope.searchbuttonclicked=false;
				
			},
			function(error){
				$scope.packageBillingCodesArray=[];
				$('#pkgBlngCode').dfwTypeAhead($scope.packageBillingCodesArray);
			});

			compChannelServices.getCompChannels().then(function(data){    	       
				$scope.channelNamesArray = [];
				data.forEach(function(item){
					$scope.channelNamesArray.push(item.name);
				});
				$('#chlName').dfwTypeAhead($scope.channelNamesArray);
			},
			function(error){
				$scope.channelNamesArray=[];
				$('#chlName').dfwTypeAhead($scope.channelNamesArray);
			}); 

			var param={
					'pkgBillingCode':$scope.pkgBillingCode==''?'':$('#pkgBlngCode').val(),
					'channelName':$scope.channelName==''?'':$('#chlName').val(),
					'reach':$scope.chlType==''?'':$scope.chlType
			};
			compChannelServices.getCCPackageMetadata(param).then(function(data){
				$scope.CCPackageMetadata=data;
				if($scope.CCPackageMetadata.length>0){
				$scope.CCPackageMetadata.forEach(function(val,index){
					if(val.monthlyTarget!=0){
						var monTar=[];
				       	monTar=val.monthlyTarget.split(" ");
				       	$scope.monthlyTar = monTar[0];
						val.tempmonthlyTarget=$scope.monthlyTar;
					}
					else{
						val.tempmonthlyTarget=0;
					}
					val.lastUpdatedDate=bulkloadServices.convertDateToET(val.lastUpdatedDate);
					val.channelName = val.channelName.replace(/\|/g, "\n");
					val.channelName = val.channelName.replace(/&amp;/g, "&");
					if (val.billingCode == $scope.propValue)
		    			     val.recentlyEdited=true;
				});
				}
				$rootScope.showSpinner=false;
			},
			function(error){
				$scope.CCPackageMetadata=[];
				$rootScope.showSpinner=false;
			}); 
			 $timeout(function () {
				 $('#searchResults').height($('#contentPannel').height() - $('#searchSection').height() - 20);
		            $('#searchResultsContainer').height($('#searchResults').height() - $('#searchResultsHeader').height() - 40);
		            $('.table-bordered>tbody').css('max-height',$('#searchResultsContainer').height()  -  20);
	            }, 1000);
		};

		$scope.initLoad();

		$scope.setSize=function(){
			window.parent.postMessage(  {'action': 'height','origin':window.location.origin} ,'*' );
			window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
			if ( window.addEventListener ) {
				window.addEventListener('message', handleDocHeightMsg, false);
			} else if ( window.attachEvent ) { // ie8
				window.attachEvent('onmessage', handleDocHeightMsg);
			}
			function handleDocHeightMsg(e) {
				// check origin
				if ( e.origin === e.data.origin ) {
					// parse data
					var data = e.data;
					// check data object
					if(data.height){
						$scope.mainWrapperHeight=data.height;
						$('#mainBody').css({'height':data.height-28});
						$scope.userid=data.userid;
						bulkloadServices.setUser($scope.userid);
						$scope.privileges=data.privilege;
						$scope.privileges=$scope.privileges.split(',');
					}
					else{
						$state.go('Error');
					}
				}
			}
		};
		$scope.setSize();


		$scope.toggle = function (p_id) {
			if (p_id === 'searchMinus') {
				$('#searchMinus').hide();
				$('#searchPlus').show();
				$('#searchParentSection').slideUp();
				$('.buttonBox').slideUp();				
			} else if (p_id === 'searchPlus') {
				$('#searchMinus').show();
				$('#searchPlus').hide();
				$('#searchParentSection').slideDown();
				$('.buttonBox').slideDown();	
			} else if (p_id === 'searchResMinus') {
				$('#searchResMinus').hide();
				$('#searchResPlus').show();
				$('#searchResultsContainer').slideUp();
			} else if (p_id === 'searchResPlus') {
				$('#searchResMinus').show();
				$('#searchResPlus').hide();
				$('#searchResultsContainer').slideDown();
			}
			 $timeout(function () {
				 $('#searchResults').height($('#contentPannel').height() - $('#searchSection').height() - 20);
		            $('#searchResultsContainer').height($('#searchResults').height() - $('#searchResultsHeader').height() - 40);
		            $('.table-bordered>tbody').css('max-height',$('#searchResultsContainer').height()  -  20);
	            }, 1000);
		};

		$scope.openMetadataPopup=function(index,data){
			bulkloadServices.setCCMetadata(data);
			var metaDataModalInstance = $modal.open({
				templateUrl: 'modules/Bulkload/views/CCPackageMetadataPopup.html',
				controller: 'CCPackageMetadataPopupController',
				windowClass: 'popup metaDtatPopup',
				backdrop: 'static'
			});
			window.parent.postMessage(  {'action': 'create','origin':window.location.origin} ,'*' );
		};
		
		$scope.openSettingsPopup=function(){
			var settingsModalInstance = $modal.open({
				templateUrl: 'modules/Bulkload/views/CCSettingsPopup.html',
				controller: 'CCSettingsPopupController',
				windowClass: 'popup metaDtatPopup configPopup',
				backdrop: 'static'
			});
			window.parent.postMessage(  {'action': 'create','origin':window.location.origin} ,'*' );
		};
		
		$scope.reset=function(){
			$scope.pkgBillingCode="";
			$scope.channelName="";
			$scope.chlType="";
		};
		
		$scope.$on('refreshTable',function(events,args){
			$scope.propValue=args.name;
    		$scope.initLoad();    		
    	});
	}
	CCPackageMetadataController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","compChannelServices","$rootScope","$state"];
})();
