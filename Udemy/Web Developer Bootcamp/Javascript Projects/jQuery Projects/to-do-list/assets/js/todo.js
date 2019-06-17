let sortMode = 'none';
let numItems = $('#todo-list li').length;

// Check off specifc todos by clicking
$('ul').on('click', 'li', function (){
	$(this).toggleClass('completed');
	if ($(this).hasClass('completed')) {
		$(this).html(`<span class="del"><i class="fas fa-trash-alt"></i></span>${$(this).text()}   <i class="fas fa-check"></i><span class="fav"><i class="fas fa-star"></i></span>`);
	} else {
		$(this).html(`<span class="del"><i class="fas fa-trash-alt"></i></span>${$(this).text()}</i><span class="fav"><i class="fas fa-star"></i></span>`);
	}
});

//click on x to delete todo
$('ul').on('click', '.del', function(e){
	let numRemoved = parseInt($(this).parent().attr('data-num'));
	//change item numering
	$('li').attr('data-num', function(i, val) {
		if (numRemoved < parseInt(val)) {
			return parseInt(val) - 1;
		}
	});
	//remove item
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	numItems--;
	e.stopPropagation();
});

$('input[type="text"]').keypress(function(e){
	if (e.which === 13) {
		numItems++;
		//grab text from input
		let todoText = $(this).val();
		$(this).val('');
		//create new li to add to ul
		$('ul').append(`<li data-num="${numItems}"><span class="del"><i class="fas fa-trash-alt"></i></span>${todoText}<span class="fav"><i class="fas fa-star"></i></span></li>`);
		if (sortMode === 'az') {
			alpha();
		}
	}
});

//fade input field
$('span').eq(0).click(function(){
	$('input[type="text"]').fadeToggle(200);
	$('h1 i').toggleClass('fa-pen-square').toggleClass('fa-minus');;
})

//mark as prioirity
$('ul').on('click', '.fav', function(e){
	if (!$(this).hasClass('active')) {
		$(this).parent().prependTo('#todo-list');
	}
	$(this).toggleClass('active');
	if (sortMode === 'az') {
		alpha();
	} else if (sortMode === 'asc') {
		ascending();
	} else if (sortMode === 'desc') {
		descending();
	}
	e.stopPropagation();
})

//alphabetize list
const alpha = () => $(".fav:not(.active)").parent().sort((a, b) => 
	$(b).text().toUpperCase() < $(a).text().toUpperCase() ? 1 : -1
	).appendTo('#todo-list');

$('#az').on('click', function(){
	alpha();
	sortMode = 'az';
})

//other list options
const ascending = () => $(".fav:not(.active)").parent().sort((a, b) => 
	$(b).attr('data-num') < $(a).attr('data-num') ? 1 : -1
	).appendTo('#todo-list');

$('#asc').on('click', function(){
	ascending();
	sortMode = 'asc';
})

const descending = () => $(".fav:not(.active)").parent().sort((a, b) => 
	$(b).attr('data-num') > $(a).attr('data-num') ? 1 : -1
	).appendTo('#todo-list');

$('#desc').on('click', function(){
	descending();
	sortMode = 'desc';
})

//show sort options
$('.sort').on('click', function(){
	let sortKind = $('.sort-kind');
	let timer = (cls) => {setTimeout(function(){
		sortKind.toggleClass(cls);
	}, 200);};
	$(this).toggleClass('sort-clicked');
	if (sortKind.hasClass('sort-trans')) {
		sortKind.toggleClass('sort-vis');
		timer('sort-trans');
	} else {
		sortKind.toggleClass('sort-trans').toggleClass('sort-vis');
	}
})

//set sort mode
$('#options').on('click', function(e){
	if ($(e.target).hasClass('active') || $(e.target).hasClass('sort')) {
		$(e.target).toggleClass('active');
	} else {
		if (sortMode === 'az') {
			$('#az').addClass('active');
			$('#asc').removeClass('active');
			$('#desc').removeClass('active');
		} else if (sortMode === 'asc') {
			$('#az').removeClass('active');
			$('#asc').addClass('active');
			$('#desc').removeClass('active');
		} else if (sortMode === 'desc') {
			$('#az').removeClass('active');
			$('#asc').removeClass('active');
			$('#desc').addClass('active');		
		}
	}
})

function tester(ele, undo) {
	if (undo) {
		$(ele).removeAttr('style');
	} else {
		$(ele).css('color', 'white');
		$(ele).css('background-color', 'red');
		$(ele).css('border', '1px solid black')
	}
}


