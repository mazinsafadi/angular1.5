var hn = window.location.hostname;
var host = "https://"+hn+":31242";
if(hn.toLowerCase().indexOf("local") >= 0) {
	host = "";
}
var host1 = "https://zld04779.vci.att.com:32637";
var host2 = "https://"+hn+":31714";   
var host3 = "https://"+hn+":31697"; 
var vamhost="https://zlp22234.vci.att.com:30603";
var host4 = "https://zltv3747.vci.att.com:31586";
var authhost="https://zltv3747.vci.att.com:31586";
var dc1Host="https://zltv3747.vci.att.com:32331";
var dc2Host="https://zld04779.vci.att.com:30196";
var dc3Host="https://zlp22234.vci.att.com:30603";

(function () {
    'use strict';
    angular.module('Bulkload.constants', []).constant('url', {
    	getPendingFile: host+"/restservices/udas/v1/vadabulkload/getPendingFile",
    	uploadCC: host+"/restservices/udas/v1/vadabulkload/ccFileUpdate",
    	uploadDNS:host+"/restservices/udas/v1/vadabulkload/dnsFileUpload",
    	exportAccounts:host+"/restservices/udas/v1/vadabulkload/exportAccounts",
    	exportDashboardAccounts:host+"/restservices/udas/v1/vadabulkload/exportDashboardAccounts",
    	getPendingDNSFile:host+"/restservices/udas/v1/vadabulkload/getDnsPendingFile",
    	deleteDNSFile:host+"/restservices/udas/v1/vadabulkload/deleteDnsFile",
    	getDNSDashboard:host+"/restservices/udas/v1/vadabulkload/getDnsDashboardDetails",
    	getCmplDashboard:host+"/restservices/udas/v1/vadabulkload/getCCDashboardDetails",
    	updateDNSFile:host+"/restservices/udas/v1/vadabulkload/updateDnsFile",
    	exportFailedAcc:host+"/restservices/udas/v1/vadabulkload/exportFailedAccounts",
    	uploadCorrection:host+"/restservices/udas/v1/vadabulkload/uploadCorrectionFile",
    	getCmplDashboardAcc:host+"/restservices/udas/v1/vadabulkload/getAccountDetails",
    	getCCPackageMetadata:host4+"/restservices/udas/v1/complimentarypackagemanager/getComplimentaryPackageMetadata",
    	getPackagesList:"https://zld04779.vci.att.com:32095/restservices/udas/v1/authorization/getAvailablePackages",
    	getChannelNames:"https://zlp22234.vci.att.com:31714/restservices/udas/v1/authorization/authcode?billingCode=NFLMAX16",
    	updateCCMetadata:host4+"/restservices/udas/v1/complimentarypackagemanager/updateCmpDetails",
    	updateBasePackages:host4+"/restservices/udas/v1/complimentarypackagemanager/updateCompPkgDetails",
    	getSelBasPackages:host4+"/restservices/udas/v1/complimentarypackagemanager/getCompPkgDetailsZone",
    	getPairedPackagesList:host4+"/restservices/udas/v1/complimentarypackagemanager/getPairedPackageList",
    	updatePairedPackages:host4+"/restservices/udas/v1/complimentarypackagemanager/insCompPairedPkg",
    	getSelPairedPackages:host4+"/restservices/udas/v1/complimentarypackagemanager/getPairedPackages",
    	getCompPackagesList:host1+"/restservices/udas/v1/packageservice/getcmplpackagedetails",
    	getCompChannelsList:authhost+"/restservices/udas/v1/authorization/getauthcompchannels",
    	availOptions:host4+"/restservices/udas/v1/complimentarypackagemanager/getCCAOnLoadOptions",
    	ccaDashboard:host4+"/restservices/udas/v1/complimentarypackagemanager/getProvCompChlsDashDet",
    	availableFiles:host4+"/restservices/udas/v1/complimentarypackagemanager/getAvailableFiles",
    	getFile:host4+"/restservices/udas/v1/complimentarypackagemanager/getFile",
    	progressFiles:host4+"/restservices/udas/v1/complimentarypackagemanager/exportComplPkgAccntDet",
    	getEligibleCust:host4+"/restservices/udas/v1/complimentarypackagemanager/getAvailablePackages",
    	sampleTemplate:host4+"/restservices/udas/v1/complimentarypackagemanager/getDeprovisioningHeaders",
    	uploadDeProvision:host4+"/restservices/udas/v1/complimentarypackagemanager/deprovisionCompPkgs",
    	updateCompMetadata:host4+"/restservices/udas/v1/complimentarypackagemanager/persistComplimentaryPackageMetadata",
    	getConfigDetails:host4+"/restservices/udas/v1/complimentarypackagemanager/getComplimentaryConfigDetails",
    	updateConfigDetails:host4+"/restservices/udas/v1/complimentarypackagemanager/updateComplimentaryConfigDetails",
    	getExportDcPkgName:host4+"/restservices/udas/v1/complimentarypackagemanager/getExportPkgNameValue",
    	getCompPkgDc:host4+"/restservices/udas/v1/complimentarypackagemanager/getCompPkgDataCenter",
    	getSmsFeedFile:host4+"/restservices/udas/v1/complimentarypackagemanager/getSmsFeedFile",
    	getPeriodForSmsFeedData:host4+"/restservices/udas/v1/complimentarypackagemanager/getPeriodForSmsFeedData",
    	getDcFile:"/restservices/udas/v1/complimentarypackagemanager/getFile",
    	sampleSubsToAddTemplate:host4+"/restservices/udas/v1/complimentarypackagemanager/getSubsToAddFeedHeaders",
    	deleteSubsToAddTemplate:host4+"/restservices/udas/v1/complimentarypackagemanager/deleteSubsToAddFeedTemplate",
    	uploadSubsToAddFeed:host4+"/restservices/udas/v1/complimentarypackagemanager/subsToAddFeedUpload",
    	getCcaSmsFeedFileName:host4+"/restservices/udas/v1/complimentarypackagemanager/getCcaSmsFeedFileName",
    	fetchSmsPeriodFile:host4+"/restservices/udas/v1/complimentarypackagemanager/getCcaSmsFeedPeriodFeedType",
    	getPeriodForUploadCcaSmsFeed:host4+"/restservices/udas/v1/complimentarypackagemanager/getPeriodForUploadCcaSmsFeed",
    	dc1HostVal: dc1Host,
    	dc2HostVal: dc2Host,
        dc3HostVal: dc3Host,	
    		userName: "SSSS",
    		password: "PWWW"
    		
    });
})();

