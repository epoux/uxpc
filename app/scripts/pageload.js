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
		    	template: '<div class="popover wide" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
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