;(function($) {
  var api_url = "http://www.uberqd.com/api/v1/activity/worldcup/38550e68-b2fd-46ab-9176-202b15f723fd/";
  var server_data;
  var flag;

  function viewRender() {
    var body_element = $('body');
    var _uuid = window.location.href.split('/')[5];

    // 设定 body 的长与框为视口的大小, 并不可缩放;
    body_element.css('width', window.innerWidth + 'px');
    body_element.css('height', window.innerHeight + 'px');

    // 远程服务器
    // api_url = api_url + _uuid + '/';

    ajaxGet(api_url, function(data) {
      server_data = data;
      $('#french-number').text(parseInt(server_data.host.vote * 2.2));
      $('#romania-number').text(parseInt(server_data.guest.vote));
      $('#share-input').val(server_data.short_url)
    }, function() {
      // 出错提醒
      $('#info-content').text('网络连接异常');
      togglePage("#info", 'on');
    })

    // 监控图片加载
    togglePage('#process-container', 'on');
    var _image = document.createElement('img');
    _image.src= "./images/background.png";
    _image.onload = function () {
      togglePage('#process-container', 'off');
    };
  }

  // @status: on 触发 off 关闭
  function togglePage(page_id, status) {
    var page_id = $(page_id);
    if (status === 'on')
      page_id.css('display', 'block');
    if (status === 'off')
      page_id.css('display', 'none');
  }

  function mountListener() {
    var french_button = $('#vote-french');
    var romania_button = $('#vote-romania');

    var confirm_button = $('#confirm');
    var register_button = $('#register');

    var confirm_input = $('#phone-input');

    french_button.on('click', toConfirmPage('french'));
    french_button.on('touch', toConfirmPage('french'));
    romania_button.on('click', toConfirmPage('romania'));
    romania_button.on('touch', toConfirmPage('romania'));

    confirm_input.on('click', function() {
      var label = $('#input-label');
      label.text('输入优步手机号');
      label.css('color', '#1a97f1')
    });

    confirm_button.on('click', toSharePage);
    confirm_button.on('touch', toSharePage);

    register_button.on('click', function() {
      window.location.href = server_data.register_url;
    });

    register_button.on('touch', function() {
      window.location.href = server_data.register_url;
    });

    // 取消模态框
    $('#info-footer').on('click', closeInfo);
    $('#info-footer').on('touch', closeInfo);
    $('#info').on('click', closeInfo);
    $('#info').on('touch', closeInfo);
  }

  function closeInfo() {
    togglePage("#info", 'off');
  }

  function toConfirmPage(_flag) {
    return function() {
      flag = _flag;
      togglePage('#page-1', 'off');
      togglePage('#page-2', 'on');
    }
  }

  function toSharePage() {
    var error;
    var label = $('#input-label');
    var phone = $('#phone-input').val();
    var phone_regex = /(^(13\d|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/g;

    if(!phone) {
      label.text('请填写手机号');
      label.css('color', 'red')
      return;
    }

    // 打开加载 tips
    togglePage('#process-container', 'on');
    if (!phone_regex.test(phone)) {
      // 打开错误提示
      label.text('手机号输入错误');
      label.css('color', 'red')
    } else {
      ajaxPost(api_url, "phone="+phone+"&team="+flag, function(data) {
        if(data.errcode === undefined) {
          togglePage('#process-container', 'off');
          togglePage('#page-2', 'off');
          togglePage('#page-3', 'on');
          return;
        }

        // 消除加载 tips
        togglePage('#process-container', 'off');
        switch (data.errcode) {
          case 400715:
            error = '活动未开始!';
            break;
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

        $('#info-content').text(error);
        togglePage("#info", 'on');

      }, function() {
        $('#info-content').text('网络连接异常');
        togglePage("#info", 'on');
      });

    }
  }

  // 页面渲染初始化
  viewRender();

  mountListener();

  ajaxGet(api_url, function(data) {

  }, function (data) {

  });

    // checkPageSize();
})(Zepto);

// 封装函数
function ajaxGet(url, success_cb, error_cb) {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    timeout: 300,
    success: success_cb,
    error: error_cb
  });
}

function ajaxPost(url, data, success_cb, error_cb) {
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    contentType: 'application/x-www-form-urlencoded',
    success: success_cb,
    error: error_cb
  });
}
