(function () {
	'use strict';
	angular.module('Bulkload.CCSettingsPopupController', []).controller('CCSettingsPopupController', CCSettingsPopupController);
	function isValidDayInMonth(dayInMonthStr) {
		const res = {
			msg: "",
			valid: false
		}
		let exactly2 = false;
		let validDay = false;
		if (dayInMonthStr) {
			exactly2 = dayInMonthStr.trim().length === 2;
			let day = parseInt(dayInMonthStr, 10);
			validDay = day <= 31 && day > 0;
			if (!exactly2) {
				res.msg += "each day should have two digits;";
			} else if (!validDay) {
				res.msg += "valid day is values are between 01 and 31;";
			}
			res.valid = validDay && exactly2;
		} else {
			res.msg += "empty value id not allowed;";
		}
		return res;
	}

	function CCSettingsPopupController($scope, $modal, $window, $timeout, $compile, bulkloadServices, $rootScope, $modalInstance, compChannelServices) {

		$rootScope.showSpinner = true;
		$scope.updateSuccess = false;
		let target = new Date();
		let currentYear = target.getFullYear();
		$scope.targetOp1 = "" + target.getMonth() + "_" + currentYear;
		$scope.targetOp2 = "" + (target.getMonth() + 1) + "_" + currentYear;
		$scope.targetOp3 = "" + (target.getMonth() + 2) + "_" + currentYear;
		if (target.getMonth() === 0) {
			$scope.targetOp1 = "12_"+ (currentYear - 1);
		}
		if (target.getMonth() === 11) {
			$scope.targetOp3 = "1_"+ (currentYear + 1);
		}
		$scope.error = false;
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
			window.parent.postMessage({ 'action': 'destroy', 'origin': window.location.origin }, '*');
		};

		compChannelServices.getConfigDetails().then(function (data) {
			if (data) {
				data.forEach(function (item) {
					if (item.attributeName == 'STAGING_REPORT') {
						$scope.accStaging = item.attributeValue;
					}
					else if (item.attributeName == 'TOTAL_POP_REPORT') {
						$scope.populationReport = item.attributeValue;
					}
					else if (item.attributeName == 'AVAILABLE_FOR_ADD_REPORT') {
						$scope.availableForAddReport = item.attributeValue;
					}
					else if (item.attributeName == 'TARGET_MONTH_YEAR') {
						$scope.targetMonthYear = item.attributeValue;
					} else if (item.attributeName == 'FirstFeedRange') {
						$scope.firstFeedRange = item.attributeValue;
					} else if (item.attributeName == 'SecondFeedRange') {
						$scope.secondFeedRange = item.attributeValue;
					}
				});
			}
			$rootScope.showSpinner = false;
		},
			function (error) {
				$rootScope.showSpinner = false;
			});

		$scope.saveConfigDetails = function () {
			$scope.updateSuccess = false;
			$scope.error = false;


			// validate first feed
			let firstFeedSplit = $scope.firstFeedRange.split(",");
			let validFirstFeed = true;
			let firstFeedresult = "";
			firstFeedSplit.map(function(val) {
				const valid = isValidDayInMonth(val);
				firstFeedresult += valid.msg;
				validFirstFeed = validFirstFeed && valid.valid;
			});

			let secondFeedSplit = $scope.firstFeedRange.split(",");
			let validSecondFeed = true;
			let secondFeedresult = "";
			secondFeedSplit.map(function(val) {
				const valid = isValidDayInMonth(val);
				secondFeedresult += valid.msg;
				validSecondFeed = validSecondFeed && valid.valid;
			});

			const validTotalPopulationGenDay = isValidDayInMonth($scope.populationReport);
			const validAvailableForAddGenDay = isValidDayInMonth($scope.availableForAddReport);

			let summary = "";
			if (!validTotalPopulationGenDay.valid) {
				summary += "population Report: ";
				summary += validTotalPopulationGenDay.msg + "; ";
			}
			if (!validAvailableForAddGenDay.valid) {
				summary += "Available For Add Report:";
				summary += validAvailableForAddGenDay.msg + "; ";
			}
			if (firstFeedresult) {
				summary += "First Feed Range: ";
				summary += firstFeedresult + "; ";
			}

			if (secondFeedresult) {
				summary += "Second Feed Range: ";
				summary += secondFeedresult + "; ";
			}

			if (summary) {
				$scope.error = true;
				$scope.errMsg = summary;
				return;
			}

			$rootScope.showSpinner = true;
			var config = {
				"TOTAL_POP_REPORT": $scope.populationReport,
				"AVAILABLE_FOR_ADD_REPORT": $scope.availableForAddReport,
				"TARGET_MONTH_YEAR": $scope.targetMonthYear,
				"FirstFeedRange": $scope.firstFeedRange,
				"SecondFeedRange": $scope.secondFeedRange
				/*"STAGING_REPORT":$scope.accStaging*/
			};
			compChannelServices.updateConfigDetails(config).then(function (data) {
				if (data.status[0].message == 'Updated Successfully') {
					$rootScope.showSpinner = false;
					$scope.updateSuccess = true;
					$scope.error = false;
					$scope.succMsg = data.status[0].message; //"Updated Successfully";
				} else {
					$rootScope.showSpinner = false;
					$scope.error = true;
					$scope.updateSuccess = false;
					$scope.errMsg = data.status[0].message;
				}
			},
				function (error) {
					$rootScope.showSpinner = false;
				});
		};

		$scope.restrictInput = function (val, id) {
			for (var i = 0; i < 33; i++) {
				if (val == i) {
					var allow = true;
				}
			}
			if (!allow)
				$('#' + id).val('');
		};
	}
	CCSettingsPopupController.$inject = ["$scope", "$modal", "$window", "$timeout", "$compile", "bulkloadServices", "$rootScope", "$modalInstance", "compChannelServices"];
})();
