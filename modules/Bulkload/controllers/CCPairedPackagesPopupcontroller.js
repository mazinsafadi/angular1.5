(function () {
    'use strict';
    angular.module('Bulkload.CCPairedPackagesPopupController', []).controller('CCPairedPackagesPopupController', CCPairedPackagesPopupController);

    function CCPairedPackagesPopupController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$modalInstance,compChannelServices) {
    	    
    	$scope.close=function(){
    		$modalInstance.dismiss('cancel');
       	};
       	$timeout(function(){
           	$('.modal-body').css({'max-height':$('#contentPannel').height()-80});
           	},100);
    	$scope.metaDataFetched=bulkloadServices.getCCMetadata();
    	$scope.pkg={};
    	$scope.addedCount=0;
    	$scope.removedCount=0;
    	
     
       	$scope.loadPackages=function(){       	 
       		compChannelServices.getMetadataPairedPackages($scope.metaDataFetched.packageId).then(function(data){    	
       			$scope.pairedPackageSelected=[];
		   	      $.each(data,function(index,val){
		       	    	val.existing=true;
		       	    	if(val.statusCode!=0){
		       	    		$scope.pairedPackageSelected.push(val);
	         	    	}
		    		 });
        	      /*$.each($scope.pairedPackageSelected,function(index,val){
	          	    	val.existing=true;
	          	    	if(val.statusCode==0){
	          	    		val.existingRemoved=true;
	          	    	}
       		 		});*/
        	      $scope.orderedPairedPackSelected=angular.copy($scope.pairedPackageSelected);
        	  	$( ".selectedtable tbody" ).sortable( {
            		update: function( event, ui ) {
            	    $(this).children().each(function(index) {
            				//$(this).find('td').last().html(index + 1)
            	    	findIndexByKeyValue($scope.orderedPairPackSelected,'basePackageCode',$(this).find('td')[2].innerHTML);
            	    	console.log($scope.orderedPairPackSelected);
            	    	
            	    });
            	  }
            	});
        	  	compChannelServices.getPairedPacakgesList($scope.metaDataFetched.packageId).then(function(data){    	       
            	      $scope.pairedPackageAvailable=data;            	   
            	  $scope.getarrayDiff ();
            	  $scope.filteredPairedPackageAvailable=angular.copy($scope.pairedPackageAvailable);            	
             		 $rootScope.showSpinner=false;
             	 },
             	 function(error){
             		$scope.pairedPackageAvailable=[];
             		 $rootScope.showSpinner=false;
             	 });
	        	
         		 $rootScope.showSpinner=false;
         	 },
         	 function(error){
         		$scope.pairedPackageSelected=[];
         		 $rootScope.showSpinner=false;
         	 });
       	};
       	
       	var j=0;
       	function findIndexByKeyValue(obj,key,value)
	    	{
       		
	    	    for (var i = 0; i < obj.length; i++) {
	    	        if (obj[i][key] == value) {
	    	        	$scope.orderedPairPackSelected[i].newIndex=0+j;
	    	        	j++;
	    	        }
	    	    }
	    	    return null;
	    }
       
   
    		
    	$scope.loadPackages();
       	
       	$scope.getarrayDiff=function(){
 			for (var i = 0; i <  $scope.pairedPackageAvailable.length; i++) { 
 		        for (var j = 0; j < $scope.pairedPackageSelected.length; j++) { 
 		            if ($scope.pairedPackageAvailable[i].basePackageCode === $scope.pairedPackageSelected[j].basePackageCode && !$scope.pairedPackageSelected[j].existingRemoved) {
 		            	$scope.pairedPackageAvailable[i].availableChecked=true;
 		            	$scope.pairedPackageAvailable[i].existing=true;
 		            }
 		           else if($scope.pairedPackageAvailable[i].basePackageCode === $scope.pairedPackageSelected[j].basePackageCode && $scope.pairedPackageSelected[j].existingRemoved){
		            	
		            	$scope.pairedPackageAvailable[i].existing=true;
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
       		$.each($scope.pairedPackageSelected, function( i, value ) {
       			if(data.basePackageCode==value.basePackageCode){
       				index1=i;
       				return;
       			}
       		});
       		if(data.availableChecked){
       			if(data.existing){
       				data.existingRemoved=false;
       				$scope.pairedPackageSelected[index1].existingRemoved=false;
       				$('#colorDiv'+index1).removeClass();
       				$('#colorDiv'+index1).addClass($scope.colorInd(data));
       				$scope.removedCount--;
       			}
       			else{
       				data.newlyAdded=true;
	       			$scope.pairedPackageSelected.push(data);
	       			$scope.colorInd(data);
	       			$scope.addedCount++;
       			}
       		}
       		else{
       			if(data.existing){
       				data.existingRemoved=true;
       				$scope.pairedPackageSelected[index1].existingRemoved=true;
       				$('#colorDiv'+index1).removeClass();
       				$('#colorDiv'+index1).addClass($scope.colorInd(data));
       			}
       			else{
       				data.newlyAdded=false;
	       			$scope.pairedPackageSelected.splice(index1,1);
	       			$scope.addedCount--;
       			}
       		}
       		$scope.orderedPairedPackSelected=angular.copy($scope.pairedPackageSelected);
       		$scope.selectAll();
       	};
       	
       	$scope.removeFromSelected=function(index,data){
       		var index1;
       		$.each($scope.filteredPairedPackageAvailable, function( i, value ) {
       			if(data.basePackageCode==value.basePackageCode){
       				index1=i;
       				return;
       			}
       		});
       		
       		if(data.existing){
       			$scope.pairedPackageSelected[index].existingRemoved=true;       			
       			$scope.filteredPairedPackageAvailable[index1].availableChecked=false;
       			$scope.removedCount++;
       		}
       		else{
       			$scope.pairedPackageSelected.splice(index,1);
       			$scope.filteredPairedPackageAvailable[index1].availableChecked=false;
       			$scope.addedCount--;
       		}
       		$scope.orderedPairedPackSelected=angular.copy($scope.pairedPackageSelected);
       		$scope.selectAll();
       	};
       	
       	$scope.updatePackages=function(){
       		compChannelServices.setSelectedPackages($scope.orderedPairedPackSelected);
       		$rootScope.$broadcast("loadPairedPackages",$scope.orderedPairedPackSelected);
       		$scope.close();
       	};
       	
       	$scope.selectAllcheckbox={
       			'select':false
       	}
       	
       	$scope.checkAll=function(){
			if($scope.selectAllcheckbox.select){
				for(var j=0;j<$scope.filteredPairedPackageAvailable.length;j++){
					if($scope.filteredPairedPackageAvailable[j].availableChecked){
						$scope.filteredPairedPackageAvailable[j].availableChecked=true;
					}
					else{
					$scope.filteredPairedPackageAvailable[j].availableChecked=true;
					$scope.addToSelected(j,$scope.filteredPairedPackageAvailable[j]);
					}
				}
			}
			else{
				if($scope.filteredPairedPackageAvailable){
					for(var j=0;j<$scope.filteredPairedPackageAvailable.length;j++){
						$scope.filteredPairedPackageAvailable[j].availableChecked=false;
					}
					for(var k=$scope.pairedPackageSelected.length-1;k>=0;k--){
						if($scope.pairedPackageSelected[k].existing)
						$scope.pairedPackageSelected[k].existingRemoved=true;
						else
						$scope.pairedPackageSelected.splice(k,1);
					}
				}
			}
			$scope.orderedPairedPackSelected=angular.copy($scope.pairedPackageSelected);
		};
		$scope.selectAll=function(index){
			var flag;         	
			for(var i=0;i<$scope.filteredPairedPackageAvailable.length;i++){
				if($scope.filteredPairedPackageAvailable[i].availableChecked){
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
    CCPairedPackagesPopupController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$modalInstance","compChannelServices"];
})();
    