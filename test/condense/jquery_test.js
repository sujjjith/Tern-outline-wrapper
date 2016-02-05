var elem= $(event.currentTarget);
elem.find(".author").show();
elem.find(".date").show();
$(".tab").mouseleave(function(event){
	var elem= $(event.currentTarget);
	elem.find(".author").hide();
	elem.find(".date").hide();
	});

var data=$("form").serialize();
 var result = $.ajax({
	type:"POST",
	data:data,
	
	});	
 
var e =event.preventDefault();	