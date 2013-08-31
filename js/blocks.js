$(document).ready(function () {
    var pack = 'sense14j';
    var handler = null,
        page = 1,
        isLoading = false,
        apiURL = 'http://api.sixteencolors.net/v0/';

    // Prepare layout options.
    var options = {
        container: $("#pack_contents"),
        gutter: 16,
        columnWidth: 176
    };

    $('a', handler).colorbox({
        rel: 'lightbox',
        photo: true,
        opacity: 0,
        title: function () {
            return $(this).siblings('label').text();
        }
    });


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

    /**
     * Refreshes the layout.
     */

    function applyLayout() {
        var container = $('#pack_contents');
        container.imagesLoaded(function () {
            var msnry = container.masonry({
                //options
                itemSelector: 'li',
                gutter: 16
            });   
        });

        options.container.imagesLoaded(function () {
            // Create a new layout handler when images have loaded.
            handler = $('#pack_contents ul li');
            var msnry = options.container.masonry({
                //options
                itemSelector: 'li',
                gutter: 16
            });   
            
            $('a', handler).colorbox({
              rel: 'lightbox', 
                photo: true,
            opacity: 0,
            title: function() {
                return $(this).siblings('label').text();
            }
            });
        });
        
        
    }

    function loadData() {
        isLoading = true;
        $('#loaderCircle').show();

        $.ajax({
            url: apiURL + '/pack/' + pack,
            dataType: 'jsonp',
            // data: {page: page}, // Page parameter to make sure we load new data
            success: onLoadPack
        });
    }

    function onLoadPacks(data) {
        var i = 0;     
        $.ajax({
            url: 'http://api.sixteencolors.net/v0/pack/' + data[i].name + '?callback=?',
            dataType: 'jsonp',
            success: onLoadPack
        });
    }



    /**
     * Receives data from the API, creates HTML for images and updates the layout
     */

    function onLoadPack(data) {
        isLoading = false;
        $('#loaderCircle').hide();

        // Increment page index for future calls.
        page++;

        // Create HTML for the images.
        var html = '<h1>' + data.name + ', ' + data.year + '</h1><ul class="pack">';
        var i = 0,
            length = data.files.length,
            image;
        for (; i < length; i++) {
            image = data.files[i];
            cssClass = "";
            if (/\.bin/i.test(image.filename)) {
                cssClass = 'bin';
            }
            html += '<li class="' + cssClass + '"><a href="http://sixteencolors.net' + image.fullsize + '" rel="lightbox">';
            html += '<img src="http://sixteencolors.net' + image.thumbnail + '" alt="' + image.filename + '" />';
            html += '<label>' + image.filename + '</label>';
            html += '</a></li>';

        }

        html += '</ul>';

        // Add image HTML to the page.
        $('#pack_contents').append(html);

        // Apply layout.
        applyLayout();
    }

    // Capture scroll event.
    // $(document).bind('scroll', onScroll);

    // Load first data from the API.
    loadData();

    /* $('#pack_contents').imagesLoaded(function() {
        handler = $('#pack_contents ul li');
        handler.wookmark({
            container: $("#pack_contents"), 
            offset: 16, 
            itemWidth: 176,
            // flexibleWidth: 352, 
            autoresize: true, 
            outerOffset: 24,
            container: $("#pack_contents")});
        $('a', handler).colorbox({
              rel: 'lightbox', 
                photo: true,
            opacity: 0,
            title: function() {
                return $(this).siblings('label').text();
            }
            });
    });*/
});