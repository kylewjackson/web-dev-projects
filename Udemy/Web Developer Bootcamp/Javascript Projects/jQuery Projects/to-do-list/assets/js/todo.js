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
		$('ul').append(`<li><span><i class="fas fa-trash-alt"></i></span> ${todoText}</li>`);
	}
});

//fade input field
$('span').eq(0).click(function(){
	$('input[type="text"]').fadeToggle(200);
})

//alphabetize list
const alpha = () => $("li").sort((a, b) => 
	$(b).text().charAt(1).toUpperCase() < $(a).text().charAt(1).toUpperCase() ? 1 : -1
	).appendTo('#todo-list');

//show sort options
$('.sort').on('click', function(){
	$('#options').toggleClass('btwn');;
	$('.sort-kind').toggleClass('hide');
})