let sortMode = 'none';

// Check off specifc todos by clicking
$('ul').on('click', 'li', function (){
	$(this).toggleClass('completed');
});

//click on x to delete todo
$('ul').on('click', '.del', function(e){
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	e.stopPropagation();
});

$('input[type="text"]').keypress(function(e){
	if (e.which === 13) {
		//grab text from input
		let todoText = $(this).val();
		$(this).val('');
		//create new li to add to ul
		$('ul').append(`<li><span class="del"><i class="fas fa-trash-alt"></i></span>${todoText}<span class="fav"><i class="fas fa-star"></i></span></li>`);
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
$('#asc').on('click', function(){
	sortMode = 'asc';
})

$('#desc').on('click', function(){
	sortMode = 'desc';
})

//show sort options
$('.sort').on('click', function(){
	$(this).toggleClass('sort-clicked');;
	$('.sort-kind').toggleClass('sort-vis');
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


