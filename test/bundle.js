/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var click = __webpack_require__(1);

	var RemoveFeedFromYouTube = __webpack_require__(2);

	(new RemoveFeedFromYouTube).init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* 
	 * The MIT License
	 *
	 * Copyright 2015 Jerome Dane <jeromedane.com>.
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */


	module.exports = function(element) {
		
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
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	function RemoveFeedFromYouTube() {
		
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
		function injectStyle() {
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
		}

		function getRemoveTrigger(postElem) {
			var removeTrigger = postElem.querySelector('.dismiss-menu-choice');
			return removeTrigger;
		}

		// hack to auto load images for vids as they come into view
		function triggerAutoLoad() {
			var x = window.scrollX;
			var y = window.scrollY;
			window.scroll(x,y+1);
			setTimeout(function() {
				window.scroll(x,y);
			},50);
		}
		
		function removePost(postElem) {
			var removeTrigger = getRemoveTrigger(postElem);
			simulateClick(removeTrigger);
			postElem.remove();
			triggerAutoLoad();
		}

		// create a new button element in the document
		function createNewButtonElement() {
			var src = __webpack_require__(3);
			console.log(src);
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

	/*
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
	*/
		
		function init() {
			injectStyle();
			injectButtonsIntoPosts();
			console.log('userscript initialized');
		}
		
		return {
			init: init
		};
	}

	module.exports = RemoveFeedFromYouTube;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFNSURBVDiNpdOxalRREAbg717FZBufwiKCglnfICDpZCu7PMbCWp09Nl7Qt7DTZrEzAd8gWSEBLXyP1UKuxf1vuAasdmA4MPPPnH/+M6fp+97Uaq1HOMMcxwlvcYUPpZQfU3wzNqi13sMSaxwkv8s5y/kbBe9LKX+gnRSf4y0avAmDh/F5Yg06nKfG/XRe4gTf8aqUcuNf22Jba/2Ej8Eu0TXr9foI39L9OX5iha6U8isMD8cYHuESPZ61EewgBTcBFmxqrYcp3iS2CqZLzVmb+QQkyS84xef4aWLdHey8NTzVDtcQ2gtc4EX8AotxpGB3OG7taa1B4RmecivYZnLzyGSTnGBn2LaGDRPaDCKOM7+Mj5qs7mCv9n7Gpu97tdaVYQv/t0jS6IlhkR7jdSmlGzfxXeY8wWWttYsO15OZF2HxAF9Ts/9navb9zn8BCnmU7ekAdZMAAAAASUVORK5CYII="

/***/ }
/******/ ]);