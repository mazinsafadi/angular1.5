(function () {
    'use strict';
    angular.module('Bulkload.CCPackageMetadataPopupController', []).controller('CCPackageMetadataPopupController', CCPackageMetadataPopupController);

    function CCPackageMetadataPopupController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$modalInstance,compChannelServices) {

    	$scope.close=function(){

    		$modalInstance.dismiss('cancel');
    		window.parent.postMessage(  {'action': 'destroy','origin':window.location.origin} ,'*' );
       	};
       	$timeout(function(){
       	$('.modal-body').css({'max-height':$('#contentPannel').height()-80});
       	},100);
       	$scope.metaDataFetched=angular.copy(bulkloadServices.getCCMetadata());
       	$scope.basePackageHierarchy=[];
       	$scope.pairedPackages=[];
       	//$scope.scheduleDetails=[];
       	$scope.targetDisabled=false;
       	$scope.metaDataFetched.legacyReach=parseInt($scope.metaDataFetched.legacyReach*1000000);
       	//$scope.metaDataFetched.penetrationBenchMark=$scope.metaDataFetched.penetrationBenchMark*1000000/10;
       	$scope.useCurrentBase=$scope.metaDataFetched.targetCustBaseType==2?true:false;
       	$scope.targetDisabled=$scope.metaDataFetched.targetCustBaseType==2?true:false;
       	$scope.targetBase=$scope.metaDataFetched.targetCustBaseType==2?$scope.metaDataFetched.dtvCustomerBase/1000000:$scope.metaDataFetched.targetCustomerBase/1000000;
       	$scope.exCriteria=$scope.metaDataFetched.exclusionCritDays?$scope.metaDataFetched.exclusionCritDays:'';
       	$scope.execStartDay=$scope.metaDataFetched.effectiveStartDay?$scope.metaDataFetched.effectiveStartDay:'';
       	$scope.execEndDay=$scope.metaDataFetched.effectiveEndDay?$scope.metaDataFetched.effectiveEndDay:'';
       	$scope.monthlyTar=$scope.metaDataFetched.monthlyTarget;
       	var monTar=[];
       	monTar=$scope.monthlyTar.split(" ");
       	$scope.monthlyTar = monTar[0];
       	$scope.monTarget=parseInt($scope.monthlyTar*1000000);
       	//$scope.thresholdExceeded=false;
       	$scope.showReach=true;
       	$scope.hideReach=false;
       	$scope.showSchedule=true;
		$scope.hideSchedule=false;
		$scope.showPaired=true;
		$scope.hidePaired=false;
		$scope.showBase=true;
		$scope.hideBase=false;
		$scope.updateSuccess=false;
		$scope.error=false;
		$scope.totalThreshold=0;
		$scope.updateNotAllowed=true;
		//$scope.allowUpdateBtn=true;



       	$scope.toggle=function(btnval){
       		switch(btnval){
       		case 'showReach':
       			$scope.showReach=false;
       			$scope.hideReach=true;
       			break;
       		case 'hideReach':
       			$scope.showReach=true;
       			$scope.hideReach=false;
       			break;
       		case 'showBase':
       			$scope.showBase=false;
       			$scope.hideBase=true;
       			break;
       		case 'hideBase':
       			$scope.showBase=true;
       			$scope.hideBase=false;
       			break;
       		case 'showSchedule':
       			$scope.showSchedule=false;
       			$scope.hideSchedule=true;
       			break;
       		case 'hideSchedule':
       			$scope.showSchedule=true;
       			$scope.hideSchedule=false;
       			break;
       		case 'showPaired':
       			$scope.showPaired=false;
       			$scope.hidePaired=true;
       			break;
       		case 'hidePaired':
       			$scope.showPaired=true;
       			$scope.hidePaired=false;
       			break;
       		default:
       			break;
       		}
       	};

       	$scope.openBasePackageGroupPopup=function(){
       		var packageModalInstance = $modal.open({
    			templateUrl: 'modules/Bulkload/views/CCBasePackagePopup.html',
    			controller: 'CCBasePackagePopupController',
    			windowClass: 'popup metaDtatPopup',
    			backdrop: 'static'
    			});
    	};

    	$scope.openPairedPackagePopup=function(){
    		var pairedPackageModalInstance = $modal.open({
    			templateUrl: 'modules/Bulkload/views/CCPairedPackagesPopup.html',
    			controller: 'CCPairedPackagesPopupController',
    			windowClass: 'popup metaDtatPopup',
    			backdrop: 'static'
    			});
    	};

    	$scope.$on('loadBasicPackages',function(events,args){
    		$scope.basePackageHierarchy= $.grep(args, function(v) {
    		    return v.existingRemoved != true;
    		});
    		$scope.basePackageHierarchy.sort(function(a, b){return a.newIndex - b.newIndex});
    		$scope.calculateTargetCustomers();
    		$scope.allowUpdate();
    	});

    	$scope.$on('loadPairedPackages',function(events,args){
    		$scope.pairedPackages= $.grep(args, function(v) {
    		    return v.existingRemoved != true;
    		});
    		$scope.allowUpdate();
    	});


		$scope.updateMetada=function(){
			//if(!$scope.thresholdExceeded){
			 $rootScope.showSpinner=true;
			 $scope.updateSuccess=false;
     		 $scope.error=false;
			var postdata=[{
				'reach':$scope.metaDataFetched.reach,
				'custBase':$scope.targetBase*1000000,
				'peneCnt':$scope.metaDataFetched.penetrationBenchMark,
				'userId':bulkloadServices.getUser(),
				'effectiveStartDay':$scope.execStartDay,
				'effectiveEndDay':$scope.execEndDay,
				'exclusionCritDays':$scope.exCriteria,
				'targetCustBaseType':$scope.useCurrentBase?2:1,
				 "basePackageHierarchy":[],
				 "pairedPackageDetails":[]
			}];
			$scope.basePackageHierarchy.sort(function(a, b){return a.newIndex - b.newIndex});
			for(var i=0;i<$scope.basePackageHierarchy.length;i++){
				postdata[0].basePackageHierarchy.push({"basePackageBillingCode":$scope.basePackageHierarchy[i].name,"packageRank":i+1,"eligibleCustomers":$scope.basePackageHierarchy[i].eligibleCustomers, "accountThreshold":$scope.basePackageHierarchy[i].threshold,"derivedAccountThreshold":$scope.derivedPenetration,"lastupdtBy":bulkloadServices.getUser(),"lastupdtTime":""});

			}
			for(var i=0;i<$scope.pairedPackages.length;i++){
				postdata[0].pairedPackageDetails.push({'basePackageName':$scope.pairedPackages[i].basePackageName,'basePackageCode':$scope.pairedPackages[i].basePackageCode,"packageId":$scope.pairedPackages[i].packageId,"lastupdtBy":bulkloadServices.getUser(),"lastupdtTime":""});
			}
			compChannelServices.updateMetadata(postdata,$scope.metaDataFetched.packageId).then(function(data){
				 $rootScope.showSpinner=false;
	     		 $scope.updateSuccess=true;
	     		 $scope.SuccMsg="Metadata updated successfully";
	     		 $scope.updateNotAllowed=true;
	     		 var myDiv = document.getElementById('modal-body');
	     		 myDiv.scrollTop = 0;
	     		 $rootScope.$broadcast("refreshTable",{'name':$scope.metaDataFetched.billingCode});
	     	 },
	     	 function(error){
	     		 $rootScope.showSpinner=false;
	     		 $scope.updateSuccess=false;
	     		 $scope.error=true;
	     		 $scope.errMsg="Some error occurred.Please try again later";
	     		 var myDiv = document.getElementById('modal-body');
	     		 myDiv.scrollTop = 0;
	     	 });
			//}
		};

		$scope.calculateDerived=function(){
			 $scope.updateSuccess=false;
			 $scope.error=false;
			 if($scope.targetBase !=null && $scope.targetBase !=undefined && $scope.targetBase !="" && $scope.metaDataFetched.penetrationBenchMark!="" && $scope.metaDataFetched.penetrationBenchMark!=null && $scope.metaDataFetched.penetrationBenchMark!=undefined){
			$scope.derivedPenetration=((parseFloat($scope.targetBase)*1000000)*parseFloat($scope.metaDataFetched.penetrationBenchMark)/100).toFixed(0);
			 $scope.deficitValue=$scope.derivedPenetration-$scope.metaDataFetched.legacyReach;
			 }else
				 $scope.derivedPenetration=0;
		};
		$scope.calculateDerived();
		$scope.calculateTargetCustomers=function(){
			$scope.totalThreshold=0;
			var balance=0;
			$scope.deficitValue=$scope.monTarget;//$scope.derivedPenetration-$scope.metaDataFetched.legacyReach;
			 $.each($scope.basePackageHierarchy,function(index,val){
        	    	if(index==0 && parseFloat(val.eligibleCustomers)<=$scope.deficitValue){
        	    		val.threshold=parseFloat(val.eligibleCustomers);
        	    		balance=balance+parseFloat(val.eligibleCustomers);
        	    	}
        	    	else if(($scope.deficitValue-balance)>=parseFloat(val.eligibleCustomers)){
        	    		val.threshold=parseFloat(val.eligibleCustomers);
        	    		balance=balance+parseFloat(val.eligibleCustomers);
        	    	}
        	    	else if(($scope.deficitValue-balance)<parseFloat(val.eligibleCustomers) && ($scope.deficitValue-balance)>0){
        	    		val.threshold=$scope.deficitValue-balance;
        	    		balance=balance+parseFloat(val.eligibleCustomers);
        	    	}
        	    	else{
        	    		val.threshold=0;
        	    	}
        	    	$scope.totalThreshold= $scope.totalThreshold+parseFloat(val.threshold);;
     		 });
			/* $.each($scope.basePackageHierarchy,function(index,val){
				$scope.totalThreshold= $scope.totalThreshold+val.threshold
			 });*/
		};
		$scope.loadHierarchyTable=function(){
			compChannelServices.getMetadataBasePackages($scope.metaDataFetched.packageId,$scope.metaDataFetched.zone).then(function(data){
       		//compChannelServices.getMetadataBasePackages($scope.metaDataFetched.packageId).then(function(data){

       		  $.each(data,function(index,val){
            	    	if(val.statusCd==0){
            	    		val.existingRemoved=true;
            	    	}
      		 });
       		$scope.basePackageHierarchy= $.grep(data, function(v) {
    		    return v.existingRemoved != true;$scope.totalThreshold
    		});
       		$.each($scope.basePackageHierarchy,function(index,val){
       			$scope.totalThreshold=$scope.totalThreshold+parseFloat(val.threshold);
		 });
       		/*if($scope.monTarget==$scope.totalThreshold){
				$scope.allowUpdateBtn=false;
			} else {
				$scope.allowUpdateBtn=true;
			} */

       		/*$.each($scope.basePackageHierarchy,function(index,val){
           	    	val.eligible_Customers=60000;
        		 });*/
        	     //$scope.calculateTargetCustomers();
        	 		//$scope.allowUpdate();
        	    /* $.each($scope.basePackageHierarchy,function(index,val){
            	    	if(index==0 && val.legacyAccount<=$scope.derivedPenetration){
            	    		val.targetedCustomers=val.legacyAccount;
            	    		balance=balance+val.legacyAccount;
            	    	}
            	    	else if(($scope.derivedPenetration-balance)>=val.legacyAccount){
            	    		val.targetedCustomers=val.legacyAccount;
            	    		balance=balance+val.legacyAccount;
            	    	}
            	    	else if(($scope.derivedPenetration-balance)<val.legacyAccount && ($scope.derivedPenetration-balance)>0){
            	    		val.targetedCustomers=$scope.derivedPenetration-balance;
            	    		balance=balance+val.legacyAccount;
            	    	}
            	    	else{
            	    		val.targetedCustomers=0;
            	    	}
         		 });*/
         		 $rootScope.showSpinner=false;
         	 },
         	 function(error){
         		$scope.basePackageHierarchy=[];
         		 $rootScope.showSpinner=false;
         	 });
       	};
       	$scope.loadHierarchyTable();

       	$scope.validateThreshold=function(index){
       		$scope.thresholdExceeded=false;
       		var total=0;
/*       		$.each($scope.basePackageHierarchy,function(index,val){
       	    	total=total+parseInt(val.threshold);
    		 });*/
       		if($scope.totalThreshold!=$scope.deficitValue){
       			$scope.thresholdExceeded=true;
       			$scope.errMsg="Total threshold for the selected base packages is not matching with the monthly target";
       		}
       	};

       	$scope.loadPairedPackagesTable=function(){
       		compChannelServices.getMetadataPairedPackages($scope.metaDataFetched.packageId).then(function(data){

       		  $.each(data,function(index,val){
            	    	if(val.statusCode==0){
            	    		val.existingRemoved=true;
            	    	}
      		 });
       		$scope.pairedPackages= $.grep(data, function(v) {
    		    return v.existingRemoved != true;
    		});
         		 $rootScope.showSpinner=false;
         	 },
         	 function(error){
         		$scope.pairedPackages=[];
         		 $rootScope.showSpinner=false;
         	 });
       	};
       	$scope.loadPairedPackagesTable();


       	$scope.allowUpdate=function(){
       		if($scope.metaDataFetched.reach !='' && $scope.metaDataFetched.reach !=null && $scope.metaDataFetched.reach !=undefined  && $scope.execStartDay !='' && $scope.execStartDay !=0 && $scope.execStartDay !=null && $scope.execStartDay !=undefined && $scope.execEndDay !='' && $scope.execEndDay !=0 && $scope.execEndDay !=null && $scope.execEndDay !=undefined){
       			//if($scope.monTarget==$scope.totalThreshold){
	       			$scope.updateNotAllowed=false;
	       			$scope.error=false;
       			//}
       			/*else{
       				$scope.updateNotAllowed=true;
           			$scope.error=true;
           			$scope.errMsg="Total threshold for the selected base packages is not matching with the monthly target";
       			}*/
       		}
       		else{
       			$scope.updateNotAllowed=true;
       			$scope.error=true;
       			$scope.errMsg="Mandatory fields are empty";
       		}
       	};
       	$scope.restrictInput=function(val,id){
       		if(id=='exCriteria'){
       			if(val==15 || val==45){
       				var allow=true;
       			}
       		}
       		else{
	       		for(var i=1;i<=31;i++){
	       			if(val==i){
	       				var allow=true;
	       			}
	       		}
       		}
       		if(!allow)
       			$('#'+id).val('');
       	};

    }
    CCPackageMetadataPopupController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$modalInstance","compChannelServices"];
})();
