document.getElementById('tablemanage_txt').innerText = config.data.table_details[Number(config.data.table_selected - 1)].purpose

//build menu
let sub_optionbar = document.createElement('div');
sub_optionbar.setAttribute("class", "sub_optionbar");
let editbtn = document.createElement('div');
editbtn.setAttribute("class", "optionbutton editbtn");
editbtn.setAttribute("title", "edit");
let deletebtn = document.createElement('div');
deletebtn.setAttribute("class", "optionbutton deletebtn");
deletebtn.setAttribute("title", "delete");
let selectbutton = document.createElement('div');
selectbutton.setAttribute("class", "optionbutton selectbutton");
selectbutton.setAttribute("title", "select");
let selectimput = document.createElement('input');
selectimput.setAttribute("type", "checkbox");

sub_optionbar.appendChild(editbtn)
sub_optionbar.appendChild(deletebtn)
selectbutton.appendChild(selectimput)
sub_optionbar.appendChild(selectbutton)
tempblock.appendChild(sub_optionbar)


//alow editing function
tempblock.setAttribute('id', 'bar_' + index);
editbtn.addEventListener('click', function () { manage.dialogue.edit(index) });//Edit btn
deletebtn.addEventListener('click', function () { manage.dialogue.edit(index); manage.dialogue.call_delete() })
selectbutton.addEventListener('click', function () { console.error('Select fucntion is incomplete') })