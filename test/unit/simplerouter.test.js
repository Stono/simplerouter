'use strict';
var SimpleRouter = require('../../lib/simplerouter');
var deride       = require('deride');
var _            = require('lodash');

describe('Regex Scenario Tests', function() {
  
  var simpleRouter,
      responseTest;
  
  beforeEach(function() {
    responseTest = deride.stub(['getHandler','putHandler','postHandler','deleteHandler']);
     
    simpleRouter = new SimpleRouter();
    simpleRouter.get('^([a-zA-Z0-9._-]+)$', responseTest.getHandler);
    simpleRouter.post('^([a-zA-Z0-9._-]+)/([0-9.-]+)$', responseTest.postHandler);
    simpleRouter.put('^([a-zA-Z0-9._-]+)/-/(\\1)-([0-9.-]+).tgz$', responseTest.putHandler);
    simpleRouter.delete('^([a-zA-Z0-9._-]+)$', responseTest.deleteHandler);

  });
  
  /*
   * Mocks the HTTP request to test routing
   */
  var getMockHttpRequest = function(url, method) {
    return {
      url: url,
      method: method
    };
  };
  
  /*
   * An array of the things we want to test
   * In the format: test, method, expected results
   */
  var sampleRequests = [
    {
      test: '/sOm3.p4-_ag3',
      method: 'GET',
      expect: function(req, res) {
        responseTest.expect.getHandler.called.once();
        responseTest.expect.getHandler.called.withArgs(req, res, 'sOm3.p4-_ag3');
        responseTest.expect.putHandler.called.never();
        responseTest.expect.postHandler.called.never();
        responseTest.expect.deleteHandler.called.never();
      }
    },
    {
      test: '/sOm3.p4-_ag3',
      method: 'DELETE',
      expect: function(req, res) {
        responseTest.expect.getHandler.called.never();
        responseTest.expect.putHandler.called.never();
        responseTest.expect.postHandler.called.never();
        responseTest.expect.deleteHandler.called.once();
        responseTest.expect.deleteHandler.called.withArgs(req, res, 'sOm3.p4-_ag3');  
      }
    },
    {
      test: '/sOm3.p4-_ag3/0.0.1',
      method: 'POST',
      expect: function(req, res) {
        responseTest.expect.getHandler.called.never();
        responseTest.expect.putHandler.called.never();
        responseTest.expect.postHandler.called.once();
        responseTest.expect.postHandler.called.withArgs(req, res, 'sOm3.p4-_ag3', '0.0.1');
        responseTest.expect.deleteHandler.called.never();
      }
    },
    {
      test: '/sOm3.p4-_ag3/-/sOm3.p4-_ag3-0.0.1.tgz',
      method: 'PUT',
      expect: function(req, res) {
        responseTest.expect.getHandler.called.never();
        responseTest.expect.putHandler.called.once();
        responseTest.expect.putHandler.called.withArgs(req, res, 'sOm3.p4-_ag3', 'sOm3.p4-_ag3', '0.0.1');
        responseTest.expect.postHandler.called.never();
        responseTest.expect.deleteHandler.called.never();
      }
    }
  ];
  
  _.forEach(sampleRequests, function(sample) {
    it(sample.test, function(done) {
      var mockHttpRequest = getMockHttpRequest(sample.test, sample.method);
      mockHttpRequest.sample = sample;
      simpleRouter.route(mockHttpRequest, null, function() {
        // Called when routing is complete
        sample.expect(mockHttpRequest, null);
        done();
      });
    });
  });
  
});