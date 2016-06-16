'use strict';

// 全局变量:
// var prefix = 'http://10.124.18.115:8080/';
var prefix = '/';
var path = 'api/v1/activity/worldcup/';

var uuid;
var reqUrl = '../api.json'; // 本地临时测试用
var voteTeam;
var cards = {
  date_1: [],
  date_2: [],
  date_3: [],
  date_4: [],
  date_5: []
};
var date = new Date();
var day = date.getDate();
var dateString_1 = void 0;
var dateString_2 = void 0;
var dateString_3 = void 0;
var dateString_4 = void 0;
var dateString_5 = void 0;

// 通用函数们:
// 1. ajax get&post functions
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

// 2. 生成 html 组件
var createHtmlP = function createHtmlP(text) {
  var style = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

  if (style === undefined) {
    return $('<p>' + text + '</p>');
  }

  // 如果有样式传入，加上样式
  var styles = '';
  for (var key in style) {
    styles = styles + key + ':' + style[key] + ';';
  }
  return $('<p style="' + styles + '">' + text + '</p>');
};
var createHtmlImg = function createHtmlImg(src, alt) {
  return $('<img alt="' + alt + '" src="' + src + '" />');
};
var createHtmlButton = function createHtmlButton(text, team, uuid, expired) {
  if (expired) {
    var tempButton = $('<button data-team="' + team + '" data-uuid="' + uuid + '">已结束</button>');
    tempButton.attr('disabled', 'disabled');
    tempButton.css('background-color', '#95a5a6');
    return tempButton;
  }
  return $('<button data-team="' + team + '" data-uuid="' + uuid + '">' + text + '</button>');
};
var createHtmlDiv = function createHtmlDiv(listOfElements, divClassName) {
  var tempDiv = $('<div class="' + divClassName + '">' + '</div>');
  for (var i = 0; i < listOfElements.length; i++) {
    listOfElements[i].appendTo(tempDiv);
  }
  return tempDiv;
};

// 3. 动态生成一个比赛对阵卡
var createHtmlGameCard = function createHtmlGameCard(hostName, hostNameCN, hostFlag, guestName, guestNameCN, guestFlag, time, uuid, expired) {
  var hostTitle = createHtmlP(hostNameCN);
  // const hostFlag = createHtmlImg('./images/' + hostName + '.png', 'hostFLag');
  // const hostFlag = createHtmlImg('./images/' + hostName + '.jpg', 'hostFLag');
  var hostFlagElement = createHtmlImg(hostFlag, 'hostFLag');
  var hostVoteButton = createHtmlButton('点击投票', hostName, uuid, expired);
  var guestTitle = createHtmlP(guestNameCN);
  // const guestFlag = createHtmlImg('./images/' + guestName + '.png', 'guestFLag');
  // const guestFlag = createHtmlImg('./images/' + guestName + '.jpg', 'guestFLag');
  var guestFlagElement = createHtmlImg(guestFlag, 'guestFLag');
  var guestVoteButton = createHtmlButton('点击投票', guestName, uuid, expired);
  var leftDiv = createHtmlDiv([hostTitle, hostFlagElement, hostVoteButton], 'page0-gamecard-left');
  var midDiv = createHtmlDiv([createHtmlP('vs'), createHtmlP(time)], 'page0-gamecard-mid');
  var rightDiv = createHtmlDiv([guestTitle, guestFlagElement, guestVoteButton], 'page0-gamecard-right');
  var cardDiv = createHtmlDiv([leftDiv, midDiv, rightDiv], 'page0-timetable-game');

  return cardDiv;
};

// 4. 添加或删除 某一天的比赛卡片
var addGameCardsOnOneDayInHtml = function addGameCardsOnOneDayInHtml(cardsOnOneDay) {
  for (var i in cardsOnOneDay) {
    cardsOnOneDay[i].addClass('animated flipInX');
    $('.page0-timetable').append(cardsOnOneDay[i]);
  }
  // 给投票按钮添加click事件监听
  $('.page0-timetable-game button').on('click', function (event) {
    event.preventDefault();
    voteTeam = this.dataset.team;
    uuid = this.dataset.uuid;
    $('#myModal').modal('show');
  });
};
var removeGameCardsOnOneDayInHtml = function removeGameCardsOnOneDayInHtml(cardsOnOneDay) {
  for (var i in cardsOnOneDay) {
    cardsOnOneDay[i].removeClass('flipInX');
    cardsOnOneDay[i].remove();
  }
};

var preloadFiles = function preloadFiles() {
  var css_uefa = document.createElement('link');
  css_uefa.type = "text/css";
  css_uefa.rel = "stylesheet";
  css_uefa.href = "css/uefa.css";

  var css_animate = document.createElement('link');
  css_animate.type = "text/css";
  css_animate.rel = "stylesheet";
  css_animate.href = "bower_components/animate.css/animate.min.css";

  var js_bootstrap = document.createElement("script");
  js_bootstrap.type = "text/javascript";
  js_bootstrap.src = "bower_components/bootstrap/dist/js/bootstrap.min.js";

  $('head').first().append(css_animate);
  $('head').first().append(css_uefa);
  $('html').first().append(js_bootstrap);

  $('#football').append(createHtmlImg('//ooo.0o0.ooo/2016/06/15/57622df0744e3.png', 'football'));
  $('#logo').append(createHtmlImg('//ooo.0o0.ooo/2016/06/15/57622884e73bb.png', 'logo'));
};

// 5. ajax callback functions
var getInfo = function getInfo(data) {
  // 异步加载其它 js、css和图片
  preloadFiles();
  changeProgressBarValue(70);

  console.log(data);
  $('#date_1').text(dateString_1.substring(5));
  $('#date_2').text(dateString_2.substring(5));
  $('#date_3').text(dateString_3.substring(5));
  $('#date_4').text(dateString_4.substring(5));
  $('#date_5').text(dateString_5.substring(5));

  // 将卡片存储于cards
  for (var i = 0; i < data.data.races.length; i++) {
    var race = data.data.races[i];
    // console.log(race.host.flag);
    var expired = race.meta.expired; // 比赛是否过期
    var tempCard = createHtmlGameCard(race.host.name, race.host.nameCN, race.host.flag, race.guest.name, race.guest.nameCN, race.guest.flag, race.meta.startAt.split(' ')[1].substring(0, 5), race.uuid, expired);
    switch (data.data.races[i].meta.startAt.split(' ')[0]) {
      case dateString_1:
        cards.date_1.push(tempCard);
        break;
      case dateString_2:
        cards.date_2.push(tempCard);
        break;
      case dateString_3:
        cards.date_3.push(tempCard);
        break;
      case dateString_4:
        cards.date_4.push(tempCard);
        break;
      case dateString_5:
        cards.date_5.push(tempCard);
        break;
      default:
        break;
    }
  }

  // 为没有赛事的date添加无赛事卡片
  for (var i in cards) {
    if (cards[i].length == 0) {
      cards[i].push(createHtmlP('无赛事', {
        'width': '100%',
        'color': '#fff',
        'font-size': '2rem',
        'text-align': 'center'
      }));
    }
  }
  // 默认为今天的比赛
  addGameCardsOnOneDayInHtml(cards.date_3);
  changeProgressBarValue(100);

  // 加载完毕后停顿1s，再显示content，防止意外发生，显示也更流畅
  window.setTimeout(function () {
    loadEnd();
  }, 1000);
};
var postPhoneNumber = function postPhoneNumber(data) {
  if (data.errcode === undefined) {
    $('#wrongMsg').text('参与成功！');
    $('#wrongMsg').css('display', 'block');
    // 投票成功后，过两秒关闭modal窗口
    window.setTimeout(function () {
      $('#wrongMsg').css('display', 'none');
      $('#myModal').modal('hide');
    }, 2000);
    // 改变已投场次的按钮样式，并disabled按钮
    $('.page0-timetable-game button').each(function (i) {
      // console.log(this.dataset.uuid);
      if (this.dataset.uuid === uuid) {
        $(this).attr('disabled', 'disabled');
        if (voteTeam === this.dataset.team) {
          $(this).css('background-color', '#e74c3c');
        } else {
          $(this).css('background-color', '#95a5a6');
        }
        $(this).text('已投票');
      }
    });
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
    console.log(errorMsg);
  }
};
var handleAjaxFail = function handleAjaxFail(errorThrown) {
  // TODO 可用进度条替代
};

// 6. 加载完成，显示内容
var loadEnd = function loadEnd() {
  $('.progress-wrapper').css('display', 'none');
  $('.container-wrapper').css('display', 'block');
};
var changeProgressBarValue = function changeProgressBarValue(value) {
  var tempVal = value.toString();
  $('.progress-bar').attr('aria-valuenow', tempVal);
  $('.progress-bar').css('width', tempVal + '%');
};
// window.onload = () => {
//   changeProgressBarValue(30);
// }

// ***********
// **程序开始**
// ***********
$(function () {
  ajaxGet(prefix + path, getInfo, handleAjaxFail);

  // 设置5天的时间string，用于判断比赛日期
  switch (day) {
    case 29:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day - 2).toString();
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day - 1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day + 1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth() + 2).toString() + '-' + '1';
      break;
    case 30:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day - 2).toString();
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day - 1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth() + 2).toString() + '-' + '1';
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth() + 2).toString() + '-' + '2';
      break;
    case 1:
      dateString_1 = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + '29';
      dateString_2 = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + '30';
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day + 1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day + 2).toString();
      break;
    case 2:
      dateString_1 = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + '30';
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day - 1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day + 1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day + 2).toString();
      break;
    default:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day - 2).toString();
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day - 1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day + 1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (day + 2).toString();
      break;
  }

  // 监听日期栏点击事件，为了切换日期和比赛卡片
  $('.page0-date').on('click', function (event) {
    event.preventDefault();
    $('.page0-date').each(function () {
      if ($(this).hasClass('active-date')) {
        removeGameCardsOnOneDayInHtml(cards[$(this).attr('id')]);
        $(this).removeClass('active-date');
      }
    });
    $(this).addClass('active-date');
    addGameCardsOnOneDayInHtml(cards[$(this).attr('id')]);
  });

  // 监听投票modal框事件
  $('#join').on('click', function (event) {
    event.preventDefault();
    var phoneNumber = $('#userPhoneInput').val();
    var phoneNumberRegExp = new RegExp('(^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7})$', 'g');
    if (!phoneNumberRegExp.test(phoneNumber)) {
      $('#wrongMsg').text('手机号有误，请重试！');
      $('#wrongMsg').css('display', 'block');
    } else {
      ajaxPost(prefix + path + uuid + '/', 'phone=' + phoneNumber + '&team=' + voteTeam, postPhoneNumber, handleAjaxFail);
    }
  });
});
//# sourceMappingURL=data:application/json;base64,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LEVBQVEsUUFBUixDQUFpQixhQUFqQixDQUFILEVBQW9DO0FBQ2xDLHNDQUE4QixNQUFNLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxJQUFiLENBQU4sQ0FBOUI7QUFDQSxVQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLGFBQXBCO0FBQ0Q7QUFDRixLQUxEO0FBTUEsTUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixhQUFqQjtBQUNBLCtCQUEyQixNQUFNLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxJQUFiLENBQU4sQ0FBM0I7QUFDRCxHQVZEOzs7QUFhQSxJQUFFLE9BQUYsRUFBVyxFQUFYLENBQWMsT0FBZCxFQUF1QixVQUFTLEtBQVQsRUFBZ0I7QUFDckMsVUFBTSxjQUFOO0FBQ0EsUUFBSSxjQUFjLEVBQUUsaUJBQUYsRUFBcUIsR0FBckIsRUFBbEI7QUFDQSxRQUFJLG9CQUFvQixJQUFJLE1BQUosQ0FBVyxrRUFBWCxFQUErRSxHQUEvRSxDQUF4QjtBQUNBLFFBQUcsQ0FBQyxrQkFBa0IsSUFBbEIsQ0FBdUIsV0FBdkIsQ0FBSixFQUF5QztBQUN2QyxRQUFFLFdBQUYsRUFBZSxJQUFmLENBQW9CLFlBQXBCO0FBQ0EsUUFBRSxXQUFGLEVBQWUsR0FBZixDQUFtQixTQUFuQixFQUE4QixPQUE5QjtBQUNELEtBSEQsTUFHTztBQUNMLGVBQ0UsU0FBUyxJQUFULEdBQWdCLElBQWhCLEdBQXVCLEdBRHpCLEVBRUUsV0FBVyxXQUFYLEdBQXlCLFFBQXpCLEdBQW9DLFFBRnRDLEVBR0UsZUFIRixFQUlFLGNBSkY7QUFNRDtBQUNGLEdBZkQ7QUFnQkQsQ0F4RUQiLCJmaWxlIjoidWVmYV92Mi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIOWFqOWxgOWPmOmHjzpcbi8vIHZhciBwcmVmaXggPSAnaHR0cDovLzEwLjEyNC4xOC4xMTU6ODA4MC8nO1xudmFyIHByZWZpeCA9ICcvJztcbnZhciBwYXRoID0gJ2FwaS92MS9hY3Rpdml0eS93b3JsZGN1cC8nO1xuXG52YXIgdXVpZDtcbnZhciByZXFVcmwgPSAnLi4vYXBpLmpzb24nOyAvLyDmnKzlnLDkuLTml7bmtYvor5XnlKhcbnZhciB2b3RlVGVhbTtcbnZhciBjYXJkcyA9IHtcbiAgZGF0ZV8xOiBbXSxcbiAgZGF0ZV8yOiBbXSxcbiAgZGF0ZV8zOiBbXSxcbiAgZGF0ZV80OiBbXSxcbiAgZGF0ZV81OiBbXVxufTtcbmNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG5sZXQgZGF0ZVN0cmluZ18xO1xubGV0IGRhdGVTdHJpbmdfMjtcbmxldCBkYXRlU3RyaW5nXzM7XG5sZXQgZGF0ZVN0cmluZ180O1xubGV0IGRhdGVTdHJpbmdfNTtcblxuXG4vLyDpgJrnlKjlh73mlbDku6w6XG4vLyAxLiBhamF4IGdldCZwb3N0IGZ1bmN0aW9uc1xuY29uc3QgYWpheEdldCA9ICh1cmwsIHN1Y2Nlc3NfY2IsIGZhaWxfY2IpID0+IHtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiAnR0VUJyxcbiAgICB1cmw6IHVybCxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pXG4gIC5kb25lKChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4ge1xuICAgIHN1Y2Nlc3NfY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHtcbiAgICBmYWlsX2NiKGVycm9yVGhyb3duKTtcbiAgfSk7XG59O1xuY29uc3QgYWpheFBvc3QgPSAodXJsLCBkYXRhLCBzdWNjZXNzX2NiLCBmYWlsX2NiKSA9PiB7XG4gICQuYWpheCh7XG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIHVybDogdXJsLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JyxcbiAgICBkYXRhOiBkYXRhXG4gIH0pXG4gIC5kb25lKChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4ge1xuICAgIHN1Y2Nlc3NfY2IoZGF0YSk7XG4gIH0pXG4gIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHtcbiAgICBmYWlsX2NiKGVycm9yVGhyb3duKTtcbiAgfSk7XG59O1xuXG4vLyAyLiDnlJ/miJAgaHRtbCDnu4Tku7ZcbmNvbnN0IGNyZWF0ZUh0bWxQID0gKHRleHQsIHN0eWxlID0gdW5kZWZpbmVkKSA9PiB7XG4gIGlmKHN0eWxlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJCgnPHA+JyArIHRleHQgKyAnPC9wPicpO1xuICB9XG5cbiAgLy8g5aaC5p6c5pyJ5qC35byP5Lyg5YWl77yM5Yqg5LiK5qC35byPXG4gIHZhciBzdHlsZXMgPSAnJztcbiAgZm9yKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICBzdHlsZXMgPSBzdHlsZXMgKyBrZXkgKyAnOicgKyBzdHlsZVtrZXldICsgJzsnO1xuICB9XG4gIHJldHVybiAkKCc8cCBzdHlsZT1cIicgKyBzdHlsZXMgKyAnXCI+JyArIHRleHQgKyAnPC9wPicpO1xufTtcbmNvbnN0IGNyZWF0ZUh0bWxJbWcgPSAoc3JjLCBhbHQpID0+IHtcbiAgcmV0dXJuICQoJzxpbWcgYWx0PVwiJyArIGFsdCArICdcIiBzcmM9XCInICsgc3JjICsgJ1wiIC8+Jyk7XG59O1xuY29uc3QgY3JlYXRlSHRtbEJ1dHRvbiA9ICh0ZXh0LCB0ZWFtLCB1dWlkLCBleHBpcmVkKSA9PiB7XG4gIGlmKGV4cGlyZWQpIHtcbiAgICB2YXIgdGVtcEJ1dHRvbiA9ICQoJzxidXR0b24gZGF0YS10ZWFtPVwiJyArIHRlYW0gKyAnXCIgZGF0YS11dWlkPVwiJyArIHV1aWQgKyAnXCI+5bey57uT5p2fPC9idXR0b24+Jyk7XG4gICAgdGVtcEJ1dHRvbi5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgIHRlbXBCdXR0b24uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJyM5NWE1YTYnKTtcbiAgICByZXR1cm4gdGVtcEJ1dHRvbjtcbiAgfVxuICByZXR1cm4gJCgnPGJ1dHRvbiBkYXRhLXRlYW09XCInICsgdGVhbSArICdcIiBkYXRhLXV1aWQ9XCInICsgdXVpZCArICdcIj4nICsgdGV4dCArICc8L2J1dHRvbj4nKTtcbn07XG5jb25zdCBjcmVhdGVIdG1sRGl2ID0gKGxpc3RPZkVsZW1lbnRzLCBkaXZDbGFzc05hbWUpID0+IHtcbiAgdmFyIHRlbXBEaXYgPSAkKCc8ZGl2IGNsYXNzPVwiJyArIGRpdkNsYXNzTmFtZSArICdcIj4nICsgJzwvZGl2PicpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZkVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGlzdE9mRWxlbWVudHNbaV0uYXBwZW5kVG8odGVtcERpdik7XG4gIH1cbiAgcmV0dXJuIHRlbXBEaXY7XG59O1xuXG4vLyAzLiDliqjmgIHnlJ/miJDkuIDkuKrmr5TotZvlr7npmLXljaFcbmNvbnN0IGNyZWF0ZUh0bWxHYW1lQ2FyZCA9IChcbiAgaG9zdE5hbWUsXG4gIGhvc3ROYW1lQ04sXG4gIGhvc3RGbGFnLFxuICBndWVzdE5hbWUsXG4gIGd1ZXN0TmFtZUNOLFxuICBndWVzdEZsYWcsXG4gIHRpbWUsXG4gIHV1aWQsXG4gIGV4cGlyZWRcbikgPT4ge1xuICBjb25zdCBob3N0VGl0bGUgPSBjcmVhdGVIdG1sUChob3N0TmFtZUNOKTtcbiAgLy8gY29uc3QgaG9zdEZsYWcgPSBjcmVhdGVIdG1sSW1nKCcuL2ltYWdlcy8nICsgaG9zdE5hbWUgKyAnLnBuZycsICdob3N0RkxhZycpO1xuICAvLyBjb25zdCBob3N0RmxhZyA9IGNyZWF0ZUh0bWxJbWcoJy4vaW1hZ2VzLycgKyBob3N0TmFtZSArICcuanBnJywgJ2hvc3RGTGFnJyk7XG4gIGNvbnN0IGhvc3RGbGFnRWxlbWVudCA9IGNyZWF0ZUh0bWxJbWcoaG9zdEZsYWcsICdob3N0RkxhZycpO1xuICBjb25zdCBob3N0Vm90ZUJ1dHRvbiA9IGNyZWF0ZUh0bWxCdXR0b24oJ+eCueWHu+aKleelqCcsIGhvc3ROYW1lLCB1dWlkLCBleHBpcmVkKTtcbiAgY29uc3QgZ3Vlc3RUaXRsZSA9IGNyZWF0ZUh0bWxQKGd1ZXN0TmFtZUNOKTtcbiAgLy8gY29uc3QgZ3Vlc3RGbGFnID0gY3JlYXRlSHRtbEltZygnLi9pbWFnZXMvJyArIGd1ZXN0TmFtZSArICcucG5nJywgJ2d1ZXN0RkxhZycpO1xuICAvLyBjb25zdCBndWVzdEZsYWcgPSBjcmVhdGVIdG1sSW1nKCcuL2ltYWdlcy8nICsgZ3Vlc3ROYW1lICsgJy5qcGcnLCAnZ3Vlc3RGTGFnJyk7XG4gIGNvbnN0IGd1ZXN0RmxhZ0VsZW1lbnQgPSBjcmVhdGVIdG1sSW1nKGd1ZXN0RmxhZywgJ2d1ZXN0RkxhZycpO1xuICBjb25zdCBndWVzdFZvdGVCdXR0b24gPSBjcmVhdGVIdG1sQnV0dG9uKCfngrnlh7vmipXnpagnLCBndWVzdE5hbWUsIHV1aWQsIGV4cGlyZWQpO1xuICBjb25zdCBsZWZ0RGl2ID0gY3JlYXRlSHRtbERpdihbaG9zdFRpdGxlLCBob3N0RmxhZ0VsZW1lbnQsIGhvc3RWb3RlQnV0dG9uXSwgJ3BhZ2UwLWdhbWVjYXJkLWxlZnQnKTtcbiAgY29uc3QgbWlkRGl2ID0gY3JlYXRlSHRtbERpdihbY3JlYXRlSHRtbFAoJ3ZzJyksIGNyZWF0ZUh0bWxQKHRpbWUpXSwgJ3BhZ2UwLWdhbWVjYXJkLW1pZCcpO1xuICBjb25zdCByaWdodERpdiA9IGNyZWF0ZUh0bWxEaXYoW2d1ZXN0VGl0bGUsIGd1ZXN0RmxhZ0VsZW1lbnQsIGd1ZXN0Vm90ZUJ1dHRvbl0sICdwYWdlMC1nYW1lY2FyZC1yaWdodCcpO1xuICBjb25zdCBjYXJkRGl2ID0gY3JlYXRlSHRtbERpdihbbGVmdERpdiwgbWlkRGl2LCByaWdodERpdl0sICdwYWdlMC10aW1ldGFibGUtZ2FtZScpO1xuXG4gIHJldHVybiBjYXJkRGl2O1xufTtcblxuLy8gNC4g5re75Yqg5oiW5Yig6ZmkIOafkOS4gOWkqeeahOavlOi1m+WNoeeJh1xuY29uc3QgYWRkR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwgPSAoY2FyZHNPbk9uZURheSkgPT4ge1xuICBmb3IobGV0IGkgaW4gY2FyZHNPbk9uZURheSkge1xuICAgIGNhcmRzT25PbmVEYXlbaV0uYWRkQ2xhc3MoJ2FuaW1hdGVkIGZsaXBJblgnKTtcbiAgICAkKCcucGFnZTAtdGltZXRhYmxlJykuYXBwZW5kKGNhcmRzT25PbmVEYXlbaV0pO1xuICB9XG4gIC8vIOe7meaKleelqOaMiemSrua3u+WKoGNsaWNr5LqL5Lu255uR5ZCsXG4gICQoJy5wYWdlMC10aW1ldGFibGUtZ2FtZSBidXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdm90ZVRlYW0gPSB0aGlzLmRhdGFzZXQudGVhbTtcbiAgICB1dWlkID0gdGhpcy5kYXRhc2V0LnV1aWQ7XG4gICAgJCgnI215TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICB9KTtcbn07XG5jb25zdCByZW1vdmVHYW1lQ2FyZHNPbk9uZURheUluSHRtbCA9IChjYXJkc09uT25lRGF5KSA9PiB7XG4gIGZvcihsZXQgaSBpbiBjYXJkc09uT25lRGF5KSB7XG4gICAgY2FyZHNPbk9uZURheVtpXS5yZW1vdmVDbGFzcygnZmxpcEluWCcpO1xuICAgIGNhcmRzT25PbmVEYXlbaV0ucmVtb3ZlKCk7XG4gIH1cbn07XG5cbmNvbnN0IHByZWxvYWRGaWxlcyA9ICgpID0+IHtcbiAgdmFyIGNzc191ZWZhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBjc3NfdWVmYS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICBjc3NfdWVmYS5yZWwgID0gXCJzdHlsZXNoZWV0XCI7XG4gIGNzc191ZWZhLmhyZWYgPSBcImNzcy91ZWZhLmNzc1wiO1xuXG4gIHZhciBjc3NfYW5pbWF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgY3NzX2FuaW1hdGUudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgY3NzX2FuaW1hdGUucmVsICA9IFwic3R5bGVzaGVldFwiO1xuICBjc3NfYW5pbWF0ZS5ocmVmID0gXCJib3dlcl9jb21wb25lbnRzL2FuaW1hdGUuY3NzL2FuaW1hdGUubWluLmNzc1wiO1xuXG4gIHZhciBqc19ib290c3RyYXAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAganNfYm9vdHN0cmFwLnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICBqc19ib290c3RyYXAuc3JjICA9IFwiYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAubWluLmpzXCI7XG5cbiAgJCgnaGVhZCcpLmZpcnN0KCkuYXBwZW5kKGNzc19hbmltYXRlKTtcbiAgJCgnaGVhZCcpLmZpcnN0KCkuYXBwZW5kKGNzc191ZWZhKTtcbiAgJCgnaHRtbCcpLmZpcnN0KCkuYXBwZW5kKGpzX2Jvb3RzdHJhcCk7XG5cbiAgJCgnI2Zvb3RiYWxsJykuYXBwZW5kKGNyZWF0ZUh0bWxJbWcoJy8vb29vLjBvMC5vb28vMjAxNi8wNi8xNS81NzYyMmRmMDc0NGUzLnBuZycsICdmb290YmFsbCcpKTtcbiAgJCgnI2xvZ28nKS5hcHBlbmQoY3JlYXRlSHRtbEltZygnLy9vb28uMG8wLm9vby8yMDE2LzA2LzE1LzU3NjIyODg0ZTczYmIucG5nJywgJ2xvZ28nKSk7XG59O1xuXG4vLyA1LiBhamF4IGNhbGxiYWNrIGZ1bmN0aW9uc1xuY29uc3QgZ2V0SW5mbyA9IChkYXRhKSA9PiB7XG4gIC8vIOW8guatpeWKoOi9veWFtuWugyBqc+OAgWNzc+WSjOWbvueJh1xuICBwcmVsb2FkRmlsZXMoKTtcbiAgY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSg3MCk7XG5cbiAgY29uc29sZS5sb2coZGF0YSk7XG4gICQoJyNkYXRlXzEnKS50ZXh0KGRhdGVTdHJpbmdfMS5zdWJzdHJpbmcoNSkpO1xuICAkKCcjZGF0ZV8yJykudGV4dChkYXRlU3RyaW5nXzIuc3Vic3RyaW5nKDUpKTtcbiAgJCgnI2RhdGVfMycpLnRleHQoZGF0ZVN0cmluZ18zLnN1YnN0cmluZyg1KSk7XG4gICQoJyNkYXRlXzQnKS50ZXh0KGRhdGVTdHJpbmdfNC5zdWJzdHJpbmcoNSkpO1xuICAkKCcjZGF0ZV81JykudGV4dChkYXRlU3RyaW5nXzUuc3Vic3RyaW5nKDUpKTtcblxuICAvLyDlsIbljaHniYflrZjlgqjkuo5jYXJkc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5yYWNlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciByYWNlID0gZGF0YS5kYXRhLnJhY2VzW2ldO1xuICAgIC8vIGNvbnNvbGUubG9nKHJhY2UuaG9zdC5mbGFnKTtcbiAgICB2YXIgZXhwaXJlZCA9IHJhY2UubWV0YS5leHBpcmVkOyAvLyDmr5TotZvmmK/lkKbov4fmnJ9cbiAgICB2YXIgdGVtcENhcmQgPSBjcmVhdGVIdG1sR2FtZUNhcmQoXG4gICAgICByYWNlLmhvc3QubmFtZSxcbiAgICAgIHJhY2UuaG9zdC5uYW1lQ04sXG4gICAgICByYWNlLmhvc3QuZmxhZyxcbiAgICAgIHJhY2UuZ3Vlc3QubmFtZSxcbiAgICAgIHJhY2UuZ3Vlc3QubmFtZUNOLFxuICAgICAgcmFjZS5ndWVzdC5mbGFnLFxuICAgICAgcmFjZS5tZXRhLnN0YXJ0QXQuc3BsaXQoJyAnKVsxXS5zdWJzdHJpbmcoMCwgNSksXG4gICAgICByYWNlLnV1aWQsXG4gICAgICBleHBpcmVkXG4gICAgKTtcbiAgICBzd2l0Y2ggKGRhdGEuZGF0YS5yYWNlc1tpXS5tZXRhLnN0YXJ0QXQuc3BsaXQoJyAnKVswXSkge1xuICAgICAgY2FzZSBkYXRlU3RyaW5nXzE6XG4gICAgICAgIGNhcmRzLmRhdGVfMS5wdXNoKHRlbXBDYXJkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRhdGVTdHJpbmdfMjpcbiAgICAgICAgY2FyZHMuZGF0ZV8yLnB1c2godGVtcENhcmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZGF0ZVN0cmluZ18zOlxuICAgICAgICBjYXJkcy5kYXRlXzMucHVzaCh0ZW1wQ2FyZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkYXRlU3RyaW5nXzQ6XG4gICAgICAgIGNhcmRzLmRhdGVfNC5wdXNoKHRlbXBDYXJkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRhdGVTdHJpbmdfNTpcbiAgICAgICAgY2FyZHMuZGF0ZV81LnB1c2godGVtcENhcmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIOS4uuayoeaciei1m+S6i+eahGRhdGXmt7vliqDml6DotZvkuovljaHniYdcbiAgZm9yKHZhciBpIGluIGNhcmRzKSB7XG4gICAgaWYoY2FyZHNbaV0ubGVuZ3RoID09IDApIHtcbiAgICAgIGNhcmRzW2ldLnB1c2goY3JlYXRlSHRtbFAoJ+aXoOi1m+S6iycsIHtcbiAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAnY29sb3InOiAnI2ZmZicsXG4gICAgICAgICdmb250LXNpemUnOiAnMnJlbScsXG4gICAgICAgICd0ZXh0LWFsaWduJzogJ2NlbnRlcidcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cbiAgLy8g6buY6K6k5Li65LuK5aSp55qE5q+U6LWbXG4gIGFkZEdhbWVDYXJkc09uT25lRGF5SW5IdG1sKGNhcmRzLmRhdGVfMyk7XG4gIGNoYW5nZVByb2dyZXNzQmFyVmFsdWUoMTAwKTtcblxuICAvLyDliqDovb3lrozmr5XlkI7lgZzpob8xc++8jOWGjeaYvuekumNvbnRlbnTvvIzpmLLmraLmhI/lpJblj5HnlJ/vvIzmmL7npLrkuZ/mm7TmtYHnlYVcbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxvYWRFbmQoKTtcbiAgfSwgMTAwMCk7XG59O1xuY29uc3QgcG9zdFBob25lTnVtYmVyID0gKGRhdGEpID0+IHtcbiAgaWYoZGF0YS5lcnJjb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAkKCcjd3JvbmdNc2cnKS50ZXh0KCflj4LkuI7miJDlip/vvIEnKTtcbiAgICAkKCcjd3JvbmdNc2cnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAvLyDmipXnpajmiJDlip/lkI7vvIzov4fkuKTnp5LlhbPpl61tb2RhbOeql+WPo1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgJCgnI3dyb25nTXNnJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICQoJyNteU1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICB9LCAyMDAwKTtcbiAgICAvLyDmlLnlj5jlt7LmipXlnLrmrKHnmoTmjInpkq7moLflvI/vvIzlubZkaXNhYmxlZOaMiemSrlxuICAgICQoJy5wYWdlMC10aW1ldGFibGUtZ2FtZSBidXR0b24nKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZGF0YXNldC51dWlkKTtcbiAgICAgIGlmKHRoaXMuZGF0YXNldC51dWlkID09PSB1dWlkKSB7XG4gICAgICAgICQodGhpcykuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgaWYodm90ZVRlYW0gPT09IHRoaXMuZGF0YXNldC50ZWFtKSB7XG4gICAgICAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnI2U3NGMzYycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJyM5NWE1YTYnKTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMpLnRleHQoJ+W3suaKleelqCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBlcnJvck1zZztcbiAgICBzd2l0Y2ggKGRhdGEuZXJyY29kZSkge1xuICAgICAgY2FzZSA0MDA3MTc6XG4gICAgICAgIGVycm9yTXNnID0gXCLmipXnpajlt7LmiKrmraLvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQwMDcxODpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuWPkeeUn+mUmeivr++8jOivt+mHjeaWsOi+k+WFpe+8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDAwNzE5OlxuICAgICAgICBlcnJvck1zZyA9IFwi5omL5py65Y+356CB6ZSZ6K+v77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDA3MjA6XG4gICAgICAgIGVycm9yTXNnID0gXCLlj5HnlJ/plJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQwMDcyMTpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuatpOaJi+acuuWPt+W3suaKlei/h+elqOS6huWTpu+8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGVycm9yTXNnID0gXCLlj5HnlJ/mnKrnn6XplJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGVycm9yTXNnKTtcbiAgfVxufTtcbmNvbnN0IGhhbmRsZUFqYXhGYWlsID0gKGVycm9yVGhyb3duKSA9PiB7XG4gIC8vIFRPRE8g5Y+v55So6L+b5bqm5p2h5pu/5LujXG59O1xuXG4vLyA2LiDliqDovb3lrozmiJDvvIzmmL7npLrlhoXlrrlcbmNvbnN0IGxvYWRFbmQgPSAoKSA9PiB7XG4gICQoJy5wcm9ncmVzcy13cmFwcGVyJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLmNvbnRhaW5lci13cmFwcGVyJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG59O1xuY29uc3QgY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSA9ICh2YWx1ZSkgPT4ge1xuICB2YXIgdGVtcFZhbCA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICQoJy5wcm9ncmVzcy1iYXInKS5hdHRyKCdhcmlhLXZhbHVlbm93JywgdGVtcFZhbCk7XG4gICQoJy5wcm9ncmVzcy1iYXInKS5jc3MoJ3dpZHRoJywgdGVtcFZhbCArICclJyk7XG59O1xuLy8gd2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbi8vICAgY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSgzMCk7XG4vLyB9XG5cbi8vICoqKioqKioqKioqXG4vLyAqKueoi+W6j+W8gOWniyoqXG4vLyAqKioqKioqKioqKlxuJChmdW5jdGlvbigpIHtcbiAgYWpheEdldChwcmVmaXgrcGF0aCwgZ2V0SW5mbywgaGFuZGxlQWpheEZhaWwpO1xuXG4gIC8vIOiuvue9rjXlpKnnmoTml7bpl7RzdHJpbmfvvIznlKjkuo7liKTmlq3mr5TotZvml6XmnJ9cbiAgc3dpdGNoIChkYXkpIHtcbiAgICBjYXNlIDI5OlxuICAgICAgZGF0ZVN0cmluZ18xID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTIpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMyA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgZGF5LnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzQgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsyKS50b1N0cmluZygpICsgJy0nICsgJzEnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzMDpcbiAgICAgIGRhdGVTdHJpbmdfMSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0yKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzMgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIGRheS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ180ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzIpLnRvU3RyaW5nKCkgKyAnLScgKyAnMSc7XG4gICAgICBkYXRlU3RyaW5nXzUgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMikudG9TdHJpbmcoKSArICctJyArICcyJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIGRhdGVTdHJpbmdfMSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSkudG9TdHJpbmcoKSArICctJyArICcyOSc7XG4gICAgICBkYXRlU3RyaW5nXzIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCkgKyAnLScgKyAnMzAnO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsxKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzIpLnRvU3RyaW5nKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCkgKyAnLScgKyAnMzAnO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzMgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIGRheS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ180ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzUgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMikudG9TdHJpbmcoKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMikudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMiA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0xKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsxKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzIpLnRvU3RyaW5nKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIOebkeWQrOaXpeacn+agj+eCueWHu+S6i+S7tu+8jOS4uuS6huWIh+aNouaXpeacn+WSjOavlOi1m+WNoeeJh1xuICAkKCcucGFnZTAtZGF0ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAkKCcucGFnZTAtZGF0ZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUtZGF0ZScpKSB7XG4gICAgICAgIHJlbW92ZUdhbWVDYXJkc09uT25lRGF5SW5IdG1sKGNhcmRzWyQodGhpcykuYXR0cignaWQnKV0pO1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGF0ZScpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZS1kYXRlJyk7XG4gICAgYWRkR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwoY2FyZHNbJCh0aGlzKS5hdHRyKCdpZCcpXSk7XG4gIH0pO1xuXG4gIC8vIOebkeWQrOaKleelqG1vZGFs5qGG5LqL5Lu2XG4gICQoJyNqb2luJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBwaG9uZU51bWJlciA9ICQoJyN1c2VyUGhvbmVJbnB1dCcpLnZhbCgpO1xuICAgIHZhciBwaG9uZU51bWJlclJlZ0V4cCA9IG5ldyBSZWdFeHAoJyheKDEzXFxcXGR8MTVbXjQsXFxcXERdfDE3WzEzNjc4XXwxOFxcXFxkKVxcXFxkezh9fDE3MFteMzQ2LFxcXFxEXVxcXFxkezd9KSQnLCAnZycpO1xuICAgIGlmKCFwaG9uZU51bWJlclJlZ0V4cC50ZXN0KHBob25lTnVtYmVyKSkge1xuICAgICAgJCgnI3dyb25nTXNnJykudGV4dCgn5omL5py65Y+35pyJ6K+v77yM6K+36YeN6K+V77yBJyk7XG4gICAgICAkKCcjd3JvbmdNc2cnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWpheFBvc3QoXG4gICAgICAgIHByZWZpeCArIHBhdGggKyB1dWlkICsgJy8nLFxuICAgICAgICAncGhvbmU9JyArIHBob25lTnVtYmVyICsgJyZ0ZWFtPScgKyB2b3RlVGVhbSxcbiAgICAgICAgcG9zdFBob25lTnVtYmVyLFxuICAgICAgICBoYW5kbGVBamF4RmFpbFxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
