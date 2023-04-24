(function () {
    'use strict';
    angular.module('Bulkload.DNSDashboardController', []).controller('DNSDashboardController', DNSDashboardController);

    function DNSDashboardController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$http,url,$base64,$state) {
    	$scope.userid="";
        $scope.hideExpand=true;
        $scope.hideSearchFields=true;
        var format = 'DD/MM/YYYY HH:mm';
		 $scope.dat=moment(new Date(), format).tz('America/New_York').format(format);
        $rootScope.searchbuttonclicked=true;
        $scope.searchType='file';
        $scope.search={};
        $scope.hideSearch=function(){
        	$('.purchase-table').css('width','99%');
        	//$timeout(function(){
        	$scope.hideSearchFields=true;
        	$scope.hideExpand=true;
        	$scope.showExpand=false;
        	//},500);
        	 $scope.init();
        };
        $scope.openSearch=function(){
        	$('.purchase-table').css('width','79%');
        	$timeout(function(){
        	$scope.hideSearchFields=false;
        	$scope.showExpand=true;
        	$scope.hideExpand=false;
        	$scope.init();
        	},500);
        	
        };
        $scope.DNSFiles=[];
        $scope.DNSAccounts=[];
        $scope.init=function(){
        	 $timeout(function(){
        		 $('#searchTable').height($('#mainBody').height()-($('.topTitle').height()+63+18));
        		 $scope.maxHeight=$('#contentPannel').height()-($('.displayData-btn').height()+$('.topTitle').height()+$('tfoot').height()+$('thead').height()+7+18);
        		 $('table.tabular-data tbody').css('max-height',$scope.maxHeight+'px');
        		 if($('table.tabular-data tbody').height()<$scope.maxHeight){
        			 $('table.tabular-data tbody').css('height',$scope.maxHeight+'px');
        		 }
        	if($scope.hideSearchFields){
        		$('.table-bordered>thead>tr:first-child>th:last-child').css('width','75px');
		       	if($('table.tabular-data tbody').hasScrollBar()){
		         	 $('.table-bordered>tbody>tr>td:last-child').css('width','60px');
		         	$('.table-bordered>thead>tr:first-child>th:last-child').css('width','75px');
		       	}else{
		         	 $('.table-bordered>tbody>tr>td:last-child').css('width','76px');
		         	$('.table-bordered>thead>tr:first-child>th:last-child').css('width','76px');
		        }
        	}
        	else{
        		$('.table-bordered>thead>tr:first-child>th:last-child').css('width','80px');
        		if($('table.tabular-data tbody').hasScrollBar()){
		         	 $('.table-bordered>tbody>tr>td:last-child').css('width','60px');
		         	$('.table-bordered>thead>tr:first-child>th:last-child').css('width','80px');
		       	}else{
		         	 $('.table-bordered>tbody>tr>td:last-child').css('width','84px');
		         	$('.table-bordered>thead>tr:first-child>th:last-child').css('width','85px');
		        }
        	}
        	 },100);
        };
        $scope.init();
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
    	            	$('#mainBody').css({'height':data.height});
    	            	$scope.maxHeight=$('#contentPannel').height()-($('.displayData-btn').height()+$('.topTitle').height()+$('tfoot').height()+$('thead').height()+7+18);
    	        		$scope.userid=data.userid;
    	        		$scope.privileges=data.privilege;
    	        		/*$scope.privileges=$scope.privileges.split(',');
    	        		for(var i=0;i<$scope.privileges.length;i++){
    	        			if($scope.privileges[i]=='DNSChannelsUpdate'){
    	        				$scope.showUploadButton=true;
    	        			}
    	        		}*/
    	            }
    	            else{
						$state.go('Error');
					}
    	        }
    	    }
    	};
    	$scope.setSize();
    	$scope.start=1;
    	$scope.stop=20;
    	$scope.itemsPerPage = 20;
        $scope.currentPage = 0;
         $scope.loadDashboard=function(start,stop,isRefresh){
        	 $rootScope.searchbuttonclicked=true;
        	 if(isRefresh){
        		 $scope.currentPage = 0;
        		 var format = 'DD/MM/YYYY HH:mm';
        		 $scope.dat=moment(new Date(), format).tz('America/New_York').format(format);
        		 $scope.search={};
        	 }
        	 $scope.loadParams={
        			 'startRecords':start,
             		'endRecords':stop
        	 };
    	 bulkloadServices.getDNSDashboard($scope.loadParams).then(function(data){
		       	$scope.DNSFiles=data;
		       	if(data.length!==0){
		        $scope.total=data[0].totalFileCount;
		        $scope.init();
		       	$scope.error=false;
				$scope.errMsg='';
				$scope.range = function() {
		              var rangeSize = 5;
		              var ret = [];
		              var start;
		              start = $scope.currentPage;
		              if($scope.pageCount()<5)
		                rangeSize=$scope.pageCount();
		              if (start > $scope.pageCount()-rangeSize) {
		                start = $scope.pageCount()-rangeSize;
		              }
		              for (var i=start; i<start+rangeSize; i++) {
		                ret.push(i);
		              }
		              return ret;
		            };
		            $scope.prevPage = function() {
		              if ($scope.currentPage > 0) {
		                $scope.currentPage--;
		                $rootScope.searchbuttonclicked=true;
		                $scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		              }
		            };
		            $scope.prevPageDisabled = function() {
		              return $scope.currentPage === 0 ? 'disabled' : '';
		            };
		            $scope.nextPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		                    $scope.currentPage++;
		                    $rootScope.searchbuttonclicked=true;
		                    $scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		                }
		            };
		            $scope.firstPage = function() {
		            	if ($scope.currentPage > 0) {
		              $scope.currentPage=0;
		              $rootScope.searchbuttonclicked=true;
		              $scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		            	}
		            };
		            $scope.lastPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		              $scope.currentPage=$scope.pageCount()-1;
		              $rootScope.searchbuttonclicked=true;
		              $scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		            	}
		            };
		            $scope.nextPageDisabled = function() {
		            	return $scope.currentPage==$scope.pageCount()-1 ? 'disabled' : '';
		            };
		            $scope.pageCount = function() {
		              return Math.ceil($scope.total/$scope.itemsPerPage);
		            };
		            $scope.setPage = function(n) {
		              if (n >= 0 && n < $scope.pageCount()) {
		                $scope.currentPage = n;
		                $rootScope.searchbuttonclicked=true;
		                $scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		              }
		            };
		       	}
				$rootScope.searchbuttonclicked=false;
		       },function(error){
		       	$scope.DNSFiles=[];
		       	$scope.error=true;
		       	//$scope.errMsg='Some error occurred.Please try again after sometime';
		       	$rootScope.searchbuttonclicked=false;
		       	
		       });
         };
            $scope.loadDashboard($scope.start,$scope.stop);
            $scope.searchDNS=function(start,stop){
            	 var format = 'DD/MM/YYYY HH:mm';
        		 $scope.dat=moment(new Date(), format).tz('America/New_York').format(format);
            	if(start==1){
            		$scope.currentPage=0;
            	}
            	$rootScope.searchbuttonclicked=true;
            	$scope.attrs={
            		'startRecords':start,
            		'endRecords':stop,
            		'fileName':$scope.search.fileName,
            		'reqId':$scope.search.reqId,
            		'status':$scope.search.status,
            		'uploadBy':$scope.search.uploadedBy
            	};
            	bulkloadServices.searchDNSDashboardFile($scope.attrs).then(function(data){
            		$scope.DNSFiles=data;
            		if(data.length!==0){
        		        $scope.total=data[0].totalFileCount;
        		        $scope.init();
        		       	$scope.error=false;
        				$scope.errMsg='';
        				$scope.range = function() {
        		              var rangeSize = 5;
        		              var ret = [];
        		              var start;
        		              start = $scope.currentPage;
        		              if($scope.pageCount()<5)
        		                rangeSize=$scope.pageCount();
        		              if (start > $scope.pageCount()-rangeSize) {
        		                start = $scope.pageCount()-rangeSize;
        		              }
        		              for (var i=start; i<start+rangeSize; i++) {
        		                ret.push(i);
        		              }
        		              return ret;
        		            };
        		            $scope.prevPage = function() {
        		              if ($scope.currentPage > 0) {
        		                $scope.currentPage--;
        		                $rootScope.searchbuttonclicked=true;
        		                $scope.searchDNS($scope.currentPage*20+1,$scope.currentPage*20+20);
        		              }
        		            };
        		            $scope.prevPageDisabled = function() {
        		              return $scope.currentPage === 0 ? 'disabled' : '';
        		            };
        		            $scope.nextPage = function() {
        		            	if ($scope.currentPage < $scope.pageCount() - 1) {
        		                    $scope.currentPage++;
        		                    $rootScope.searchbuttonclicked=true;
        		                    $scope.searchDNS($scope.currentPage*20+1,$scope.currentPage*20+20);
        		                }
        		            };
        		            $scope.firstPage = function() {
        		            	if ($scope.currentPage > 0) {
        		              $scope.currentPage=0;
        		              $rootScope.searchbuttonclicked=true;
        		              $scope.searchDNS($scope.currentPage*20+1,$scope.currentPage*20+20);
        		            	}
        		            };
        		            $scope.lastPage = function() {
        		            	if ($scope.currentPage < $scope.pageCount() - 1) {
        		              $scope.currentPage=$scope.pageCount()-1;
        		              $rootScope.searchbuttonclicked=true;
        		              $scope.searchDNS($scope.currentPage*20+1,$scope.currentPage*20+20);
        		            	}
        		            };
        		            $scope.nextPageDisabled = function() {
        		            	return $scope.currentPage==$scope.pageCount()-1 ? 'disabled' : '';
        		            };
        		            $scope.pageCount = function() {
        		              return Math.ceil($scope.total/$scope.itemsPerPage);
        		            };
        		            $scope.setPage = function(n) {
        		              if (n >= 0 && n < $scope.pageCount()) {
        		                $scope.currentPage = n;
        		                $rootScope.searchbuttonclicked=true;
        		                $scope.searchDNS($scope.currentPage*20+1,$scope.currentPage*20+20);
        		              }
        		            };
        		       	}
        				$rootScope.searchbuttonclicked=false;
        		       },function(error){
        		       	$scope.DNSFiles=[];
        		       	$scope.error=true;
        		       	//$scope.errMsg='Some error occurred.Please try again after sometime';
        		       	$rootScope.searchbuttonclicked=false;
            	});
            };
            $scope.resetDNS=function(){
            	$scope.search={};
            };
            $scope.openFailedAccountsPopup=function(file){
            	bulkloadServices.setFileName(file);
            	var failedModalInstance = $modal.open({
        			templateUrl: 'modules/Bulkload/views/FailedAccountsPopup.html',
        			controller: 'FailedAccPopupController',
        			windowClass: 'popup failedpopup',
        			backdrop: 'static'
        			});
        		window.parent.postMessage(  {'action': 'create','origin':window.location.origin} ,'*' );
            };
            $scope.searchDNSAcc=function(start,stop){
            	 var format = 'DD/MM/YYYY HH:mm';
        		 $scope.dat=moment(new Date(), format).tz('America/New_York').format(format);
            	if($scope.search.accNum){
            	if(start==1){
            		$scope.currentPage=0;
            	}
            	$rootScope.searchbuttonclicked=true;
            	$scope.attrs={
            		'pagStart':start,
            		'pagEnd':stop,
            		'accountNumber':$scope.search.accNum,
            		'packageBillingCode':$scope.search.billingCode
            	};
            	bulkloadServices.searchCCDashboardAcc($scope.attrs).then(function(data){
            			$scope.DNSAccounts=data.bulkAccounts;
		       	if(data.bulkAccounts.length!==0){
		        $scope.total=data.count;
		        $scope.init();
		       	$scope.error=false;
				$scope.errMsg='';
				$scope.range = function() {
		              var rangeSize = 5;
		              var ret = [];
		              var start;
		              start = $scope.currentPage;
		              if($scope.pageCount()<5)
		                rangeSize=$scope.pageCount();
		              if (start > $scope.pageCount()-rangeSize) {
		                start = $scope.pageCount()-rangeSize;
		              }
		              for (var i=start; i<start+rangeSize; i++) {
		                ret.push(i);
		              }
		              return ret;
		            };
		            $scope.prevPage = function() {
		              if ($scope.currentPage > 0) {
		                $scope.currentPage--;
		                $rootScope.searchbuttonclicked=true;
		                $scope.searchDNSAcc($scope.currentPage*20+1,$scope.currentPage*20+20);
		              }
		            };
		            $scope.prevPageDisabled = function() {
		              return $scope.currentPage === 0 ? 'disabled' : '';
		            };
		            $scope.nextPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		                    $scope.currentPage++;
		                    $rootScope.searchbuttonclicked=true;
		                    $scope.searchDNSAcc($scope.currentPage*20+1,$scope.currentPage*20+20);
		                }
		            };
		            $scope.firstPage = function() {
		            	 if ($scope.currentPage > 0) {
		              $scope.currentPage=0;
		              $rootScope.searchbuttonclicked=true;
		              $scope.searchDNSAcc($scope.currentPage*20+1,$scope.currentPage*20+20);
		            	 }
		            };
		            $scope.lastPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		              $scope.currentPage=$scope.pageCount()-1;
		              $rootScope.searchbuttonclicked=true;
		              $scope.searchDNSAcc($scope.currentPage*20+1,$scope.currentPage*20+20);
		            	}
		            };
		            $scope.nextPageDisabled = function() {
		            	return $scope.currentPage==$scope.pageCount()-1 ? 'disabled' : '';
		            };
		            $scope.pageCount = function() {
		              return Math.ceil($scope.total/$scope.itemsPerPage);
		            };
		            $scope.setPage = function(n) {
		              if (n >= 0 && n < $scope.pageCount()) {
		                $scope.currentPage = n;
		                $rootScope.searchbuttonclicked=true;
		                $scope.searchDNSAcc($scope.currentPage*20+1,$scope.currentPage*20+20);
		              }
		            };
		       	}
				$rootScope.searchbuttonclicked=false;
		       },function(error){
		       	$scope.DNSAccounts=[];
		       	$scope.error=true;
		       	//$scope.errMsg='Some error occurred.Please try again after sometime';
		       	$rootScope.searchbuttonclicked=false;
		       	
		       });
            	}
            	else{
            		$scope.DNSAccounts=[];
    		       	$scope.error=true;
    		       	$scope.errMsg='Please enter valid account number.';
            	}
            };
            $scope.downloadFile=function(index,data){
            	var username=url.userName;
            	var password=url.password;
            	$rootScope.searchbuttonclicked=true;
         	   $scope.recordCount=data.totalAccounts;
         	   $scope.filename=data.fileName;
         	   $scope.numDownloads=Math.ceil($scope.recordCount/25000);
        	   $scope.total=Math.ceil($scope.recordCount/25000);
        	   $scope.numFile=1;
         	   var modulo=$scope.recordCount%25000;
         	   $scope.index={
         			   'fileId':data.fileId,
         		'start':0,
         		'stop':0
         	   };
         	   if($scope.recordCount>=25000){
         		   $scope.index.start=1;
         		   $scope.index.stop=25000;
         	   }
         	   else{
         		   $scope.index.start=1;
         		   $scope.index.stop=$scope.recordCount;
         	   }
         	  
         	   var csvString="ACCOUNT_NUM,ACTION,PACKAGE_BILLING_CODE,STATUS,ERROR_DESCRIPTION\n";
            $http({method: 'GET', url: url.exportDashboardAccounts,accept:'application/text',params:$scope.index,headers: {
         		'Content-Type': 'application/json;charset=UTF-8',
         		'Authorization': 'Basic '+$base64.encode(username+':'+password),
         		'Accept' : 'application/json'
         	}}).
            success(function(data, status, headers, config) {
         	   csvString=csvString+data.jsonStr;
         	   var fileBlob = new Blob([csvString], {type: 'application/pdf'});
         	   if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
                    window.navigator.msSaveOrOpenBlob(fileBlob, $scope.filename+'_'+$scope.numFile+'of ' +$scope.total+'.csv');
                    $scope.numDownloads--;
                    $scope.numFile++;
         	   } else { 
               var anchor = angular.element('<a/>');
               anchor.attr({
                   href: 'data:application/octet-stream;base64,' + btoa(csvString),
                   target: '_blank',
                   download: $scope.filename+'_'+$scope.numFile+'of ' +$scope.total+'.csv'
               })[0].click();
               $scope.numDownloads--;
               $scope.numFile++;
                }
         	   
               if($scope.numDownloads>0 && $scope.index.stop+25000<=$scope.recordCount){
             	  $scope.index.start+=25000;
             	  $scope.index.stop+=25000;
         	      $scope.manualDownload($scope.index.start,$scope.index.stop,$scope.index.fileId);
               }else if($scope.numDownloads>0 && $scope.index.stop+25000>$scope.recordCount){
             	  $scope.index.start+=25000;
             	  $scope.index.stop=$scope.recordCount;
         	      $scope.manualDownload($scope.index.start,$scope.index.stop,$scope.index.fileId);
               }
               $scope.flagged=true;
               //$scope.manualDownload(index.start,index.stop);
               $rootScope.searchbuttonclicked=false;
            }).
            error(function(data, status, headers, config) {
         	   $scope.searchbuttonclicked=false;
            });
            };
           
            $scope.manualDownload=function(start,stop,fileid){
         	   $scope.index1={
         			   'fileId':fileid,
         			   'start':start,
         			   'stop':stop
         	   };
         	  $rootScope.searchbuttonclicked=true;
         	   var csvString="ACCOUNT_NUM,ACTION,PACKAGE_BILLING_CODE,STATUS,ERROR_DESCRIPTION\n";
         	   $http({method: 'GET', url: url.exportDashboardAccounts,accept:'application/text',params:$scope.index1,headers: {
         		'Content-Type': 'application/json;charset=UTF-8',
         		'Authorization': 'Basic '+$base64.encode(url.userName+':'+url.password),
         		'Accept' : 'application/json'
         	}}).
         	   success(function(data, status, headers, config) {
         		   csvString=csvString+data.jsonStr;
         		   //console.log(csvString);
         		   var fileBlob = new Blob([csvString], {type: 'application/pdf'});
             	   if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
                        window.navigator.msSaveOrOpenBlob(fileBlob, $scope.filename+'_'+$scope.numFile+'of ' +$scope.total+'.csv');
                        $scope.numDownloads--;
                        $scope.numFile++; 
             	   } else { 
         	      var anchor = angular.element('<a/>');
         	      anchor.attr({
         	          href: 'data:application/octet-stream;base64,' + btoa(csvString),
         	          target: '_blank',
         	          download: $scope.filename+'_'+$scope.numFile+'of ' +$scope.total+'.csv'
         	      })[0].click();
         	     $scope.numDownloads--;
                 $scope.numFile++;
                    }
             	  if(stop+25000<=$scope.recordCount && $scope.numDownloads>0){
            		   $scope.index1.start+=25000;
            		   $scope.index1.stop+=25000;
            		   $scope.manualDownload($scope.index1.start,$scope.index1.stop,$scope.index1.fileId);
            	   }
            	   else if(stop+25000>$scope.recordCount && $scope.numDownloads>0){
            	    	  $scope.index1.start+=25000;
            	    	  $scope.index1.stop=$scope.recordCount;
            		      $scope.manualDownload($scope.index1.start,$scope.index1.stop,$scope.index1.fileId);
            	    }
             	  $rootScope.searchbuttonclicked=false;
         	   }).
         	   error(function(data, status, headers, config) {
         		  $rootScope.searchbuttonclicked=false;
         	   });
            };
    }
    DNSDashboardController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$http","url","$base64","$state"];
})();
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);
