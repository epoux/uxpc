$(document).ready(function () {
	 
	// INITIAL LOADING OF COMPONENTS
	// Firing off all the loading functions
	loadLeftNav();
	loadRightNav();
	$('.container-main').load('views/application.html', function(){
		loadApplication();
	})
	
	// COMPONENT LOADING
	// Loading the appropriate html snippets into the content areas. These in turn call a set of functions 
	// related to the component
	
	function loadLeftNav(){ // Left (main) navigation
		$('.navbar-left').load('components/nav-left.html', function(){
			leftNavFunctions();
			$('a[title="Search"]').on('click', function(){
				$('.container-main').load('views/search.html', function(){
					searchFunctions();
				});		
			});
			$('a[title="Application"]').on('click', function(){
				$('.container-main').load('views/application.html', function(){
					loadApplication();									
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
	    
	    $('.navbar-left ul li').on('click', function(){
	    	$('.container-main').removeClass('dual-screen');
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
    
    function searchFunctions() {
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
		//query builder functions
		$('.query-builder .mark-query').click(function(){ // mark the star 
			//change the star to yellow
			$(this).find('.glyphicon').toggleClass('glyphicon-star glyphicon-star-empty').toggleClass('marked');
			//change the title to reflect whether it is already marked
			if ($('.query-builder .mark-query .glyphicon').hasClass('marked')){
				$(this).attr({
					"title": "Query is marked",
					"data-original-title": "Query is marked"
				});
			} else {
				$(this).attr({
					"title": "Mark query",
					"data-original-title": "Mark query"
				});
			}						
		}).tooltip();
		//search on sources
		$('.search-param').on('mouseenter mouseleave', function(){
			$(this).toggleClass('hover');
		});
		$('.search-param button').on('click', function(){
			$(this).toggleClass('btn-default');
		});
		//switch between 'concept modes'
		$('ul.view li a').click(function(e){
			e.preventDefault();
			var display = '.concept-mode' + '.' + $(this).attr('title');					
			$(display).toggleClass('active');
			$('.concept-mode').not(display).removeClass('active');
			$(this).parent().toggleClass('active');
			$(this).parent().parent().find('li').not($(this).parent()).removeClass('active');
		});
		//action group for concepts
		$('.action-group a').tooltip({container: 'body'});
		//add new search term
		appendage = '<li><input type="checkbox">&nbsp;<input type="checkbox" class="checkbox-highlight"><span><input class="new" style="width:100%;"></input></span><span class="picker"><span class="caret"></span><ul style="display: block;"><li class="light-orange">&nbsp;</li><li class="light-green">&nbsp;</li><li class="light-yellow">&nbsp;</li><li class="light-red">&nbsp;</li><li class="light-blue">&nbsp;</li><li class="light-purple">&nbsp;</li></ul></span></li>';
		
		$('.queryhighlights #add-new').on('click', function(){
			$('ul.highlights-list.main').append(appendage).each(function(){
				$('.picker ul').hide();
				$('.picker span.caret').unbind('click').on('click', function(){
					$('.picker ul').toggle();
				});
			});
			$('.new').fadeIn(800);
		});
		//hide the term with 'hide' button
		$('.action-group a[data-original-title="Hide"]').on('click', function(){												
			//$(this).tooltip('destroy');
			$(this).parent().parent().hide();
		});
		$('#show-hidden').on('click', function(){
			$('.highlights-list.main li').show();
		})
		//remove term with 'delete' button
		$('.action-group a[data-original-title="Delete"]').on('click', function(){												
			$(this).tooltip('destroy');
			$(this).parent().parent().remove();
		});
	}
	   
	//GENERAL 

});