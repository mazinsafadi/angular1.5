(function () {
    'use strict';
    angular.module('Bulkload.bulkloadController', []).controller('bulkloadController', bulkloadController);

    function bulkloadController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$state) {
       // var vm = this;
    	//$scope.DNSSupervisor=true;
    	$rootScope.uploadDNSClicked=true;
        $scope.userid="";
        bulkloadServices.setUser( $scope.userid);
        $scope.init=function(){
        		$scope.bulkLoad={
                		'file':'',
                		'fileDesc':'',
                		'effectiveDate':'',
                		'priority':'NONE',
                		'busJust':'',
                		'requestId':''
                };
        		 $scope.selected=false;
        	       $scope.changeEditFields=false; 
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
          		 $('.dnsTable>tbody>tr>td:last-child').css('width','60px');
          	 }else{
          		$('.dnsTable>tbody>tr>td:last-child').css('width','77px');
          	 }
             $scope.errSucc="";
	    	   $scope.uploadSuccess=false;
        };
        $timeout(function(){
          	 $scope.init();
          },100);
        $scope.fileHref = "C:\Users\nr760w\Downloads\hello.txt";
       /*document.getElementById("uploadBtn").onchange = function () {
            document.getElementById("uploadFile").value = this.value;
            console.log(document.getElementById("uploadBtn").value);
        };*/
        $scope.fileChanged = function(files) {
        	document.getElementById("uploadFile").value = files.value;
        	$scope.displayHideMessages();
        	};
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
    	        		$scope.userid=data.userid;
    	        		$scope.privileges=data.privilege;
    	        		$scope.privileges=$scope.privileges.split(',');
    	        		for(var i=0;i<$scope.privileges.length;i++){
    	        			if($scope.privileges[i]=='DNSChannelsUpdate'){
    	        				$scope.showUploadButton=true;
    	        			}
    	        			if($scope.privileges[i]=='DNSChannelsFileModification'){
    	        				$scope.DNSSupervisor=true;
    	        			}
    	        		}
    	            }
    	            else{
						$state.go('Error');
					}
    	        }
    	    }
    	};
        $scope.setSize();
    	
        $('#mainBody').height($(window).height()-12);
        $('#effectiveDate').datetimepicker({
        	'minDate': new Date(),
       	 maxDate: '+1M', 
       	 //numberOfMonths:2
        });
        $timeout(function(){
       	 $scope.init();
       },100);
        //$scope.downloadData = [{a: 1, b:2,c:5}, {a:3, b:4,c:6}];
        $scope.separator=",";
        $scope.decimalSeparator=".";
        $scope.CSVFileName="Sample.csv";
        $scope.getDataHeader=function(){
        	return ["ACCOUNT_NUM","ACTION","PACKAGE_BILLING_CODE","COMMENT"];
        };
       // $scope.getSingleInvoicePDF = function(invoiceNumberEntity) {
        	/* var blob = new Blob([document.getElementById('exportable').innerHTML], {
                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
             });
             saveAs(blob, "hello.xls");*/
        		/*var fileName = "hello.csv";
           var pdfDownload = document.createElement("a");
           document.body.appendChild(pdfDownload);

           $.ajax({
        	   url: 'https://jsonplaceholder.typicode.com/posts/1',
        	   method: 'GET'
        	 }).then(function(data) {
        	   console.log(data);
        	   var fileBlob = new Blob([data.body], {type: 'application/pdf'});
        	   if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
                   window.navigator.msSaveBlob(fileBlob, fileName);
               } else { // for other browsers
                   var fileURL = window.URL.createObjectURL(fileBlob);
                   pdfDownload.href = fileURL;
                   pdfDownload.download = fileName;
                   pdfDownload.click();   
                   var element = document.createElement('a');
                   element.setAttribute('href', 'data:attachment/csv,' + encodeURIComponent(data.title));
                   element.setAttribute('download', fileName);

                   element.style.display = 'none';
                   document.body.appendChild(element);

                   element.click();

                   document.body.removeChild(element);
               }
        	 });*/
         
        //};
        $scope.reset=function(){
        	$scope.init();
        	// $("#effectiveDate").removeClass('hasDatepicker').dfwDateTimePicker('datetime');
        	document.getElementById("uploadFile").value="";
        	document.getElementById("uploadBtn").disabled = false;
        	 $('#effectiveDate').datetimepicker({
             	'minDate': new Date(),
            	 maxDate: '+1M', 
            	 //numberOfMonths:2
             });
        	 for(var i=0;i<$scope.pendingDNSFiles.length;i++){
        		 $scope.pendingDNSFiles[i].selection=false;
        		 $('#img'+i).attr("src",'../images/delete_disabled.png');
         	}
        	$("input[type='file']").val(null);	
        };
        $scope.strEndsWith=function(str, suffix) {
		    return str.match(suffix+"$")==suffix;
		};
        $scope.uploadFile = function(){
        	$scope.fileName=document.getElementById("uploadFile").value;
        	$scope.effDate=$("#effectiveDate").val();
        	//console.log("file",$scope.fileName,$scope.effDate);
        	/*$scope.fileName;
        	$scope.effDate;*/
        	$scope.error=false;
		       $scope.errMsg='';
		       $scope.errSucc='';
	    	   $scope.uploadSuccess=false;
        	if($scope.effDate !== "" && $scope.effDate !== undefined && $scope.effDate !== null && $scope.bulkLoad.fileDesc !== "" && $scope.bulkLoad.fileDesc !== undefined && $scope.bulkLoad.fileDesc !== null && $scope.fileName !== undefined && $scope.fileName !== null && $scope.fileName !== "" && $scope.bulkLoad.busJust !== undefined && $scope.bulkLoad.busJust !== ""  && $scope.bulkLoad.busJust !== null && $scope.bulkLoad.requestId !== "" && $scope.bulkLoad.requestId !== undefined && $scope.bulkLoad.requestId !== null && $scope.bulkLoad.priority !== "" && $scope.bulkLoad.priority !== undefined && $scope.bulkLoad.priority !== null)
        	{
        		$scope.file = $scope.myFile;
            	//var effDate=$("#effectiveDate").val();
            	var effDate = new Date($("#effectiveDate").val()).toISOString();
            	$scope.data={
            		'fileDesc':$scope.bulkLoad.fileDesc,
            		'acctDesc':$scope.bulkLoad.busJust,
            		'effDate':effDate,
            		'fileName':this.file.name,
            		'requestID':$scope.bulkLoad.requestId,
            		'priority':$scope.bulkLoad.priority,
            		'fileType':'DNS',
            		'lastUpdateBy':$scope.userid
            	};
        		//if(fileName.endsWith('.csv')){
        		
        		if($scope.strEndsWith($scope.fileName,".csv")){
        			$rootScope.uploadDNSClicked=true;
			       bulkloadServices.uploadFileToUrl($scope.file, $scope.data).then(function(result){
			    	   $scope.res=result;
			    	     if(result){
			    	   if(result.status[0].code==400){
				    	   	$scope.error=true;
						      $scope.errMsg=result.status[0].message;
				    	   }
				    	   else{
				    	   $scope.errSucc=result.status[0].message;
				    	   $scope.uploadSuccess=true;
				    	   bulkloadServices.getPendingDNSfiles().then(function(data){
				    	       	$scope.pendingDNSFiles=data;
				    	       	$timeout(function(){
				    	       	if($('table.tabular-data tbody').height()>=150){
				    	         		 $('.table-bordered>tbody>tr>td:last-child').css('width','60px');
				    	         	 }else{
				    	         		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
				    	         	 }
				    	       	},500);
				    	       	$scope.error=false;
				    			$scope.errMsg='';
				    			$rootScope.uploadDNSClicked=false;
				    	       },function(error){
				    	       	$scope.pendingFiles=[];
				    	       	$scope.error=true;
				    	       	$scope.errMsg='Some error occurred.Please try again after sometime';
				    	       	$rootScope.uploadDNSClicked=false;
				    	       });
				    	   $scope.onSuccess();
				    	   }
				    	}
			    	     $rootScope.uploadDNSClicked=false;
			    	   /*$scope.errors = bulkloadServices.getResponse();
			        console.log($scope.errors);
			        $scope.errVisibility = true;
			        bulkloadServices.uploadFileDetails($scope.data).then(function(result){
				        console.log(result);
				        }, function(error) {
				        });*/
			        }, function(error) {
			        	$rootScope.uploadDNSClicked=false;
			        	$scope.error=true;
					      $scope.errMsg='Upload failed.Please try again';
			        });
			       
        		}
        		else{
        			$scope.error=true;
            		$scope.errMsg='Only .csv files are allowed to upload';
        		}
        	}
        	else{
        		$scope.error=true;
        		$scope.errMsg='Mandatory fields are empty';
        	}

       };
       $scope.downloadSampleTemplate=function(){
    	   $scope.csvString="ACCOUNT_NUM,ACTION,PACKAGE_BILLING_CODE,COMMENT\n";
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
       $scope.displayHideMessages=function(){
    	   $scope.errMsg="";
    	   $scope.errSucc="";
       };
       //$scope.privileges="DNSSupervisor";
       $scope.pendingDNSFiles=[];
       bulkloadServices.getPendingDNSfiles().then(function(data){
       	//$scope.pendingDNSFiles=[];
       	$scope.pendingDNSFiles=data;
       	$timeout(function(){
       	if($('table.tabular-data tbody').height()>=150){
         		 $('.table-bordered>tbody>tr>td:last-child').css('width','60px');
         	 }else{
         		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
         	 }
       	},500);
       	$scope.error=false;
		$scope.errMsg='';
		$rootScope.uploadDNSClicked=false;
       },function(error){
       	$scope.pendingFiles=[];
       	$scope.error=true;
       	$scope.errMsg='Some error occurred.Please try again after sometime';
       	$rootScope.uploadDNSClicked=false;
       });
       $scope.checkAll=function(index){
       	var flag;
     	for(var i=0;i<$scope.pendingDNSFiles.length;i++){
     		if(i==index){
     			if($scope.pendingDNSFiles[i].selection){
     				$('#img'+index).attr("src",'../images/delete.png');
     				$scope.fileIDs=$scope.pendingDNSFiles[i].fileId;
     			}
     			else
     				$('#img'+index).attr("src",'../images/delete_disabled.png');
     		}
     		else{
     			$scope.pendingDNSFiles[i].selection=false;
     			$('#img'+i).attr("src",'../images/delete_disabled.png');
     		}
   		}
       	for(var j=0;j<$scope.pendingDNSFiles.length;j++){
   			if($scope.pendingDNSFiles[j].selection){
   				flag=true;
   			}
   		}
       	if(flag){
       		$scope.selected=true;
       	}
       	else{
       		$scope.selected=false;
       	}
       };
       $scope.disableFields=function(){
    	   if($scope.selected){
    	   $scope.changeEditFields=true;
    	   document.getElementById("uploadBtn").disabled = true;
    	   $scope.bulkLoad.requestId="";
   			$scope.bulkLoad.priority="NONE";
   			$scope.bulkLoad.fileDesc="";
   			$scope.bulkLoad.busJust="";
   			document.getElementById("uploadFile").value="";
   		 $('#effectiveDate').datetimepicker({
          	'minDate': new Date(),
         	 maxDate: '+1M', 
         	 //numberOfMonths:2
          });
    	   }
    	   else{
    		   $scope.changeEditFields=false;  
    	   document.getElementById("uploadBtn").disabled = false;
    	   }
       };
       $scope.openConfirmPopup=function(index,data,obj){
    	   if(data.selection){
    		   bulkloadServices.setUser($scope.userid);
    	   bulkloadServices.setData(data);
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
			$scope.errSucc=args.record.fileName+" deleted successfully";
			$scope.uploadSuccess=true;
			  bulkloadServices.getPendingDNSfiles().then(function(data){
			       	$scope.pendingDNSFiles=[];
			       	$scope.pendingDNSFiles=data;
			       	$timeout(function(){
			       		if($('table.tabular-data tbody').height()>=150){
	    	         		 $('.table-bordered>tbody>tr>td:last-child').css('width','60px');
	    	         	 }else{
	    	         		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
	    	         	 }
	    	       	},500);
			        $scope.onSuccess();
			        $rootScope.uploadDNSClicked=false;
			     /*  	$scope.error=false;
					$scope.errMsg='';
					$rootScope.uploadDNSClicked=false;
					$scope.changeEditFields=false;
			    	document.getElementById("uploadBtn").disabled = false;*/
			       },function(error){
			       	$scope.pendingDNSFiles=[];
			       	$scope.error=true;
			       	$scope.errMsg='Some error occurred.Please try again after sometime';
			       	$rootScope.uploadDNSClicked=false;
			       });
		});
		$scope.updateFile=function(){
        	$scope.effDate=document.getElementById("effectiveDate").value;
        	$scope.error=false;
		       $scope.errMsg='';
		       $scope.errSucc='';
	    	   $scope.uploadSuccess=false;
        	if($scope.effDate !== "" && $scope.effDate !== undefined && $scope.effDate !== null && $scope.bulkLoad.busJust !== undefined && $scope.bulkLoad.busJust !== ""  && $scope.bulkLoad.busJust !== null)
        	{
            	var effDate=$("#effectiveDate").val();
            	effDate = new Date(effDate).toISOString();
            	$scope.data={
            		'fileIDs':$scope.fileIDs,
            		'acctDesc':$scope.bulkLoad.busJust,
            		'effDate':effDate,
            		'lastUpdateBy':$scope.userid
            	};
        			$rootScope.uploadDNSClicked=true;
			       bulkloadServices.updateDNSFile($scope.data).then(function(result){
			    	   $scope.res=result;
			    	     if(result){
			    	   if(result.status[0].code==400){
				    	   	$scope.error=true;
						      $scope.errMsg=result.status[0].message;
				    	   }
				    	   else{
				    	   $scope.errSucc=result.status[0].message;
				    	   $scope.uploadSuccess=true;
				    	   bulkloadServices.getPendingDNSfiles().then(function(data){
				    	       	$scope.pendingDNSFiles=data;
				    	       	$timeout(function(){
				    	       	if($('table.tabular-data tbody').height()>=150){
				    	         		 $('.table-bordered>tbody>tr>td:last-child').css('width','60px');
				    	         	 }else{
				    	         		$('.table-bordered>tbody>tr>td:last-child').css('width','77px');
				    	         	 }
				    	       	},500);
				    	       	$scope.error=false;
				    			$scope.errMsg='';
				    			$rootScope.uploadDNSClicked=false;
				    	       },function(error){
				    	       	$scope.pendingFiles=[];
				    	       	$scope.error=true;
				    	       	$scope.errMsg='Some error occurred.Please try again after sometime';
				    	       	$rootScope.uploadDNSClicked=false;
				    	       });
				    	   $scope.onSuccess();
				    	   }
				    	}
			    	     $rootScope.uploadDNSClicked=false;
			        }, function(error) {
			        	$rootScope.uploadDNSClicked=false;
			        	$scope.error=true;
					      $scope.errMsg='Upload failed.Please try again';
			        });
			    
        	}
        	else{
        		$scope.error=true;
        		$scope.errMsg='Mandatory fields are empty';
        	}
		};
		$scope.onSuccess=function(){
			$scope.bulkLoad={
            		'file':'',
            		'fileDesc':'',
            		'effectiveDate':'',
            		'priority':'NONE',
            		'busJust':'',
            		'requestId':''
            };
    		 $scope.selected=false;
    	       $scope.changeEditFields=false; 
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
      		 $('.dnsTable>tbody>tr>td:last-child').css('width','60px');
      	 }else{
      		$('.dnsTable>tbody>tr>td:last-child').css('width','77px');
      	 }
       	document.getElementById("uploadFile").value="";
    	document.getElementById("uploadBtn").disabled = false;
    	 $('#effectiveDate').datetimepicker({
         	'minDate': new Date(),
        	 maxDate: '+1M', 
        	 //numberOfMonths:2
         });
    	 for(var i=0;i<$scope.pendingDNSFiles.length;i++){
    		 $scope.pendingDNSFiles[i].selection=false;
    		 $('#img'+i).attr("src",'../images/delete_disabled.png');
     	}
		};
      /* $("#uploadBtn").change(function() {
    	   $scope.displayHideMessages();
       });*/
    }
    bulkloadController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$state"];
})();
