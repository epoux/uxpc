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
	}// END search functions
	   
	//APPLICATION Functions
	function loadApplication(){
		
		//Define variables
		secondary = ""
		currClass = ""
		
		//Load components
		loadHeader();
		loadHighlightsNavigation();
			
		function loadHeader(){ // Filters (header) area 
			$('.header').load('components/header.html', function(){
				headerFunctions();
			});
		}
		
		function loadHighlightsNavigation(){ // Highlights/navigation and VIN bar area 
			$('.highlights-annotations-bar').load('components/highlights-annotations.html', function(){
				loadNew();
				switchView();
				viewer();
				//something
			});
		}
		
		function headerFunctions(){
	    	// Change to dual view
		    $('.contextual ul>li a').click(function () {
		        $('.container-main').addClass('dual-screen');
		        var title = $(this).text();
		        var Str = title.replace(/\s+/g, '');
		        var url = 'includes/' + Str + '.html'
	
		        $('.content-secondary-wrapper header h5').html(title);
		        $('.comms').load(url, function(){
		        	//function
		        });
		        if($('.container-main').hasClass('dual-screen')){
			    	$('.annotation .glyphicon').popover({
			    		placement:'left',
			    		container: 'body',
			    		title: 'Clarity – Claim 20',
			    		content: 'The term particular criteria used in claim 20 is vague and unclear'    		
			    	});
			    }
		    });
		    //Close dual view
		    $('button.close').click(function () {
		        $('.container-main').removeClass('dual-screen');
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
		
		function loadAppFunctions() {
			//Inititally hide page layout mode
			$('.page-layout').hide();
		
			//Syncing the highlights bar 'claims view' tree and document view
			$('[id^="claim"]').hide();
			
			//Trigger event on click of the numbers (dependant claims)
			$('.expandable').on('click', function(){
				//expand the claims tree to match document
				
				//change height of 'viewer' to reflect portion of document being shown
				
				//expand the dependant claims
				$(this).parent().find('[id*="claim"]').slideToggle(400, function(){
					docHeight = $('#view-screen-reading').height();
					highlightsHeight = $('#panel-claims').height();
					console.log('docHeight: ' + docHeight);
					console.log('highlightsHeight: ' + highlightsHeight);
					
					//$('#viewer-claims').css('height', highlightsHeight);
					$('#viewer-claims').toggleClass('expanded');
					
					$('#viewer-figures, #viewer-descriptions').fadeToggle(400);
				});
							
			});
			
			$('.content-main-wrapper').scroll(function(){
				//$('#viewer-claims').animate({"marginTop": 100}, "slow" );
			})
			//Popover images on thumbnails    
		    var image = '<img src="images/popover-diagram.jpg">'
		    $('.popover-image').popover({
		    	placement:'bottom',
		    	content: image,
		    	html:true,
		    	trigger: 'click focus',
		    	title: 'Figure 3',
		    	container: 'body',
		    	viewport: { selector: 'body', padding: 0 },
		    	template: '<div class="popover wide" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
		    });
		    //Annotation hover
		    $('.annotation').on('mouseenter mouseleave', function () {
		    	if(!$('.container-main').hasClass('dual-screen')){
		    		$(this).toggleClass('expanded');  		
		    	}
		    });
		    // Popovers
			$('.markers button, .markers a').popover();	
		}
	
		//Load 'Claims' initially
		function init() {
			$('#view-screen-reading').load('includes/claims.html', function(){
				loadAppFunctions();		
			});
		}
		init();
		
		//Load new content on click
		function loadNew() {
			$('.highlights-filter a').on('click', function(){
		    	$('.filter-trigger').html($(this).parent().attr('id') + '&nbsp;<b class="caret"></b>');
		    	url = 'includes/' + $(this).parent().attr('id') + '.html';
		    	
		    	$('#view-screen-reading').load(url, function(){
		    		loadAppFunctions();  				    
		    	});
		    });
		}
		
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
		
		function getSelectionText() {
		    text = "";
		    if (window.getSelection) {
		        text = window.getSelection().toString();
		    } else if (document.selection && document.selection.type != "Control") {
		        text = document.selection.createRange().text;
		    }
		    return text;
		}
		
		function getHighlights() {
			
			$('.swatches li').unbind('click').on('click', function(){
		   		//alert('selected');
	
		   		hClass = $(this).attr('class');
		   		hText = $(this).attr('title');
		   		$(this).toggleClass('checked');
	
		   		console.log(hClass);
		   		
		   		//sequential class for highlights - if needed
		   		currHighlight = 'highlight-' + n;
	
		   		//something
		   		$(this).parent().parent().find('input' + hClass).attr('checked', 'checked');
		   		
		   		if($(this).hasClass('checked')) {	   			
					$('body').highlight(hText, {className: hClass});
					//avoid the highlight plugin creating nested spans
					$('body p').find('span span').unwrap();
					
				} else {
					//remove the colour class - workaround for the 'unhighlight' method if the highlight plugin
					$('body p').find('span').removeClass(hClass);
				}
				
		   	});
		   	  	
		}// END getHighlights()
		
		//On object menu - text selection
		$('#view-screen-reading').mouseup(function (e){
	       getSelectionText();
	
	       var pageX = e.pageX;
	       var pageY = e.pageY;   
	       
	       if (text.length > 1){
	       		//console.log(text);       	
		    	$('.oo-menu').fadeIn(100).css('left', pageX).css('top', pageY);    	
	       } else {
	       		$('.oo-menu').fadeOut(200);
	       		$(secondary).hide();
	       }
	
	       $('.oo-menu .search-term').html('<input type="checkbox" value="" checked>' + text);
	
	   	});
	   	$('.colour-picker ul').hide();
		$('.colour-picker span.caret').unbind('click').on('click', function(){
			$('.colour-picker ul').toggle();
		});
	
		//'On-object menu' - menu selection
	    
	    $('.oo-menu').hide();
	    
	    $('#anchor').on('click', function(){
	    	var pos = $(this).offset();
	    	var posLeft = pos.left;
	    	var posTop = pos.top;
	    	var width = $(this).width();
	    	
	    	$('.oo-menu').toggle().css('left', (posLeft + width + 10)).css('top', posTop);
	    });
	    
	    $('.oo-menu li a').on('mouseenter mouseleave', function(){
	    	secondary = $(this).attr('href');
	    	$(secondary).show();
	    	$('.oo-menu').find('div').not($(secondary)).hide();
	    });
	
		//Toggle selected class on colour picker
		$('.colour-picker ul li').unbind('click').on('click', function(){
			$(this).addClass('selected');
			$('.colour-picker ul li').not(this).removeClass('selected');
			currClass = $(this).attr('class');
			$('.search-term').addClass(currClass);
			$('.colour-picker ul').fadeOut(100);	
		});
	
		//Add highlights to search term
		n = 0;
	   	$('.oo-menu .btn-add').unbind('click').on('click', function(){
	   		n +=1;
	   		//console.log('n: ' + n);
			$('.oo-menu').fadeOut(100);
			$('.search-term').removeClass(currClass);
			//add a swatch to the highlights bar
			$('ul.swatches').append('<li class="' + currClass + '" title="' + text + '"></li>');
			$('ul.swatches li').removeClass('selected');
			//Adding another checkbox
			$('.highlight-choices').append('<span class="highlight-checkbox" id="highlight-' + n + '" title="' + text + '"><input type="checkbox" class="'+ currClass + '"></span>');
			//Changing the width of the swatches and checkboxes in the highlights bar
			newWidth = 100 / $('ul.swatches li').size() + "%";
			$('ul.swatches li, .highlight-checkbox').css('width', newWidth);
			//$('body p').highlight(text, { wordsOnly: true, className: currClass });
			//Trigger highlighting function
			getHighlights();
			//Trigger alert/notification in helper menu
			$('.notification').fadeIn().html(n).css('visibility', 'visible');
			//Add search term to Query|Highlights panel in helpers menu
			$('ul.highlights-list.main').append('<li><input type="checkbox" class="checkbox-highlight">&nbsp;<input type="checkbox">&nbsp;<span class="'+ currClass +'">' + text + '</span></li>');
			
		});
	
	}//END function loadApplication()

});