'use strict';

angular.module('confRegistrationWebApp')
  .run(function ($httpBackend, uuid) {
    // https://github.com/CruGlobal/conf-registration-api/wiki/Conferences

    // todo write fn to CRUD JS objs from JSON in local storage

    // Retrieve all conferences that user is authorized on
    $httpBackend.whenGET(/^conferences\/?$/).respond(function () {
      console.log(arguments);
      var headers = {};
      var conferences = localStorage.get('conferences');
      return [200, conferences, headers];
    });

    // Create a conference
    $httpBackend.whenPOST(/^conferences\/?$/).respond(function (verb, url, data) {
      console.log(arguments);

      var conference = angular.fromJson(data);

      if (!conference.name) {
        var message = {
          message: 'Name property must be provided'
        };
        return [400, message];
      }

      conference.id = uuid();
      conference.registrationPages = [];
      // todo: fill in the rest of the conference defaults

      var headers = {
        'Location': '/conferences/' + conference.id
      };
      return [201, conference, headers];
    });


    $httpBackend.whenGET(/^conferences\/[-a-zA-Z0-9]+\/?$/).respond(function (verb, url) {
      console.log(arguments);

      var conferenceId = url.split('/')[1];

      var conference = _.find(conferences, function (conference) {
        return angular.equals(conference.id, conferenceId);
      });

      return [200, conference, {}];
    });
  });