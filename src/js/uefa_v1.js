// Global variables and functions
var voteTeam; // 用户支持的球队
var gameDate; // 比赛时间
var voteEndTime; // 投票截止时间
var expired; // 页面是否过期，过期为true
var shortUrl; // page3 用于分享的链接
var hostFlag, hostName, hostNameCN; // 主队信息 (国旗图片的名称，国家名称，国家中文名称)
var guestFlag, guestName, guestNameCN; // 客队信息 (国旗图片的名称，国家名称，国家中文名称)
var testUrl = "result.json";
// var testUrl = 'http://10.124.18.115:8080/api/v1/activity/worldcup/52ab7bc3-b36d-454e-a9e3-79c72891abf6/';
var cdn_root_path = './';
var ajaxGet = (url, success_cb, fail_cb) => {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json'
  })
  .done((data, textStatus, jqXHR) => {
    success_cb(data);
  })
  .fail((jqXHR, textStatus, errorThrown) => {
    fail_cb(errorThrown);
  });
};
var ajaxPost = (url, data, success_cb, fail_cb) => {
  $.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: data
  })
  .done((data, textStatus, jqXHR) => {
    success_cb(data);
  })
  .fail((jqXHR, textStatus, errorThrown) => {
    fail_cb(errorThrown);
  });
};

// Callback functions for ajax requests
var showInfo = (data) => {
  console.log(data);
  gameDate = data.meta.startAt;
  voteEndTime = data.meta.endAt;
  expired = data.meta.expired;
  expired = false;
  shortUrl = data.short_url;
  hostFlag = data.host.flag;
  hostName = data.host.name;
  hostNameCN = data.host.nameCN;
  guestFlag = data.guest.flag;
  guestName = data.guest.name;
  guestNameCN = data.guest.nameCN;
  // 更新主、客队支持票数
  $('#host-vote-number').text(data.host.vote);
  $('#guest-vote-number').text(data.guest.vote);
  // 设置国旗图片地址
  $('#flag-host').attr('src', cdn_root_path + 'images/' + hostFlag + '.png');
  $('#flag-guest').attr('src', cdn_root_path + 'images/' + guestFlag + '.png');
  // 设置注册按钮链接
  $('#register-url').attr('href', data.register_url);
  // 设置比赛时间文本
  $('#page1-title-time').text(gameDate);
  // 设置“规则”里的截止投票时间
  $('#vote-endTime').text('2. 投票截止时间：' + voteEndTime);

  if(expired) {
    $('.vote-button').css({
      'background-color': '#95a5a6',
      'cursor': 'default'
    }).text('投票已截止');
    $('#vote-button-1').css('background-color', '#95a5a6');
    $('#vote-button-2').css('background-color', '#95a5a6');
  }

  // 数据加载完毕，隐藏加载框
  $('#process-container').css('display', 'none');
};
var submitPhoneNumber = (data) => {
  console.log(data);
  if(data.errcode === undefined) {
    // 隐藏第二页，展示第三页，更新背景足球场白色边框
    $('.page2').css('display', 'none');
    $('.page3').css('display', 'block');
    $('.frame img').attr('src', cdn_root_path + 'images/football-frame-5.png');
    // 设置分享链接
    $('#short-url').val(shortUrl);
  } else {
    var errorMsg;
    switch (data.errcode) {
      case 400717:
        errorMsg = "投票已截止！";
        break;
      case 400718:
        errorMsg = "发生错误，请重新输入！";
        break;
      case 400719:
        errorMsg = "手机号码错误！";
        break;
      case 400720:
        errorMsg = "发生错误，请重新输入！";
        break;
      case 400721:
        errorMsg = "此手机号已投过票了哦！";
        break;
      default:
        errorMsg = "发生未知错误，请重新输入！";
        break;
    }
    $('#myModalLabel').text('发生错误');
    $('.modal-body').text(errorMsg);
    // 弹出模态框
    $('#myModal').modal('show');
  }
};
var handleAjaxFail = (errorThrown) => {
  $('#myModalLabel').text(errorThrown);
  $('.modal-body').text('请刷新页面，尝试重新载入！');
  // 弹出模态框
  $('#myModal').modal('show');
};

// js里修改html里所有图片的前缀地址，这样就可以方便修改路径
var setImagePath = () => {
  $('img').each(function(i) {
    var original_src = $(this).attr('src');
    if(original_src !== undefined) {
      $(this).attr('src', cdn_root_path + original_src);
    }
  });

  $('link').each(function(i) {
    // $(this).attr('href', );
  })
};



// 程序开始执行
(() => {
  var body_element = $('body');
  body_element.css('width', window.innerWidth + 'px');
  body_element.css('height', window.innerHeight + 'px');

  setImagePath();

  // 在数据到达之前显示加载框
  $('#process-container').css('display', 'block');

  // 获取首页信息
  ajaxGet(testUrl, showInfo, handleAjaxFail);

  $('#vote-button-1').on('click', (event) => {
    event.preventDefault();
    if(!expired) {
      // 隐藏第一页，展示第二页，更新背景足球场白色边框
      $('.page1').css('display', 'none');
      $('.page2').css('display', 'block');
      $('.frame img').attr('src', cdn_root_path + 'images/football-frame-3.png');

      // 存储用户投的队伍名称，后面第二页post请求会用到
      voteTeam = hostName;
    }
  });

  $('#vote-button-2').on('click', (event) => {
    event.preventDefault();
    if(!expired) {
      // 隐藏第一页，展示第二页，更新背景足球场白色边框
      $('.page1').css('display', 'none');
      $('.page2').css('display', 'block');
      $('.frame img').attr('src', cdn_root_path + 'images/football-frame-3.png');

      // 存储用户投的队伍名称，后面第二页post请求会用到
      voteTeam = guestName;
    }
  });

  $('#confirm').on('click', (event) => {
    event.preventDefault();
    var phoneNumber = $('.page2-phone-card form input').val();
    var phoneNumberRegExp = new RegExp('(^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7})$', 'g');
    if(!phoneNumberRegExp.test(phoneNumber)) {
      $('#myModalLabel').text('发生错误');
      $('.modal-body').text('手机号格式错误！请重新输入！');
      // 弹出模态框
      $('#myModal').modal('show');
      $('#modal-close').on('click', (event) => {
        $('.page2-phone-card form input').val('');
      });
    } else {
      var postData = 'phone=' + phoneNumber.toString() + '&team=' + voteTeam;
      ajaxPost(testUrl, postData, submitPhoneNumber, handleAjaxFail);
    }
  });
})();
