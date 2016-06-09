var $ = Zepto;


// 页面加载完成后
var frenchShow = $('#french-show');
var romaniaShow = $('#romania-show');

// 填充数据
getRequest(function(data) {
  frenchShow[0].innerHTML = data.host.vote;
  romaniaShow[0].innerHTML = data.guest.vote;
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
    // 提交数据
    // $.ajax()
    // 处理数据

    // 切入下一页
    $('#page-container').addClass('toogle-2-to-3');
  }
});

// 点击进入注册页面
$('#page-2-register').on('click', function(e) {
  window.location.href = 'http://www.baidu.com';
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
  var url = 'http://10.124.18.115:8080/api/v1/activity/worldcup/52ab7bc3-b36d-454e-a9e3-79c72891abf6/';

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
  var prefix = 'http://10.124.18.115:8080/api/v1/activity/worldcup/52ab7bc3-b36d-454e-a9e3-79c72891abf6/'

  $.ajax({
    type: 'POST',
    url: prefix + url,
    data: data,
    contentType: 'application/x-www-form-urlencoded',
  })
}
