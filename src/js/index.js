;(function($){
  var prefix = 'http://10.124.18.115:8080/';
  var path = 'api/v1/activity/worldcup/'
  var uuid = '52ab7bc3-b36d-454e-a9e3-79c72891abf6/';
  var ajaxUrl = prefix + path + uuid;
  var registerUrl;
  // console.log(ajaxUrl);
  var hostName, hostFlag;
  var guestName, guestFlag;
  var voteFor;
  var showVoteNumbers = (data) => {
    console.log(data);
    registerUrl = data.register_url;
    hostName = data.host.nameCN;
    hostFlag = data.host.flag;
    guestName = data.guest.nameCN;
    guestFlag = data.guest.flag;
    $('#vote-button-1').text('支持' + hostName);
    $('#vote-button-2').text('支持' + guestName);
    $('#vote-number-country-1').text(data.host.vote);
    $('#vote-number-country-2').text(data.guest.vote);

    $('#flag1').attr('src', './images/' + hostFlag + '.png');
    $('#flag2').attr('src', './images/' + guestFlag + '.png');
    $('.content-register-container a').attr('href', registerUrl);
  };

  var doAjax = (reqType, url, parameters, callback) => {
    if (reqType === 'get') {
      var xhr = $.getJSON(url, parameters);
    } else {
      var xhr = $.post(url, parameters);
    }

    // Promise callbacks
    xhr.done((data, textStatus, jqXHR) => {
      callback(data);
    })
    .fail((jqXHR, textStatus, err) => {
      console.log(err.toString());
    });
  };

  doAjax('get', ajaxUrl, {}, showVoteNumbers);


  $('#vote-button-1').on('click', (event) => {
    event.preventDefault();
    voteFor = hostName;
    $('.container').addClass('transfer1');
  });

  $('#vote-button-2').on('click', (event) => {
    event.preventDefault();
    voteFor = guestName;
    $('.container').addClass('transfer1');
  });

  var confirmPhoneNumber = (data) => {
    console.log(data);
    /* 错误参数提示：
    ** 400718 缺少参数 phone=(...)&team(...)
    ** 400719 手机号错误
    ** 400720 队名错误
    ** 400721 投过票了
    */

    if(data.errcode === undefined) {
      $('.container').addClass('transfer2');
    } else {
      var error;
      switch (data.errcode) {
        case 400718:
          error = "发生错误，请重新输入！";
          console.log("Error code: 400718, 缺少参数 phone=(...)&team(...)");
          break;
        case 400719:
          error = "手机号码错误！";
          console.log("Error code: 400719, 手机号码错误！");
          break;
        case 400720:
          error = "发生错误，请重新输入！";
          console.log("Error code: 400720, 队伍名称错误！");
          break;
        case 400721:
          error = "此手机号已投过票了哦！";
          console.log("Error code: 400721, 此手机号已投过票！");
          break;
        default:
          error = "发生错误，请重新输入！";
          console.log("Unknown error!");
          break;
      }

      window.setTimeout(() => {
        $('#alert-box-container').removeClass('display-none');
        $('#alert-box-content').text(error);
        $('#alert-box-button').on('click', (event) => {
          event.preventDefault();
          $('#alert-box-container').addClass('display-none');
          $('.page2 form input').val('');
          $('.page2 form input').focus();
        });
      }, 0);
    }
  };

  $('#confirm').on('click', (event) => {
     event.preventDefault();
     var phoneNumber = $('.page2 form input').val();
     var phoneNumberRegExp = new RegExp('(^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7})$', 'g');
     if(phoneNumberRegExp.test(phoneNumber)) {
       var parameters = 'phone=' + phoneNumber + '&team=' + voteFor;
       doAjax('post', ajaxUrl, parameters, confirmPhoneNumber);
     } else {
       // 手机号格式错误
       window.setTimeout(() => {
         $('#alert-box-container').removeClass('display-none');
         $('#alert-box-content').text('手机号码有误！');
         $('#alert-box-button').on('click', (event) => {
           event.preventDefault();
           $('#alert-box-container').addClass('display-none');
           $('.page2 form input').val('');
           $('.page2 form input').focus();
         });
       }, 0);
     }


    //  $('.container').addClass('transfer2');
    //  $('.container').removeClass('transfer1');
  });


})(Zepto);
