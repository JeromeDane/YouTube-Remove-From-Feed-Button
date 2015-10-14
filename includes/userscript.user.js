// ==UserScript==
// @name           Remove From Feed for YouTube
// @description    Easily remove items from your YouTube subscription feed with a single click
// @author         Jerome Dane <jeromedane.com>
// @website        https://chrome.google.com/webstore/detail/remove-from-feed-for-yout/ogclfblkiagkkfpdbbbphchgfkieecml
// 
// @include        http://www.youtube.com/feed/*
// @include        https://www.youtube.com/feed/*
// 
// Please report any bugs or issues to https://github.com/JeromeDane/YouTube-Remove-From-Feed-Button/issues
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

// configuration variables
var feedItemSelector = '#browse-items-primary .feed-item-container';


function simulateClick(element) {
	
    var clickEvent;
    clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mouseup", true, true);
    element.dispatchEvent(clickEvent);
}

// inject styles
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.feed-item-dismissal-notices { display:none; }' + // hide removed from feed notices 
	'.bcRemoveButton {' +
		'cursor:pointer;' +
		'opacity:.45;' +
		'position:absolute; top:0; right:30px; display:none; padding:3px' +
	'}' +
	'.feed-item-container:hover .bcRemoveButton { display:block; }' +
	'.bcRemoveButton:hover { opacity:.6; }';
document.getElementsByTagName('head')[0].appendChild(style);

function getRemoveTrigger(postElem) {
	var removeTrigger = postElem.querySelector('.dismiss-menu-choice');
	return removeTrigger;
}

function removePost(postElem) {
	var removeTrigger = getRemoveTrigger(postElem);
	simulateClick(removeTrigger);
	postElem.remove();
	// hack to auto load images for vids as they come into view
	var x = window.scrollX;
	var y = window.scrollY;
	window.scroll(x,y+1);
	setTimeout(function() {
		window.scroll(x,y);
	},50);
}


// create a new button element in the document
function createNewButtonElement() {
	var src = chrome.extension.getURL('images/close_16_r8.png');
	var button = document.createElement('img');
	button.src = src;
	button.className = 'bcRemoveButton';
	button.title = "Remove this item from your subscription feed";
	return button;
}

// inject a remove button into a post
function injectButton(postElem) {
	if(!postElem.className.match(/buttonEnabled/)) {
		postElem.className += ' buttonEnabled';
		var removeTrigger = getRemoveTrigger(postElem);
		if(removeTrigger) {
			var actionMenuElem = postElem.querySelector('.feed-item-action-menu');
			var button = createNewButtonElement();
			actionMenuElem.parentNode.insertBefore(button, actionMenuElem);
			button.onclick = function() {
				removePost(postElem);
			};
		}
	}
};

// draw mute button for existing posts
function injectButtonsIntoPosts() {
	var videoElements = document.querySelectorAll(feedItemSelector);
	for(var i = 0; i < videoElements.length; i++) {
		injectButton(videoElements[i]);
	}
}
injectButtonsIntoPosts();

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
