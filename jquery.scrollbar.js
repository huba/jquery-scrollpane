(function($){
	$.fn.scrollbar = function(options){
		
		if (this.length > 1){
			return this.each(function(){
				$(this).scrollbar(options);
			});
		}
		
		var scrollbar = this;
		
		var $container, $content, $vScrollBar, $hScrollBar, $vHandle, $hHandle;
		
		var defaults = {
			'horizontalSide' : 'bottom',
			'verticalSide': 'right',
			'axis' : 'vertical',
			'autoDimension': false,
			'hHandleRatio' : 0,
			'vHandleRatio' : 0,
			'horizontalScroll' : false,
			'verticalScroll' : false,
			'autoHide' : true,
			'hiddenOpacity' : 0.08,
			'visibleOpacity' : 1
		};
		
		var settings = $.extend(defaults, options);
		
		//Private functions
		var initialize = function(){
			$container = $(scrollbar);
			$content = $container.find('.content');
		
			setProperties();
			insertDOM();
			setDimensions();
			bindEvents();
			return scrollbar;
		};
		
		var setProperties = function(){
			/**
			*Reads the plugin settings and converts them into properties
			**/
			
			//Resets the axis
			settings['verticalScroll'] = false;
			settings['horizontalScroll'] = false;
			
			//Sets the apropriate axis to true
			if (settings['axis'] == 'vertical'){
				settings['verticalScroll'] = true;
			} else if (settings['axis'] == 'horizontal'){
				settings['horizontalScroll'] = true;
			} else if (settings['axis'] == 'both'){
				settings['verticalScroll'] = true;
				settings['horizontalScroll'] = true;
			} else {
				$.error('jQuery.scrollbar: Invalid axis value: ' + settings['axis'])
			}
		};
		
		var insertDOM = function(){
			/**
			*This function inserts the elements for the scrollbar into the html.
			**/
			
			$container.addClass('container');
			
			if (settings['verticalScroll'] == true){
				var $bar = $('<div class="verticalScrollbar"><div class="scrollTrack"></div><div class="scrollHandle"></div></div>');
				$container.append($bar);
				$vScrollBar = $container.find('.verticalScrollbar');
				$vHandle = $vScrollBar.find('.scrollHandle');
				$vHandle.draggable({
					axis : 'y',
					containment : 'parent'
				});
				if (settings['verticalSide'] == 'right'){
					$vScrollBar.css({right: '0px'});
					$vScrollBar.find('.scrollTrack').css({right: '0px'});
				} else if (settings['verticalSide'] == 'left'){
					$vScrollBar.css({left: '0px'});
					$vScrollBar.find('.scrollTrack').css({left: '0px'});
				} else{
					$.error('jQuery.scrollbar: Invalid verticalSide value: ' + settings['verticalSide']);
				}
			} else {
				$content.css({height: '100%'});
				if (settings['autoDimenson'] == true){
					$container.css({height: 'auto'});
				}
			}
			
			if (settings['horizontalScroll'] == true){
				$container.append('<div class="horizontalScrollbar"><div class="scrollTrack"></div><div class="scrollHandle"></div></div>');
				$hScrollBar = $container.find('.horizontalScrollbar');
				$hHandle = $hScrollBar.find('.scrollHandle');
				$hHandle.draggable({
					axis : 'x',
					containment : 'parent'
				});
				if (settings['horizontalSide'] == 'top'){
					$hScrollBar.css({top: '0px'});
					$hScrollBar.find('.scrollTrack').css({top: '0px'});
				} else if (settings['horizontalSide'] == 'bottom'){
					$hScrollBar.css({bottom: '0px'});
					$hScrollBar.find('.scrollTrack').css({bottom: '0px'});
				} else {
					$.error('jQuery.scrollbar: Invalid horizontalSide value: ' + settings['horizontalSide']);
				}
			} else {
				$content.css({width: '100%'});
				if (settings['autoDimenson'] == true){
					$container.css({width: 'auto'});
				}
			}
		};
		
		var setDimensions = function(){
			/**
			*Calculates the dimensions for the handle in order to properly represent the ratio of content height 
			* and container height.
			**/
			
			if (settings['verticalScroll'] == true){
				settings['vHandleRatio'] = $content.height() / $vScrollBar.height();
				$vHandle.css({height: $vScrollBar.height() / settings['vHandleRatio']});
			}
			
			if (settings['horizontalScroll'] == true){
				settings['hHandleRatio'] = $content.width() / $hScrollBar.width();
				$hHandle.css({width: $hScrollBar.width() / settings['hHandleRatio']});
			}
		};
		
		var bindEvents = function(){
			if (settings['verticalScroll'] == true){
				$content.bind('mousewheel', function(e, d){
					e.preventDefault();
					for (i = 0; i < 5; i++){
						if (($vHandle.position().top > 0 | d < 0) && ($vHandle.position().top < $container.height() - $vHandle.height() | d > 0)){
							$vHandle.css({top: (-d + ($vHandle.position().top))});
							//$vHandle.parent().fadeTo('slow', 0.4);
						}
					}
					updatePosition('y');
					//$vHandle.parent().fadeTo('slow', settings['hiddenOpacity']);
				});
			
				$vHandle.bind('drag', function(){
					updatePosition('y');
				}).bind('mouseenter', function(e){
					$(this).parent().stop().fadeTo('slow', settings['visibleOpacity']);
				}).bind('mouseleave', function(e){
					$(this).parent().stop().fadeTo('slow', settings['hiddenOpacity']);
				}).parent().fadeTo('slow', settings['hiddenOpacity']);
			}
			
			if (settings['horizontalScroll'] == true){
				$hHandle.bind('drag', function(){
					updatePosition('x');
				}).bind('mouseenter', function(e){
					$(this).parent().stop().fadeTo('slow', settings['visibleOpacity']);
				}).bind('mouseleave', function(e){
					$(this).parent().stop().fadeTo('slow', settings['hiddenOpacity']);
				}).parent().fadeTo('slow', settings['hiddenOpacity']);
			}
		};
		
		var updatePosition = function(axis){
			if (axis == 'y'){
				$content.css({top: -($vHandle.position().top * settings['vHandleRatio'])});
			} else if (axis == 'x'){
				$content.css({left: -($hHandle.position().left * settings['hHandleRatio'])});
			}
		};
		
		//Public functions
		this.scrollTo = function(x, y){
			//TODO: think about this.
		};
		
		return initialize();
	}
})(jQuery);