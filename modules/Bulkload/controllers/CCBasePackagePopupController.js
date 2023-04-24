(function () {
    'use strict';
    angular.module('Bulkload.CCBasePackagePopupController', []).controller('CCBasePackagePopupController', CCBasePackagePopupController);

    function CCBasePackagePopupController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$modalInstance,compChannelServices) {
    	    
    	$scope.close=function(){
    		$modalInstance.dismiss('cancel');
       	};
       	$timeout(function(){
           	$('.modal-body').css({'max-height':$('#contentPannel').height()-80});
           	},100);
    	$scope.metaDataFetched=bulkloadServices.getCCMetadata();
    	$scope.availableChannelNames=$scope.metaDataFetched.channelName.split("\n");
    	$scope.pkg={};
    	$scope.addedCount=0;
    	$scope.removedCount=0;
    	$scope.errMsg="";
		$scope.error = false;
    	
       	$scope.loadPackages=function(){  
       		$rootScope.showSpinner=true;
       		compChannelServices.getMetadataBasePackages($scope.metaDataFetched.packageId,$scope.metaDataFetched.zone).then(function(data){
       		//compChannelServices.getMetadataBasePackages($scope.metaDataFetched.packageId).then(function(data){    	       
        	      $scope.basPackageSelected=[];
        	      if(data && data.length>0){
	        	     $.each(data,function(index,val){
	            	    	val.existing=true;
	            	    	if(val.statusCd!=0){
	            	    		$scope.basPackageSelected.push(val);
	              	    	}
	         		 });
        	      }
        	     $scope.orderedBasePackSelected=angular.copy($scope.basPackageSelected);
        	  	$( ".selectedtable tbody" ).sortable( {
            		update: function( event, ui ) {
            	    $(this).children().each(function(index) {
            				//$(this).find('td').last().html(index + 1)
            	    	findIndexByKeyValue($scope.orderedBasePackSelected,'billing_code',$(this).find('td')[2].innerHTML);
            	    	
            	    });
            	  }
            	});        	  
        	  	compChannelServices.getPacakgesList($scope.metaDataFetched.billingCode).then(function(data){    	       
            	      $scope.basPackageAvailable=[];
            	      $scope.basPackageAvailable=data;
            	     /* var channelAvailable=false;
            	      if(data && data.length>0){
	            	    $.each(data,function(index,val){
	            	    	channelAvailable=false;
	            	    	if(val.type=='Basic' && val.status=='Active'){           	
	            	    		for(var i=0;i<$scope.availableChannelNames.length;i++){
	            	    			if(val.channels.indexOf($scope.availableChannelNames[i])!=-1){
	            	    				channelAvailable=true;
	            	    			}
	            	    		}
	            	    	}
	            	    	if(!channelAvailable){
	    	    				$scope.basPackageAvailable.push(val);    	    				
	    	    			}
	            	    });
            	      }*/
            	  $scope.getarrayDiff ();
            	  $scope.filteredbasPackageAvailable=angular.copy($scope.basPackageAvailable);
            	  
             		 $rootScope.showSpinner=false;
             	 },
             	 function(error){
             		$scope.basPackageAvailable=[];
             		 $rootScope.showSpinner=false;
             	 });
	        	
         		 //$rootScope.showSpinner=false;
         	 },
         	 function(error){
         		$scope.basPackageSelected=[];
         		$scope.orderedBasePackSelected=[];
         		 $rootScope.showSpinner=false;
         	 });
       	};
       	
       	var j=0;
       	function findIndexByKeyValue(obj,key,value)
	    	{
       		
	    	    for (var i = 0; i < obj.length; i++) {
	    	        if (obj[i][key] == value) {
	    	        	$scope.orderedBasePackSelected[i].newIndex=0+j;
	    	        	$scope.basPackageSelected[i].newIndex=0+j;
	    	        	j++;
	    	        }
	    	    }
	    	   // $scope.basPackageSelected=angular.copy($scope.orderedBasePackSelected);
	    	    return null;
	    }
       
   
    		
    	$scope.loadPackages();
       	
       	$scope.getarrayDiff=function(){
 			for (var i = 0; i <  $scope.basPackageAvailable.length; i++) { 
 		        for (var j = 0; j < $scope.basPackageSelected.length; j++) { 
 		            if ($scope.basPackageAvailable[i].billing_code === $scope.basPackageSelected[j].billing_code && !$scope.basPackageSelected[j].existingRemoved) {
 		            	$scope.basPackageAvailable[i].availableChecked=true;
 		            	$scope.basPackageAvailable[i].existing=true;
 		            }
 		            else if($scope.basPackageAvailable[i].billing_code === $scope.basPackageSelected[j].billing_code && $scope.basPackageSelected[j].existingRemoved){
 		            	
 		            	$scope.basPackageAvailable[i].existing=true;
 		            }
 		        }
 		    }
 		};
       	
       
       	$scope.colorInd=function(rowData){
       		if(rowData.newlyAdded){
       			return "colorIndicator greenIndicator";
       		}
       		else if(rowData.existingRemoved){
       			return "colorIndicator redIndicator";
       		}
       		else{
       			return "";
       		}
       	};
       	
       	$scope.addToSelected=function(index,data){
       		var index1;
       		$.each($scope.basPackageSelected, function( i, value ) {
       			if(data.billing_code==value.billing_code){
       				index1=i;
       				return;
       			}
       		});
       		if(data.availableChecked){
       			if(data.existing){
       				data.existingRemoved=false;
       				$scope.basPackageSelected[index1].existingRemoved=false;
       				$('#colorDiv'+index1).removeClass();
       				$('#colorDiv'+index1).addClass($scope.colorInd(data));
       				$scope.removedCount--;
       			}
       			else{
       				data.newlyAdded=true;
	       			$scope.basPackageSelected.push(data);
	       			//$scope.orderedBasePackSelected=angular.copy($scope.basPackageSelected);
	       			$scope.colorInd(data);
	       			$scope.addedCount++;
       			}
       		}
       		else{
       			if(data.existing){
       				data.existingRemoved=true;
       				$scope.basPackageSelected[index1].existingRemoved=true;
       				$('#colorDiv'+index1).removeClass();
       				$('#colorDiv'+index1).addClass($scope.colorInd(data));
       			}
       			else{
       				data.newlyAdded=false;
	       			$scope.basPackageSelected.splice(index1,1);
	       			//$scope.orderedBasePackSelected=angular.copy($scope.basPackageSelected);
	       			$scope.addedCount--;
       			}
       		}
       		$scope.orderedBasePackSelected=angular.copy($scope.basPackageSelected);
       		$scope.selectAll();
       	};
       	
       	$scope.removeFromSelected=function(index,data){
       		var index1;
       		$.each($scope.filteredbasPackageAvailable, function( i, value ) {
       			if(data.billing_code==value.billing_code){
       				index1=i;
       				return;
       			}
       		});
       		
       		if(data.existing){
       			$scope.basPackageSelected[index].existingRemoved=true;       			
       			$scope.filteredbasPackageAvailable[index1].availableChecked=false;
       			$scope.removedCount++;
       		}
       		else{
       			$scope.basPackageSelected.splice(index,1);
       			$scope.filteredbasPackageAvailable[index1].availableChecked=false;
       			$scope.addedCount--;
       		}
       		$scope.orderedBasePackSelected=angular.copy($scope.basPackageSelected);
       		$scope.selectAll();
       	};
       	
       	$scope.updatePackages=function(){
       		
       		var basePackageCnt = $scope.basPackageSelected.length;
       		var selBasePackageCnt = 0;
       		for(var i=0; i <$scope.basPackageSelected.length; i++){
       			if((JSON.stringify($scope.basPackageSelected[i])).includes("existingRemoved")){
       				selBasePackageCnt = selBasePackageCnt + 1;
       			}
       		}
       		if(basePackageCnt == selBasePackageCnt){
       			$scope.error = true;
       			$scope.errMsg = "Please select atleast one Base package";
       		}
       		else{
       			$scope.error = false;
       			$scope.errMsg = "";
	       		compChannelServices.setSelectedPackages($scope.orderedBasePackSelected);
	       		$rootScope.$broadcast("loadBasicPackages",$scope.orderedBasePackSelected);
	       		$scope.close();
       		}
       	};
       	
       	$scope.selectAllcheckbox={
       			'select':false
       	}
       	
       	$scope.checkAll=function(){
			if($scope.selectAllcheckbox.select){
				for(var j=0;j<$scope.filteredbasPackageAvailable.length;j++){
					if($scope.filteredbasPackageAvailable[j].availableChecked){
						$scope.filteredbasPackageAvailable[j].availableChecked=true;
					}
					else{
					$scope.filteredbasPackageAvailable[j].availableChecked=true;
					$scope.addToSelected(j,$scope.filteredbasPackageAvailable[j]);
					}
				}
			}
			else{
				if($scope.filteredbasPackageAvailable){
					for(var j=0;j<$scope.filteredbasPackageAvailable.length;j++){
						$scope.filteredbasPackageAvailable[j].availableChecked=false;
					}
					for(var k=$scope.basPackageSelected.length-1;k>=0;k--){
						if($scope.basPackageSelected[k].existing)
						$scope.basPackageSelected[k].existingRemoved=true;
						else
						$scope.basPackageSelected.splice(k,1);
					}
				}
			}
			$scope.orderedBasePackSelected=angular.copy($scope.basPackageSelected);
		};
		$scope.selectAll=function(index){
			var flag;         	
			for(var i=0;i<$scope.filteredbasPackageAvailable.length;i++){
				if($scope.filteredbasPackageAvailable[i].availableChecked){
					flag=true;
				}else{
					flag=false;
					break;
				}
			}
			if(flag){
				$scope.selectAllcheckbox.select=true;
				//$scope.level.acc=true;
			}
			else{
				$scope.selectAllcheckbox.select=false;
				//$scope.level.rec=true;
			}
		};
		
		$scope.removeAll=function(){
			$scope.selectAllcheckbox.select=false;
			$scope.checkAll();
		};

    }
    CCBasePackagePopupController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$modalInstance","compChannelServices"];
})();
    