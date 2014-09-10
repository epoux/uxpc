/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrance of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};


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
//Page loading (dummy AJAX loading of views)  
function pageLoad(){

	function getSelectionText() {
	    text = "";
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	}
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
	   	  	
	}

	//Load 'Claims' initially
	$('#view-screen-reading').load('includes/claims.html .wrap', function(){
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
		
	});
	
	// Popovers
	$('.markers button, .markers a').popover();	
	
	//Load new content on click
	$('.highlights-filter a').on('click', function(){
    	$('.filter-trigger').html($(this).parent().attr('id') + '&nbsp;<b class="caret"></b>');
    	url = 'includes/' + $(this).parent().attr('id') + '.html';
    	
    	$('#view-screen-reading').load(url, function(){
    		
    		//Inititally hide page layout mode
    		$('.page-layout').hide();
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
		    	template: '<div class="popover wide" role="tooltip" style="margin-left:-220px;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
		    });
		    //Annotation hover
		    $('.annotation').on('mouseenter mouseleave', function () {
		    	if(!$('.container-main').hasClass('dual-screen')){
		    		$(this).toggleClass('expanded');  		
		    	}
		    });		    
    	});
    });

}//END function pageLoad()