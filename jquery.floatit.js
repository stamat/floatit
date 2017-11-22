(function ($) {
	$.fn.floatit = function(params) {
	  	var $floater = this;
	    var $limiter = null;
	    var $container = null;
	    var top_mod = 0;
	    var bottom_mod = 0;
	    var $top_mod_elem = null;
	    var preserve_width = false;
	   	var bottomTopOffest = function(elem) {
	    	return $(elem).first().offset().top;
	    };
	    var timeout = null;
	    var recalculate = false;

	    if (!$floater.length) {
	        return;
	    }

	    if ($floater.outerHeight(true) >= $floater.parent().height()) {
	        return;
	    }

		if($floater.data('fltr')) {
			return this;
		}

	    params = params || {};

	    if (params.hasOwnProperty('limiter')) {
	    	$limiter = $(params.limiter);
	    }

	    if (params.hasOwnProperty('top_spacing')) {
	    	top_mod = params.top_spacing;
	    }

	    if (params.hasOwnProperty('top_spacing_elem')) {
	    	$top_mod_elem = $(params.top_spacing_elem);
	    }

	    if (params.hasOwnProperty('bottom_spacing')) {
	    	bottom_mod = params.bottom_spacing;
	    }

	    if (params.hasOwnProperty('preserve_width')) {
	    	preserve_width = params.preserve_width;
	    }

	    if (params.hasOwnProperty('limit_fn')) {
	    	bottomTopOffest = params.limit_fn;
	    }

	    if (params.hasOwnProperty('recalculate')) {
	    	recalculate = params.recalculate;
	    }

	    if (params.hasOwnProperty('timeout')) {
	    	timeout = params.timeout;
	    }

	    if (params.hasOwnProperty('container')) {
	    	$container = $(params.container);
	    }

	    function fromTop($elem, top, limit, mod) {
	        if (top + mod >= limit) {
	            $elem.css({
	                'top': mod,
	                'position': 'fixed'
	            });
	        } else {
	            $elem.css({
	                'top': limit,
	                'position': 'absolute'
	            });
	        }
	    }

	    $floater.addClass('floating');

	    var topLimit = null;
	    var bottomLimit = null;
	    var off = null;
	    var floater_h = null;

	    function updateInitialOffset() {
	        off = $('#floater-dummy').offset();
	        $floater.data('fltr_offset', off);
	    }

	    var calculateFloatInitials = function() {
	        off = $floater.offset();
	        floater_h = $floater.outerHeight(true);
	        topLimit = off.top;
	        $floater.data('fltr_offset', off);
	        $floater.data('fltr_parent', $floater.parent());

	        var css = {
	            'top': off.top,
	            'left': off.left,
	            'position': 'absolute'
	        };

	        if (preserve_width) {
	            css.width = $floater.outerWidth();
	        }

	        $floater.css(css);

	        if ($limiter && $limiter.length) {
	            bottomLimit = bottomTopOffest($limiter) - bottom_mod;
	        }

	        $floater.parent().append('<div id="floater-dummy" />');

	        $floater.detach();
	        if ($container) {
	            $container.css('position', 'relartive').append($floater);
	        } else {
	            $('body').append($floater);
	        }

	    };

	    function topModCalc() {
	        var tm = top_mod;
	        if ($top_mod_elem) {
	            tm = $top_mod_elem.outerHeight(true) + top_mod;
	        }

	        return tm;
	    }

	    var onscroll = [];

	    onscroll[0] = function () {
	        if (!$floater.hasClass('floating')) {
	            return;
	        }
	        var top = $(document).scrollTop();
	        var tm = topModCalc();
	        fromTop($floater, top, off.top, tm);
	    };

	    onscroll[1] = function() {
	    	if (!$floater.hasClass('floating')) {
	            return;
	        }

	        var tm = topModCalc();
	        var top = $(document).scrollTop();
	        var cp = top + floater_h  + tm;

	          if (cp >= bottomLimit) {
	            $floater.css({
	              'top': bottomLimit-floater_h,
	              'position': 'absolute'
	            });
	          } else {
	            fromTop($floater, top, off.top, tm);
	          }
	    };

	    onscroll[2] = function() {
		    if (!$floater.hasClass('floating')) {
	            return;
	        }

	        if ($top_mod_elem.length) {
	            updateInitialOffset();
	        }

	        var limit = bottomTopOffest($limiter) - bottom_mod;
	        var top = $(document).scrollTop();
	        var h = $floater.outerHeight(true);

	        var tm = topModCalc();
	        var cp = top + h + tm;

	        if (cp >= limit) {
	            $floater.css({
	                'top': limit - h,
	                'position': 'absolute'
	            });
	        } else {
	            fromTop($floater, top, off.top, tm);
	        }
	    };

	    var recalc = function () {
	        if (!$floater.hasClass('floating')) {
	            return;
	        }

	  	    $floater.detach();
	        $($floater.data('fltr_parent')).append($floater);
	        $floater.attr('style', '');

	        calculateFloatInitials();
			var scroll_fn_id = 0;
            	if (bottomLimit) {
                	scroll_fn_id = recalculate ? 2 : 1;
            	}
			onscroll[scroll_fn_id]();
	  	};

	  	function __init__() {
	      	calculateFloatInitials();

	      	$(window).resize(recalc);

	      	var scroll_fn_id = 0;
	      	if (bottomLimit) {
	          	scroll_fn_id = recalculate ? 2 : 1;
	      	}
	      	$(document).scroll(onscroll[scroll_fn_id]);
	      	onscroll[scroll_fn_id]();
	  	}

	  	if (timeout) {
	    	setTimeout(__init__, timeout);
	  	} else {
	      __init__();
	  	}

		return this;
	};

  	$.fn.sinkit = function(params) {
  		var $floater = this;
  		$floater.removeClass('floating');
    	$floater.detach();
		$('#floatit-dummy').remove();
	    $floater.data('fltr', false);
    	$($floater.data('fltr_parent')).append($floater);
    	$floater.attr('style', '');

    	return this;
  	};
})(jQuery);
