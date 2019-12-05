$.ajax({
	url:'/music/list',
	success: function(response){
		// console.log(response);
		var html = template('musicTpl', response);
		// console.log(html);
		$('#VoteMain').html(html);
	}
});

// 点击投票的功能
$('#VoteMain').on('click', '.VoteImg', function () {
	var music_id = $(this).attr('data-id');
	// $(this).siblings
	$.ajax({
		url:'/music/vote/'+music_id,
		success:(response) => {
			// alert(response);
			// location.reload();
			$(this).next().css({
				'marginTop': (response.vote > 281 ? 0: (281-response.vote)) + 'px',
				'height':  (response.vote > 281 ? 281:response.vote) + 'px'
			}).children().children().html(response.vote);

			
		},
		error:function(error){
			// console.log(error.responseText);
			alert(error.responseText);		
		}
	})
});
$('#VoteMain').on('mouseover', '.VoteText',function(){

	let music_id = $(this).attr('data-id');
	// 绝对位置
	let now_left = $(this).offset().left
	$.ajax({
		url:'/music/info/'+music_id,
		success:function(result){
			$('#name').html(result.info.name);
			$('#singer').html(result.info.singer);
			$('#ip').html(result.info.ip);
			$('#music_id').val(music_id);
			$('#sendwish').attr('data-img', result.info.avatar ? result.info.avatar : '/images/mary.png');
			if(result.info.isplayed){
				$('#played').val('已播放');
			} else{
				$('#played').val('未播放');
			}
			let li = '';
			// console.log(result.wishlist);
			// console.log(result.wishlist != []);
			
			if(result.wishlist.length != 0){
				result.wishlist.forEach(function(item, index){
					li += `<li>${item.ip}❤${item.content}</li>`;
				});
			} else {
				li = `<li>朋友~❤一大波祝福在路上~</li>`;
			}
			$('#wishlist ul').html(li);
			// // $('#wish').html(info.wish);
			$('.show').css('margin-left', now_left+100+'px');
			$('.show').show();
		}
	});
});
$('#close').on('click', function(){
	$('.show').hide();
})
$('#played').on('click', function(){
	let music_id = $('#music_id').val();
	$.ajax({
		url:'/music/played/'+music_id
	});
	$(this).val('已播放');
	$('.show').hide();
})