var click = require('simulate-click-js');

function RemoveFeedFromYouTube() {
	
	// configuration variables
	var removeButtonClass = 'bcRemoveButton';
	var feedItemContainerClass = 'feed-item-container';
	var feedWrapperSelector = '#browse-items-primary > ol';
	var feedItemSelector = feedWrapperSelector + ' .' + feedItemContainerClass;

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
		click(removeTrigger);
		postElem.remove();
		triggerAutoLoad();
	}

	// create a new button element in the document
	function createNewButtonElement() {
		var src = require('./images/close_16_r8.png');
		var button = document.createElement('img');
		button.src = src;
		button.className = removeButtonClass;
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


	// listen for new videos in the DOM and add the remove button as necessary
	function listenForNewVideos() {
		
		var target = document.querySelector(feedWrapperSelector);

		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				for(var i = 0; i < mutation.addedNodes.length; i++) {
					var  node = mutation.addedNodes[i];
					if(node.querySelector) {
						var item = node.querySelector('.' + feedItemContainerClass);
						if(item) {
							injectButton(item);
						}
					}
				}
			});
		});
		
		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true }

		// pass in the target node, as well as the observer options
		observer.observe(target, config);
		
	}

/*
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
		injectButtonsIntoPosts();
		listenForNewVideos();
		console.log('Remove from feed for YouTube successfully initialized');
	}
	
	return {
		init: init
	};
}

module.exports = RemoveFeedFromYouTube;