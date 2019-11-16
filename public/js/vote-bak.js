$.ajax({
	url:'/music/list',
	success: function(response){
		// console.log(response);
		var html = template('musicTpl', response);
		// console.log(html);
		$('#VoteMain').html(html);
	}
});

$('#VoteMain').on('click', '.VoteImg', function () {
	var music_id = $(this).attr('data-id');
	$.ajax({
		url:'/music/vote/'+music_id,
		success:function(response){
			alert(response);
			location.reload();
			// var VoteValue = $(this).next();
			// var VoteSpan = $(this).next().find('.VoteSpan #voteNew');
			// VoteSpan.html(VoteSpan.html() - 0 + 1);
			// VoteValue.css("height", VoteValue.height() - 0 + 1 + "px");
			// VoteValue.css("margin-top", 300-20-(VoteValue.height() - 0 + 1)+"px");
		},
		error:function(error){
			// console.log(error.responseText);
			alert(error.responseText);		
		}
	})
});