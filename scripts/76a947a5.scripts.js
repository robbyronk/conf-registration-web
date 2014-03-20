"use strict";angular.module("confRegistrationWebApp",["ngRoute","ngResource","ngCookies","ui.bootstrap"]).config(["$routeProvider","$injector",function($routeProvider,$injector){$routeProvider.when("/",{templateUrl:"views/admin-dashboard.html",controller:"MainCtrl",resolve:{enforceAuth:$injector.get("enforceAuth")}}).when("/wizard/:conferenceId",{templateUrl:"views/admin-wizard.html",controller:"AdminWizardCtrl",resolve:{enforceAuth:$injector.get("enforceAuth"),conference:["$route","ConfCache",function($route,ConfCache){return ConfCache.get($route.current.params.conferenceId)}]}}).when("/register/:conferenceId",{resolve:{redirectToIntendedRoute:["$location","$route",function($location,$route){$location.replace().path("/register/"+$route.current.params.conferenceId+"/page/")}]}}).when("/register/:conferenceId/page/:pageId?",{templateUrl:"views/registration.html",controller:"RegistrationCtrl",resolve:{enforceAuth:$injector.get("enforceAuth"),conference:["$route","ConfCache",function($route,ConfCache){return ConfCache.get($route.current.params.conferenceId)}],currentRegistration:["$route","RegistrationCache",function($route,RegistrationCache){return RegistrationCache.getCurrent($route.current.params.conferenceId)}]}}).when("/adminData/:conferenceId",{templateUrl:"views/adminData.html",controller:"AdminDataCtrl",resolve:{enforceAuth:$injector.get("enforceAuth"),registrations:["$route","RegistrationCache",function($route,RegistrationCache){return RegistrationCache.getAllForConference($route.current.params.conferenceId)}],conference:["$route","ConfCache",function($route,ConfCache){return ConfCache.get($route.current.params.conferenceId)}],permissions:["$route","PermissionCache",function($route,PermissionCache){return PermissionCache.getForConference($route.current.params.conferenceId)}]}}).when("/adminDetails/:conferenceId",{templateUrl:"views/adminDetails.html",controller:"AdminDetailsCtrl",resolve:{enforceAuth:$injector.get("enforceAuth"),registrations:["$route","RegistrationCache",function($route,RegistrationCache){return RegistrationCache.getAllForConference($route.current.params.conferenceId)}],conference:["$route","ConfCache",function($route,ConfCache){return ConfCache.get($route.current.params.conferenceId)}],permissions:["$route","PermissionCache",function($route,PermissionCache){return PermissionCache.getForConference($route.current.params.conferenceId)}]}}).when("/reviewRegistration/:conferenceId",{templateUrl:"views/reviewRegistration.html",controller:"ReviewRegistrationCtrl",resolve:{enforceAuth:$injector.get("enforceAuth"),registration:["$route","RegistrationCache",function($route,RegistrationCache){return RegistrationCache.getCurrent($route.current.params.conferenceId).then(function(currentRegistration){return currentRegistration})}],conference:["$route","ConfCache",function($route,ConfCache){return ConfCache.get($route.current.params.conferenceId)}]}}).when("/payment/:conferenceId",{templateUrl:"views/payment.html",controller:"paymentCtrl",resolve:{enforceAuth:$injector.get("enforceAuth"),registration:["$route","RegistrationCache",function($route,RegistrationCache){return RegistrationCache.getCurrent($route.current.params.conferenceId).then(function(currentRegistration){return currentRegistration})}],conference:["$route","ConfCache",function($route,ConfCache){return ConfCache.get($route.current.params.conferenceId)}]}}).when("/permissions/:conferenceId",{templateUrl:"views/admin-permissions.html",controller:"AdminPermissionsCtrl",resolve:{enforceAuth:$injector.get("enforceAuth"),conference:["$route","ConfCache",function($route,ConfCache){return ConfCache.get($route.current.params.conferenceId)}]}}).when("/activatePermission/:permissionAuthCode",{template:"{{message}}",controller:"ActiviatePermissionCtrl",resolve:{enforceAuth:$injector.get("enforceAuth")}}).when("/auth/:token",{resolve:{redirectToIntendedRoute:["$location","$cookies","$route","$rootScope","ProfileCache",function($location,$cookies,$route,$rootScope,ProfileCache){$cookies.crsAuthProviderType="",$cookies.crsToken&&$cookies.crsToken!==$route.current.params.token&&($cookies.crsPreviousToken=$cookies.crsToken),$cookies.crsToken=$route.current.params.token,$rootScope.crsToken=$cookies.crsToken,ProfileCache.getCache(function(data){$cookies.crsAuthProviderType=data.authProviderType,$location.replace().path($cookies.intendedRoute||"/")})}]}}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$cookies","$location",function($rootScope,$cookies,$location){$rootScope.$on("$locationChangeStart",function(){/^\/auth\/.*/.test($location.url())||($cookies.intendedRoute=$location.url())})}]).config(["$httpProvider",function($httpProvider){$httpProvider.interceptors.push("currentRegistrationInterceptor"),$httpProvider.interceptors.push("httpUrlInterceptor"),$httpProvider.interceptors.push("authorizationInterceptor"),$httpProvider.interceptors.push("unauthorizedInterceptor"),$httpProvider.interceptors.push("debouncePutsInterceptor"),$httpProvider.interceptors.push("statusInterceptor")}]).run(["$rootScope","$location",function($rootScope,$location){$rootScope.location=$location,$rootScope.$watch("location.url()",function(newVal){$rootScope.adminDashboard=angular.equals(newVal,"/"),$rootScope.subHeadStyle={height:$rootScope.adminDashboard?"100px":"5px"}})}]).config(["$provide",function($provide){$provide.decorator("$exceptionHandler",["$delegate",function($delegate){return function(exception,cause){$delegate(exception,cause),bugsense.notify(exception,cause)}}])}]),angular.module("confRegistrationWebApp").controller("MainCtrl",["$scope","ConfCache","$modal","$location","$http","Model","uuid",function($scope,ConfCache,$modal,$location,$http,Model,uuid){function getTotalRegistrations(confId,confIndex){$http.get("conferences/"+confId+"/registrations").success(function(result){$scope.conferences[confIndex].totalRegistrations=_.filter(result,function(item){return item.completed===!0}).length})}$scope.$on("conferences/",function(event,conferences){conferences=_.sortBy(conferences,function(conf){return conf.name}),$scope.conferences=conferences;for(var i=0;i<$scope.conferences.length;i++)getTotalRegistrations(conferences[i].id,i)}),ConfCache.query(),$scope.createConference=function(){$modal.open({templateUrl:"views/createConference.html",controller:"CreateDialogCtrl",resolve:{defaultValue:function(){return""}}}).result.then(function(conferenceName){null===conferenceName||""===conferenceName||angular.isUndefined(conferenceName)||ConfCache.create(conferenceName).then(function(conference){$location.path("/wizard/"+conference.id)})})},$scope.cloneConference=function(conferenceToCloneId){var conferenceToClone=_.find($scope.conferences,{id:conferenceToCloneId});$modal.open({templateUrl:"views/cloneConference.html",controller:"CreateDialogCtrl",resolve:{defaultValue:function(){return conferenceToClone.name+" (clone)"}}}).result.then(function(conferenceName){null===conferenceName||""===conferenceName||angular.isUndefined(conferenceName)||ConfCache.create(conferenceName).then(function(conference){var conferenceOrig=conference;$http.get("conferences/"+conferenceToClone.id).success(function(result){conference=angular.copy(result),conference.contactUser=conferenceOrig.contactUser,conference.id=conferenceOrig.id,conference.name=conferenceName,conference.registrationPages=result.registrationPages;for(var i=0;i<conference.registrationPages.length;i++){var pageUuid=uuid();conference.registrationPages[i].id=pageUuid,conference.registrationPages[i].conferenceId=conference.id;for(var j=0;j<conference.registrationPages[i].blocks.length;j++)conference.registrationPages[i].blocks[j].id=uuid(),conference.registrationPages[i].blocks[j].pageId=pageUuid}Model.update("conferences/"+conference.id,conference,function(){$location.path("/wizard/"+conference.id)})})})})}}]);