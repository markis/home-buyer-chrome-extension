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

var SpreadsheetProvider = (function($) {
  'use strict';

  var SPREADSHEETS_FEED_URL = 'https://spreadsheets.google.com/feeds/spreadsheets/private/full';
  var WORKSHEETS_NAMESPACE = 'http://schemas.google.com/spreadsheets/2006#worksheetsfeed';
  var LISTFEED_NAMESPACE = 'http://schemas.google.com/spreadsheets/2006#listfeed';

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
  }

  function Internals() {}

  Internals.prototype.consoleFailureCallback = function consoleFailureCallback(e) {
  	console.error(e);
  }

  Internals.prototype.getToken = function getToken(interactive, callback, failureCallback) {
  	try {
  		chrome.identity.getAuthToken({ 'interactive': interactive }, callback);
  	} catch(e) { failureCallback(e); }
  }

  Internals.prototype.getWorkSheetUrl = function getWorkSheetUrl(spreadsheetName, callback, failureCallback) {
	if (!spreadsheetName) failureCallback('spreadsheetName is undefined');
  	var self = this;
  	self.callGoogleApi(SPREADSHEETS_FEED_URL, function ($doc) {
  		try	{
			var worksheetsfeedUrl = $doc.find('entry title:contains("' + spreadsheetName + '")').parent('entry').find('link[rel="' + WORKSHEETS_NAMESPACE + '"]').attr('href');
			callback(worksheetsfeedUrl);
  		} catch(e) { failureCallback(e); }
  	}, failureCallback);
  }

  Internals.prototype.getWorkSheetListFeedUrl = function getWorkSheetListFeedUrl(worksheetsfeedUrl, callback, failureCallback) {
  	if (!worksheetsfeedUrl) failureCallback('worksheetsfeedUrl is undefined');
  	var self = this;
  	self.callGoogleApi(worksheetsfeedUrl, function ($doc) {
  		try	{
			var listfeedurl = $doc.find('link[rel="' + LISTFEED_NAMESPACE + '"]').attr('href');
			callback(listfeedurl);
  		} catch(e) { failureCallback(e); }
  	}, failureCallback);
  }

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
		};
		postData.push('</entry>');

		self.callGoogleApi(listfeedurl, postData.join(''), callback, failureCallback);
  	} catch(e) { failureCallback(e); }
  }

  Internals.prototype.callGoogleApi = function callGoogleApi(url, postData, successCallback, failureCallback){
  	if ('function' === typeof postData) {
  		failureCallback = successCallback
  		successCallback = postData;
  		postData = undefined;
  	}
  	if (!failureCallback) failureCallback = consoleFailureCallback
  	var self = this;
   	try	{

	  	self.getToken(false, function(token) {
	  		var ajaxSettings = {
		  			cache: false,
		  			dataType: 'xml',
		  			type: 'GET',
		  			beforeSend: function (xhr)
					{
						xhr.setRequestHeader("Authorization", "Bearer " + token);
					},
					success: function(data) {
			  			successCallback($(data));
					},
					error: function(xhr, status, error) {
						if (failureCallback) {
							failureCallback(error);
						} else {
							console.error(error);
						}
					}
		  		}
			if (postData) {
				ajaxSettings.type = 'POST';
				ajaxSettings.data = postData;
				ajaxSettings.contentType = 'application/atom+xml';
			}
			$.ajax(url, ajaxSettings);
	  	}, failureCallback);
	 } catch(e) { failureCallback(e); }
  }

  return SpreadsheetProvider;

})(jQuery);
