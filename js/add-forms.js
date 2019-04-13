function create_input(i, field){
	name = "calibrationdetail_set-"+i+"-"+field;
	input = $(document)[0].createElement('input');
	input.setAttribute('type', "number"),
	input.setAttribute('name', name);
	input.setAttribute('class', field + "_input");
	input.setAttribute('id', "id_"+name);
	return input;
}

function create_calibration_row(i){
	tr = $(document)[0].createElement('tr');
	fields = ['concentration', "percentage"]
	fields.forEach(field => {
		td = $(document)[0].createElement('td');
		td.append(create_input(i,field));
		tr.appendChild(td);
	})
	return tr;
}

function add_new_calibration_row(){
	total_forms_field = $('#id_calibrationdetail_set-TOTAL_FORMS')[0]
	forms_count = parseInt(total_forms_field.value);
	total_forms_field.setAttribute('value',forms_count + 1)
	tr = create_calibration_row(forms_count);
	table_body = $('#calibration-table-body')[0];
	table_body.appendChild(tr);
}



