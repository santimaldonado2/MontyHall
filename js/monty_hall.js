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
var intervalId = null;

function get_random_between(min, max){
    return Math.floor(Math.random() * (+max - +min+1)) + +min;
}

function get_prize_door(){	 
    prize_door = get_random_between(0,2) 
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
	$('#play_button').attr("disabled", true);
	$("#play_button").text("Jugar Otra Vez");
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
			remaining_door = i;
			break;
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
	update_progress_bar('keep_bar', keep_door_win_count, total_times_played)
	update_progress_bar('change_bar', change_door_win_count, total_times_played)
	update_progress_bar('result_bar', win_count, total_times_played)
	$('#play_button').attr("disabled", false);
}

function update_progress_bar(id_bar, count, total_times){
	bar = $('#' + id_bar)
	value = Math.round(100*count/total_times,2);
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

function sleep(milliseconds) {
	 var start = new Date().getTime();
		 for (var i = 0; i < 1e7; i++) {
			  if ((new Date().getTime() - start) > milliseconds) {
			   	break;
			  }
	 }
}

function update_progress_bar_sim(id_bar, count, total_times){
	bar = $('#' + id_bar)
	value = Math.round(100*count/total_times,2);
	bar.attr('area_value_now', value)
	bar.attr('style', 'width:' + value + '%;')
	bar.text(count +"/" + total_times + " " + value + "%")
}

function simulate(){
	if(intervalId){
		clearInterval(intervalId);
		$('#simulate_button').text("Simular")
		intervalId = null;
	} else {
		$('#simulate_button').text("Detener");
		sim_keep_door_won = 0;
		sim_change_door_won = 0;
		simulations = 0
		intervalId = setInterval(function(){
			simulations++;
			sim_available_doors_open = new Set([0,1,2]);

			sim_prize_door = get_random_between(0,2);
			sim_available_doors_open.delete(sim_prize_door)

			sim_choosen_door = get_random_between(0,2)
			sim_available_doors_open.delete(sim_prize_door)

			sim_open_door = getRandomItem(sim_available_doors_open)

			if(sim_choosen_door == sim_prize_door){
				sim_keep_door_won++;
			} else {
				sim_change_door_won++;
			}

			update_progress_bar_sim('sim_keep_bar', sim_keep_door_won, simulations)
			update_progress_bar_sim('sim_change_bar', sim_change_door_won, simulations)
		}, 100)
	}
}






