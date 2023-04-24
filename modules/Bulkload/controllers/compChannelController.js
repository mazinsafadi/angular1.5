(function () {
    'use strict';
    angular.module('Bulkload.compChannelController', []).controller('compChannelController', compChannelController);

    function compChannelController($scope,$modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$http,url,$base64,$state) {
        $scope.userid="";
        //$scope.CmplSupervisor=true;
        $scope.uploadCCClicked=true;
        $scope.selectedFiles=[];
        $scope.pendingFiles=[
                             /*{
                             	'fileName':'AAA bbb c c c sf sd  s fsd fstrt ret re ',
                             	'recordCount':'100',
                             	'uploadedTime':'2017-07-04T11:41:42.866Z',
                             	'effectiveDate':'2017-07-04T11:41:42.866Z'
                         	},
                         	 {
                             	'fileName':'AAA bbb c c c sf sd  s fsd fstrt ret re ',
                             	'recordCount':'100',
                             	'uploadedTime':'2017-07-04T11:41:42.866Z',
                             	'effectiveDate':""
                         	}
                         	*/
         ];
        //$scope.downloadData=[];
        /*$scope.separator=",";
        $scope.decimalSeparator=".";
        $scope.CSVFileName="Sample.csv";
        $scope.getDataHeader=function(){
        	return ["ACCOUNT_NUM", "ACTION", "PACKAGE_BILLING_CODE", "COMMENT"];
        };*/
        bulkloadServices.getPendingFiles().then(function(data){
        	$scope.pendingFiles=data;
        	/*if($scope.CmplSupervisor){
        		$scope.pendingFiles=data;
        	}
        	else{
        		for(var i=0;i<data.length;i++){
        			if(data[i].effectiveDate==="" || data[i].effectiveDate===null){
        				$scope.pendingFiles.push(data[i]);
        			}
        		}
        		
        	}*/
        	$timeout(function(){
        	if($('table.tabular-data tbody').height()>=150){
          		 $('.table-bordered>tbody>tr>td:last-child').css('width','58px');
          	 }else{
          		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
          	 }
        	},500);
        	$scope.error=false;
		       $scope.errMsg='';
        	$scope.uploadCCClicked=false;
        },function(error){
        	$scope.pendingFiles=[];
        	$scope.error=true;
		       $scope.errMsg='Some error occurred.Please try again after sometime';
        	$scope.uploadCCClicked=false;
        });
        $scope.selectAll=function(val){
        	if($scope.CmplSupervisor){
	        	if(val){
	        		for(var i=0;i<$scope.pendingFiles.length;i++){
	        			$scope.pendingFiles[i].selection=true;
	        			$('#img'+i).attr("src",'../images/delete.png');
	        			$('#icon'+i).css('color','dodgerblue');
	        		}
	        	}
	        	else{
	        		for(var j=0;j<$scope.pendingFiles.length;j++){
	        			$scope.pendingFiles[j].selection=false;
	        			$('#img'+j).attr("src",'../images/delete_disabled.png');
	        			$('#icon'+j).css('color','grey');
	        		}
	        	}
        	}
        	else{
        		if(val){
	        		for(var k=0;k<$scope.pendingFiles.length;k++){
	        			if($scope.pendingFiles[k].effectiveDate!=="")
	        				$scope.pendingFiles[k].selection=false;
	        			else
	        				$scope.pendingFiles[k].selection=true;
	        		}
	        	}
	        	else{
	        		for(var l=0;l<$scope.pendingFiles.length;l++){
	        			$scope.pendingFiles[l].selection=false;
	        		}
	        	}
        	}
        };
        $scope.checkAll=function(index){
        	var flag;
        	for(var i=0;i<$scope.pendingFiles.length;i++){
         		if(i==index){
         			if($scope.pendingFiles[i].selection){
         				$('#img'+index).attr("src",'../images/delete.png');
         				$('#icon'+index).css('color','dodgerblue');
         				$scope.isSelected=true;
         			}
         			else{
         				$('#img'+index).attr("src",'../images/delete_disabled.png');
         				$('#icon'+index).css('color','grey');
         				$scope.isSelected=false;
         			}
         		}
       		}
        	for(i=0;i<$scope.pendingFiles.length;i++){
    			if($scope.pendingFiles[i].selection){
    				//$('#img'+i).attr("src",'../images/delete.png');
    				flag=true;
    			}else{
    				//$('#img'+i).attr("src",'../images/delete_disabled.png');
    				flag=false;
    				break;
    			}
    		}
        	if(flag){
        		$scope.selectFiles=true;
        	}
        	else{
        		$scope.selectFiles=false;
        	}
        };
        $scope.init=function(){
        		$scope.cc={
                		'file':'',
                		'accDesc':'',
                		'fileDesc':'',
                		'effectiveDate':'',
                		'priority':'NONE',
                		'busJust':'',
                		'requestId':''
                };
        		var date = new Date();
           	 var hours = date.getHours();
           	  var minutes = date.getMinutes();
           	  var ampm = hours >= 12 ? 'pm' : 'am';
           	  hours = hours % 12;
           	  hours = hours ? hours : 12; // the hour '0' should be '12'
           	  minutes = minutes < 10 ? '0'+minutes : minutes;
           	  var strTime = hours + ':' + minutes + ' ' + ampm;
           	 var n=(date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()+" "+hours+":"+minutes+" "+ampm;
           	 $("#effectiveDate").val(n);
           	 if($('table.tabular-data tbody').height()>=150){
           		 $('.table-bordered>tbody>tr>td:last-child').css('width','58px');
           	 }else{
           		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
           	 }
        };
        $timeout(function(){
          	 $scope.init();
          },500);
      
       
        function setSize(){
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
    	        		$scope.userid=data.userid;
    	        		$scope.privileges=data.privilege;
    	        		$scope.privileges=$scope.privileges.split(',');
    	        		for(var i=0;i<$scope.privileges.length;i++){
    	        			if($scope.privileges[i]=='CompChannelsUpdate'){
    	        				$scope.showUploadCCButton=true;
    	        			}
    	        			if($scope.privileges[i]=='ComplChannelsFileModification'){
    	        				$scope.CmplSupervisor=true;
    	        			}
    	        		}
    	            }
    	            else{
						$state.go('Error');
					}
    	        }
    	    }
    	}
        setSize();
    	/*$(window).resize(function () {
    		setSize();
    	});*/
    	
        $('#mainBody').height($(window).height()-12);
        $('#effectiveDate').datetimepicker({
        	'minDate': new Date(),
       	 maxDate: '+1M', 
       	 //numberOfMonths:2
        });
        $timeout(function(){
       	 $scope.init();
       },100);
        
        $scope.reset=function(){
        	$scope.init();
        	 $('#effectiveDate').datetimepicker({
              	'minDate': new Date(),
             	 maxDate: '+1M', 
             	 //numberOfMonths:2
              });
        	 $scope.selectFiles=false;
        	// $("#effectiveDate").removeClass('hasDatepicker').dfwDateTimePicker('datetime');
        	 for(var i=0;i<$scope.pendingFiles.length;i++){
        		 $scope.pendingFiles[i].selection=false;
        		 $('#img'+i).attr("src",'../images/delete_disabled.png');
        		 $('#icon'+i).css('color','grey');
         	}
        	 $scope.errMsg="";
        	 $scope.errSucc="";
        	
        	//document.getElementById("uploadFile").value="";
        		
        };
        /*$scope.strEndsWith=function(str, suffix) {
		    return str.match(suffix+"$")==suffix;
		}*/
        $scope.uploadCmpl = function(){
        	/*var file = $scope.myFile;
        	var uploadUrl = "https://jsonplaceholder.typicode.com/";
        	var fileName=document.getElementById("uploadFile").value;*/
        	//$scope.effDate=document.getElementById("effectiveDate").value;
        	$scope.effDate = new Date(document.getElementById("effectiveDate").value).toISOString();
        	$scope.selectedFiles=[];
        	$scope.selectedFileNames=[];
        	for(var i=0;i<$scope.pendingFiles.length;i++){
        		if($scope.pendingFiles[i].selection){
        			$scope.selectedFiles.push($scope.pendingFiles[i].fileId);
        			$scope.selectedFileNames.push($scope.pendingFiles[i].fileName);
        			$scope.isSelected=true;
        		}
        	}
        	$scope.data={
        			'fileDesc':$scope.cc.fileDesc,
            		'acctDesc':$scope.cc.busJust,
            		'effDate':$scope.effDate,
            		'requestID':$scope.cc.requestId,
            		'priority':$scope.cc.priority,
            		'pendingFiles':$scope.selectedFiles.join(),
            		'fileType':'CMPL',
            		'lastUpdateBy':$scope.userid
        	};
        	if($scope.effDate !== "" && $scope.effDate !== undefined && $scope.effDate !== null && $scope.cc.fileDesc !== "" && $scope.cc.fileDesc !== undefined && $scope.cc.fileDesc !== null && $scope.cc.busJust !== "" && $scope.cc.busJust !== undefined && $scope.cc.busJust !== null && $scope.cc.requestId !== "" && $scope.cc.requestId !== undefined && $scope.cc.requestId !== null && $scope.cc.priority !== "" && $scope.cc.priority !== undefined && $scope.cc.priority !== null && $scope.isSelected)
        	{
        		//if(fileName.endsWith('.csv')){
        		
        		//if(strEndsWith(fileName,".csv")){
        		 $scope.error=false;
			       $scope.errMsg='';
			       $scope.errSucc="";
			       $scope.uploadCCClicked=true;
			       bulkloadServices.uploadCCData($scope.data).then(function(result){
			    	   
			    	   $scope.errSucc="File(s) ["+$scope.selectedFileNames.join()+"] updated successfully. File(s) processing starts with the selected effective date.";
			    	   $scope.uploadSuccess=true;
			    	   bulkloadServices.getPendingFiles().then(function(data){
			           	$scope.pendingFiles=data;
			           	$timeout(function(){
			           	if($('table.tabular-data tbody').height()>=150){
			             		 $('.table-bordered>tbody>tr>td:last-child').css('width','58px');
			             	 }else{
			             		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
			             	 }
			           	},500);
			           	$scope.error=false;
			   		    $scope.errMsg='';
			           	$scope.uploadCCClicked=false;
			           },function(error){
			           	$scope.pendingFiles=[];
			           	$scope.error=true;
			   		       $scope.errMsg='Some error occurred.Please try again after sometime';
			           	$scope.uploadCCClicked=false;
			           });
						$scope.onSuccess();
			        //$scope.uploadCCClicked=false;
			        }, function(error) {
			        	 $scope.error=true;
					      $scope.errMsg='Error in updating. Please try again/contact support team.';
					      $scope.uploadCCClicked=false;
			        });
			       
        	/*	}
        		else{
        			$scope.error=true;
            		$scope.errMsg='Only .csv files are allowed to upload';
        		}*/
        	}
        	else{
        		$scope.error=true;
        		$scope.errMsg='Mandatory fields are empty';
        	}

       };
       $scope.recordCount="";
   $scope.downloadFile=function(index,data){
	   $scope.uploadCCClicked=true;
	   var username=url.userName;
   		var password=url.password;
	   $scope.recordCount=data.recordCount;
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
	  
	   var csvString="ACCOUNT_NUM,ACTION,PACKAGE_BILLING_CODE,COMMENT\n";
   $http({method: 'GET', url: url.exportAccounts,accept:'application/text',params:$scope.index,headers: {
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
      $scope.uploadCCClicked=false;
   }).
   error(function(data, status, headers, config) {
	   $scope.uploadCCClicked=false;
   });
   };
  
   $scope.manualDownload=function(start,stop,fileid){
	   $scope.index1={
			   'fileId':fileid,
			   'start':start,
			   'stop':stop
	   };
	   $scope.uploadCCClicked=true;
	   var csvString="ACCOUNT_NUM,ACTION,PACKAGE_BILLING_CODE,COMMENT\n";
	   $http({method: 'GET', url: url.exportAccounts,accept:'application/text',params:$scope.index1,headers: {
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
    	      }else if(stop+25000>$scope.recordCount && $scope.numDownloads>0){
    	    	  $scope.index1.start+=25000;
    	    	  $scope.index1.stop=$scope.recordCount;
    		      $scope.manualDownload($scope.index1.start,$scope.index1.stop,$scope.index1.fileId);
    	      }
	      $scope.uploadCCClicked=false;
	   }).
	   error(function(data, status, headers, config) {
		   $scope.uploadCCClicked=false;
	   });
   };
   $scope.displayHideMessages=function(){
	   $scope.errMsg="";
	   $scope.errSucc="";
   };
   $scope.openConfirmPopup=function(data){
	   if(data.selection){
	   bulkloadServices.setData(data);
	   bulkloadServices.setUser($scope.userid);
  		var deleteModalInstance = $modal.open({
			templateUrl: 'modules/Bulkload/views/ConfirmPopup.html',
			controller: 'DeletePopupController',
			windowClass: 'popup',
			backdrop: 'static'
			});
				window.parent.postMessage(  {'action': 'create','origin':window.location.origin} ,'*' );
	   }
	};
		$scope.$on("refreshTable", function(events,args){
			if(args.record){
				$scope.errSucc=args.record.fileName+" deleted successfully";
				$scope.uploadSuccess=true;
			}
			  bulkloadServices.getPendingFiles().then(function(data){
			       	$scope.pendingFiles=[];
			       	$scope.pendingFiles=data;
			       	$timeout(function(){
			       		if($('table.tabular-data tbody').height()>=150){
			           		 $('.table-bordered>tbody>tr>td:last-child').css('width','58px');
			           	 }else{
			           		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
			           	 }
			       	},500);
			       	$scope.error=false;
					$scope.errMsg='';
					$rootScope.uploadCCClicked=false;
					/*$timeout(function(){
						$scope.errSucc='';
						$scope.uploadSuccess=false;
					},2000);*/
			       },function(error){
			       	$scope.pendingFiles=[];
			       	$scope.error=true;
			       	$scope.errMsg='Some error occurred.Please try again after sometime';
			       	$rootScope.uploadCCClicked=false;
			       });
		});
		$scope.callDisable=function(data){
			if((data.effectiveDate!=="" && data.effectiveDate!==null) && !$scope.CmplSupervisor){
				return true;
			}
			else{
				return false;
			}
		};
		$scope.onSuccess=function(){
			$scope.init();
			$('#effectiveDate').datetimepicker({
              	'minDate': new Date(),
             	 maxDate: '+1M', 
             	 //numberOfMonths:2
              });
        	 $scope.selectFiles=false;
        	// $("#effectiveDate").removeClass('hasDatepicker').dfwDateTimePicker('datetime');
        	 for(var i=0;i<$scope.pendingFiles.length;i++){
        		 $scope.pendingFiles[i].selection=false;
        		 $('#img'+i).attr("src",'../images/delete_disabled.png');
        		 $('#icon'+i).css('color','grey');
         	}
		};
		 $scope.openCorrectionPopup=function(file){
			 if(file.selection){
         	bulkloadServices.setFileName(file);
         	bulkloadServices.setUser($scope.userid);
         	var correctionModalInstance = $modal.open({
     			templateUrl: 'modules/Bulkload/views/CorrectionPopup.html',
     			controller: 'CorrectionPopupController',
     			windowClass: 'popup',
     			backdrop: 'static'
     			});
     		window.parent.postMessage(  {'action': 'create','origin':window.location.origin} ,'*' );
         }
		};
    }
    compChannelController.$inject = ["$scope","$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$http","url","$base64","$state"];
})();
