$(document).ready(function () {
	 
	// INITIAL LOADING OF COMPONENTS
	// Firing off all the loading functions
	loadLeftNav();
	loadRightNav();
	
	// COMPONENT LOADING
	// Loading the appropriate html snippets into the content areas. These in turn call a set of functions 
	// related to the component
	
	function loadLeftNav(){ // Left (main) navigation
		$('.navbar-left').load('components/nav-left.html', function(){
			leftNavFunctions();
			$('a[title="Search"]').on('click', function(){
				$('.container-main').load('views/search.html', function(){
					//load search history fly out
					$('.pull-out a.pull').on('click', function(){
						$('.pull-out').toggleClass('slide-in');
						$('.container-main').toggleClass('nudge');
						
						if($('.search-content').hasClass('shrink')){
							$('.search-content').toggleClass('shrink');
							$('.pull-out').toggleClass('expand');
							$('.dashboard').toggle(400);
						}
						
						//var pop = ''
						
						pop = function(){
								theid = $(this).attr("rel");
								$('#pop').load('includes/popover.html');
								return $('#pop').html();						
							  }
						
						$('.search-term').popover({
					    	placement:'right',
					    	content: pop,
					    	html:true,
					    	trigger: 'focus hover',
					    	container: 'body',
					    	viewport: { selector: 'body', padding: 0 },
					    });				    
					});
					//click events for search history 'bars'
					$('.pull-out .search-term').unbind('click').on('click', function(){
						//toggle selected class on click
						if (!$(this).parent().parent().hasClass('selected')) { 
							$(this).parent().parent().toggleClass('selected');
						}						
						$('.presearch-field').not($(this).parent().parent()).removeClass('selected');
						
						$(this).toggleClass('current-search');
						$('.search-term').not($(this)).removeClass('current-search');
						
						//setting the var to determine which search field is loaded
						var id = $(this).attr("rel");
						var url = 'includes/searchresults.html #' + id;
						//load/'replay' the search  
						$('.search-content').load(url, function(){
							//additional functions here						
						});
						
					});
					//load dashboard
					$('#dashboard').on('click', function(){
						$('.search-content').toggleClass('shrink');
						$('.pull-out').toggleClass('expand');
						$('.dashboard').toggleClass('active').delay(400).fadeToggle(400);
					});
				});			
			});
			$('a[title="Application"]').on('click', function(){
				$('.container-main').load('views/application.html', function(){
					pageLoad();
					loadHeader();
					loadHighlightsNavigation();				
				});
			});
			$('a[title="Tags & viewer"]').on('click', function(){
				$('.container-main').load('views/tags-and-viewer.html');
				$('.container-main').css('position', 'relative'); //this is a hack - need to find a solution
			});
			$('a[title="Office actions"]').on('click', function(){
				$('.container-main').load('views/office-actions.html');
			});
		});
	}
	
	function loadRightNav(){ // Right navigation (helpers)
		$('.nav-right').load('components/nav-right.html', function(){
			rightNavFunctions();
		});
	}
	
	function loadHeader(){ // Filters (header) area 
		$('.header').load('components/header.html', function(){
			headerFunctions();
		});
	}
	
	function loadHighlightsNavigation(){ // Highlights/navigation and VIN bar area 
		$('.highlights-annotations-bar').load('components/highlights-annotations.html', function(){
			pageLoad();
			switchView();
			viewer();
			//something
		});
	}

	// COMPONENT FUNCTIONS
	// Functions that run 'inside' of the loaded content. These can be called as a callback of the AJAX load functions.
	
	function leftNavFunctions() {
		//Getting the application number
		var ep = 'EP13742066'
		$('.ep').on('mouseenter mouseleave', function (){
			$(this).parent().toggleClass('extend');		
		});
		$('.ep').mouseenter(function(){
			$('.appNo').html(ep);
		}).mouseleave(function(){
			$('.appNo').html('EP...');
		});
		// Navigation arrows
	    $('.arrow-back').parent().mouseenter(function () {
	        $(this).css('width', '100px');	        
	    }).mouseleave(function () {
	        $(this).css('width', '50px');
	    });
	    
	    // Left hand navigation (main) "fly out" menu
	    $('.navbar-left ul li').on('mouseenter mouseleave', function () {
	        $(this).find('.secondary-nav').delay(800).toggleClass('slide-in');
	        $(this).find('a').toggleClass('selected');	        
	    });
	    
	    //Restore container to original position (centered) if it has been changed
	    $('.navbar-left ul li').not('a[title="search"]').on('click', function(){
	    	$('.container-main').removeClass('nudge');
	    });

	}//END left nav functions
	
	function rightNavFunctions() { 
		//Tooltips
	    $('.nav-right ul li a, button').tooltip({
	        container: 'body'
	    });
	    //Right navigation click functions
    	$('.nav-right ul li a').unbind('click').on('click', function () {
    		
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
		    $('#tagswitch').on('click', function(){
		    	$(this).parents().find('.menu-item').end().toggleClass('doc-view');
		    });

    	});
    	//Remove notifications from Query|Highlights
    	$('.nav-right ul li a[rel="queryhighlights"]').on('click', function(){
    		$('.notification').fadeOut();
    		n = 0;
    	})
    }//END right nav functions
    
    function headerFunctions(){
    	// Change to dual view
	    $('#comm-draft, button.close').click(function () {
	        $('.container-main').toggleClass('dual-screen');
	        if($('.container-main').hasClass('dual-screen')){
		    	$('.annotation .glyphicon').popover({
		    		placement:'left',
		    		container: 'body',
		    		title: 'Clarity – Claim 20',
		    		content: 'The term particular criteria used in claim 20 is vague and unclear'    		
		    	});
		    }
	    });
	    
	    // Destroy popover on dual screen close
	    $('button.close').click(function(){
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
    	$('.trigger-page-layout').on('click', function(){
	    	// Change the title of the dropdown that triggers the switch
	    	$(this).parent().parent().parent().find('.dropdown-toggle').html('<span class="glyphicon glyphicon-list"></span> Page layout <b class="caret"></b>');
	    	// Display or hide
	    	$('.page-layout').show();
	    	$('.screen-reading').hide();
	    });
	    
	    $('.trigger-screen-reading').on('click', function(){
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

});