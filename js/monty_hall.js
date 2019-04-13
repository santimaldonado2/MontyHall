var choosen_door = null;
var prize_door = null;
var open_door = null;
var remaining_door = null;
var available_doors_open = null;
var available_doors_choose = null;
var keep_door_win_count = 0;
var change_door_win_count = 0;
var total_times_played = 0;
var win_count = 0;

function get_prize_door(){
	var min=0; 
    var max=3;  
    var random =Math.floor(Math.random() * (+max - +min+1)) + +min; 
    prize_door = random 
}

function choose_door(element){
	elem = $(element)
	$('.choosen_door').each(function() {
	  $( this ).attr('src','img/closed_door.png');
	  $( this ).removeClass('choosen_door')
	});

	elem.attr('src','img/choosen_door.png');
	elem.addClass('choosen_door');
	choosen_door = parseInt(elem.attr('id'), 10);	
	available_doors_open.delete(choosen_door)
	do_open_door()
}

function start(){
	$('.door').each(function() {
	  $( this ).attr('src','img/closed_door.png');
	  $( this ).removeClass('choosen_door')
	  $( this ).attr('onclick','choose_door(this)');
	});
	get_prize_door();
	available_doors_open = new Set([0,1,2]);	
	available_doors_open.delete(prize_door)
	available_doors_choose = new Set([0,1,2]);
}

function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}

function do_open_door(){
	open_door = getRandomItem(available_doors_open)
	$('#' + open_door.toString()).attr('src','img/open_door.png');
	$('#' + open_door.toString()).prop("onclick", null).off("click");
	for(i in [0,1,2]){
		if(i != choosen_door && i != open_door){
			remaining_door = i
		}
	}
	$('#' + remaining_door.toString()).attr('onclick','finish(true)');
	$('#' + choosen_door.toString()).attr('onclick','finish(false)');
}

function finish(change){
	var won = false;
	if (change){
		var auxiliar = choosen_door;
		choosen_door = remaining_door;
		remaining_door = auxiliar;
	}

	if(choosen_door == prize_door){
		$('#' + choosen_door.toString()).attr('src','img/choosen_prize_door.png');
		$('#' + remaining_door.toString()).attr('src','img/open_door.png');
		if(change){
			change_door_win_count++;
		} else {
			keep_door_win_count++;
		}
		win_count ++;
	} else {
		$('#' + choosen_door.toString()).attr('src','img/choosen_open_door.png');
		$('#' + remaining_door.toString()).attr('src','img/open_prize_door.png');
		if(change){
			keep_door_win_count++;
		} else {
			change_door_win_count++;
		}
	}

	$('.door').each(function() {
	  $( this ).prop("onclick", null).off("click");
	});
	total_times_played++;
	update_progress_bar('keep_bar', keep_door_win_count)
	update_progress_bar('change_bar', change_door_win_count)
	update_progress_bar('result_bar', win_count)
}

function update_progress_bar(id_bar, count){
	bar = $('#' + id_bar)
	value = Math.round(100*count/total_times_played,2);
	bar.attr('area_value_now', value)
	bar.attr('style', 'width:' + value + '%;')
	bar.text(value + '%')
}

function restart(){
	
	start()
}

function select_option(){
	if (confirm("Press a button!")) {
	  txt = "You pressed OK!";
	} else {
	  txt = "You pressed Cancel!";
	}
}





