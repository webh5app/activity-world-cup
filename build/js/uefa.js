'use strict';

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
var ajaxGet = function ajaxGet(url, success_cb, fail_cb) {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json'
  }).done(function (data, textStatus, jqXHR) {
    success_cb(data);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail_cb(errorThrown);
  });
};
var ajaxPost = function ajaxPost(url, data, success_cb, fail_cb) {
  $.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: data
  }).done(function (data, textStatus, jqXHR) {
    success_cb(data);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail_cb(errorThrown);
  });
};

// Callback functions for ajax requests
var showInfo = function showInfo(data) {
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

  if (expired) {
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
var submitPhoneNumber = function submitPhoneNumber(data) {
  console.log(data);
  if (data.errcode === undefined) {
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
var handleAjaxFail = function handleAjaxFail(errorThrown) {
  $('#myModalLabel').text(errorThrown);
  $('.modal-body').text('请刷新页面，尝试重新载入！');
  // 弹出模态框
  $('#myModal').modal('show');
};

// js里修改html里所有图片的前缀地址，这样就可以方便修改路径
var setImagePath = function setImagePath() {
  $('img').each(function (i) {
    var original_src = $(this).attr('src');
    if (original_src !== undefined) {
      $(this).attr('src', cdn_root_path + original_src);
    }
  });

  $('link').each(function (i) {
    // $(this).attr('href', );
  });
};

// 程序开始执行
(function () {
  var body_element = $('body');
  body_element.css('width', window.innerWidth + 'px');
  body_element.css('height', window.innerHeight + 'px');

  setImagePath();

  // 在数据到达之前显示加载框
  $('#process-container').css('display', 'block');

  // 获取首页信息
  ajaxGet(testUrl, showInfo, handleAjaxFail);

  $('#vote-button-1').on('click', function (event) {
    event.preventDefault();
    if (!expired) {
      // 隐藏第一页，展示第二页，更新背景足球场白色边框
      $('.page1').css('display', 'none');
      $('.page2').css('display', 'block');
      $('.frame img').attr('src', cdn_root_path + 'images/football-frame-3.png');

      // 存储用户投的队伍名称，后面第二页post请求会用到
      voteTeam = hostName;
    }
  });

  $('#vote-button-2').on('click', function (event) {
    event.preventDefault();
    if (!expired) {
      // 隐藏第一页，展示第二页，更新背景足球场白色边框
      $('.page1').css('display', 'none');
      $('.page2').css('display', 'block');
      $('.frame img').attr('src', cdn_root_path + 'images/football-frame-3.png');

      // 存储用户投的队伍名称，后面第二页post请求会用到
      voteTeam = guestName;
    }
  });

  $('#confirm').on('click', function (event) {
    event.preventDefault();
    var phoneNumber = $('.page2-phone-card form input').val();
    var phoneNumberRegExp = new RegExp('(^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7})$', 'g');
    if (!phoneNumberRegExp.test(phoneNumber)) {
      $('#myModalLabel').text('发生错误');
      $('.modal-body').text('手机号格式错误！请重新输入！');
      // 弹出模态框
      $('#myModal').modal('show');
      $('#modal-close').on('click', function (event) {
        $('.page2-phone-card form input').val('');
      });
    } else {
      var postData = 'phone=' + phoneNumber.toString() + '&team=' + voteTeam;
      ajaxPost(testUrl, postData, submitPhoneNumber, handleAjaxFail);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,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VyxXQUFXLFlBQVksUUFBWixFQUFYLEdBQW9DLFFBQXBDLEdBQStDLFFBQTlEO0FBQ0EsZUFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTRCLGlCQUE1QixFQUErQyxjQUEvQztBQUNEO0FBQ0YsR0FoQkQ7QUFpQkQsQ0F4REQiLCJmaWxlIjoidWVmYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEdsb2JhbCB2YXJpYWJsZXMgYW5kIGZ1bmN0aW9uc1xudmFyIHZvdGVUZWFtOyAvLyDnlKjmiLfmlK/mjIHnmoTnkIPpmJ9cbnZhciBnYW1lRGF0ZTsgLy8g5q+U6LWb5pe26Ze0XG52YXIgdm90ZUVuZFRpbWU7IC8vIOaKleelqOaIquatouaXtumXtFxudmFyIGV4cGlyZWQ7IC8vIOmhtemdouaYr+WQpui/h+acn++8jOi/h+acn+S4unRydWVcbnZhciBzaG9ydFVybDsgLy8gcGFnZTMg55So5LqO5YiG5Lqr55qE6ZO+5o6lXG52YXIgaG9zdEZsYWcsIGhvc3ROYW1lLCBob3N0TmFtZUNOOyAvLyDkuLvpmJ/kv6Hmga8gKOWbveaXl+WbvueJh+eahOWQjeensO+8jOWbveWutuWQjeensO+8jOWbveWutuS4reaWh+WQjeensClcbnZhciBndWVzdEZsYWcsIGd1ZXN0TmFtZSwgZ3Vlc3ROYW1lQ047IC8vIOWuoumYn+S/oeaBryAo5Zu95peX5Zu+54mH55qE5ZCN56ew77yM5Zu95a625ZCN56ew77yM5Zu95a625Lit5paH5ZCN56ewKVxudmFyIHRlc3RVcmwgPSBcInJlc3VsdC5qc29uXCI7XG4vLyB2YXIgdGVzdFVybCA9ICdodHRwOi8vMTAuMTI0LjE4LjExNTo4MDgwL2FwaS92MS9hY3Rpdml0eS93b3JsZGN1cC81MmFiN2JjMy1iMzZkLTQ1NGUtYTllMy03OWM3Mjg5MWFiZjYvJztcbnZhciBjZG5fcm9vdF9wYXRoID0gJy4vJztcbnZhciBhamF4R2V0ID0gKHVybCwgc3VjY2Vzc19jYiwgZmFpbF9jYikgPT4ge1xuICAkLmFqYXgoe1xuICAgIHR5cGU6ICdHRVQnLFxuICAgIHVybDogdXJsLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSlcbiAgLmRvbmUoKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB7XG4gICAgc3VjY2Vzc19jYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4ge1xuICAgIGZhaWxfY2IoZXJyb3JUaHJvd24pO1xuICB9KTtcbn07XG52YXIgYWpheFBvc3QgPSAodXJsLCBkYXRhLCBzdWNjZXNzX2NiLCBmYWlsX2NiKSA9PiB7XG4gICQuYWpheCh7XG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIHVybDogdXJsLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JyxcbiAgICBkYXRhOiBkYXRhXG4gIH0pXG4gIC5kb25lKChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4ge1xuICAgIHN1Y2Nlc3NfY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHtcbiAgICBmYWlsX2NiKGVycm9yVGhyb3duKTtcbiAgfSk7XG59O1xuXG4vLyBDYWxsYmFjayBmdW5jdGlvbnMgZm9yIGFqYXggcmVxdWVzdHNcbnZhciBzaG93SW5mbyA9IChkYXRhKSA9PiB7XG4gIGNvbnNvbGUubG9nKGRhdGEpO1xuICBnYW1lRGF0ZSA9IGRhdGEubWV0YS5zdGFydEF0O1xuICB2b3RlRW5kVGltZSA9IGRhdGEubWV0YS5lbmRBdDtcbiAgZXhwaXJlZCA9IGRhdGEubWV0YS5leHBpcmVkO1xuICBleHBpcmVkID0gZmFsc2U7XG4gIHNob3J0VXJsID0gZGF0YS5zaG9ydF91cmw7XG4gIGhvc3RGbGFnID0gZGF0YS5ob3N0LmZsYWc7XG4gIGhvc3ROYW1lID0gZGF0YS5ob3N0Lm5hbWU7XG4gIGhvc3ROYW1lQ04gPSBkYXRhLmhvc3QubmFtZUNOO1xuICBndWVzdEZsYWcgPSBkYXRhLmd1ZXN0LmZsYWc7XG4gIGd1ZXN0TmFtZSA9IGRhdGEuZ3Vlc3QubmFtZTtcbiAgZ3Vlc3ROYW1lQ04gPSBkYXRhLmd1ZXN0Lm5hbWVDTjtcbiAgLy8g5pu05paw5Li744CB5a6i6Zif5pSv5oyB56Wo5pWwXG4gICQoJyNob3N0LXZvdGUtbnVtYmVyJykudGV4dChkYXRhLmhvc3Qudm90ZSk7XG4gICQoJyNndWVzdC12b3RlLW51bWJlcicpLnRleHQoZGF0YS5ndWVzdC52b3RlKTtcbiAgLy8g6K6+572u5Zu95peX5Zu+54mH5Zyw5Z2AXG4gICQoJyNmbGFnLWhvc3QnKS5hdHRyKCdzcmMnLCBjZG5fcm9vdF9wYXRoICsgJ2ltYWdlcy8nICsgaG9zdEZsYWcgKyAnLnBuZycpO1xuICAkKCcjZmxhZy1ndWVzdCcpLmF0dHIoJ3NyYycsIGNkbl9yb290X3BhdGggKyAnaW1hZ2VzLycgKyBndWVzdEZsYWcgKyAnLnBuZycpO1xuICAvLyDorr7nva7ms6jlhozmjInpkq7pk77mjqVcbiAgJCgnI3JlZ2lzdGVyLXVybCcpLmF0dHIoJ2hyZWYnLCBkYXRhLnJlZ2lzdGVyX3VybCk7XG4gIC8vIOiuvue9ruavlOi1m+aXtumXtOaWh+acrFxuICAkKCcjcGFnZTEtdGl0bGUtdGltZScpLnRleHQoZ2FtZURhdGUpO1xuICAvLyDorr7nva7igJzop4TliJnigJ3ph4znmoTmiKrmraLmipXnpajml7bpl7RcbiAgJCgnI3ZvdGUtZW5kVGltZScpLnRleHQoJzIuIOaKleelqOaIquatouaXtumXtO+8micgKyB2b3RlRW5kVGltZSk7XG5cbiAgaWYoZXhwaXJlZCkge1xuICAgICQoJy52b3RlLWJ1dHRvbicpLmNzcyh7XG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjOTVhNWE2JyxcbiAgICAgICdjdXJzb3InOiAnZGVmYXVsdCdcbiAgICB9KS50ZXh0KCfmipXnpajlt7LmiKrmraInKTtcbiAgICAkKCcjdm90ZS1idXR0b24tMScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcjOTVhNWE2Jyk7XG4gICAgJCgnI3ZvdGUtYnV0dG9uLTInKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnIzk1YTVhNicpO1xuICB9XG5cbiAgLy8g5pWw5o2u5Yqg6L295a6M5q+V77yM6ZqQ6JeP5Yqg6L295qGGXG4gICQoJyNwcm9jZXNzLWNvbnRhaW5lcicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG59O1xudmFyIHN1Ym1pdFBob25lTnVtYmVyID0gKGRhdGEpID0+IHtcbiAgY29uc29sZS5sb2coZGF0YSk7XG4gIGlmKGRhdGEuZXJyY29kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8g6ZqQ6JeP56ys5LqM6aG177yM5bGV56S656ys5LiJ6aG177yM5pu05paw6IOM5pmv6Laz55CD5Zy655m96Imy6L655qGGXG4gICAgJCgnLnBhZ2UyJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAkKCcucGFnZTMnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAkKCcuZnJhbWUgaW1nJykuYXR0cignc3JjJywgY2RuX3Jvb3RfcGF0aCArICdpbWFnZXMvZm9vdGJhbGwtZnJhbWUtNS5wbmcnKTtcbiAgICAvLyDorr7nva7liIbkuqvpk77mjqVcbiAgICAkKCcjc2hvcnQtdXJsJykudmFsKHNob3J0VXJsKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXJyb3JNc2c7XG4gICAgc3dpdGNoIChkYXRhLmVycmNvZGUpIHtcbiAgICAgIGNhc2UgNDAwNzE3OlxuICAgICAgICBlcnJvck1zZyA9IFwi5oqV56Wo5bey5oiq5q2i77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDA3MTg6XG4gICAgICAgIGVycm9yTXNnID0gXCLlj5HnlJ/plJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQwMDcxOTpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaJi+acuuWPt+eggemUmeivr++8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDAwNzIwOlxuICAgICAgICBlcnJvck1zZyA9IFwi5Y+R55Sf6ZSZ6K+v77yM6K+36YeN5paw6L6T5YWl77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDA3MjE6XG4gICAgICAgIGVycm9yTXNnID0gXCLmraTmiYvmnLrlj7flt7LmipXov4fnpajkuoblk6bvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBlcnJvck1zZyA9IFwi5Y+R55Sf5pyq55+l6ZSZ6K+v77yM6K+36YeN5paw6L6T5YWl77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAkKCcjbXlNb2RhbExhYmVsJykudGV4dCgn5Y+R55Sf6ZSZ6K+vJyk7XG4gICAgJCgnLm1vZGFsLWJvZHknKS50ZXh0KGVycm9yTXNnKTtcbiAgICAvLyDlvLnlh7rmqKHmgIHmoYZcbiAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gIH1cbn07XG52YXIgaGFuZGxlQWpheEZhaWwgPSAoZXJyb3JUaHJvd24pID0+IHtcbiAgJCgnI215TW9kYWxMYWJlbCcpLnRleHQoZXJyb3JUaHJvd24pO1xuICAkKCcubW9kYWwtYm9keScpLnRleHQoJ+ivt+WIt+aWsOmhtemdou+8jOWwneivlemHjeaWsOi9veWFpe+8gScpO1xuICAvLyDlvLnlh7rmqKHmgIHmoYZcbiAgJCgnI215TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xufTtcblxuLy8ganPph4zkv67mlLlodG1s6YeM5omA5pyJ5Zu+54mH55qE5YmN57yA5Zyw5Z2A77yM6L+Z5qC35bCx5Y+v5Lul5pa55L6/5L+u5pS56Lev5b6EXG52YXIgc2V0SW1hZ2VQYXRoID0gKCkgPT4ge1xuICAkKCdpbWcnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICB2YXIgb3JpZ2luYWxfc3JjID0gJCh0aGlzKS5hdHRyKCdzcmMnKTtcbiAgICBpZihvcmlnaW5hbF9zcmMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCBjZG5fcm9vdF9wYXRoICsgb3JpZ2luYWxfc3JjKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoJ2xpbmsnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAvLyAkKHRoaXMpLmF0dHIoJ2hyZWYnLCApO1xuICB9KVxufTtcblxuXG5cbi8vIOeoi+W6j+W8gOWni+aJp+ihjFxuKCgpID0+IHtcbiAgdmFyIGJvZHlfZWxlbWVudCA9ICQoJ2JvZHknKTtcbiAgYm9keV9lbGVtZW50LmNzcygnd2lkdGgnLCB3aW5kb3cuaW5uZXJXaWR0aCArICdweCcpO1xuICBib2R5X2VsZW1lbnQuY3NzKCdoZWlnaHQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgKyAncHgnKTtcblxuICBzZXRJbWFnZVBhdGgoKTtcblxuICAvLyDlnKjmlbDmja7liLDovr7kuYvliY3mmL7npLrliqDovb3moYZcbiAgJCgnI3Byb2Nlc3MtY29udGFpbmVyJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgLy8g6I635Y+W6aaW6aG15L+h5oGvXG4gIGFqYXhHZXQodGVzdFVybCwgc2hvd0luZm8sIGhhbmRsZUFqYXhGYWlsKTtcblxuICAkKCcjdm90ZS1idXR0b24tMScpLm9uKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYoIWV4cGlyZWQpIHtcbiAgICAgIC8vIOmakOiXj+esrOS4gOmhte+8jOWxleekuuesrOS6jOmhte+8jOabtOaWsOiDjOaZr+i2s+eQg+WcuueZveiJsui+ueahhlxuICAgICAgJCgnLnBhZ2UxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICQoJy5wYWdlMicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgJCgnLmZyYW1lIGltZycpLmF0dHIoJ3NyYycsIGNkbl9yb290X3BhdGggKyAnaW1hZ2VzL2Zvb3RiYWxsLWZyYW1lLTMucG5nJyk7XG5cbiAgICAgIC8vIOWtmOWCqOeUqOaIt+aKleeahOmYn+S8jeWQjeensO+8jOWQjumdouesrOS6jOmhtXBvc3Tor7fmsYLkvJrnlKjliLBcbiAgICAgIHZvdGVUZWFtID0gaG9zdE5hbWU7XG4gICAgfVxuICB9KTtcblxuICAkKCcjdm90ZS1idXR0b24tMicpLm9uKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYoIWV4cGlyZWQpIHtcbiAgICAgIC8vIOmakOiXj+esrOS4gOmhte+8jOWxleekuuesrOS6jOmhte+8jOabtOaWsOiDjOaZr+i2s+eQg+WcuueZveiJsui+ueahhlxuICAgICAgJCgnLnBhZ2UxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICQoJy5wYWdlMicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgJCgnLmZyYW1lIGltZycpLmF0dHIoJ3NyYycsIGNkbl9yb290X3BhdGggKyAnaW1hZ2VzL2Zvb3RiYWxsLWZyYW1lLTMucG5nJyk7XG5cbiAgICAgIC8vIOWtmOWCqOeUqOaIt+aKleeahOmYn+S8jeWQjeensO+8jOWQjumdouesrOS6jOmhtXBvc3Tor7fmsYLkvJrnlKjliLBcbiAgICAgIHZvdGVUZWFtID0gZ3Vlc3ROYW1lO1xuICAgIH1cbiAgfSk7XG5cbiAgJCgnI2NvbmZpcm0nKS5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBwaG9uZU51bWJlciA9ICQoJy5wYWdlMi1waG9uZS1jYXJkIGZvcm0gaW5wdXQnKS52YWwoKTtcbiAgICB2YXIgcGhvbmVOdW1iZXJSZWdFeHAgPSBuZXcgUmVnRXhwKCcoXigxM1xcXFxkfDE1W140LFxcXFxEXXwxN1sxMzY3OF18MThcXFxcZClcXFxcZHs4fXwxNzBbXjM0NixcXFxcRF1cXFxcZHs3fSkkJywgJ2cnKTtcbiAgICBpZighcGhvbmVOdW1iZXJSZWdFeHAudGVzdChwaG9uZU51bWJlcikpIHtcbiAgICAgICQoJyNteU1vZGFsTGFiZWwnKS50ZXh0KCflj5HnlJ/plJnor68nKTtcbiAgICAgICQoJy5tb2RhbC1ib2R5JykudGV4dCgn5omL5py65Y+35qC85byP6ZSZ6K+v77yB6K+36YeN5paw6L6T5YWl77yBJyk7XG4gICAgICAvLyDlvLnlh7rmqKHmgIHmoYZcbiAgICAgICQoJyNteU1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICQoJyNtb2RhbC1jbG9zZScpLm9uKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAkKCcucGFnZTItcGhvbmUtY2FyZCBmb3JtIGlucHV0JykudmFsKCcnKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcG9zdERhdGEgPSAncGhvbmU9JyArIHBob25lTnVtYmVyLnRvU3RyaW5nKCkgKyAnJnRlYW09JyArIHZvdGVUZWFtO1xuICAgICAgYWpheFBvc3QodGVzdFVybCwgcG9zdERhdGEsIHN1Ym1pdFBob25lTnVtYmVyLCBoYW5kbGVBamF4RmFpbCk7XG4gICAgfVxuICB9KTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
