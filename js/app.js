(function () {
    'use strict';

    angular.module('3p', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider.when('/start', {
            templateUrl: 'parts/start.html'
        });
        $routeProvider.when('/attach', {
            templateUrl: 'parts/attach-art.html',
            resolve: {
                'check': function($location, FunnelService) {
                    FunnelService.routeFunnel($location);
                }
            }
        });
        $routeProvider.when('/notify', {
            templateUrl: 'parts/notification.html',
            resolve: {
                'check': function($location, FunnelService) {
                    FunnelService.routeFunnel($location);
                }
            }
        });
        $routeProvider.when('/statement', {
            templateUrl: 'parts/legal-statements.html',
            resolve: {
                'check': function($location, FunnelService) {
                    FunnelService.routeFunnel($location);
                }
            }
        });
        $routeProvider.when('/submit', {
            templateUrl: 'parts/review-submission.html',
            resolve: {
                'check': function($location, FunnelService) {
                    FunnelService.routeFunnel($location);
                }
            }
        });
        $routeProvider.otherwise({redirectTo: '/start'});
    })

.service('FunnelService', function (StepService) {

    this.routeFunnel = function(loc) {
        if (typeof appNumber == 'undefined') {
            loc.path('/');
            StepService.setStep(1);

            //debug
            console.log('appNumber: ' + appNumber + ', Redirected to /');
            console.log(loc);
        } else {
            //maybe do something

            //debug
            console.log('appNumber: ' + appNumber + ', Proceeding!');
            console.log(loc);
        }
    };

})

.service('StepService', function(){
    this.callbacks = [];
    this.currentStep = null;

    this.getStep = function() {
        return this.currentStep;
    };

    this.setStep = function(s) {
        this.currentStep = s;

        // for $watch-like callbacks
        angular.forEach(this.callbacks, function(callback){
            callback();
        });
    };

    this.registerCallback = function(callback) {
        this.callbacks.push(callback);
    }
})

.controller('ScrapeController', ['$http', function($http){
    this.bibs = {};
    this.url = 'http://patent-server.appspot.com/api';
    this.number = null;

    var scrapey = this;
    this.scrape = function () {
        $http({
            method: 'GET',
            url: scrapey.url,
            params: {query: scrapey.number}
        }).success(function(data){
            scrapey.bibs = data;
        })
    };
}])

.controller('WizardController', function ($location, $templateCache, $rootScope, StepService) {
    this.placeholder = 'Publication Number (e.g. 20010000044) or Application Number (e.g. 14/123,456)';
    this.currentStep = 1;
    this.steps = steps;

    // maybe unused
    this.setView = function (view) {
        $location.path(view);
    };

    this.setStep = function (s) {
        $location.path(this.steps[s].view);
        StepService.setStep(this.steps[s].ordinal);
        this.currentStep = StepService.getStep();
    };

    // sanity check in case routeFunnel popped
    // primarily to prevent some weird conditional formatting issues that will probably never happen in reality
    // 
    var wctrl = this; // because scope fail
    this.reset = function () {
        wctrl.currentStep = StepService.getStep();
    };
    StepService.registerCallback(this.reset);

    // debug
    // clear template caching for less PITA
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
        console.log('templateCache Cleared!');
    });


})

.controller('ArtController', function () {
    this.artAdded = art;

    this.add = function () {
        this.count = this.artAdded.length;
        this.artAdded.push({name: 'test', id: this.count});
    };
})


.controller('ArtReadOnlyController', function () {
    this.artAdded = art;
})

.controller('AppNumberController', function () {
    this.appNumber = appNumber;

        // maybe unused
        this.setApp = function (appn) {
            this.appNumber = appn;
        };

        this.kickApp = function () {
            appNumber = this.appNumber;
        };
    })

.controller('NotificationController', function() {
    this.notify = notify;
    this.email = email;
})

.controller('LegalStatementsController', function() {
    this.statements = statements;

    this.validate = function(statement) {
        var indices;
        var validated = false;

        if  (statement.name == 'feeIncluded') {

            indices = $.map(this.statements, function(item, index) {
                if(item.name == 'feeNotRequired' || item.name == 'resubmission') {
                    return index;
                }
            });

                //debug
                console.log(statement.name);
                console.log(JSON.stringify($.grep(this.statements, function(item){ return item.name == statement.name; })));
                console.log(indices);

                validated = true;

            } else if (statement.name == 'feeNotRequired' || statement.name == 'resubmission') {

                indices = $.map(this.statements, function(item, index) {
                    if(item.name == 'feeIncluded') {
                        return index;
                    }
                });

                //debug
                console.log(statement.name);
                console.log(JSON.stringify($.grep(this.statements, function(item){ return item.name == statement.name; })));
                console.log(indices);

                validated = true;
            }
            
            //pulling this out just in case i want to do something weird with the validation rules
            if (validated) {

            var lctrl = this;   // because scope fugerdlyness
            $.each(indices, function(i, val) {
                lctrl.statements[val].selected = false;
            });}

            //debug
            console.log(validated);

            return validated;
        };
    })

.directive('priorArt', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'parts/art.html',
    };
})

.directive('priorArtRo', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'parts/art-readonly.html',
    };
})

.directive('legalStatement', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'parts/statement.html',
    };
})

.directive('legalStatementRo', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'parts/statement-readonly.html',
    };
})

; ////////////////////////////////

var appNumber;
var notify;
var email;
var statements = [
{
    name: 'feeIncluded',
    text: 'The fee set forth in 37 CFR 1.290(f) has been submitted herewith.',
    selected: false
},
{
    name: 'feeNotRequired',
    text: 'The fee set forth in 37 CFR 1.290(f) is not required because this submission lists three or fewer total items and, to the knowledge of the person signing the statement after making reasonable inquiry, this submission is the first and only submission under 35 U.S.C.122(e) filed in the above-identified application by the party making the submission or by a party in privity with the party. See 37 CFR 1.290(g).',
    selected: false
},
{
    name: 'resubmission',
    text: 'This resubmission is being made responsive to a notification of non-compliance issued for an earlier filed third-party submission. The corrections in this resubmission are limited to addressing the non-compliance. As such, the party making this resubmission: (1) requests that the Office apply the previously-paid fee set forth in 37 CFR 1.290(f), or (2) states that no fee is required to accompany this resubmission as the undersigned is again making the fee exemption statement set forth in 37 CFR 1.290(g).',
    selected: false
}
];

// this 
var art = [];

var steps = [
{
    ordinal: 1,
    view: '/start'
},
{
    ordinal: 2,
    view: '/attach'
},
{
    ordinal: 3,
    view: '/notify'
},
{
    ordinal: 4,
    view: '/statement'
},
{
    ordinal: 5,
    view: '/submit'
}
];

})();