(function () {
    'use strict';
    var app = angular.module('Bulkload', ["ngCsv",'ui.router', 'ui.bootstrap', 'ngSanitize','Bulkload.DeletePopupController','Bulkload.CCSettingsPopupController','Bulkload.numbersOnly','Bulkload.FailedAccPopupController','Bulkload.CorrectionPopupController','Bulkload.CCADashboardController','Bulkload.CCPackageMetadataPopupController','Bulkload.CCBasePackagePopupController', 'Bulkload.bulkloadController','Bulkload.DNSDashboardController','Bulkload.compChannelController','Bulkload.bulkloadServices','Bulkload.fileBrowse','Bulkload.constants','Bulkload.CmplDashboardController','Bulkload.CCPackageMetadataController','Bulkload.compChannelServices','Bulkload.CCPairedPackagesPopupController']);
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.otherwise('/');
        $stateProvider
        .state("DNS", {
            url: "/DNS",
            templateUrl: 'modules/Bulkload/views/BulkLoad.html',
            controller: 'bulkloadController',
            controllerAs: 'vm'
        })
        .state("CC", {
            url: "/CC",
            templateUrl: 'modules/Bulkload/views/compChannel.html',
            controller: 'compChannelController',
            controllerAs: 'vm'
        })
        .state("CCdashboard", {
            url: "/CCdashboard",
            templateUrl: 'modules/Bulkload/views/CmplDashboard.html',
            controller: 'CmplDashboardController',
            controllerAs: 'vm'
        })
        .state("DNSdashboard", {
            url: "/DNSdashboard",
            templateUrl: 'modules/Bulkload/views/DNSDashboard.html',
            controller: 'DNSDashboardController',
            controllerAs: 'vm'
        })
        .state("CCAdashboard", {
            url: "/CCAdashboard",
            templateUrl: 'modules/Bulkload/views/CCADashboard.html',
            controller: 'CCADashboardController',
            controllerAs: 'vm'
        })
        .state("CCPackageMetadata", {
            url: "/CCPackageMetadata",
            templateUrl: 'modules/Bulkload/views/CCPackageMetadata.html',
            controller: 'CCPackageMetadataController',
            controllerAs: 'vm'
        })
        .state("Error", {
            url: "/Error",
            template: '<div>Not authorized</div>'
        });
    }]);

    //page loader
   /* app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.spinnerTemplate = '<div id="loadingDiv" class = "fade modal-backdrop in"></div><div class="loadTxt"><span class="txtContainer">Processing, please wait</span><span class="loadImg"><img src="images/spin.gif"/></span></div>';
    }]);*/
})();
