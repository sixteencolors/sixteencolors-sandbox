$(document).ready(function () {
	var
		pack = '27inch04'
		, handler = null
		, page = 1
		, isLoading = false
		, apiURL = 'http://api.sixteencolors.net/v0/'
		// layout options
		, options = {
			container: $('#pack_contents')
			, gutter: 16
			, columnWidth: 176
		}
	;

	// prev/next bindings
	$('#cbox_prev').bind('click', $.colorbox.prev);
	$('#cbox_next').bind('click', $.colorbox.next);

	// handle window resizing
	$(window).bind('resize', onResize);

	// force resize event once
	onResize();

	// Lock body of page to not scroll
	$(document).bind('cbox_open', function () {
		$('html').css({ overflow: 'hidden' });
	}).bind('cbox_closed', function () {
		$('html').css({ overflow: 'auto' });
	});

	// capture hash change
	$(window).bind('hashchange', onHashChange);

	// Capture scroll event.
	// $(document).bind('scroll', onScroll);

	// Load first data from the API.
	if (! onHashChange()) {
		// no hash passed; load default pack
		loadData();
	}

	/**
	 * Refreshes the layout.
	 */

	function applyLayout() {
		var howmany = 0;
		clearProgress();

		options.container.imagesLoaded(function (instance) {
			$('#progress').hide();
			$('#pack_contents ul').css('left', 'auto');

			options.container.masonry({
				itemSelector: 'li:not(.stamp)'
				, stamp: '.stamp'
				, gutter: 16
			});

			var msnry = options.container.data('masonry');

			$('#pack_contents ul').css('text-indent', 'auto');
			// Create a new layout handler when images have loaded.
			handler = $('#pack_contents ul li');

			for (var i = 0, len = instance.images.length; i < len; i++ ) {
				var image = instance.images[i];
			}

			$('a', handler).colorbox({
				rel: 'lightbox'
				, photo: true
				, opacity: 0.9
				, height: '100%'
				, maxWidth: '100%'
				, scalePhotos: false
				, transition: 'fade'
				, title: function () {
					return $(this).find('label span').html();
				}
				, onLoad: function () {
					$('#cbox_prev, #cbox_next').fadeOut(200);
				}
				, onCleanup: function() {
					$('#cbox_prev, #cbox_next').fadeOut(200);
				}
				, onComplete: function () {
					// resize window for scrollers
					var adjustment = 0;

					if ($('#cboxLoadedContent').height() < $('#cboxLoadedContent img').height()) {
						var boxheight = $('#cboxLoadedContent').height();

						if ($('#colorbox').width() + 20 > $(window).width()) {
							$.colorbox.resize({ width: $(window).width(), height: '100%' });
						} else {
							//$.colorbox.resize({ innerWidth: $('#cboxLoadedContent img').width() + 20, height: '100%' });
							$('#cboxLoadedContent')
								.each(function() { $(this).width($(this).width() + 20); })
								.css({ 'margin-left': '-11px' })
							;
						}

						adjustment = 10;
					}

					// block-shaded representation of image's position in pack
					var
						$cur = $('#cboxCurrent')
						, bar = ''
						, barWidth = 10
						, count = 0
						, prog = /(\d+)\D+(\d+)/i.exec($cur.html())
						, pct = Math.round(prog[1] / prog[2] * barWidth)
					;

					for (; count < pct - 1; count++) {
						bar += '\xb2';
					}

					bar += '\xb1';
					count++;

					for (; count < barWidth; count++) {
						bar += '\xb0';
					}

					$cur.html(bar + ' ' + prog[1] + '/' + prog[2]);

					// prev/next images
					var prev, next;

					// prev: either prev or last in set
					prev = $.colorbox.element().parent().prev('li').find('img');
					if (prev.length == 0) prev = $('ul.pack li:last img');
					// next: either next or first in set
					next = $.colorbox.element().parent().next('li').find('img');
					if (next.length == 0) next = $('ul.pack li:first img')
					// set their background images/titles and show 'em
					$('#cbox_prev')
						.css({ background: 'url(' + prev.attr('src') + ')' })
						.attr('title', 'Previous: ' + prev.siblings('label').find('span').html())
					;
					$('#cbox_next')
						.css({ background: 'url(' + next.attr('src') + ')' })
						.attr('title', 'Next: ' + next.siblings('label').find('span').html())
					;
					$('#cbox_prev, #cbox_next').fadeIn(200);
					// recalculate prev/next alignment in case new image size is different than last
					alignControls(adjustment);
				}
			});

			msnry.layout();
			// restore cursor and overflow now that we're loaded
			$('html').css({ cursor: 'default', overflow: 'auto' });
		})
		.progress(function(instance, image) {
			// block-shaded progress bar
			var pct = Math.round(++howmany / instance.images.length * 50);

			if (image.isLoaded) {
				var $which = $('#progress span:first');

				for (var a = 0; a < pct - 1; a++) {
					$which.html('\xb2');
					$which = $which.next('span');
				}

				$which.html('\xb1');
			}

			var result = image.isLoaded? 'loaded' : 'broken';
		});

	}

	function clearProgress() {
		var bar = '';

		for (var a = 0; a < 50; a++) bar += '<span data-loaded="0">\xb0</span>';
		$('#progress').html(bar + '<br />Loading...');
		$('html').css({ cursor: 'progress', overflow: 'hidden' });
	}

	function loadData() {
		isLoading = true;
		$('#loaderCircle').show();

		// stub data
		/* @DEBUG */ onLoadPack({"pack_file_location":"/static/packs/2003/27inch01.zip","files":[{"fullsize":"/pack/27inch01/27INCH.ANS/fullscale","thumbnail":"/pack/27inch01/27INCH.ANS/preview","filename":"27INCH.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/27INCH.ANS/download","uri":"/pack/27inch01/27INCH.ANS"},{"fullsize":"/pack/27inch01/27INFO.ANS/fullscale","thumbnail":"/pack/27inch01/27INFO.ANS/preview","filename":"27INFO.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/27INFO.ANS/download","uri":"/pack/27inch01/27INFO.ANS"},{"fullsize":"/pack/27inch01/43E0-IS.ANS/fullscale","thumbnail":"/pack/27inch01/43E0-IS.ANS/preview","filename":"43E0-IS.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/43E0-IS.ANS/download","uri":"/pack/27inch01/43E0-IS.ANS"},{"fullsize":"/pack/27inch01/AVG-27.ANS/fullscale","thumbnail":"/pack/27inch01/AVG-27.ANS/preview","filename":"AVG-27.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/AVG-27.ANS/download","uri":"/pack/27inch01/AVG-27.ANS"},{"fullsize":"/pack/27inch01/E0-COL1.ANS/fullscale","thumbnail":"/pack/27inch01/E0-COL1.ANS/preview","filename":"E0-COL1.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/E0-COL1.ANS/download","uri":"/pack/27inch01/E0-COL1.ANS"},{"fullsize":"/pack/27inch01/E0-OUTZ.ANS/fullscale","thumbnail":"/pack/27inch01/E0-OUTZ.ANS/preview","filename":"E0-OUTZ.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/E0-OUTZ.ANS/download","uri":"/pack/27inch01/E0-OUTZ.ANS"},{"fullsize":"/pack/27inch01/FILE_ID.DIZ/fullscale","thumbnail":"/pack/27inch01/FILE_ID.DIZ/preview","filename":"FILE_ID.DIZ","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/FILE_ID.DIZ/download","uri":"/pack/27inch01/FILE_ID.DIZ"},{"fullsize":"/pack/27inch01/QZE0-TSG.ANS/fullscale","thumbnail":"/pack/27inch01/QZE0-TSG.ANS/preview","filename":"QZE0-TSG.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/QZE0-TSG.ANS/download","uri":"/pack/27inch01/QZE0-TSG.ANS"},{"fullsize":"/pack/27inch01/TCF-PLAG.ANS/fullscale","thumbnail":"/pack/27inch01/TCF-PLAG.ANS/preview","filename":"TCF-PLAG.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/TCF-PLAG.ANS/download","uri":"/pack/27inch01/TCF-PLAG.ANS"},{"fullsize":"/pack/27inch01/TCF-RHN.ANS/fullscale","thumbnail":"/pack/27inch01/TCF-RHN.ANS/preview","filename":"TCF-RHN.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/TCF-RHN.ANS/download","uri":"/pack/27inch01/TCF-RHN.ANS"},{"fullsize":"/pack/27inch01/US-27I.ANS/fullscale","thumbnail":"/pack/27inch01/US-27I.ANS/preview","filename":"US-27I.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/US-27I.ANS/download","uri":"/pack/27inch01/US-27I.ANS"},{"fullsize":"/pack/27inch01/US-EXILE.ANS/fullscale","thumbnail":"/pack/27inch01/US-EXILE.ANS/preview","filename":"US-EXILE.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/US-EXILE.ANS/download","uri":"/pack/27inch01/US-EXILE.ANS"},{"fullsize":"/pack/27inch01/US-FLASH.ANS/fullscale","thumbnail":"/pack/27inch01/US-FLASH.ANS/preview","filename":"US-FLASH.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/US-FLASH.ANS/download","uri":"/pack/27inch01/US-FLASH.ANS"},{"fullsize":"/pack/27inch01/US-ROHAN.ANS/fullscale","thumbnail":"/pack/27inch01/US-ROHAN.ANS/preview","filename":"US-ROHAN.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/US-ROHAN.ANS/download","uri":"/pack/27inch01/US-ROHAN.ANS"},{"fullsize":"/pack/27inch01/US-SENSE.ANS/fullscale","thumbnail":"/pack/27inch01/US-SENSE.ANS/preview","filename":"US-SENSE.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/US-SENSE.ANS/download","uri":"/pack/27inch01/US-SENSE.ANS"},{"fullsize":"/pack/27inch01/US-TMNS.ANS/fullscale","thumbnail":"/pack/27inch01/US-TMNS.ANS/preview","filename":"US-TMNS.ANS","pack":{"filename":"27inch01.zip","name":"27inch01","uri":"/pack/27inch01"},"file_location":"/pack/27inch01/US-TMNS.ANS/download","uri":"/pack/27inch01/US-TMNS.ANS"}],"month":null,"name":"27inch01","uri":"/pack/27inch01","filename":"27inch01.zip","groups":[],"year":2003}); return;
		
		$.ajax({
			url: apiURL + 'pack/' + pack
			, dataType: 'jsonp'
			// , data: {page: page} // Page parameter to make sure we load new data
			, success: onLoadPack
		});
	}

	function generatePackHtml(data) {
		var html = '<h1>' + data.name + ', ' + data.year + '</h1>';
		html += '<div id="progress">Loading</div><ul class="pack">';
		html += '<img src="http://sixteencolors.net/pack/' + data.name + '/preview" class="stamp" />';

		var
			i = 0
			, length = data.files.length
			, image
		;

		for (; i < length; i++) {
			image = data.files[i];
			cssClass = '';

			if (/\.bin/i.test(image.filename)) {
				cssClass = 'bin';
			}

			html += '<li class="' + cssClass + '"><a href="http://sixteencolors.net' + image.fullsize + '" rel="lightbox">';
			html += '<img src="http://sixteencolors.net' + image.thumbnail + '" alt="' + image.filename + '" />';
			html += '<label><span>' + image.filename + '</span></label>';
			html += '</a></li>';
		}

		html += '</ul>';

		// Add image HTML to the page.
		$('#pack_contents').append(html);

		// Apply layout.
		applyLayout();
	}

	function alignControls(adjustment) {
		// vertically center the next/prev elements
		$('#cbox_prev, #cbox_next').css({
			top: Math.round($(window).height() / 2) - Math.round($('#cbox_prev').height() / 2) + 'px'
		});

		// horizontally
		$('#cbox_prev').css({
			left: Math.round($(window).width() / 2 - $('#colorbox').width() / 2 - $('#cbox_prev').width() - (typeof adjustment == 'undefined' ? 0 : adjustment)) + 'px'
		});
		$('#cbox_next').css({ right: $('#cbox_prev').position().left + 'px' });
	}

	/**
	 * When has changes, load a new pack
	 */

	function onHashChange (event) {
		var hash = $(window.location).attr('hash').split('/');
		/* @DEBUG */ hash = 'pack/27inch01';

		if (hash.length > 1) {
			pack = hash[1];

			// if there's masonry, tear it down first
			if ($('#pack_contents h1').length > 0) {
				options.container.masonry('destroy');
				$('#pack_contents').html('');
			}

			loadData();
			return true;
		}

		return false;
	}

	/**
	 * Receives data from the API, creates HTML for images and updates the layout
	 */

	function onLoadPack(data) {
		isLoading = false;
		$('#loaderCircle').hide();
		generatePackHtml(data);
	}

	/**
	 * Handle window resizing
	 */

	function onResize() {
		// reload colorbox if currently shown
		if($('#colorbox').length && $('#colorbox').css('display') != 'none') {
			var el = $.colorbox.element();
			$(el).click();
		}
	}

	/**
	 * When scrolled all the way to the bottom, add more tiles.
	 */

	function onScroll(event) {
		// Only check when we're not still waiting for data.
		if (!isLoading) {
			// Check if we're within 100 pixels of the bottom edge of the broser window.
			var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);

			if (closeToBottom) {
				loadData();
			}
		}
	}
});
