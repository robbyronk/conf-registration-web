"use strict";angular.module("confRegistrationWebApp",["ngMockE2E","ngResource"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/register/:conferenceId/page/:pageId",{templateUrl:"views/registration.html",controller:"RegistrationCtrl",resolve:{conference:["$route","Conferences","$q",function(a,b,c){var d=c.defer();return b.get({id:a.current.params.conferenceId},function(a){d.resolve(a)}),d.promise}],answers:["$route","Registrations","$q",function(a,b){return b.getCurrentOrCreate(a.current.params.conferenceId).then(function(a){return a.answers})}]}}).when("/info/:conferenceId",{templateUrl:"views/info.html",controller:"InfoCtrl",resolve:{conference:["$route","Conferences","$q",function(a,b,c){var d=c.defer();return b.get({id:a.current.params.conferenceId},function(a){d.resolve(a)}),d.promise}]}}).when("/adminData/:conferenceId",{templateUrl:"views/adminData.html",controller:"AdminDataCtrl",resolve:{registrations:["$route","Registrations","$q",function(a,b){return b.getAllForConference(a.current.params.conferenceId)}],conference:["$route","Conferences","$q",function(a,b,c){var d=c.defer();return b.get({id:a.current.params.conferenceId},function(a){d.resolve(a)}),d.promise}]}}).otherwise({redirectTo:"/"})}]),console.log("**********************USING MOCK BACKEND**********************"),angular.module("confRegistrationWebApp").run(["$httpBackend",function(a){a.whenGET(/views\/.*/).passThrough();var b={"012":[{user:"user-1",answers:[{block:"block-2",value:"Ron"},{block:"block-4",value:"Man"},{block:"block-5",value:"Yes"},{block:"block-6",value:"No"},{block:"block-7",value:"Waffles"},{block:"block-8",value:"Burger"},{block:"block-9",value:"Steak"}]},{user:"user-2",answers:[{block:"block-2",value:"Jerry"},{block:"block-3",value:"Perdue"},{block:"block-4",value:"Man"},{block:"block-5",value:"Yes"},{block:"block-6",value:"Yes"},{block:"block-7",value:"Pancakes"},{block:"block-8",value:"Sandwich"},{block:"block-9",value:"Shrimp"}]},{user:"user-3",answers:[{block:"block-2",value:"Tom"},{block:"block-4",value:"Man"},{block:"block-5",value:"No"},{block:"block-6",value:"Yes"},{block:"block-7",value:"Omelettes"},{block:"block-8",value:"Soup"},{block:"block-9",value:"Lobster"}]}]},c=[{id:"012",name:"A Sweet Fall Retreat",landingPage:{blocks:[{id:"landingpage-1",title:"Location",type:"paragraphContent",content:"123 Main St. Orlando, FL, 32828"},{id:"landingpage-2",title:"Registration Begins",type:"paragraphContent",content:"August 19, 2013 12:00 AM Eastern Time"},{id:"landingpage-2",title:"Registration Ends",type:"paragraphContent",content:"October 12, 2013 3:00 AM Eastern Time"},{id:"landingpage-2",title:"Fall Retreat Starts",type:"paragraphContent",content:"October 18, 2013 6:00 PM Eastern Time"},{id:"landingpage-2",title:"Fall Retreat Ends",type:"paragraphContent",content:"October 20, 2013 10:00 AM Eastern Time"},{id:"landingpage-2",title:"Contact Info",type:"paragraphContent",content:"John Smith <john.smith@example.com> 555-555-5555"}]},pages:[{id:"1",title:"About You",blocks:[{id:"block-1",title:"Important Information",type:"paragraphContent",content:"We are glad you are coming to Fall Retreat!"},{id:"block-2",title:"What's your name?",required:!0,type:"textQuestion"},{id:"block-3",title:"What school do you currently attend?",type:"textQuestion"},{id:"block-4",title:"Man or Lady?",type:"radioQuestion",required:!0,choices:["Man","Lady"]}]},{id:"2",title:"Rides",blocks:[{id:"block-1",title:"Ride Situation",type:"paragraphContent",content:"If you are driving, please give someone a ride."},{id:"block-5",title:"Do you have a car?",type:"radioQuestion",required:!0,choices:["Yes","No"]},{id:"block-6",title:"Do you need a ride?",type:"radioQuestion",required:!0,choices:["Yes","No"]}]},{id:"3",title:"Food",blocks:[{id:"block-7",title:"What do you want to eat for breakfast?",type:"radioQuestion",required:!0,choices:["Pancakes","Waffles","Omelettes"]},{id:"block-8",title:"What do you want to eat for lunch?",type:"radioQuestion",required:!0,choices:["Sandwich","Soup","Burger"]},{id:"block-9",title:"What do you want to eat for dinner?",type:"radioQuestion",required:!0,choices:["Steak","Shrimp","Lobster"]}]}]},{id:"123",name:"Fall Retreat WOOO"},{id:"234",name:"Fall Retreat!"},{id:"345",name:"Yet Another Fall Retreat (YAFR)"},{id:"456",name:"Fall Retreat Is Never Gonna Give You Up"}];a.whenGET("conferences").respond(function(){console.log("GET /conferences");var a={};return[200,c,a]}),angular.forEach(c,function(c){a.whenGET("conferences/"+c.id).respond(function(){console.log("GET /conferences/"+c.id);var a={};return[200,c,a]}),a.whenGET("conferences/"+c.id+"/registrations").respond(function(){console.log("GET /conferences/"+c.id+"/registrations");var a={};return[200,b[c.id],a]}),a.whenPOST("conferences/"+c.id+"/registrations").respond(function(){console.log("POST /conferences/"+c.id+"/registrations");var a={id:"752bab92-e8bf-11e2-91e2-0800200c9a66",user:"c8cfaf61-e8a8-11e2-91e2-0800200c9a66",answers:[]},d={location:"registrations/"+a.id};return[201,b[c.id],d]}),a.whenGET("conferences/"+c.id+"/registrations/current").respond(function(){console.log("GET /conferences/"+c.id+"/registrations/current");var a={},d=b[c.id],e=_.find(d,function(a){return angular.equals(a.user,"user-1")});return console.log(e),[200,e,a]})})}]),angular.module("confRegistrationWebApp").controller("MainCtrl",["$scope","Conferences",function(a,b){a.conferences=b.query()}]);