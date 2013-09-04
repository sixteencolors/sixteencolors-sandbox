$(document).ready(function () {
    var pack = '27inch04';
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

    var hash = $(window.location).attr("hash").split('/');

    if (hash.length > 1) {
        pack = hash[1];
    }

    $('a', handler).colorbox({
        rel: 'lightbox',
        photo: true,
        opacity: 0,
        height: '100%',
        title: function () {
            return $(this).siblings('label span').text();
        }
    });

    $(window).on("resize", function(){
    //check if colorbox is open. This 'if' is from stackoverflow, I haven't tested
    if($('#colorbox').length && $('#colorbox').css('display') != 'none') {
        //replace colorboxID with the correct ID colorbox uses
        document.getElementById('cboxContent').style.height=$(window).height();
    }
});

    // Lock body of page to not scroll
    
    $(document).bind('cbox_open', function () {
        $('html').css({ overflow: 'hidden' });
    }).bind('cbox_closed', function () {
        $('html').css({ overflow: 'auto' });
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
        /* var container = $('#pack_contents');
        container.imagesLoaded(function () {
            var msnry = container.masonry({
                //options
                itemSelector: 'li:not(.stamp)',
                gutter: 16
            });   
        }); */

        clearProgress();

        options.container.imagesLoaded(function (instance) {
            $('#progress').hide();
            $('#pack_contents ul').css('left', 'auto');
            options.container.masonry({
                    //options
                    itemSelector: 'li:not(.stamp)',
                    stamp: '.stamp',
                    gutter: 16
                });  

            var msnry = options.container.data('masonry');

            $('#pack_contents ul').css("text-indent", "auto");
            // Create a new layout handler when images have loaded.
            handler = $('#pack_contents ul li');
            
            for (var i = 0, len = instance.images.length; i < len; i++ ) {
                var image = instance.images[i];
            }

            $('a', handler).colorbox({
              rel: 'lightbox', 
                photo: true,
                opacity: 0.9,
                height: $(window).height(), 
                scalePhotos: false,
                title: function() {
                    return $(this).siblings('label span').text();
                }
            });

            msnry.layout();
        })
        .progress(function(instance, image) {
            if (image.isLoaded) {
                $('<span>.</span>').appendTo('#progress')
                


            }
            var result = image.isLoaded? 'loaded' : 'broken';
        });
        
    }

    function clearProgress() {
        $('#progress').text('Loading');
    }

    function loadData() {
        isLoading = true;
        $('#loaderCircle').show();

        $.ajax({
            url: apiURL + 'pack/' + pack,
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

    $.preload = function() {
        this.each(function() {
            $('<img/>'[0].src = this);
        });
    }

    function generatePackHtml(data) {
        var html = '<h1>' + data.name + ', ' + data.year + '</h1>';
        html += '<div id="progress">Loading</div><ul class="pack">';
        html += '<img src="http://sixteencolors.net/pack/' + data.name + '/preview" class="stamp" />';
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
            html += '<label><span>' + image.filename + '</span></label>';
            html += '</a></li>';

        }

        html += '</ul>';

        // Add image HTML to the page.
        $('#pack_contents').append(html);

        // Apply layout.
        applyLayout();
    }

    /**
     * Receives data from the API, creates HTML for images and updates the layout
     */

    function onLoadPack(data) {
        isLoading = false;
        $('#loaderCircle').hide();

        generatePackHtml(data);

        /* for (; i < length; i++) {
            $.preload({ 'http://sixteencolors.net' + data.files[i].image.thumbnail });
        } */
        
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