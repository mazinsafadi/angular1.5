(function () {
    'use strict';
    angular.module('Bulkload.CCADashboardController', []).controller('CCADashboardController', CCADashboardController);

    function CCADashboardController($scope, $modal, $window, $timeout, $compile, bulkloadServices,$rootScope,$http,url,$base64,compChannelServices,$state) {
        $scope.userid="";        
        $rootScope.searchbuttonclicked=true;
    	$scope.error=false;
        $scope.searched=false;
        $scope.recordsPerPage=4;
        $scope.deProvsionNotAllowed=true;
        $scope.uploadSubsToAddNotAllowed=true;
        $scope.disableSaveBtn=false;
        $scope.disableDownloadBtn=true;
        $scope.disableUploadBtn=true;
        $scope.deProvisionFile='';
        $scope.subsToAddFile={};
        var format = 'DD/MM/YYYY HH:mm';
		 $scope.dat=moment(new Date(), format).tz('America/New_York').format(format);
        $scope.channel={
        		'type':{'name':'Select One','value':''},
        		'types':[
        		         {'name':'Select One','value':''},
        		         {'name':'National','value':'N'},
        		         {'name':'RSN','value':'R'}
        		      ]
        };
       
       /* $scope.feed = {
        		'value': {'name': 'Select One'},
        		};
        $scope.feedList = [
                  {'name':'First Feed'},
                  {'name':'Second Feed'}
        ];*/
        $scope.feed = {
        		'value': ''
        };
        
        
    	$scope.CCA=[];
    	$scope.totalCCA=[];
    	$scope.totalDc=[];
        var monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ];
        var today = new Date();
        $scope.last4Months = {
        		'list':[],
        		'period':''
        };
        var j=0;
        //we take next month, current month and 2 last months
        if(today.getMonth()=='0'){
        	$scope.last4Months.list.push({'name':monthNames[1] + ' - ' +(today.getFullYear()) ,'value':'2_' +(today.getFullYear())});
        	$scope.last4Months.list.push({'name':monthNames[0] + ' - ' +(today.getFullYear()) ,'value':'1_' +today.getFullYear()});
        	$scope.last4Months.list.push({'name':monthNames[11] + ' - ' +(today.getFullYear()-1) ,'value':'12_' +(today.getFullYear()-1)});
        	$scope.last4Months.list.push({'name':monthNames[10] + ' - ' +(today.getFullYear()-1) ,'value':'11_' +(today.getFullYear()-1)});
        }
        else if(today.getMonth()=='1'){
        	$scope.last4Months.list.push({'name':monthNames[2] + ' - ' +(today.getFullYear()) ,'value':'3_' +(today.getFullYear())});
        	$scope.last4Months.list.push({'name':monthNames[1] + ' - ' +(today.getFullYear()) ,'value':'2_' +today.getFullYear()});
        	$scope.last4Months.list.push({'name':monthNames[0] + ' - ' +(today.getFullYear()) ,'value':'1_' +(today.getFullYear())});
        	$scope.last4Months.list.push({'name':monthNames[11] + ' - ' +(today.getFullYear()-1) ,'value':'12_' +(today.getFullYear()-1)});
        }
        else if(today.getMonth()=='11') {
        	$scope.last4Months.list.push({'name':monthNames[0] + ' - ' +(today.getFullYear()+1) ,'value':'1_' +(today.getFullYear()+1)});
        	$scope.last4Months.list.push({'name':monthNames[11] + ' - ' +today.getFullYear() ,'value':'12_' +today.getFullYear()});
        	$scope.last4Months.list.push({'name':monthNames[10] + ' - ' +today.getFullYear() ,'value':'11_' +today.getFullYear()});
        	$scope.last4Months.list.push({'name':monthNames[9] + ' - ' +today.getFullYear() ,'value':'10_' +today.getFullYear()});
        } else {
        	$scope.last4Months.list.push({'name':monthNames[(today.getMonth()+1)] + ' - ' +today.getFullYear() ,'value':(today.getMonth() + 2) + '_' +today.getFullYear()});
        }
        
        if($scope.last4Months.list.length!=4){
        	for (var i = 1; i < 4; i++) { 
        		$scope.last4Months.list.push({'name':monthNames[(today.getMonth() - i) + 1] + ' - ' +today.getFullYear() ,'value':(today.getMonth()+2-i) + '_' +today.getFullYear()});
        	}
        }
        $scope.last4Months.period=$scope.last4Months.list[1];
        $scope.deProvision={
        		'file':'',
        		'effectiveStartDate':'',
        		'effectiveEndDate':'',
        		'busJust':''
        };
        $scope.uploadSubsToAdd={
        		'file':'',
        		'busJust':'',
        		'viewOpt.option':'',
        		'feed.value':''
        };
        $scope.displayHideMessages=function(){
     	   $scope.errMsg="";
     	   $scope.errSucc="";
     	  $scope.fileName=document.getElementById("uploadFile").value;
     	  $scope.effStartDate=$("#effectiveStartDate").val();
     	  $scope.effEndDate=$("#effectiveEndDate").val();
     	   if($scope.effStartDate !== "" && $scope.effStartDate !== undefined && $scope.effStartDate !== null && $scope.effEndDate !== "" && $scope.effEndDate !== undefined && $scope.effEndDate !== null && $scope.fileName !== undefined && $scope.fileName !== null && $scope.fileName !== "" && $scope.deProvision.busJust !== undefined && $scope.deProvision.busJust !== ""  && $scope.deProvision.busJust !== null){
     		   $scope.deProvsionNotAllowed=false;
     	   }
     	   else{
     		  $scope.deProvsionNotAllowed=true;
     	   }
        };
       
        $scope.fileChanged = function(files) {
        	document.getElementById("uploadFile").value = files.value;
        	$scope.deProvisionFile=files.files[0];
        	$scope.displayHideMessages();        	
        };       
        $scope.downloadSampleTemplate=function(){
        	$rootScope.searchbuttonclicked=true;
        	 compChannelServices.downloadSampleTemplate().then(function(data){  
        		 $scope.csvString=data.status[0]?data.status[0].message+'\n':'';
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
            	$rootScope.searchbuttonclicked=false;
    		},
    		function(error){
    			$rootScope.searchbuttonclicked=false;
    		});     	  
        };
        $scope.strEndsWith=function(str, suffix) {
		    return str.match(suffix+"$")==suffix;
		};
        $scope.saveFile=function(){
           	$scope.fileName=document.getElementById("uploadFile").value;
        	$scope.effStartDate=$("#effectiveStartDate").val();
        	$scope.effEndDate=$("#effectiveEndDate").val();
        	$scope.error=false;
		    $scope.errMsg='';
		    $scope.errSucc='';
	    	$scope.uploadSuccess=false;
        	if($scope.effStartDate !== "" && $scope.effStartDate !== undefined && $scope.effStartDate !== null && $scope.effEndDate !== "" && $scope.effEndDate !== undefined && $scope.effEndDate !== null && $scope.fileName !== undefined && $scope.fileName !== null && $scope.fileName !== "" && $scope.deProvision.busJust !== undefined && $scope.deProvision.busJust !== ""  && $scope.deProvision.busJust !== null)
        	{
        		if($("#effectiveStartDate").val()<$("#effectiveEndDate").val()){       			
        		
        		$scope.file = $scope.deProvisionFile;
            	//var effStartDate = new Date($("#effectiveStartDate").val()).toISOString();
            	//var effEndDate = new Date($("#effectiveEndDate").val()).toISOString();
            	$scope.data={
            		'busineJust':$scope.deProvision.busJust,
            		'effDate':$scope.effStartDate,
            		'effDateEnd':$scope.effEndDate,
            		'fileName':$scope.deProvisionFile.name,
            		'lastUpdateBy':$scope.userid,
            		'requestID':'Deprovision_complimentary_channels'
            	};
        		if($scope.strEndsWith($scope.fileName,".csv")){
		        	$rootScope.searchbuttonclicked=true;		        
		        	compChannelServices.uploadDeProvisionFile($scope.file,$scope.data).then(function(result){  
		        		$scope.res=result;
			    	     if(result){
			    	    	 if(result.status[0].code==400){
			    	    		 $scope.error=true;
			    	    		 $scope.errMsg=result.status[0].message;
			    	    	 }
			    	    	 else{
			    	    		 if(result.status[0].message == 'Some error occurred.Please try again after sometime'){
			    	    			 	$scope.error=true;
				 			   			$scope.disableSaveBtn=true;
				 					    $scope.errMsg='Some error occurred.Please try again after sometime';
				 			   			$rootScope.searchbuttonclicked=false;
			    	    		 }else{			    	    			 
				    	    		 $scope.errSucc=result.status[0].message;			    	    	 
				    	    		 $scope.uploadSuccess=true;
				    	    		 $scope.disableSaveBtn=true;
			    	    		 }
			    	    	 }
			    	     }
		        		$rootScope.searchbuttonclicked=false;
			   		},
			   		function(error){
			   			$scope.error=true;
			   			$scope.disableSaveBtn=true;
					    $scope.errMsg='Upload failed.Please try again';
			   			$rootScope.searchbuttonclicked=false;
			   		});
        		}
        		else{
        			$scope.error=true;
            		$scope.errMsg='Only .csv files are allowed to upload';
        		}
        		}
        		else{
        			$scope.error=true;
            		$scope.errMsg='Effective end date should be greater than effective start date.';
        		}
        	}
        	else{
        		$scope.error=true;
        		$scope.errMsg='Mandatory fields are empty';
        	}
        };
        compChannelServices.loadOptions().then(function(data){  
        	 $scope.viewOptions={
        			 'availAoptions':[]
        	 };
        	 $scope.viewOptions.availAoptions.push({'name':'Select One' ,'value':-1 });
        	data.forEach(function(item,index){
				$scope.viewOptions.availAoptions.push({'name':item,'value':index});
			});
        	$scope.viewOptions.option=$scope.viewOptions.availAoptions[0];
        	$rootScope.searchbuttonclicked=false;
        	console.log($scope.viewOptions.option);
		},
		function(error){
			 $scope.viewOptions={
        			 'availAoptions':[]
        	 };
			$rootScope.searchbuttonclicked=false;
		});
        
        
        $scope.onLoad=function(){
        	$scope.error=false;
        	$scope.uploadSuccess=false;
        	$scope.searched=false;
        	if($scope.viewOptions.option.value==0){
        		$rootScope.searchbuttonclicked=true;
        	compChannelServices.getCompPackages().then(function(data){  
				$scope.packageBillingCodesArray = [];
				if(data && data.packageDetails.length>0){
					data.packageDetails.forEach(function(item){
					$scope.packageBillingCodesArray.push(item.packageBillingCode);
				});
				}
				$('#packgaeCode').dfwTypeAhead($scope.packageBillingCodesArray);
				$rootScope.searchbuttonclicked=false;
			},
			function(error){
				$scope.packageBillingCodesArray=[];
				$('#packgaeCode').dfwTypeAhead($scope.packageBillingCodesArray);
				$rootScope.searchbuttonclicked=false;
			});
        	compChannelServices.getCompChannels().then(function(data){    	       
				$scope.channelNamesArray = [];
				if(data.length>0){
				data.forEach(function(item){
					/*item.channels.forEach(function(channel){
						$scope.channelNamesArray.push(channel.name);
					});*/
					$scope.channelNamesArray.push(item.name);
				});
				}
				$('#chName').dfwTypeAhead($scope.channelNamesArray);
				$rootScope.searchbuttonclicked=false;
			},
			function(error){
				$scope.channelNamesArray=[];
				$('#chName').dfwTypeAhead($scope.channelNamesArray);
				$rootScope.searchbuttonclicked=false;
			});
			compChannelServices.getAvailableFiles().then(function(data){    	       
				$scope.packagesNameArray =data.status[0].files.split(',');
				$rootScope.searchbuttonclicked=false;
			},
			function(error){
				$scope.packagesNameArray=[];
				//$scope.packagesNameArray=['COMPFSNSPORTS','COMPSTOHIO'];
				$rootScope.searchbuttonclicked=false;
			});
        	}
        	else if($scope.viewOptions.option.value==1){
        		$scope.searched=false;
        		 $scope.deProvision={
        	        		'file':'',
        	        		'effectiveStartDate':'',
        	        		'effectiveEndDate':'',
        	        		'busJust':''
        	        };
        		 $scope.disableSaveBtn=false;
        		$timeout(function () {
        		 $('#effectiveStartDate').datepicker({
        	        	'minDate': new Date()//,
        		       	// maxDate: '+1M', 
        		       	 //numberOfMonths:2
        	        });
    	        $('#effectiveEndDate').datepicker({
    	        	'minDate': new Date()//,
    		       	// maxDate: '+1M', 
    		       	 //numberOfMonths:2
    	        });
    	       // document.getElementById("effectiveStartDate").onchange = function() {$scope.displayHideMessages()};
    	       // document.getElementById("effectiveEndDate").onchange = function() {$scope.displayHideMessages()};
        		},1000);
        	}
        };
        
        $scope.resize=function(){
        	 $timeout(function () {
				 $('#searchResults').height($('#contentPannel').height() - $('#searchSection').height() -$('#actionSearch').height() - $('.dfw-error').height()-40);
		            $('#searchResultsContainer').height($('#searchResults').height() - $('#searchResultsHeader').height() - 17);
		            $('.table-bordered>tbody').css('max-height',$('#searchResultsContainer').height()  );
	            }, 500);
        	 //$scope.onLoad();
        };
        $scope.toggle = function (p_id) {
			if (p_id === 'searchMinus') {
				$('#searchMinus').hide();
				$('#searchPlus').show();
				$('#searchSection').slideUp();
				$('#searchSectionDeProv').slideUp();
				$('#searchSectionSmsFeed').slideUp();
				$('#searchSectionUploadSubsToAdd').slideUp();
				$('.buttonBox').slideUp();	
				$timeout(function () {
					 $('#searchResults').height($('#contentPannel').height() -$('#actionSearch').height() -$('.dfw-error').height()- 40);
			            $('#searchResultsContainer').height($('#searchResults').height() - $('#searchResultsHeader').height() - 17);
			            $('.table-bordered>tbody').css('max-height',$('#searchResultsContainer').height()   );
		         }, 500);
			} else if (p_id === 'searchPlus') {
				$('#searchMinus').show();
				$('#searchPlus').hide();
				$('#searchSection').slideDown();
				$('#searchSectionDeProv').slideDown();
				$('#searchSectionSmsFeed').slideDown();
				$('#searchSectionUploadSubsToAdd').slideDown();
				$('.buttonBox').slideDown();
				$timeout(function () {
					 $('#searchResults').height($('#contentPannel').height() - $('#searchSection').height() -$('#actionSearch').height() -$('.dfw-error').height()- 40);
			            $('#searchResultsContainer').height($('#searchResults').height() - $('#searchResultsHeader').height() - 17);
			            $('.table-bordered>tbody').css('max-height',$('#searchResultsContainer').height()  );
		            }, 500);
			} else if (p_id === 'searchResMinus') {
				$('#searchResMinus').hide();
				$('#searchResPlus').show();
				$('#searchResultsContainer').slideUp();
			} else if (p_id === 'searchResPlus') {
				$('#searchResMinus').show();
				$('#searchResPlus').hide();
				$('#searchResultsContainer').slideDown();
			}
		/*	 $timeout(function () {
				 $('#searchResults').height($('#contentPannel').height() - $('#searchSection').height() -$('#actionSearch').height() - 40);
		            $('#searchResultsContainer').height($('#searchResults').height() - $('#searchResultsHeader').height() - 40);
		            $('.table-bordered>tbody').css('max-height',$('#searchResultsContainer').height()  -  20 );
	            }, 500);*/
			$timeout(function(){
				if($scope.recordsPerPage==0){
					$scope.recordsPerPage=parseInt(($('tbody').height()-60)/41);
				}
				else
				$scope.recordsPerPage=parseInt($('tbody').height()/41);
				
				$scope.CCA=$scope.totalCCA.slice(0,$scope.recordsPerPage);
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
		                //$rootScope.searchbuttonclicked=true;
		                $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		                //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		                //$scope.availableFiles();	
		              }
		            };
		            $scope.prevPageDisabled = function() {
		              return $scope.currentPage === 0 ? 'disabled' : '';
		            };
		            $scope.nextPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		                    $scope.currentPage++;
		                   // $rootScope.searchbuttonclicked=true;
		                    $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		                    //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		                    //$scope.availableFiles();	
		                }
		            };
		            $scope.firstPage = function() {
		            	 if ($scope.currentPage > 0) {
		              $scope.currentPage=0;
		              //$rootScope.searchbuttonclicked=true;
		              $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		              //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		              //$scope.availableFiles();	
		            	 }
		            };
		            $scope.lastPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		              $scope.currentPage=$scope.pageCount()-1;
		              //$rootScope.searchbuttonclicked=true;
		              $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		              //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		              //$scope.availableFiles();	
		            	}
		            };
		            $scope.nextPageDisabled = function() {
		            	return $scope.currentPage==$scope.pageCount()-1 ? 'disabled' : '';
		            };
		            $scope.pageCount = function() {
		              return Math.ceil($scope.total/$scope.recordsPerPage);
		            };
		            $scope.setPage = function(n) {
		              if (n >= 0 && n < $scope.pageCount()) {
		                $scope.currentPage = n;
		                //$rootScope.searchbuttonclicked=true;
		                $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		                //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		                //$scope.availableFiles();	
		              }
		            };
			},1000);
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
    	            }
    	            /*else{
						$state.go('Error');
					}*/
    	        }
    	    }
    	};
    	$scope.availableFiles=function(){
    		compChannelServices.getAvailableFiles().then(function(data){    	       
				$scope.packagesNameArray =data.status[0].files.split(',');
				for(var j=0;j<$scope.packagesNameArray.length;j++){
		       		for(var k=0;k<$scope.CCA.length;k++){
		       			if($scope.packagesNameArray[j].split('_')[0]==$scope.CCA[k].packageBillingCode){
		       				$scope.CCA[k].readyDownload=true;
		       			}
		       		}
		       	}
				//$rootScope.searchbuttonclicked=false;
			},
			function(error){
				$scope.packagesNameArray=[];
				//$scope.packagesNameArray=['COMPFSNSPORTS','COMPSTOHIO'];
				//$rootScope.searchbuttonclicked=false;
			});
    	};
    	$scope.setSize();
    	$scope.start=1;
    	$scope.stop=20;
    	//$scope.itemsPerPage = 20;
        $scope.currentPage = 0;
         $scope.loadDashboard=function(start,stop,isRefresh){
        	 $rootScope.searchbuttonclicked=true;   
        	 $scope.searched=true;
        	 $scope.toggle('searchPlus');
        	 $scope.getMonthValue= $scope.last4Months.period.value;
        	 $scope.loadParams={
        			//'startRecords':start,
              		//'endRecords':stop,
              		'period':$scope.getMonthValue, //$scope.last4Months.period.value,
              		'pkgBillingCode':$('#packgaeCode').val(),
              		'channelName':$('#chName').val(),
              		'channelType':$scope.channel.type.value
        	 };      
        	 compChannelServices.loadDcDashboard($scope.loadParams).then(function(data){
        			 compChannelServices.setPackageDC(data);
        	 });
        	 compChannelServices.loadCCADashboard($scope.loadParams).then(function(data){
        		 if(data.length>=0)
        		 $scope.totalCCA=data;
        		 else
        		 $scope.totalCCA=[];
        		 $scope.total=$scope.totalCCA.length;
		       	$scope.totalCCA.forEach(function(item,index){
					item.minProvisioningRange=moment(item.minProvisioningRange).tz('EST').format('MM/DD/YYYY');
					item.maxProvisioningRange=moment(item.maxProvisioningRange).tz('EST').format('MM/DD/YYYY');
					//item.readyDownload=false;
				});
		       	//$scope.CCA=$scope.totalCCA.slice(0,$scope.recordsPerPage);
		       /*	compChannelServices.getAvailableFiles().then(function(data){    	       
    				$scope.packagesNameArray =data.status[0].files.split(',');
    				for(var j=0;j<$scope.packagesNameArray.length;j++){
    		       		for(var k=0;k<$scope.CCA.length;k++){
    		       			if($scope.packagesNameArray[j].split('_')[0]==$scope.CCA[k].packageBillingCode){
    		       				$scope.CCA[k].readyDownload=true;
    		       			}
    		       		}
    		       	}
    				//$rootScope.searchbuttonclicked=false;
    			},
    			function(error){
    				$scope.packagesNameArray=[];
    				//$scope.packagesNameArray=['COMPFSNSPORTS','COMPSTOHIO'];
    				//$rootScope.searchbuttonclicked=false;
    			});*/
		       
		       	if(data.length!==0){
		        //$scope.total=$scope.CCA.length;
		       	$scope.error=false;
				$scope.errMsg='';
				$scope.recordsPerPage=parseInt($('tbody').height()/41);
				$scope.CCA=$scope.totalCCA.slice(0,$scope.recordsPerPage);
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
		                //$rootScope.searchbuttonclicked=true;
		                $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		                //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		                //$scope.availableFiles();		                
		              }
		            };
		            $scope.prevPageDisabled = function() {
		              return $scope.currentPage === 0 ? 'disabled' : '';
		            };
		            $scope.nextPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		                    $scope.currentPage++;
		                   // $rootScope.searchbuttonclicked=true;
		                    $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		                    //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		                    //$scope.availableFiles();	
		                }
		            };
		            $scope.firstPage = function() {
		            	 if ($scope.currentPage > 0) {
		              $scope.currentPage=0;
		              //$rootScope.searchbuttonclicked=true;
		              $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		              //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		              //$scope.availableFiles();	
		            	 }
		            };
		            $scope.lastPage = function() {
		            	if ($scope.currentPage < $scope.pageCount() - 1) {
		              $scope.currentPage=$scope.pageCount()-1;
		              //$rootScope.searchbuttonclicked=true;
		              $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		              //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		              //$scope.availableFiles();	
		            	}
		            };
		            $scope.nextPageDisabled = function() {
		            	return $scope.currentPage==$scope.pageCount()-1 ? 'disabled' : '';
		            };
		            $scope.pageCount = function() {
		              return Math.ceil($scope.total/$scope.recordsPerPage);
		            };
		            $scope.setPage = function(n) {
		              if (n >= 0 && n < $scope.pageCount()) {
		                $scope.currentPage = n;
		                //$rootScope.searchbuttonclicked=true;
		                $scope.CCA=$scope.totalCCA.slice($scope.currentPage*$scope.recordsPerPage,$scope.currentPage*$scope.recordsPerPage+$scope.recordsPerPage);
		                //$scope.loadDashboard($scope.currentPage*20+1,$scope.currentPage*20+20);
		                //$scope.availableFiles();
		              }
		            };
		       	}
		       	//$scope.availableFiles();	
				$rootScope.searchbuttonclicked=false;
		       },function(error){
		       	$scope.CCA=[];
		       	$scope.error=true;
		       	$scope.errMsg='Some error occurred.Please try again after sometime';
		       	//$scope.availableFiles();	
		       	$rootScope.searchbuttonclicked=false;
		       	
		       });
            };
          
            $scope.reset=function(){
            	$scope.period=$scope.last4Months[0];
            	$scope.channel.type.value='';
            	$('#packgaeCode').val('');
            	$('#chName').val('');
            };     
            
            $scope.downloadFile=function(filename){
            	$rootScope.searchbuttonclicked=true;
            	var monthVal = $scope.last4Months.period.name.split(' - ')[0];
            	var yearVal = $scope.last4Months.period.name.split(' - ')[1];
            	var param={
            			'pckCd':filename,
            			'month':monthVal+'_'+yearVal //$scope.last4Months.period.name //.split(' -')
            	};
            	
            	compChannelServices.downloadReadyFile(param).then(function(data){             	
            	/*	 var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            		    var objectUrl = URL.createObjectURL(blob);
            		    window.open(objectUrl);*/
            		//'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            		var fileBlob = new Blob([data], {type: 'application/zip'});
              	   	if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
                         window.navigator.msSaveOrOpenBlob(fileBlob, filename+'_'+monthVal+'_'+yearVal+'_Export.zip');
                     } else { 
                    	 var link = document.createElement('a');
                         link.href = window.URL.createObjectURL(fileBlob);
                         link.download = filename+'_'+monthVal+'_'+yearVal+'_Export.zip';
                         link.click();
                         window.URL.revokeObjectURL(link.href);                        
                     }   													//monthNames[(today.getMonth()+1)]
              	   	$rootScope.searchbuttonclicked=false;
    			},
    			function(error){
    				$rootScope.searchbuttonclicked=false;
    			});            	
            };
            
            $scope.startDownload=function(data){
            	var param={
            			'pckCd':data.packageBillingCode,
            			'stDt':data.minProvisioningRange,
            			'endDt':data.maxProvisioningRange
            	};
            	compChannelServices.startProgress(param).then(function(data){    	 
    				$rootScope.searchbuttonclicked=false;
    			},
    			function(error){
    				$rootScope.searchbuttonclicked=false;
    			});
            };
            
             compChannelServices.getPeriodForUploadCcaSmsFeed().then(function(getData){  
            	 $scope.getData = getData;
               	$rootScope.searchbuttonclicked=false;
       		    },
       		    function(error){
       			$rootScope.searchbuttonclicked=false;
       		    }); 
            
            compChannelServices.getPeriodForSmsFeedData().then(function(data){  
               	$scope.viewOpt={
               			 'getPeriodForSmsFeedData':[]
               	 };
               	 $scope.viewOpt.getPeriodForSmsFeedData.push({'name':'Select One' ,'value':-1 });
               	data.forEach(function(item,index){
       				$scope.viewOpt.getPeriodForSmsFeedData.push({'name':item,'value':index});
       			});
               	$scope.viewOpt.option=$scope.viewOpt.getPeriodForSmsFeedData[0];
               	$rootScope.searchbuttonclicked=false;
               	console.log($scope.viewOpt.option);
       		    },
       		    function(error){
       			 $scope.viewOpt={
               			 'getPeriodForSmsFeedData':[]
               	 };
       			$rootScope.searchbuttonclicked=false;
       		    }); 
            
            $scope.downloadSampleFile=function(){
            	$rootScope.searchbuttonclicked=true;
            	var param={
            			'month':$scope.viewOpt.option.name,
            				'feedType': $scope.feed.value
            	};
            	$scope.disableDownloadBtn=false;
            	if(param.month=='Select One' && param.feedType==""){
            		//$scope.disableDownloadBtn=true;
            		$scope.error=true;
            		$scope.errMsg="Select provisioning period and feed type";
            	} else if(param.month=='Select One') {
            		//$scope.disableDownloadBtn=true;
            		$scope.error=true;
            		$scope.errMsg="Select provisioning period";
            	} else if(param.feedType=="") {
            		//$scope.disableDownloadBtn=true;
            		$scope.error=true;
            		$scope.errMsg="Select feed type";
            	} else {
            		$scope.error=false;
            		$scope.errMsg='';
            	var monthName = [];
            	monthName = param.month.split("_");
            	compChannelServices.downloadSampleFile(param).then(function(data){ 
            		compChannelServices.getSmsFeedFileName().then(function(res){
            			$scope.getFileName = res.status[0].message;
            			var params={
                    			'fileName':$scope.getFileName
                    	};
            	/*	 var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            		    var objectUrl = URL.createObjectURL(blob);
            		    window.open(objectUrl);*/
            		//'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            			var fileBlob = new Blob([data], {type: 'application/xlsx'});
                  	   	if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
                             window.navigator.msSaveOrOpenBlob(fileBlob,$scope.getFileName);
                         } else { 
                        	 var link = document.createElement('a');
                             link.href = window.URL.createObjectURL(fileBlob);
                             link.download = $scope.getFileName;
                             link.click();
                             window.URL.revokeObjectURL(link.href);                        
                         }   													//monthNames[(today.getMonth()+1)]
                  	   	$rootScope.searchbuttonclicked=false;
                  	  compChannelServices.deleteSampleSubsToAddTemplate(params).then(function(data){ 
                  		$scope.delMsg = data.status[0].message;
                  		$rootScope.searchbuttonclicked=false;
              		},
              		function(error){
              			$rootScope.searchbuttonclicked=false;
              		});
	    			},
	    			function(error){
	    				$rootScope.searchbuttonclicked=false;
	    			});  
            		
            	},
    			function(error){
    				$rootScope.searchbuttonclicked=false;
    			});
            	}
            };

            $scope.downloadSampleSubsToAddTemplate=function(){
            	$rootScope.searchbuttonclicked=true;
               	 compChannelServices.downloadSampleSubsToAddTemplate().then(function(data){  
               		$scope.fileBlob = new Blob([data], {type: 'application/xlsx'});
               		$scope.fileName="SampleSubsToAddTemplate.xlsx";
               		var param={
                			'fileName':$scope.fileName
                	};
                  	   if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
                             window.navigator.msSaveOrOpenBlob($scope.fileBlob, $scope.fileName);
                         } else { // for other browsers
                        	 var link = document.createElement('a');
                             link.href = window.URL.createObjectURL($scope.fileBlob);
                             link.download = $scope.fileName;
                             link.click();
                             window.URL.revokeObjectURL(link.href); 
                         }
                  	 $rootScope.searchbuttonclicked=false;
                  	 compChannelServices.deleteSampleSubsToAddTemplate(param).then(function(data){ 
                    		$scope.delMsg = data.status[0].message;
                    		$rootScope.searchbuttonclicked=false;
                		},
                		function(error){
                			$rootScope.searchbuttonclicked=false;
                		});
           		},
           		
           		function(error){
           			$rootScope.searchbuttonclicked=false;
           		}); 
               	 
               };
               
               $scope.subsToAddFileChanged = function(files) {
               	document.getElementById("uploadFile").value = files.value;
               	$scope.subsToAddFile=files.files[0];
               	$scope.displaySubsToAddHideMessages();        	
               }; 
               
               $scope.displaySubsToAddHideMessages=function(){
             	   $scope.errMsg="";
             	   $scope.errSucc="";
             	  $scope.fileName=document.getElementById("uploadFile").value;
             	 compChannelServices.getPeriodForUploadCcaSmsFeed().then(function(getData){  
                   	 $scope.getData = getData;
                      	$rootScope.searchbuttonclicked=false;
              		    },
              		    function(error){
              			$rootScope.searchbuttonclicked=false;
											});
												if(!$scope.subsToAddFile.busJust){
													$scope.subsToAddFile.busJust = "";
												}
             	 if($scope.fileName !== undefined && $scope.fileName !== null && $scope.fileName !== "" && $scope.subsToAddFile.busJust !== undefined && $scope.subsToAddFile.busJust !== null && $scope.getData !== "" && $scope.getData !== null && $scope.getData !==undefined && $scope.subsToAddFile.feed.value !=="" && $scope.subsToAddFile.feed.value !==null && $scope.subsToAddFile.feed.value !== undefined){
             		   $scope.uploadSubsToAddNotAllowed=false;
             	   }
             	   else{
             		  $scope.uploadSubsToAddNotAllowed=true;
             	   }
                };
                
                $scope.fetchDetails=function(){
                	var param={
                			'month':$scope.viewOpt.option.name,
                			'feedType': $scope.feed.value
                	};
                	if(param.feedType!="" && param.month !== 'Select One') {
                	compChannelServices.fetchSmsPeriodFile(param).then(function(attrs){
                		if(attrs.status[0].message == 'Unable to download SMS feed.No records Found') {
                			$scope.error=true;
                			$scope.disableDownloadBtn=true;
                			$scope.errMsg='Unable to download SMS feed.No records Found';
     			   			$rootScope.searchbuttonclicked=false;
                		} else {
                			$scope.error=false;
                			$scope.disableDownloadBtn=false;
                			$scope.errMsg='';
     			   			$rootScope.searchbuttonclicked=false;
                		}
                	},
                		function(error){
    			   			$scope.error=true;
    			   			$scope.disableDownloadBtn=true;
    					    $scope.errMsg='Downlaod failed.Please try again';
    			   			$rootScope.searchbuttonclicked=false;
                	});
                	} else {
                		$scope.error=true;
            			$scope.disableDownloadBtn=true;
            			$scope.errMsg='';
 			   			$rootScope.searchbuttonclicked=false;
                	}
                }
                
                $scope.removeMsg=function(){
                	$scope.error=false;
        		    $scope.errMsg='';
        		    $scope.errSucc='';
        		    $scope.disableUploadBtn=false;
                };
                
                $scope.saveSubsToAddFile=function(){
                	$rootScope.searchbuttonclicked=true;
                	$scope.fileName=document.getElementById("uploadFile").value;
                	$scope.error=false;
        		    $scope.errMsg='';
        		    $scope.errSucc='';
        	    	$scope.uploadSuccess=false;
        	    	if($scope.fileName !== undefined && $scope.fileName !== null && $scope.fileName !== "" && $scope.subsToAddFile.busJust !== undefined !== ""  && $scope.subsToAddFile.busJust !== null && $scope.getData !== "" && $scope.getData !== null && $scope.getData !==undefined && $scope.subsToAddFile.feed.value !=="" && $scope.subsToAddFile.feed.value !==null && $scope.subsToAddFile.feed.value !== undefined){
        	    		$scope.file = $scope.subsToAddFile;
        	    		$scope.data={
                    		'busineJust':$scope.subsToAddFile.busJust,
                    		'fileName':$scope.subsToAddFile.name,
                    		'period':$scope.getData[0],
                			'feedType': $scope.subsToAddFile.feed.value,
                    		'lastUpdateBy':$scope.userid,
                    		'requestID':'Upload Subscribers to Add File'
                    	};
        	    		if($scope.strEndsWith($scope.fileName,".xlsx")){
        	    			$rootScope.searchbuttonclicked=true;
        	    			compChannelServices.uploadSubsToAddFile($scope.file,$scope.data).then(function(result){  
        		        		$scope.res=result;
        			    	     if(result){
        			    	    	 if(result.status[0].code==400){
        			    	    		 $scope.error=true;
        			    	    		 $scope.errMsg=result.status[0].message;
        			    	    	 }
        			    	    	 else{
        			    	    		 if(result.status[0].message == 'Some error occurred.Please try again after sometime'){
        			    	    			 	$scope.error=true;
        				 			   			$scope.disableUploadBtn=true;
        				 					    $scope.errMsg='Some error occurred.Please try again after sometime';
        				 			   			$rootScope.searchbuttonclicked=false;
        			    	    		 }else{			    	    			 
        				    	    		 $scope.errSucc=result.status[0].message;			    	    	 
        				    	    		 $scope.uploadSuccess=true;
        				    	    		 $scope.disableUploadBtn=true;
        			    	    		 }
        			    	    	 }
        			    	     }
        		        		$rootScope.searchbuttonclicked=false;
        			   		},
        			   		function(error){
        			   			$scope.error=true;
        			   			$scope.disableUploadBtn=true;
        					    $scope.errMsg='Upload failed.Please try again';
        			   			$rootScope.searchbuttonclicked=false;
        			   		});
        	    		}
        	    		else{
                			$scope.error=true;
                    		$scope.errMsg='Unable to process the file. Only .xlsx files are allowed to upload';
                		}
        	    	}
        	    	else{
                		$scope.error=true;
                		$scope.errMsg='Mandatory fields are empty';
                		$rootScope.searchbuttonclicked=false;
                	}
                };
                
                $scope.resetAll=function(){
                	$scope.errMsg='';
         		    $scope.errSucc='';
                	$scope.viewOpt.option=$scope.viewOpt.getPeriodForSmsFeedData[0];
                	$scope.feed.value='';
                	$scope.fileName='';
                	$scope.disableSaveBtn=false;
                    $scope.disableDownloadBtn=true;
                    $scope.disableUploadBtn=true;
                    $scope.subsToAddFile='';
                    
                    compChannelServices.getPeriodForUploadCcaSmsFeed().then(function(getData){  
                   	 $scope.getData = getData;
                      	$rootScope.searchbuttonclicked=false;
              		    },
              		    function(error){
              			$rootScope.searchbuttonclicked=false;
              		    });
                	//$scope.subsToAddFile.busJust='';
                	//$scope.subsToAddFile.feed.value='';
                };
    }
    CCADashboardController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices","$rootScope","$http","url","$base64","compChannelServices","$state"];
})();
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);