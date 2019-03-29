
$('input[type="radio"]').click(function(){
    if($(this).attr("value")=="Owner"){
        $(".Pets").show('fast');
    }
    if($(this).attr("value")=="Caretaker"){
        $(".Pets").hide('fast');

    }        
});
$('input[type="radio"]').trigger('click');