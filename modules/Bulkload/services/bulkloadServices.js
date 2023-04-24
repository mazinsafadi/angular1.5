(function () {
    'use strict';
    angular.module('Bulkload.bulkloadServices', ['base64']).service("bulkloadServices", ['$http', '$window', '$location','$q','url','$base64', function ($http, $window, $location,$q,url,$base64) {
    	var selectedData;   
    	var User;
    	var fileName;
    	var ccMetadata=[];
    	return{
       uploadFileToUrl : function(file, datas){
    	   var deferred = $q.defer();
    	   //function(file, uploadUrl){
    	   var username = url.userName;
			var password = url.password;
    	        var fd = new FormData();
    	        fd.append('file', file);
    	        fd.append('name', JSON.stringify(datas));
    	        var uploadUrl = url.uploadDNS;

    	        $http.post(uploadUrl, fd, {
    	            transformRequest: angular.identity,
    	            headers: {'Content-Type': undefined,'Authorization': 'Basic '+$base64.encode(username+':'+password)}
    	        })
    	        
			.success(function(data) {
				//console.log(data);
				//responseData=data;
				/*if(!data.errorOccurred){
					deferred.resolve(data);
				}
				else{
					deferred.resolve(data);
				}*/
				deferred.resolve(data);
			})
			.error(function(msg, code) {
				/*if(code == "403") {
				}
				else*/
					deferred.reject(msg);
			});
			return deferred.promise;
    
       },       
       getPendingFiles :function(){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
       	$http({
		        //url: "http://135.66.32.30:8080/restservices/udas/v1/vadabulkload/pendingFile",
		        url:url.getPendingFile,
		        method: "GET",
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
				/*if(code == "403") {
				}
				else*/
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       uploadCCData : function(datas){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
		       // url: "http://135.66.32.30:8080/restservices/udas/v1/vadabulkload/updateAccounts",
    		   url:url.uploadCC,
		        method: "POST",
		        data: JSON.stringify(datas),
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				/*if(!data.errorOccurred){
					deferred.resolve(data);
				}
				else{
					deferred.resolve(data);
				}*/
				deferred.resolve(data);
			})
			.error(function(msg, code) {
				/*if(code == "403") {
				}
				else*/
					deferred.reject(msg);
			});
			return deferred.promise;
    
       },
       getPendingDNSfiles :function(){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
       	$http({
		        //url: "http://135.66.32.30:8080/restservices/udas/v1/vadabulkload/pendingFile",
		        url:url.getPendingDNSFile,
		        method: "GET",
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				deferred.resolve(data);
			})
			.error(function(msg, code) {
				/*if(code == "403") {
				}
				else*/
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       setData:function(data){
       	selectedData=data;
       },
       getData:function(data){
       	return selectedData;
       },
       setUser:function(user){
          	User=user;
          },
      getUser:function(user){
      	return User;
      },
      getFileName:function(){
         	return fileName;
      },
      setFileName:function(filename){
    	  fileName=filename;
      },
       deleteDNSFile:function(data){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
		       // url: "http://135.66.32.30:8080/restservices/udas/v1/vadabulkload/updateAccounts",
    		   url:url.deleteDNSFile,
		        method: "DELETE",
		        data: JSON.stringify(data),
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       getDNSDashboard:function(loadParams){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
    		   url:url.getDNSDashboard,
		        method: "GET",
		        params:loadParams,
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       getCmplDashboard:function(loadParams){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
    		   url:url.getCmplDashboard,
		        method: "GET",
		        params:loadParams,
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       updateDNSFile:function(data){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
    		   url:url.updateDNSFile,
		        method: "POST",
		        data:JSON.stringify(data),
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       searchDNSDashboardFile:function(searchParams){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
    		   //url:"https://zlp22234.vci.att.com:31242/restservices/udas/v1/vadabulkload/getDnsDashboardDetails",
    		    url:url.getDNSDashboard,
		        method: "GET",
		        params:searchParams,
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       searchCCDashboardFile:function(searchParams){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
    		   //url:"https://zlp22234.vci.att.com:31242/restservices/udas/v1/vadabulkload/getCCDashboardDetails",
    		   url:url.getCmplDashboard,
		        method: "GET",
		        params:searchParams,
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       ExportFailedAccs:function(fileId){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
    		   //url:"https://135.66.34.240:8080/restservices/udas/v1/vadabulkload/exportFailedAccounts",
    		   url:url.exportFailedAcc,
		        method: "GET",
		        params:fileId,
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       uploadCorrectionFile : function(file, datas){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	        var fd = new FormData();
    	        fd.append('file', file);
    	        fd.append('update', JSON.stringify(datas));
    	        var uploadUrl = url.uploadCorrection;

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
       searchCCDashboardAcc:function(searchParams){
    	   var deferred = $q.defer();
    	   var username = url.userName;
			var password = url.password;
    	   $http({
    		   //url:"https://135.66.37.231:8080/restservices/udas/v1/vadabulkload/getAccountDetails",
    		   url:url.getCmplDashboardAcc,
		        method: "GET",
		        params:searchParams,
		        headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic '+$base64.encode(username+':'+password),
					'Accept' : 'application/json'
				}
		    })
			.success(function(data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function(msg, code) {
					deferred.reject(msg);
			});
			return deferred.promise;
       },
       setCCMetadata:function(data){
    	   ccMetadata=data;
       },
       getCCMetadata:function(){
    	   return ccMetadata;
       },
       convertDateToET:function(date){
	    	   var etDate = "";
	    	   if(date != undefined && date != null && date !=""){
	     	   etDate = moment(date).format('MM/DD/YYYY HH:mm:ss');
	    	   }
	    	   return etDate;
	    },
       };
		}]);
})();
