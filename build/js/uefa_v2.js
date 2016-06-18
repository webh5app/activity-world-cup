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
var createHtmlGameCard = function createHtmlGameCard(hostName, hostNameCN, hostFlag, hostVote, guestName, guestNameCN, guestFlag, guestVote, time, uuid, expired) {
  var hostTitleElement = createHtmlP(hostNameCN);
  // const hostFlag = createHtmlImg('./images/' + hostName + '.png', 'hostFLag');
  // const hostFlag = createHtmlImg('./images/' + hostName + '.jpg', 'hostFLag');
  var hostFlagElement = createHtmlImg(hostFlag, 'hostFLag');
  var hostVoteNumber = createHtmlP(hostVote, {
    'width': '100%',
    'margin': '0'
  });
  var hostVoteNumberElement = createHtmlDiv([hostVoteNumber], 'page0-gamecard-voteNumber');
  var hostVoteButtonElement = createHtmlButton('点击投票', hostName, uuid, expired);

  var guestTitleElement = createHtmlP(guestNameCN);
  // const guestFlag = createHtmlImg('./images/' + guestName + '.png', 'guestFLag');
  // const guestFlag = createHtmlImg('./images/' + guestName + '.jpg', 'guestFLag');
  var guestFlagElement = createHtmlImg(guestFlag, 'guestFLag');
  var guestVoteNumber = createHtmlP(guestVote, {
    'width': '100%',
    'margin': '0'
  });
  var guestVoteNumberElement = createHtmlDiv([guestVoteNumber], 'page0-gamecard-voteNumber');
  var guestVoteButtonElement = createHtmlButton('点击投票', guestName, uuid, expired);
  var leftDiv = createHtmlDiv([hostTitleElement, hostFlagElement, hostVoteNumberElement, hostVoteButtonElement], 'page0-gamecard-left');
  var midDiv = createHtmlDiv([createHtmlP('vs'), createHtmlP(time)], 'page0-gamecard-mid');
  var rightDiv = createHtmlDiv([guestTitleElement, guestFlagElement, guestVoteNumberElement, guestVoteButtonElement], 'page0-gamecard-right');
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
    $('#wrongMsg').css('display', 'none');
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
  css_uefa.href = "/css/uefa.css";

  var css_animate = document.createElement('link');
  css_animate.type = "text/css";
  css_animate.rel = "stylesheet";
  css_animate.href = "/css/animate.min.css";

  var js_bootstrap = document.createElement("script");
  js_bootstrap.type = "text/javascript";
  js_bootstrap.src = "/js/bootstrap.min.js";

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

  // console.log(data);
  $('#date_1').text(dateString_1.substring(5));
  $('#date_2').text(dateString_2.substring(5));
  $('#date_3').text(dateString_3.substring(5));
  $('#date_4').text(dateString_4.substring(5));
  $('#date_5').text(dateString_5.substring(5));

  // 如果至少有一场比赛，则设置投票modal窗口里的注册链接
  if (data.data.races.length > 0) {
    $('#modal-close').attr('href', data.data.races[0].register_url);
  }

  // 设置html title
  $('title').first().text(data.data.title);

  // 将卡片存储于cards
  for (var i = 0; i < data.data.races.length; i++) {
    var race = data.data.races[i];
    // console.log(race.host.flag);
    var expired = race.meta.expired; // 比赛是否过期
    var tempCard = createHtmlGameCard(race.host.name, race.host.nameCN, race.host.flag, race.host.vote, race.guest.name, race.guest.nameCN, race.guest.flag, race.guest.vote, race.meta.startAt.split(' ')[1].substring(0, 5), race.uuid, expired);
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
    // console.log(errorMsg);
    $('#wrongMsg').text(errorMsg);
    $('#wrongMsg').css('display', 'block');
  }
};
var handleAjaxFail = function handleAjaxFail(errorThrown) {
  // TODO:
};

// 6. 加载完成，显示内容
var loadEnd = function loadEnd() {
  $('#preload-page').css('display', 'none');
  $('.container-wrapper').css('display', 'block');
};
var changeProgressBarValue = function changeProgressBarValue(value) {
  var tempVal = value.toString();
  $('.progress-bar').attr('aria-valuenow', tempVal);
  $('.progress-bar').css('width', tempVal + '%');
};

// ***********
// **程序开始**
// ***********
$(function () {
  ajaxGet(reqUrl, getInfo, handleAjaxFail);
  // ajaxGet(prefix + path, getInfo, handleAjaxFail);

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
//# sourceMappingURL=data:application/json;base64,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UixDQUFhLElBQWIsQ0FBTixDQUEzQjtBQUNELEdBVkQ7OztBQWFBLElBQUUsT0FBRixFQUFXLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLFVBQVMsS0FBVCxFQUFnQjtBQUNyQyxVQUFNLGNBQU47QUFDQSxRQUFJLGNBQWMsRUFBRSxpQkFBRixFQUFxQixHQUFyQixFQUFsQjtBQUNBLFFBQUksb0JBQW9CLElBQUksTUFBSixDQUFXLGtFQUFYLEVBQStFLEdBQS9FLENBQXhCO0FBQ0EsUUFBRyxDQUFDLGtCQUFrQixJQUFsQixDQUF1QixXQUF2QixDQUFKLEVBQXlDO0FBQ3ZDLFFBQUUsV0FBRixFQUFlLElBQWYsQ0FBb0IsWUFBcEI7QUFDQSxRQUFFLFdBQUYsRUFBZSxHQUFmLENBQW1CLFNBQW5CLEVBQThCLE9BQTlCO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsZUFDRSxTQUFTLElBQVQsR0FBZ0IsSUFBaEIsR0FBdUIsR0FEekIsRUFFRSxXQUFXLFdBQVgsR0FBeUIsUUFBekIsR0FBb0MsUUFGdEMsRUFHRSxlQUhGLEVBSUUsY0FKRjtBQU1EO0FBQ0YsR0FmRDtBQWdCRCxDQXpFRCIsImZpbGUiOiJ1ZWZhX3YyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5YWo5bGA5Y+Y6YePOlxuLy8gdmFyIHByZWZpeCA9ICdodHRwOi8vMTAuMTI0LjE4LjExNTo4MDgwLyc7XG52YXIgcHJlZml4ID0gJy8nO1xudmFyIHBhdGggPSAnYXBpL3YxL2FjdGl2aXR5L3dvcmxkY3VwLyc7XG52YXIgdXVpZDtcbnZhciByZXFVcmwgPSAnLi4vYXBpLmpzb24nOyAvLyDmnKzlnLDkuLTml7bmtYvor5XnlKhcbnZhciB2b3RlVGVhbTtcbnZhciBjYXJkcyA9IHtcbiAgZGF0ZV8xOiBbXSxcbiAgZGF0ZV8yOiBbXSxcbiAgZGF0ZV8zOiBbXSxcbiAgZGF0ZV80OiBbXSxcbiAgZGF0ZV81OiBbXVxufTtcbmNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG5sZXQgZGF0ZVN0cmluZ18xO1xubGV0IGRhdGVTdHJpbmdfMjtcbmxldCBkYXRlU3RyaW5nXzM7XG5sZXQgZGF0ZVN0cmluZ180O1xubGV0IGRhdGVTdHJpbmdfNTtcblxuLy8g6YCa55So5Ye95pWw5LusOlxuLy8gMS4gYWpheCBnZXQmcG9zdCBmdW5jdGlvbnNcbmNvbnN0IGFqYXhHZXQgPSAodXJsLCBzdWNjZXNzX2NiLCBmYWlsX2NiKSA9PiB7XG4gICQuYWpheCh7XG4gICAgdHlwZTogJ0dFVCcsXG4gICAgdXJsOiB1cmwsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KVxuICAuZG9uZSgoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpID0+IHtcbiAgICBzdWNjZXNzX2NiKGRhdGEpO1xuICB9KVxuICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB7XG4gICAgZmFpbF9jYihlcnJvclRocm93bik7XG4gIH0pO1xufTtcbmNvbnN0IGFqYXhQb3N0ID0gKHVybCwgZGF0YSwgc3VjY2Vzc19jYiwgZmFpbF9jYikgPT4ge1xuICAkLmFqYXgoe1xuICAgIHR5cGU6ICdQT1NUJyxcbiAgICB1cmw6IHVybCxcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCcsXG4gICAgZGF0YTogZGF0YVxuICB9KVxuICAuZG9uZSgoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpID0+IHtcbiAgICBzdWNjZXNzX2NiKGRhdGEpO1xuICB9KVxuICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB7XG4gICAgZmFpbF9jYihlcnJvclRocm93bik7XG4gIH0pO1xufTtcblxuLy8gMi4g55Sf5oiQIGh0bWwg57uE5Lu2XG5jb25zdCBjcmVhdGVIdG1sUCA9ICh0ZXh0LCBzdHlsZSA9IHVuZGVmaW5lZCkgPT4ge1xuICBpZihzdHlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICQoJzxwPicgKyB0ZXh0ICsgJzwvcD4nKTtcbiAgfVxuXG4gIC8vIOWmguaenOacieagt+W8j+S8oOWFpe+8jOWKoOS4iuagt+W8j1xuICB2YXIgc3R5bGVzID0gJyc7XG4gIGZvcih2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgc3R5bGVzID0gc3R5bGVzICsga2V5ICsgJzonICsgc3R5bGVba2V5XSArICc7JztcbiAgfVxuICByZXR1cm4gJCgnPHAgc3R5bGU9XCInICsgc3R5bGVzICsgJ1wiPicgKyB0ZXh0ICsgJzwvcD4nKTtcbn07XG5jb25zdCBjcmVhdGVIdG1sSW1nID0gKHNyYywgYWx0KSA9PiB7XG4gIHJldHVybiAkKCc8aW1nIGFsdD1cIicgKyBhbHQgKyAnXCIgc3JjPVwiJyArIHNyYyArICdcIiAvPicpO1xufTtcbmNvbnN0IGNyZWF0ZUh0bWxCdXR0b24gPSAodGV4dCwgdGVhbSwgdXVpZCwgZXhwaXJlZCkgPT4ge1xuICBpZihleHBpcmVkKSB7XG4gICAgdmFyIHRlbXBCdXR0b24gPSAkKCc8YnV0dG9uIGRhdGEtdGVhbT1cIicgKyB0ZWFtICsgJ1wiIGRhdGEtdXVpZD1cIicgKyB1dWlkICsgJ1wiPuW3sue7k+adnzwvYnV0dG9uPicpO1xuICAgIHRlbXBCdXR0b24uYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICB0ZW1wQnV0dG9uLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcjOTVhNWE2Jyk7XG4gICAgcmV0dXJuIHRlbXBCdXR0b247XG4gIH1cbiAgcmV0dXJuICQoJzxidXR0b24gZGF0YS10ZWFtPVwiJyArIHRlYW0gKyAnXCIgZGF0YS11dWlkPVwiJyArIHV1aWQgKyAnXCI+JyArIHRleHQgKyAnPC9idXR0b24+Jyk7XG59O1xuY29uc3QgY3JlYXRlSHRtbERpdiA9IChsaXN0T2ZFbGVtZW50cywgZGl2Q2xhc3NOYW1lKSA9PiB7XG4gIHZhciB0ZW1wRGl2ID0gJCgnPGRpdiBjbGFzcz1cIicgKyBkaXZDbGFzc05hbWUgKyAnXCI+JyArICc8L2Rpdj4nKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGxpc3RPZkVsZW1lbnRzW2ldLmFwcGVuZFRvKHRlbXBEaXYpO1xuICB9XG4gIHJldHVybiB0ZW1wRGl2O1xufTtcblxuLy8gMy4g5Yqo5oCB55Sf5oiQ5LiA5Liq5q+U6LWb5a+56Zi15Y2hXG5jb25zdCBjcmVhdGVIdG1sR2FtZUNhcmQgPSAoXG4gIGhvc3ROYW1lLFxuICBob3N0TmFtZUNOLFxuICBob3N0RmxhZyxcbiAgaG9zdFZvdGUsXG4gIGd1ZXN0TmFtZSxcbiAgZ3Vlc3ROYW1lQ04sXG4gIGd1ZXN0RmxhZyxcbiAgZ3Vlc3RWb3RlLFxuICB0aW1lLFxuICB1dWlkLFxuICBleHBpcmVkXG4pID0+IHtcbiAgY29uc3QgaG9zdFRpdGxlRWxlbWVudCA9IGNyZWF0ZUh0bWxQKGhvc3ROYW1lQ04pO1xuICAvLyBjb25zdCBob3N0RmxhZyA9IGNyZWF0ZUh0bWxJbWcoJy4vaW1hZ2VzLycgKyBob3N0TmFtZSArICcucG5nJywgJ2hvc3RGTGFnJyk7XG4gIC8vIGNvbnN0IGhvc3RGbGFnID0gY3JlYXRlSHRtbEltZygnLi9pbWFnZXMvJyArIGhvc3ROYW1lICsgJy5qcGcnLCAnaG9zdEZMYWcnKTtcbiAgY29uc3QgaG9zdEZsYWdFbGVtZW50ID0gY3JlYXRlSHRtbEltZyhob3N0RmxhZywgJ2hvc3RGTGFnJyk7XG4gIGNvbnN0IGhvc3RWb3RlTnVtYmVyID0gY3JlYXRlSHRtbFAoaG9zdFZvdGUsIHtcbiAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgJ21hcmdpbic6ICcwJ1xuICB9KTtcbiAgY29uc3QgaG9zdFZvdGVOdW1iZXJFbGVtZW50ID0gY3JlYXRlSHRtbERpdihbaG9zdFZvdGVOdW1iZXJdLCAncGFnZTAtZ2FtZWNhcmQtdm90ZU51bWJlcicpO1xuICBjb25zdCBob3N0Vm90ZUJ1dHRvbkVsZW1lbnQgPSBjcmVhdGVIdG1sQnV0dG9uKCfngrnlh7vmipXnpagnLCBob3N0TmFtZSwgdXVpZCwgZXhwaXJlZCk7XG5cbiAgY29uc3QgZ3Vlc3RUaXRsZUVsZW1lbnQgPSBjcmVhdGVIdG1sUChndWVzdE5hbWVDTik7XG4gIC8vIGNvbnN0IGd1ZXN0RmxhZyA9IGNyZWF0ZUh0bWxJbWcoJy4vaW1hZ2VzLycgKyBndWVzdE5hbWUgKyAnLnBuZycsICdndWVzdEZMYWcnKTtcbiAgLy8gY29uc3QgZ3Vlc3RGbGFnID0gY3JlYXRlSHRtbEltZygnLi9pbWFnZXMvJyArIGd1ZXN0TmFtZSArICcuanBnJywgJ2d1ZXN0RkxhZycpO1xuICBjb25zdCBndWVzdEZsYWdFbGVtZW50ID0gY3JlYXRlSHRtbEltZyhndWVzdEZsYWcsICdndWVzdEZMYWcnKTtcbiAgY29uc3QgZ3Vlc3RWb3RlTnVtYmVyID0gY3JlYXRlSHRtbFAoZ3Vlc3RWb3RlLCB7XG4gICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICdtYXJnaW4nOiAnMCdcbiAgfSk7XG4gIGNvbnN0IGd1ZXN0Vm90ZU51bWJlckVsZW1lbnQgPSBjcmVhdGVIdG1sRGl2KFtndWVzdFZvdGVOdW1iZXJdLCAncGFnZTAtZ2FtZWNhcmQtdm90ZU51bWJlcicpO1xuICBjb25zdCBndWVzdFZvdGVCdXR0b25FbGVtZW50ID0gY3JlYXRlSHRtbEJ1dHRvbign54K55Ye75oqV56WoJywgZ3Vlc3ROYW1lLCB1dWlkLCBleHBpcmVkKTtcbiAgY29uc3QgbGVmdERpdiA9IGNyZWF0ZUh0bWxEaXYoW2hvc3RUaXRsZUVsZW1lbnQsIGhvc3RGbGFnRWxlbWVudCwgaG9zdFZvdGVOdW1iZXJFbGVtZW50LCBob3N0Vm90ZUJ1dHRvbkVsZW1lbnRdLCAncGFnZTAtZ2FtZWNhcmQtbGVmdCcpO1xuICBjb25zdCBtaWREaXYgPSBjcmVhdGVIdG1sRGl2KFtjcmVhdGVIdG1sUCgndnMnKSwgY3JlYXRlSHRtbFAodGltZSldLCAncGFnZTAtZ2FtZWNhcmQtbWlkJyk7XG4gIGNvbnN0IHJpZ2h0RGl2ID0gY3JlYXRlSHRtbERpdihbZ3Vlc3RUaXRsZUVsZW1lbnQsIGd1ZXN0RmxhZ0VsZW1lbnQsIGd1ZXN0Vm90ZU51bWJlckVsZW1lbnQsIGd1ZXN0Vm90ZUJ1dHRvbkVsZW1lbnRdLCAncGFnZTAtZ2FtZWNhcmQtcmlnaHQnKTtcbiAgY29uc3QgY2FyZERpdiA9IGNyZWF0ZUh0bWxEaXYoW2xlZnREaXYsIG1pZERpdiwgcmlnaHREaXZdLCAncGFnZTAtdGltZXRhYmxlLWdhbWUnKTtcblxuICByZXR1cm4gY2FyZERpdjtcbn07XG5cbi8vIDQuIOa3u+WKoOaIluWIoOmZpCDmn5DkuIDlpKnnmoTmr5TotZvljaHniYdcbmNvbnN0IGFkZEdhbWVDYXJkc09uT25lRGF5SW5IdG1sID0gKGNhcmRzT25PbmVEYXkpID0+IHtcbiAgZm9yKGxldCBpIGluIGNhcmRzT25PbmVEYXkpIHtcbiAgICBjYXJkc09uT25lRGF5W2ldLmFkZENsYXNzKCdhbmltYXRlZCBmbGlwSW5YJyk7XG4gICAgJCgnLnBhZ2UwLXRpbWV0YWJsZScpLmFwcGVuZChjYXJkc09uT25lRGF5W2ldKTtcbiAgfVxuICAvLyDnu5nmipXnpajmjInpkq7mt7vliqBjbGlja+S6i+S7tuebkeWQrFxuICAkKCcucGFnZTAtdGltZXRhYmxlLWdhbWUgYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZvdGVUZWFtID0gdGhpcy5kYXRhc2V0LnRlYW07XG4gICAgdXVpZCA9IHRoaXMuZGF0YXNldC51dWlkO1xuICAgICQoJyN3cm9uZ01zZycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgJCgnI215TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICB9KTtcbn07XG5jb25zdCByZW1vdmVHYW1lQ2FyZHNPbk9uZURheUluSHRtbCA9IChjYXJkc09uT25lRGF5KSA9PiB7XG4gIGZvcihsZXQgaSBpbiBjYXJkc09uT25lRGF5KSB7XG4gICAgY2FyZHNPbk9uZURheVtpXS5yZW1vdmVDbGFzcygnZmxpcEluWCcpO1xuICAgIGNhcmRzT25PbmVEYXlbaV0ucmVtb3ZlKCk7XG4gIH1cbn07XG5cbmNvbnN0IHByZWxvYWRGaWxlcyA9ICgpID0+IHtcbiAgdmFyIGNzc191ZWZhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBjc3NfdWVmYS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICBjc3NfdWVmYS5yZWwgID0gXCJzdHlsZXNoZWV0XCI7XG4gIGNzc191ZWZhLmhyZWYgPSBcIi9jc3MvdWVmYS5jc3NcIjtcblxuICB2YXIgY3NzX2FuaW1hdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gIGNzc19hbmltYXRlLnR5cGUgPSBcInRleHQvY3NzXCI7XG4gIGNzc19hbmltYXRlLnJlbCAgPSBcInN0eWxlc2hlZXRcIjtcbiAgY3NzX2FuaW1hdGUuaHJlZiA9IFwiL2Nzcy9hbmltYXRlLm1pbi5jc3NcIjtcblxuICB2YXIganNfYm9vdHN0cmFwICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gIGpzX2Jvb3RzdHJhcC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAganNfYm9vdHN0cmFwLnNyYyAgPSBcIi9qcy9ib290c3RyYXAubWluLmpzXCI7XG5cbiAgJCgnaGVhZCcpLmZpcnN0KCkuYXBwZW5kKGNzc19hbmltYXRlKTtcbiAgJCgnaGVhZCcpLmZpcnN0KCkuYXBwZW5kKGNzc191ZWZhKTtcbiAgJCgnaHRtbCcpLmZpcnN0KCkuYXBwZW5kKGpzX2Jvb3RzdHJhcCk7XG5cbiAgJCgnI2Zvb3RiYWxsJykuYXBwZW5kKGNyZWF0ZUh0bWxJbWcoJy8vb29vLjBvMC5vb28vMjAxNi8wNi8xNS81NzYyMmRmMDc0NGUzLnBuZycsICdmb290YmFsbCcpKTtcbiAgJCgnI2xvZ28nKS5hcHBlbmQoY3JlYXRlSHRtbEltZygnLy9vb28uMG8wLm9vby8yMDE2LzA2LzE1LzU3NjIyODg0ZTczYmIucG5nJywgJ2xvZ28nKSk7XG59O1xuXG4vLyA1LiBhamF4IGNhbGxiYWNrIGZ1bmN0aW9uc1xuY29uc3QgZ2V0SW5mbyA9IChkYXRhKSA9PiB7XG4gIC8vIOW8guatpeWKoOi9veWFtuWugyBqc+OAgWNzc+WSjOWbvueJh1xuICBwcmVsb2FkRmlsZXMoKTtcbiAgY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSg3MCk7XG5cbiAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICQoJyNkYXRlXzEnKS50ZXh0KGRhdGVTdHJpbmdfMS5zdWJzdHJpbmcoNSkpO1xuICAkKCcjZGF0ZV8yJykudGV4dChkYXRlU3RyaW5nXzIuc3Vic3RyaW5nKDUpKTtcbiAgJCgnI2RhdGVfMycpLnRleHQoZGF0ZVN0cmluZ18zLnN1YnN0cmluZyg1KSk7XG4gICQoJyNkYXRlXzQnKS50ZXh0KGRhdGVTdHJpbmdfNC5zdWJzdHJpbmcoNSkpO1xuICAkKCcjZGF0ZV81JykudGV4dChkYXRlU3RyaW5nXzUuc3Vic3RyaW5nKDUpKTtcblxuICAvLyDlpoLmnpzoh7PlsJHmnInkuIDlnLrmr5TotZvvvIzliJnorr7nva7mipXnpahtb2RhbOeql+WPo+mHjOeahOazqOWGjOmTvuaOpVxuICBpZihkYXRhLmRhdGEucmFjZXMubGVuZ3RoID4gMCkge1xuICAgICQoJyNtb2RhbC1jbG9zZScpLmF0dHIoJ2hyZWYnLCBkYXRhLmRhdGEucmFjZXNbMF0ucmVnaXN0ZXJfdXJsKTtcbiAgfVxuXG4gIC8vIOiuvue9rmh0bWwgdGl0bGVcbiAgJCgndGl0bGUnKS5maXJzdCgpLnRleHQoZGF0YS5kYXRhLnRpdGxlKTtcblxuICAvLyDlsIbljaHniYflrZjlgqjkuo5jYXJkc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5yYWNlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciByYWNlID0gZGF0YS5kYXRhLnJhY2VzW2ldO1xuICAgIC8vIGNvbnNvbGUubG9nKHJhY2UuaG9zdC5mbGFnKTtcbiAgICB2YXIgZXhwaXJlZCA9IHJhY2UubWV0YS5leHBpcmVkOyAvLyDmr5TotZvmmK/lkKbov4fmnJ9cbiAgICB2YXIgdGVtcENhcmQgPSBjcmVhdGVIdG1sR2FtZUNhcmQoXG4gICAgICByYWNlLmhvc3QubmFtZSxcbiAgICAgIHJhY2UuaG9zdC5uYW1lQ04sXG4gICAgICByYWNlLmhvc3QuZmxhZyxcbiAgICAgIHJhY2UuaG9zdC52b3RlLFxuICAgICAgcmFjZS5ndWVzdC5uYW1lLFxuICAgICAgcmFjZS5ndWVzdC5uYW1lQ04sXG4gICAgICByYWNlLmd1ZXN0LmZsYWcsXG4gICAgICByYWNlLmd1ZXN0LnZvdGUsXG4gICAgICByYWNlLm1ldGEuc3RhcnRBdC5zcGxpdCgnICcpWzFdLnN1YnN0cmluZygwLCA1KSxcbiAgICAgIHJhY2UudXVpZCxcbiAgICAgIGV4cGlyZWRcbiAgICApO1xuICAgIHN3aXRjaCAoZGF0YS5kYXRhLnJhY2VzW2ldLm1ldGEuc3RhcnRBdC5zcGxpdCgnICcpWzBdKSB7XG4gICAgICBjYXNlIGRhdGVTdHJpbmdfMTpcbiAgICAgICAgY2FyZHMuZGF0ZV8xLnB1c2godGVtcENhcmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZGF0ZVN0cmluZ18yOlxuICAgICAgICBjYXJkcy5kYXRlXzIucHVzaCh0ZW1wQ2FyZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkYXRlU3RyaW5nXzM6XG4gICAgICAgIGNhcmRzLmRhdGVfMy5wdXNoKHRlbXBDYXJkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRhdGVTdHJpbmdfNDpcbiAgICAgICAgY2FyZHMuZGF0ZV80LnB1c2godGVtcENhcmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZGF0ZVN0cmluZ181OlxuICAgICAgICBjYXJkcy5kYXRlXzUucHVzaCh0ZW1wQ2FyZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8g5Li65rKh5pyJ6LWb5LqL55qEZGF0Zea3u+WKoOaXoOi1m+S6i+WNoeeJh1xuICBmb3IodmFyIGkgaW4gY2FyZHMpIHtcbiAgICBpZihjYXJkc1tpXS5sZW5ndGggPT0gMCkge1xuICAgICAgY2FyZHNbaV0ucHVzaChjcmVhdGVIdG1sUCgn5peg6LWb5LqLJywge1xuICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICdjb2xvcic6ICcjZmZmJyxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6ICcycmVtJyxcbiAgICAgICAgJ3RleHQtYWxpZ24nOiAnY2VudGVyJ1xuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuICAvLyDpu5jorqTkuLrku4rlpKnnmoTmr5TotZtcbiAgYWRkR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwoY2FyZHMuZGF0ZV8zKTtcbiAgY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSgxMDApO1xuXG4gIC8vIOWKoOi9veWujOavleWQjuWBnOmhvzFz77yM5YaN5pi+56S6Y29udGVudO+8jOmYsuatouaEj+WkluWPkeeUn++8jOaYvuekuuS5n+abtOa1geeVhVxuICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgbG9hZEVuZCgpO1xuICB9LCAxMDAwKTtcbn07XG5jb25zdCBwb3N0UGhvbmVOdW1iZXIgPSAoZGF0YSkgPT4ge1xuICBpZihkYXRhLmVycmNvZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICQoJyN3cm9uZ01zZycpLnRleHQoJ+WPguS4juaIkOWKn++8gScpO1xuICAgICQoJyN3cm9uZ01zZycpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIC8vIOaKleelqOaIkOWKn+WQju+8jOi/h+S4pOenkuWFs+mXrW1vZGFs56qX5Y+jXG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAkKCcjd3JvbmdNc2cnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgJCgnI215TW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgIH0sIDIwMDApO1xuICAgIC8vIOaUueWPmOW3suaKleWcuuasoeeahOaMiemSruagt+W8j++8jOW5tmRpc2FibGVk5oyJ6ZKuXG4gICAgJCgnLnBhZ2UwLXRpbWV0YWJsZS1nYW1lIGJ1dHRvbicpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgaWYodGhpcy5kYXRhc2V0LnV1aWQgPT09IHV1aWQpIHtcbiAgICAgICAgJCh0aGlzKS5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICBpZih2b3RlVGVhbSA9PT0gdGhpcy5kYXRhc2V0LnRlYW0pIHtcbiAgICAgICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcjZTc0YzNjJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnIzk1YTVhNicpO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcykudGV4dCgn5bey5oqV56WoJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGVycm9yTXNnO1xuICAgIHN3aXRjaCAoZGF0YS5lcnJjb2RlKSB7XG4gICAgICBjYXNlIDQwMDcxNzpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaKleelqOW3suaIquatou+8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDAwNzE4OlxuICAgICAgICBlcnJvck1zZyA9IFwi5Y+R55Sf6ZSZ6K+v77yM6K+36YeN5paw6L6T5YWl77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDA3MTk6XG4gICAgICAgIGVycm9yTXNnID0gXCLmiYvmnLrlj7fnoIHplJnor6/vvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQwMDcyMDpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuWPkeeUn+mUmeivr++8jOivt+mHjeaWsOi+k+WFpe+8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDAwNzIxOlxuICAgICAgICBlcnJvck1zZyA9IFwi5q2k5omL5py65Y+35bey5oqV6L+H56Wo5LqG5ZOm77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuWPkeeUn+acquefpemUmeivr++8jOivt+mHjeaWsOi+k+WFpe+8gVwiO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coZXJyb3JNc2cpO1xuICAgICQoJyN3cm9uZ01zZycpLnRleHQoZXJyb3JNc2cpO1xuICAgICQoJyN3cm9uZ01zZycpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICB9XG59O1xuY29uc3QgaGFuZGxlQWpheEZhaWwgPSAoZXJyb3JUaHJvd24pID0+IHtcbiAgLy8gVE9ETzpcbn07XG5cbi8vIDYuIOWKoOi9veWujOaIkO+8jOaYvuekuuWGheWuuVxuY29uc3QgbG9hZEVuZCA9ICgpID0+IHtcbiAgJCgnI3ByZWxvYWQtcGFnZScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5jb250YWluZXItd3JhcHBlcicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xufTtcbmNvbnN0IGNoYW5nZVByb2dyZXNzQmFyVmFsdWUgPSAodmFsdWUpID0+IHtcbiAgdmFyIHRlbXBWYWwgPSB2YWx1ZS50b1N0cmluZygpO1xuICAkKCcucHJvZ3Jlc3MtYmFyJykuYXR0cignYXJpYS12YWx1ZW5vdycsIHRlbXBWYWwpO1xuICAkKCcucHJvZ3Jlc3MtYmFyJykuY3NzKCd3aWR0aCcsIHRlbXBWYWwgKyAnJScpO1xufTtcblxuLy8gKioqKioqKioqKipcbi8vICoq56iL5bqP5byA5aeLKipcbi8vICoqKioqKioqKioqXG4kKGZ1bmN0aW9uKCkge1xuICBhamF4R2V0KHJlcVVybCwgZ2V0SW5mbywgaGFuZGxlQWpheEZhaWwpO1xuICAvLyBhamF4R2V0KHByZWZpeCArIHBhdGgsIGdldEluZm8sIGhhbmRsZUFqYXhGYWlsKTtcblxuICAvLyDorr7nva415aSp55qE5pe26Ze0c3RyaW5n77yM55So5LqO5Yik5pat5q+U6LWb5pel5pyfXG4gIHN3aXRjaCAoZGF5KSB7XG4gICAgY2FzZSAyOTpcbiAgICAgIGRhdGVTdHJpbmdfMSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0yKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzMgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIGRheS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ180ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzUgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMikudG9TdHJpbmcoKSArICctJyArICcxJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzA6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMikudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMiA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0xKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsyKS50b1N0cmluZygpICsgJy0nICsgJzEnO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzIpLnRvU3RyaW5nKCkgKyAnLScgKyAnMic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCkgKyAnLScgKyAnMjknO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKS50b1N0cmluZygpICsgJy0nICsgJzMwJztcbiAgICAgIGRhdGVTdHJpbmdfMyA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgZGF5LnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzQgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsyKS50b1N0cmluZygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgZGF0ZVN0cmluZ18xID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKS50b1N0cmluZygpICsgJy0nICsgJzMwJztcbiAgICAgIGRhdGVTdHJpbmdfMiA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0xKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsxKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzIpLnRvU3RyaW5nKCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgZGF0ZVN0cmluZ18xID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTIpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMyA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgZGF5LnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzQgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsyKS50b1N0cmluZygpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyDnm5HlkKzml6XmnJ/moI/ngrnlh7vkuovku7bvvIzkuLrkuobliIfmjaLml6XmnJ/lkozmr5TotZvljaHniYdcbiAgJCgnLnBhZ2UwLWRhdGUnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCgnLnBhZ2UwLWRhdGUnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlLWRhdGUnKSkge1xuICAgICAgICByZW1vdmVHYW1lQ2FyZHNPbk9uZURheUluSHRtbChjYXJkc1skKHRoaXMpLmF0dHIoJ2lkJyldKTtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRhdGUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUtZGF0ZScpO1xuICAgIGFkZEdhbWVDYXJkc09uT25lRGF5SW5IdG1sKGNhcmRzWyQodGhpcykuYXR0cignaWQnKV0pO1xuICB9KTtcblxuICAvLyDnm5HlkKzmipXnpahtb2RhbOahhuS6i+S7tlxuICAkKCcjam9pbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgcGhvbmVOdW1iZXIgPSAkKCcjdXNlclBob25lSW5wdXQnKS52YWwoKTtcbiAgICB2YXIgcGhvbmVOdW1iZXJSZWdFeHAgPSBuZXcgUmVnRXhwKCcoXigxM1xcXFxkfDE1W140LFxcXFxEXXwxN1sxMzY3OF18MThcXFxcZClcXFxcZHs4fXwxNzBbXjM0NixcXFxcRF1cXFxcZHs3fSkkJywgJ2cnKTtcbiAgICBpZighcGhvbmVOdW1iZXJSZWdFeHAudGVzdChwaG9uZU51bWJlcikpIHtcbiAgICAgICQoJyN3cm9uZ01zZycpLnRleHQoJ+aJi+acuuWPt+acieivr++8jOivt+mHjeivle+8gScpO1xuICAgICAgJCgnI3dyb25nTXNnJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFqYXhQb3N0KFxuICAgICAgICBwcmVmaXggKyBwYXRoICsgdXVpZCArICcvJyxcbiAgICAgICAgJ3Bob25lPScgKyBwaG9uZU51bWJlciArICcmdGVhbT0nICsgdm90ZVRlYW0sXG4gICAgICAgIHBvc3RQaG9uZU51bWJlcixcbiAgICAgICAgaGFuZGxlQWpheEZhaWxcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
