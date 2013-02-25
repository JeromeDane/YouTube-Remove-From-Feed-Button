// ==UserScript==
// @name           Google+ Tweaks
// @description    Tweaks to the layout and features of Google+
// @author         Jerome Dane
// @website        http://userscripts.org/scripts/show/106166
// @version        1.1157
//
// @updateURL      https://userscripts.org/scripts/source/106166.meta.js
// 
// @include        http://plus.google.com/*
// @include        https://plus.google.com/*
//
// ==/UserScript==

// License         Creative Commons Attribution 3.0 Unported License http://creativecommons.org/licenses/by/3.0/
//
// Copyright (c) 2012 Jerome Dane
//
// Permission is hereby granted, free of charge, to any person obtaining 
// a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function simulateClick(element) {
    var clickEvent;
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("mousedown", true, true)
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("click", true, true)
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("mouseup", true, true)
    element.dispatchEvent(clickEvent);
}

// inject styles
$('head').append('<style type="text/css">' +
	'.feed-item-dismissal-notices { display:none; }' + // hide removed from feed notices 
	'.bcRemoveButton {' +
		'cursor:pointer;' +
		'opacity:.45;' +
		'position:absolute; top:10px; right:30px; display:none;' +
	'}' +
	'.feed-item-container:hover .bcRemoveButton { display:block; }' +
	'.bcRemoveButton:hover { opacity:.6; }' +
	'</style>');

function getRemoveTrigger(postElem) {
	var removeTrigger = $('.yt-uix-button-menu li:first span:first', postElem);
	if(removeTrigger.size() == 1) {
		return removeTrigger;	
	}
	return false;
			
}

function removePost(postElem) {
	var removeTrigger = getRemoveTrigger(postElem);
	simulateClick(removeTrigger[0]);
}

function injectButton(postElem) {
	
	if(!postElem.className.match(/buttonEnabled/)) {
		postElem.className += ' buttonEnabled';
		var removeTrigger = getRemoveTrigger(postElem);
		if(removeTrigger) {
			var src = chrome.extension.getURL('close_16_r8.png');
			$('.feed-item-action-menu', postElem).before('<img src="' + src + '" class="bcRemoveButton" title="Remove from your feed"/>');
			$('.bcRemoveButton', postElem).click(function() {
				removePost(postElem);
			});
		}
		//console.log(removeTrigger);
		
	}
	
};

function injectButtonsIntoPosts() {
	// draw mute button for existing posts
	$(feedItemSelector).each(function() {
		injectButton(this);
	});
}
injectButtonsIntoPosts();

var feedItemSelector = '#feed .feed-item-container';

// trigger re-checking all posts when any new post is first moused over 
$(feedItemSelector).live('mouseover', function() {
	injectButtonsIntoPosts();
});

// remove all watched button
$('.feed-header .feed-manage-link').after('<a id="bcRemoveAll" class="yt-uix-button  feed-manage-link secondary-nav yt-uix-sessionlink yt-uix-button-epic-nav-item">Remove All Watched</a>');
$('#bcRemoveAll').click(function() {
	$(feedItemSelector).each(function() {
		var postElem = $(this);
		if($('.feed-thumb-watched', postElem).size() > 0) {
			removePost(postElem);
		}
	});
});
