;(function($){
  $('.vote-button').on('click', (event) => {
    $('.container').addClass('transfer1');
  });

  $('.vote-button').on('click', (event) => {
    $('.container').addClass('transfer1');
  });

  $('#button2').on('click', (event) => {
    // $('.container').removeClass(['transfer1']);
    $('.container').addClass('transfer2');
  });

  $('.confirm-button').on('click', (event) => {
  	var number = $('.phone-content').val();
  	// console.log(number);
  	var reg = /^1[3|4|5|7|8][0-9]{9}$/;
  	var flag = reg.test(number);
  	// console.log($(this).attr('value'));
  	console.log($(this).html());
  	var name="";
  	if($(this).attr('value')=="支持法国"){
  		name = "法国";
  	}
  	else {
  		name = "罗马尼亚";
  	}
  	if(flag){
  		console.log("yes");
  		$.ajax({
  			type:'post',
  			url: 'http://10.124.18.115:8080/api/v1/activity/worldcup/52ab7bc3-b36d-454e-a9e3-79c72891abf6/',
  			data: { team: name, phone: number},
  			dataType: 'json',
			crossDomain: true,
			success: function(data){
				console.log(data);
			}
  		})
  	}
  	else{
  		alert("请输入正确的手机号码");
  	}
  	
  });
})(Zepto);

var loadVotes = function() {
	$.ajax({
		type: 'get',
		url: 'http://10.124.18.115:8080/api/v1/activity/worldcup/52ab7bc3-b36d-454e-a9e3-79c72891abf6/',
		dataType: 'json',
		crossDomain: true,
		success: function(data) {
			var num1 = data.host.vote;
			var num2 = data.guest.vote;
			$('.vote-number-f').text(num1);
			$('.vote-number-r').text(num2); 
		}
	});
}

$(document).ready(function() {
	loadVotes();
});