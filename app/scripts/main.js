$(document).ready(function () {

    // INITIAL LOADING OF COMPONENTS
    // Firing off all the loading functions
    loadLeftNav();
    loadRightNav();
    loadHeader();
    loadHighlightsNavigation();

    //load initial page
    pageLoad();

    // COMPONENT LOADING
    // Loading the appropriate html snippets into the content areas. These in turn call a set of functions
    // related to the component

    function loadLeftNav() { // Left (main) navigation
        $('.navbar-left').load('components/nav-left.html', function () {
            leftNavFunctions();
        });
    }

    function loadRightNav() { // Right navigation (helpers)
        $('.nav-right').load('components/nav-right.html', function () {
            rightNavFunctions();
        });
    }

    function loadHeader() { // Filters (header) area
        $('.header').load('components/header.html', function () {
            headerFunctions();
        });
    }

    function loadHighlightsNavigation() { // Highlights/navigation and VIN bar area
        $('.highlights-annotations-bar').load('components/highlights-annotations.html', function () {
            pageLoad();
            switchView();
            viewer();
        });
    }

    // COMPONENT FUNCTIONS
    // Functions that run 'inside' of the loaded content. These can be called as a callback of the AJAX load functions.

    function leftNavFunctions() {
        // Navigation arrows
        $('.arrow-back').parent().mouseenter(function () {
            $(this).css('width', '100px');
        }).mouseleave(function () {
            $(this).css('width', '50px');
        });

        // Left hand navigation (main) "fly out" menu
        $('.navbar-left ul li').on('mouseenter mouseleave', function () {
            $(this).find('.secondary-nav').toggleClass('slide-in');
            $(this).find('a').toggleClass('selected');
        });

    }//END left nav functions

    function rightNavFunctions() {
        //Tooltips
        $('.nav-right ul li a, button').tooltip({
            container: 'body'
        });
        //Right navigation click functions
        $('.nav-right ul li a').on('click', function () {

            // Right hand (helpers) "fly out" menu
            $(this).toggleClass('selected');
            $('.nav-right ul li a').not(this).removeClass('selected');

            var displayname = $(this).attr('rel');
            var menuItem = $('.slide-in-menu').find('.' + displayname);


            if (!$(menuItem).hasClass('slide-in')) {
                $(menuItem).addClass('slide-in');
                $('.slide-in-menu').find('.menu-item').not($(menuItem)).removeClass('doc-view').removeClass('slide-in');
            } else {
                $(menuItem).removeClass('slide-in').removeClass('doc-view');
            }

            // Expanding 'tags' preview 
            $('#tagswitch').on('click', function () {
                $(this).parents().find('.menu-item').end().toggleClass('doc-view');
            });

        });
    }//END right nav functions

    function headerFunctions() {
        // Change to dual view
        $('#comm-draft, button.close').click(function () {
            $('.container-main').toggleClass('dual-screen');
            if ($('.container-main').hasClass('dual-screen')) {
                $('.annotation .glyphicon').popover({
                    placement: 'left',
                    container: 'body',
                    title: 'Clarity – Claim 20',
                    content: 'The term particular criteria used in claim 20 is vague and unclear'
                });
            }
        });

        // Destroy popover on dual screen close
        $('button.close').click(function () {
            $('body').popover('destroy');
        });

        // Toggle/switch for titles and filters
        $('.btn-multi-toggle .btn, .btn-toggle .btn').click(function (e) {
            $(this).toggleClass('btn-primary active');
            $(this).parent().find('.btn').not(this).addClass('btn-default').removeClass('btn-primary active');
            e.preventDefault();
        });

        // Custom dropdown for filters
        $('.filter-trigger').click(function (event) {
            $('.dropdown-filter-group').toggleClass('visible');
            //stop propogation to the doc body
            event.stopPropagation();
        });
        $(document).click(function (event) { //click outside window

            if (!$(event.target).closest('.dropdown-filter-group').length) {
                if ($('.dropdown-filter-group').is(':visible')) {
                    $('.dropdown-filter-group').toggleClass('visible');
                }
            }
        });

    } //END header functions


    //Switch between 'page layout' and 'screen reading'
    function switchView() {
        $('.trigger-page-layout').on('click', function () {
            // Change the title of the dropdown that triggers the switch
            $(this).parent().parent().parent().find('.dropdown-toggle').html('<span class="glyphicon glyphicon-list"></span> Page layout <b class="caret"></b>');
            // Display or hide
            $('.page-layout').show();
            $('.screen-reading').hide();
        });

        $('.trigger-screen-reading').on('click', function () {
            // Change the title of the dropdown that triggers the switch
            $(this).parent().parent().parent().find('.dropdown-toggle').html('<span class="glyphicon glyphicon-eye-open"></span> Screen reading <b class="caret"></b>');
            $('.screen-reading').show();
            $('.page-layout').hide();
        });
    }//END function switchView()

    function viewer() {
        var docHeight = $('#view-screen-reading').height();
        console.log('docHeight: ' + docHeight);
    }

    //GENERAL

    //Beginning of 'on-object menu'

    $('.oo-menu').hide();

    $('#anchor').on('click', function () {
        var pos = $(this).offset();
        var posLeft = pos.left;
        var posTop = pos.top;
        var width = $(this).width();

        $('.oo-menu').toggle().css('left', (posLeft + width + 10)).css('top', posTop);
    });

    $('.oo-menu li a').on('mouseenter mouseleave', function () {
        secondary = $(this).attr('href');
        $(secondary).show();
        $('.oo-menu').find('div').not($(secondary)).hide();
    });

});