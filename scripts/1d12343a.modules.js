"use strict";angular.module("confRegistrationWebApp").factory("Conferences",["$resource",function(a){return a("conferences/:id")}]),angular.module("confRegistrationWebApp").controller("RegistrationCtrl",["$scope","conference","$routeParams","$location","answers",function(a,b,c,d,e){function f(a){for(var c=b.pages,d=0;d<c.length;d++)if(angular.equals(a,c[d].id))return c[d]}function g(a){for(var c=b.pages,d=0;d<c.length;d++)if(angular.equals(a,c[d].id))return c[d+1]}a.validPages={},a.$on("pageValid",function(b,c){b.stopPropagation(),a.validPages[b.targetScope.page.id]=c}),a.conference=b,a.answers=e,a.findAnswer=function(a){return _.find(e,function(b){return angular.equals(b.block,a)})};var h=c.pageId;a.activePageId=h,a.page=f(h),a.nextPage=g(h),a.validateAndGoToNext=function(){d.path("/register/"+b.id+"/page/"+a.nextPage.id)}}]),angular.module("confRegistrationWebApp").directive("textQuestion",function(){return{templateUrl:"views/textQuestion.html",restrict:"E",link:function(a,b){b.find("input").bind("blur",function(){a.updateAnswer()})}}}),angular.module("confRegistrationWebApp").directive("radioQuestion",function(){return{templateUrl:"views/radioQuestion.html",restrict:"E"}}),angular.module("confRegistrationWebApp").directive("emailQuestion",function(){return{templateUrl:"views/emailQuestion.html",restrict:"E",link:function(a,b){b.find("input").bind("blur",function(){a.updateAnswer()})}}}),angular.module("confRegistrationWebApp").directive("nameQuestion",function(){return{templateUrl:"views/nameQuestion.html",restrict:"E",link:function(a,b){b.find("input").bind("blur",function(){a.updateAnswer()})}}}),angular.module("confRegistrationWebApp").directive("page",function(){return{templateUrl:"views/pageDirective.html",restrict:"E",controller:["$scope",function(a){a.$watch("pageForm.$valid",function(b){a.$emit("pageValid",b)})}]}}),angular.module("confRegistrationWebApp").directive("block",function(){return{templateUrl:"views/blockDirective.html",restrict:"E",scope:{block:"=",prefillAnswer:"=answer"},controller:["$scope",function(a){a.answer=angular.copy(a.prefillAnswer)||{},a.updateAnswer=function(){console.log("update answer in "+a.block.id+" to "+angular.toJson(a.answer))}}]}}),angular.module("confRegistrationWebApp").controller("InfoCtrl",["$scope","conference",function(a,b){a.conference=b,a.page=b.landingPage}]),angular.module("confRegistrationWebApp").factory("Registrations",["$resource","$http","$q",function(a,b,c){var d={},e={getAllForConference:{method:"GET",url:"conferences/:conferenceId/registrations",isArray:!0}},f=a("registrations/:id",d,e);return f.getCurrentOrCreate=function(a){var d=c.defer();return b.get("conferences/"+a+"/registrations/current").success(d.resolve).error(function(b,c){404===c?f.create(a).then(d.resolve):d.reject(b)}),d.promise},f.create=function(a){var d=c.defer();return b.post("conferences/"+a+"/registrations").success(d.resolve),d.promise},f}]),angular.module("confRegistrationWebApp").controller("AdminDataCtrl",["$scope","registrations","conference",function(a,b,c){a.conference=c,a.blocks=[],a.reversesort=!1,angular.forEach(c.pages,function(b){angular.forEach(b.blocks,function(b){-1===b.type.indexOf("Content")&&a.blocks.push(b)})}),a.findAnswer=function(a,b){return _.find(a.answers,function(a){return angular.equals(a.block,b)})},a.answerSort=function(b){return angular.isDefined(a.order)?angular.isDefined(a.findAnswer(b,a.order))?a.findAnswer(b,a.order).value:void 0:0},a.setOrder=function(b){a.reversesort=b===a.order?!a.reversesort:!1,a.order=b},a.registrations=b}]),angular.module("confRegistrationWebApp").constant("uuid",function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=0|16*Math.random(),c="x"==a?b:8|3&b;return c.toString(16)})});