altairApp.directive('smsType', function (){
	return {
		templateUrl : "app/components/sms/promotional_transactional.html"
	};
});

altairApp.directive('smsUnicode', function (){
	return {
		templateUrl : "app/components/sms/unicode.html"
	};
});

altairApp.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9\n]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            //return parseInt(digits,10);
            return digits;
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});

altairApp.directive('noSpace', function() {
 	return function(scope, element, attrs) {
 		element.bind("keydown", function(event) {
   			if (event.keyCode == 32) event.preventDefault();
   		});
  	};
});