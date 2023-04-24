(function () {
    'use strict';
    angular.module('Bulkload.compChannelServices', ['base64']).service("compChannelServices", ['$http', '$window', '$location','$q','url','$base64', function ($http, $window, $location,$q,url,$base64) {
    	var selectedPackages=[];
    	var basePackageAvailable=[];
    	var packageDCVal = [];
    	return{
    		 getCCPackageMetadata:function(searchParams){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    //url:"https://135.66.37.231:8889/restservices/udas/v1/vadabulkload/getCompPkg",
    	    		   //url:"https://135.177.130.196:8083/restservices/udas/v1/vadabulkload/getCompPkg",
    	    		    url:url.getCCPackageMetadata,
    			        method: "GET",
    			        params:searchParams,
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       setSelectedPackages:function(data){
    	    	   selectedPackages=data;
    	       },
    	       getSelectedPackages:function(){
    	    	   return selectedPackages;
    	       },
    	       setPackageDC:function(data){
    	    	   packageDCVal=data;
    	       },
    	       getPackageDC:function(){
    	    	   return packageDCVal;
    	       },
    	       setBasPackageAvailable:function(data){
    	    	   basePackageAvailable=data;
    	       },
    	       getBasPackageAvailable:function(){
    	    	   return basePackageAvailable;
    	       },
    	       getPacakgesList:function(pkgcd){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		   url:url.getPackagesList,
    			        method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					params:{
    						'pkgCd':pkgcd
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	        getChannelNames:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    	    	   var password = url.password;
    	    	   $http({
    	    		   url:url.getChannelNames,
    	    		   method: "GET",
    	    		   headers: {
    	    			   'Content-Type': 'application/json;charset=UTF-8',
    	    			   'Authorization': 'Basic '+$base64.encode(username+':'+password),
    	    			   'Accept' : 'application/json'
    	    		   },
   					timeout:90000
    	    	   })
    	    	   .success(function(data) {
    	    		   deferred.resolve(data);
    	    	   })
    	    	   .error(function(msg, code) {
    	    		   deferred.reject(msg);
    	    	   });
    	    	   return deferred.promise;
    	       },
    	       updateMetadata:function(postData,pkgBillingCode){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.updateCompMetadata+"?channelPackageID="+pkgBillingCode,
    	    		    //url:"https://135.66.37.231:8889/restservices/udas/v1/vadabulkload/updateCmpDetails?pkgBillingCd="+pkgBillingCode,
    			        method: "POST",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					data:postData
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       updateMetadataBasePackages:function(postData,pkgBillingCode){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.updateBasePackages+'?channelPackageID='+pkgBillingCode,
    	    		    //url:"https://135.66.37.231:8889/restservices/udas/v1/vadabulkload/updateCompPkgDetails?channelPackageID="+pkgBillingCode,
    	    		   	//url:'https://135.66.38.139:8083/restservices/udas/v1/vadabulkload/updateCompPkgDetails?channelPackageID='+pkgBillingCode,
    			        method: "POST",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					data:postData
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
						getMetadataBasePackages:function(pkgBillingCode,zone){
							var deferred = $q.defer();
    	    	  var username = url.userName;
	    				var password = url.password;
    	    	  $http({
    	    		    url:url.getSelBasPackages+'?channelPackageID='+pkgBillingCode+'&zone='+zone,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getPairedPacakgesList:function(id){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		   url:url.getPairedPackagesList+'?channelPackageID='+id,
    	    		   //url:"https://135.66.36.65:8092/restservices/udas/v1/vadabulkload/getPairedPackageList",
    			        method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       updateMetadataPairedPackages:function(postData,pkgBillingCode){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.updatePairedPackages+'?channelPackageID='+pkgBillingCode,
    	    		    //url:"https://135.66.36.65:8092/restservices/udas/v1/vadabulkload/insCompPairedPkg?channelPackageID="+pkgBillingCode,
    	    		   	//url:'https://135.66.38.139:8083/restservices/udas/v1/vadabulkload/updateCompPkgDetails?channelPackageID='+pkgBillingCode,
    			        method: "POST",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					data:postData
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getMetadataPairedPackages:function(pkgBillingCode){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getSelPairedPackages+'?channelPackageID='+pkgBillingCode,
    	    		   	//url:'https://135.66.38.139:8083/restservices/udas/v1/vadabulkload/updateCompPkgDetails?channelPackageID=32931',
    	    		    //url:"https://135.66.36.65:8092/restservices/udas/v1/vadabulkload/getPairedPackages?channelPackageID="+pkgBillingCode,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getCompPackages:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getCompPackagesList,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getCompChannels:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getCompChannelsList,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       loadOptions:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.availOptions,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       loadCCADashboard:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.ccaDashboard,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					params:attrs,
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getAvailableFiles:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    //url:"https://135.66.35.58:8889/restservices/udas/v1/vadabulkload/getAvaliableFiles",
    	    		    url:url.availableFiles,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       downloadReadyFile:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    			   var password = url.password;
    			   var finalUrl = null;

    			   var keys = Object.keys(packageDCVal);
    			   for(var i=0;i<keys.length;i++){
    			       var keyName = keys[i];
    			       var value = [];
    			       value = packageDCVal[keyName].split(',');
    			       for(var j=0;j<value.length;j++){
    			    	   var pkgName = value[j];
    			    	   if(pkgName==attrs.pckCd && keyName=="DC1"){
    			    		   finalUrl = url.dc1HostVal+url.getDcFile;
    			    	   }
    			    	   if(pkgName==attrs.pckCd && keyName=="DC2"){
    			    		   finalUrl = url.dc2HostVal+url.getDcFile;
    			    	   }
    			    	   if(pkgName==attrs.pckCd && keyName=="DC3"){
    			    		   finalUrl = url.dc3HostVal+url.getDcFile;
    			    	   }
    			       }
    			   }
    	    	   $http({
    	    		    url: finalUrl,
    	    		    //url:"https://135.66.35.58:8889/restservices/udas/v1/vadabulkload/getFile",
    	    		    method: "GET",
    			        headers: {
    			        	'Content-Type': 'application/zip',
    						//'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password)
    						//'Accept' : 'application/xlsx'
    					},
    					params:attrs,
    					 responseType: 'arraybuffer'
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       startProgress:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    //url:"https://135.66.35.58:8889/restservices/udas/v1/vadabulkload/getDashboardReports",
    	    		    url:url.progressFiles,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					params:attrs,
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       fetchEligibleCustVal:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getEligibleCust,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       downloadSampleTemplate:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.sampleTemplate,
    	    		    method: "GET",
    	    		    headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       uploadDeProvisionFile : function(file, datas){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	        var fd = new FormData();
    	    	        fd.append('file', file);
    	    	        fd.append('name', JSON.stringify(datas));
    	    	        var uploadUrl = url.uploadDeProvision;
    	    	        $http.post(uploadUrl, fd, {
    	    	            transformRequest: angular.identity,
    	    	            headers: {'Content-Type': undefined,'Authorization': 'Basic '+$base64.encode(username+':'+password)}
    	    	        })

    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    					deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getConfigDetails:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getConfigDetails,
    	    		    method: "GET",
    	    		    headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       updateConfigDetails:function(val){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.updateConfigDetails,
    	    		    method: "POST",
    	    		    headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000,
    					data:val
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       loadDcDashboard:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getExportDcPkgName,
    	    		    method: "GET",
    			        headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					params:attrs,
    					timeout:90000
    			    })
    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getPeriodForSmsFeedData:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getPeriodForSmsFeedData,
    	    		    method: "GET",
    	    		    headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getPeriodForUploadCcaSmsFeed:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getPeriodForUploadCcaSmsFeed,
    	    		    method: "GET",
    	    		    headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       downloadSampleFile:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getSmsFeedFile,
    	    		    method: "GET",
    	    		    headers: {
    	    		    	'Content-Type': 'application/xlsx',
    	    		    	//'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    	    		    	'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						//'Accept' : 'application/xlsx'
    					},
    			     params:attrs,
    			     responseType: 'arraybuffer'
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       getSmsFeedFileName:function(){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.getCcaSmsFeedFileName,
    	    		    method: "GET",
    	    		    headers: {
    						'Content-Type': 'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						'Accept' : 'application/json'
    					},
    					timeout:90000
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       downloadSampleSubsToAddTemplate:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	   $http({
    	    		    url:url.sampleSubsToAddTemplate,
    	    		    method: "GET",
    	    		    headers: {
    						'Content-Type': 'application/xlsx',//'application/json;charset=UTF-8',
    						'Authorization': 'Basic '+$base64.encode(username+':'+password),
    						//'Accept' : 'application/json'
    					},
    					responseType: 'arraybuffer'
    					//timeout:90000
    			    })
    			    .success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    						deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       deleteSampleSubsToAddTemplate:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    				 $http({
     	    		    url:url.deleteSubsToAddTemplate,
     	    		    method: "GET",
     	    		    headers: {
     						'Content-Type': 'application/json;charset=UTF-8',
     						'Authorization': 'Basic '+$base64.encode(username+':'+password),
     						'Accept' : 'application/json'
     					},
     					 params:attrs,
     					timeout:90000
     			    })
     			    .success(function(data) {
     					deferred.resolve(data);
     				})
     				.error(function(msg, code) {
     						deferred.reject(msg);
     				});
     				return deferred.promise;
    	       },
    	       uploadSubsToAddFile : function(file, datas){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    	    	        var fd = new FormData();
    	    	        fd.append('file', file);
    	    	        fd.append('name', JSON.stringify(datas));
    	    	        var uploadUrl = url.uploadSubsToAddFeed;
    	    	        $http.post(uploadUrl, fd, {
    	    	            transformRequest: angular.identity,
    	    	            headers: {'Content-Type': undefined,'Authorization': 'Basic '+$base64.encode(username+':'+password)}
    	    	        })

    				.success(function(data) {
    					deferred.resolve(data);
    				})
    				.error(function(msg, code) {
    					deferred.reject(msg);
    				});
    				return deferred.promise;
    	       },
    	       fetchSmsPeriodFile:function(attrs){
    	    	   var deferred = $q.defer();
    	    	   var username = url.userName;
    				var password = url.password;
    				 $http({
     	    		    url:url.fetchSmsPeriodFile,
     	    		    method: "GET",
     	    		    headers: {
     						'Content-Type': 'application/json;charset=UTF-8',
     						'Authorization': 'Basic '+$base64.encode(username+':'+password),
     						'Accept' : 'application/json'
     					},
     					params:attrs,
     					timeout:90000
     			    })
     			    .success(function(data) {
     					deferred.resolve(data);
     				})
     				.error(function(msg, code) {
     						deferred.reject(msg);
     				});
     				return deferred.promise;
    	       },

       };
		}]);
})();
