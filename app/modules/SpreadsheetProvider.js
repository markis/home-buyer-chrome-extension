// Home Buyer - Chrome Extension
// Copyright (C) 2014  Markis Taylor

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// See http://www.gnu.org/licenses/

define(['jquery'], function($) {
  'use strict';

  var DRIVE_URL = 'https://www.googleapis.com/drive/v2/files?key=AIzaSyD-ytzTZk3pth5_d2Ip1B00PXJv_nS3nCA';
  var SPREADSHEETS_FEED_URL = 'https://spreadsheets.google.com/feeds/spreadsheets/private/full';
  var WORKSHEETS_NAMESPACE = 'http://schemas.google.com/spreadsheets/2006#worksheetsfeed';
  var LISTFEED_NAMESPACE = 'http://schemas.google.com/spreadsheets/2006#listfeed';
  var CELLSFEED_NAMESPACE = 'http://schemas.google.com/spreadsheets/2006#cellsfeed';

  var XML_CHAR_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  };
 
  function escapeXml (s) {
    return s.replace(/[<>&"']/g, function (ch) {
      return XML_CHAR_MAP[ch];
    });
  }

  function SpreadsheetProvider() {
  	this.internals = new Internals();
  }

  SpreadsheetProvider.prototype.save = function save(spreadSheetName, property, callback, failureCallback) {
  	if (!failureCallback) failureCallback = consoleFailureCallback;
  	if (!property) failureCallback('property is undefined');
  	var self = this.internals;

  	self.getWorkSheetUrl(spreadSheetName, function(worksheetsfeedUrl) {
  		self.getWorkSheetListFeedUrl(worksheetsfeedUrl, function(listfeedurl) {
  			self.postPropertyToWorksheet(listfeedurl, property, callback, failureCallback);
  		}, failureCallback);
  	}, failureCallback);
  };

  SpreadsheetProvider.prototype.setupAccount = function setupAccount(callback, failureCallback) {
    var self = this.internals;
    self.getToken(true, callback, failureCallback);
  };

  SpreadsheetProvider.prototype.createHomeBuyerSpreadsheet = function createHomeBuyerSpreadsheet(spreadSheetName, callback, failureCallback) {
    if (!spreadSheetName) failureCallback('spreadSheetName is undefined');
    var self = this.internals;
    self.getToken(false, function(token) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v2/files?convert=true');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.onreadystatechange=function()
        {
            if (xhr.readyState==4 && xhr.status==200) { // && xhr.status==200
                var data = JSON.parse(xhr.response);
                var xhr2 = new XMLHttpRequest();
                xhr2.open('PATCH', 'https://www.googleapis.com/drive/v2/files/' + data.id + '?key=AIzaSyD-ytzTZk3pth5_d2Ip1B00PXJv_nS3nCA');
                xhr2.setRequestHeader('Authorization', 'Bearer ' + token);
                xhr2.setRequestHeader('Content-Type', 'application/json');
                xhr2.onreadystatechange=function()
                {
                    if (xhr2.readyState==4 && xhr2.status==200) {
                        callback();
                    }
                };
                xhr2.send('{title:"Home Buyer",description:"This file was created by the Home Buyer Chrome Extension","properties":[{"key": "HomeBuyer"}]}');
            }
        };
        
        var blob = new Blob(['url,address,price,bed,bath,sqft'], { type: 'text/csv'});
        var formData = new FormData();
        
        formData.append('HomeBuyerFile', blob);
        
        xhr.send(formData);
    }, failureCallback);
  };

  function Internals() {}

  Internals.prototype.consoleFailureCallback = function consoleFailureCallback(e) {
  	console.error(e);
  };

  Internals.prototype.getToken = function getToken(interactive, callback, failureCallback) {
  	try {
      chrome.identity.getAuthToken({ 'interactive': interactive }, function(token) {
        if ('undefined' === typeof token) {
          failureCallback();
        } else {
          callback(token);
        }
      });
    } catch(e) { failureCallback(e); }
  };

  Internals.prototype.setColumnsOnSpreadsheet = function setColumnsOnSpreadsheet(spreadSheetName, callback, failureCallback) {
    if (!spreadSheetName) failureCallback('spreadSheetName is undefined');
    var self = this;
    self.getWorkSheetUrl(spreadSheetName, function(worksheetsfeedUrl) {
      self.getWorkSheetCellsFeedUrl(worksheetsfeedUrl, function(cellsfeedurl) {
        
      }, failureCallback);
    }, failureCallback);
  };

  Internals.prototype.getWorkSheetUrl = function getWorkSheetUrl(spreadsheetName, callback, failureCallback) {
	if (!spreadsheetName) failureCallback('spreadsheetName is undefined');
  	var self = this;
  	self.callGoogleApi(SPREADSHEETS_FEED_URL, function ($doc) {
  		try	{
			var worksheetsfeedUrl = $doc.find('entry title:contains("' + spreadsheetName + '")').parent('entry').find('link[rel="' + WORKSHEETS_NAMESPACE + '"]').attr('href');
			callback(worksheetsfeedUrl);
  		} catch(e) { failureCallback(e); }
  	}, failureCallback);
  };

  Internals.prototype.getWorkSheetListFeedUrl = function getWorkSheetListFeedUrl(worksheetsfeedUrl, callback, failureCallback) {
  	if (!worksheetsfeedUrl) failureCallback('worksheetsfeedUrl is undefined');
  	var self = this;
  	self.callGoogleApi(worksheetsfeedUrl, function ($doc) {
  		try	{
			var listfeedurl = $doc.find('link[rel="' + LISTFEED_NAMESPACE + '"]').attr('href');
			callback(listfeedurl);
  		} catch(e) { failureCallback(e); }
  	}, failureCallback);
  };

  Internals.prototype.postPropertyToWorksheet = function postPropertyToWorksheet(listfeedurl, property, callback, failureCallback) {
  	if (!listfeedurl) failureCallback('listfeedurl is undefined');
  	if (!property) failureCallback('property is undefined');
  	var self = this;
  	try	{
  		var keys = Object.keys(property);
  		var postData = [];
  		postData.push('<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">');
  		for (var i = 0; i < keys.length; i++) {
  			var key = keys[i];
  			postData.push('<gsx:' + key + '>' + escapeXml(property[key]) + '</gsx:' + key + '>');
  		}
  		postData.push('</entry>');

  		self.callGoogleApi(listfeedurl, postData.join(''), callback, failureCallback);
  	} catch(e) { failureCallback(e); }
  };

  Internals.prototype.callGoogleApi = function callGoogleApi(url, postData, callback, failureCallback){
  	if ('function' === typeof postData) {
  		failureCallback = callback;
  		callback = postData;
  		postData = undefined;
  	}
  	if (!failureCallback) failureCallback = consoleFailureCallback;
  	var self = this;
   	try	{

      var contenttype = 'xml'; //TODO: adjust the call signature to allow this to be passed in
	  	self.getToken(false, function(token) {
	  		var ajaxSettings = {
		  			cache: false,
		  			dataType: contenttype,
		  			type: 'GET',
		  			beforeSend: function (xhr)
					{
						xhr.setRequestHeader("Authorization", "Bearer " + token);
					},
					success: function(data) {
			  			callback($(data));
					},
					error: function(xhr, status, error) {
						if (failureCallback) {
							failureCallback(error);
						} else {
							console.error(error);
						}
					}
        };
			if (postData) {
				ajaxSettings.type = 'POST';
				ajaxSettings.data = postData;
        if (contenttype === 'xml') {
          contenttype = 'atom+xml';
        }
        ajaxSettings.contentType = 'application/' + contenttype;
			}
			$.ajax(url, ajaxSettings);
	  	}, failureCallback);
	 } catch(e) { failureCallback(e); }
  };

  return SpreadsheetProvider;

});
