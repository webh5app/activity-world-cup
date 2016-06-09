var $ = Zepto;

// 页面加载完成后
var frenchShow = $('#french-show');
var romaniaShow = $('#romania-show');
var shareInput = $('#page-3-input');
var registerUrl;

var _id = location.href.split('/')[5];

// 填充数据
getRequest(function(data) {
  frenchShow[0].innerHTML = data.host.vote;
  romaniaShow[0].innerHTML = data.guest.vote;
  registerUrl = data.register_url;
  shareInput.val(data.short_url);
});

// 点击进入第二页
$(".vote-button").on('click', function(e) {
  name = $(e.target).data('name');
  $('#page-container').addClass('toggle-1-to-2');
});

// 点击进入第三页
$('#page-2-send').on('click', function(e) {
  // 检查页面
  var phone = $('#page-2-input').val();
  var phoneRegex = /(^(13\d|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/g;

  if (!phoneRegex.test(phone)) {
    $('#model--content')[0].innerHTML = '输入手机号错误';
    $('#model').addClass('toggled')
  } else {
    $('#process-container').addClass('toggled');
    // 提交数据
    postRequest("phone=" + phone + "&team=" + name, function(data) {
      var error;

      if(data.errcode === undefined) {
        $('#process-container').removeClass('toggled');
        $('#page-container').addClass('toogle-2-to-3');
        return;
      }

      switch (data.errcode) {
        case 400718:
          error = "发生错误，请重新输入！";
          break;
        case 400719:
          error = "手机号码错误！";
          break;
        case 400720:
          error = "发生错误，请重新输入！";
          break;
        case 400721:
          error = "此手机号已投过票了哦！";
          break;
        default:
          error = "发生未知错误，请重新输入！";
          break;
      }

      $('#model--content')[0].innerHTML = error;
      $('#model').addClass('toggled')

    }, function() {
      $('#model--content')[0].innerHTML = '网络连接失败';
      $('#model').addClass('toggled')
    });
  }
});

// 点击进入注册页面
$('#page-2-register').on('click', function(e) {
  window.location.href = registerUrl;
});

// 取消模态框
$('#model-footer').on('click', function() {
    $('#model').removeClass('toggled');
});
$('#model').on('click', function() {
    $('#model').removeClass('toggled');
});

// 动态渲染主页
var flags = $('#flags');
flags.css('top', (window.innerHeight / 2 - 33) + 'px');


function getRequest(success_cb, error_cb) {
  var url = '/api/v1/activity/worldcup/' + _id;

  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    timeout: 300,
    success: success_cb,
    error: error_cb
  });
}

function postRequest(data, success_cb, error_cb) {
  var url = '/api/v1/activity/worldcup/' + _id;

  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    contentType: 'application/x-www-form-urlencoded',
    success: success_cb,
    error: error_cb,
  })
}
