$.ajax({
	url:'/music/list',
	success: function(voteJson){
	
		function init(){
			for(var i=0;i<voteJson.length;i++){
				var mName=voteJson[i].name;
				var mImg=voteJson[i].avatar ? voteJson[i].avatar : 'mary.png';
				var mValue=voteJson[i].vote;
				var music_id = voteJson[i]._id;
				var VoteItem=$("<div></div>");
				VoteItem.attr("class","VoteItem");
				$("#VoteMain").append(VoteItem);
				
				var VoteImg=$("<img title='支持一下' data-id='"+ music_id + "' src='images/"+ mImg +"' />");
				VoteImg.attr("class","VoteImg");
				VoteImg.click(function() {
					var music_id = $(this).attr('data-id');
					$.ajax({
						url:'/music/vote/'+music_id,
						success:(response) => {
							// alert(response);
							// location.reload();
							console.log($(this).next().height());
							
							$(this).next().css("height",($(this).next().height()-0+1)+"px");
							$(this).next().css("margin-top",300-20-$(this).next().height()+"px");
							// $(this).next().find(".VoteSpan").html($(this).next().height());
							var VoteSpanTri=$("<span></span>");
							VoteSpanTri.attr("class","VoteSpanTri");
							$(this).next().find(".VoteSpan").append(VoteSpanTri);
							location.reload();
						},
						error:function(error){
							// console.log(error.responseText);
							alert(error.responseText);
							return;		
						}
					})
					
				});
				VoteItem.append(VoteImg);
	
				var VoteValue=$("<div></div>");
				VoteValue.attr("class","VoteValue");
				VoteValue.css("margin-top",300-20-mValue+"px");
				VoteValue.animate({height:mValue+"px"},500);
				VoteItem.append(VoteValue);
				
				var VoteSpan=$("<div>"+mValue+"</div>");
				VoteSpan.attr("class","VoteSpan");
				VoteValue.append(VoteSpan);
				
				var VoteSpanTri=$("<span></span>");
				VoteSpanTri.attr("class","VoteSpanTri");
				VoteSpan.append(VoteSpanTri);
				
				
				var VoteText=$("<p></p>");
				VoteText.html(mName);
				VoteText.attr("class","VoteText");
				VoteItem.append(VoteText);
			}
		}
		init();
	}
});
