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
  var hostFlagElement = createHtmlImg(hostFlag, 'hostFLag');
  var hostVoteNumber = createHtmlP(hostVote, {
    'width': '100%',
    'margin': '0'
  });
  var hostVoteNumberElement = createHtmlDiv([hostVoteNumber], 'page0-gamecard-voteNumber');
  var hostVoteButtonElement = createHtmlButton(hostNameCN + '胜', hostName, uuid, expired);

  var guestTitleElement = createHtmlP(guestNameCN);
  var guestFlagElement = createHtmlImg(guestFlag, 'guestFLag');
  var guestVoteNumber = createHtmlP(guestVote, {
    'width': '100%',
    'margin': '0'
  });
  var guestVoteNumberElement = createHtmlDiv([guestVoteNumber], 'page0-gamecard-voteNumber');
  var guestVoteButtonElement = createHtmlButton(guestNameCN + '胜', guestName, uuid, expired);

  var pingVoteButtonElement = createHtmlButton('打平', 'ping', uuid, expired);

  var leftDiv = createHtmlDiv([hostTitleElement, hostFlagElement, hostVoteNumberElement, hostVoteButtonElement], 'page0-gamecard-left');

  var midDiv = createHtmlDiv([createHtmlP('vs'), createHtmlP(time), pingVoteButtonElement], 'page0-gamecard-mid');

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
          if (voteTeam !== 'ping') {
            var tempVoteNumber = $(this).prev().find('p').text();
            $(this).prev().find('p').text((Number(tempVoteNumber) + 1).toString());
          }
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
//# sourceMappingURL=data:application/json;base64,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T0FBcEIsRUFBNkIsVUFBUyxLQUFULEVBQWdCO0FBQzNDLFVBQU0sY0FBTjtBQUNBLE1BQUUsYUFBRixFQUFpQixJQUFqQixDQUFzQixZQUFXO0FBQy9CLFVBQUcsRUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixhQUFqQixDQUFILEVBQW9DO0FBQ2xDLHNDQUE4QixNQUFNLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxJQUFiLENBQU4sQ0FBOUI7QUFDQSxVQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLGFBQXBCO0FBQ0Q7QUFDRixLQUxEO0FBTUEsTUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixhQUFqQjtBQUNBLCtCQUEyQixNQUFNLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxJQUFiLENBQU4sQ0FBM0I7QUFDRCxHQVZEOzs7QUFhQSxJQUFFLE9BQUYsRUFBVyxFQUFYLENBQWMsT0FBZCxFQUF1QixVQUFTLEtBQVQsRUFBZ0I7QUFDckMsVUFBTSxjQUFOO0FBQ0EsUUFBSSxjQUFjLEVBQUUsaUJBQUYsRUFBcUIsR0FBckIsRUFBbEI7QUFDQSxRQUFJLG9CQUFvQixJQUFJLE1BQUosQ0FBVyxrRUFBWCxFQUErRSxHQUEvRSxDQUF4QjtBQUNBLFFBQUcsQ0FBQyxrQkFBa0IsSUFBbEIsQ0FBdUIsV0FBdkIsQ0FBSixFQUF5QztBQUN2QyxRQUFFLFdBQUYsRUFBZSxJQUFmLENBQW9CLFlBQXBCO0FBQ0EsUUFBRSxXQUFGLEVBQWUsR0FBZixDQUFtQixTQUFuQixFQUE4QixPQUE5QjtBQUNELEtBSEQsTUFHTztBQUNMLGVBQ0UsU0FBUyxJQUFULEdBQWdCLElBQWhCLEdBQXVCLEdBRHpCLEVBRUUsV0FBVyxXQUFYLEdBQXlCLFFBQXpCLEdBQW9DLFFBRnRDLEVBR0UsZUFIRixFQUlFLGNBSkY7QUFNRDtBQUNGLEdBZkQ7QUFnQkQsQ0F6RUQiLCJmaWxlIjoidWVmYV92Mi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIOWFqOWxgOWPmOmHjzpcbi8vIHZhciBwcmVmaXggPSAnaHR0cDovLzEwLjEyNC4xOC4xMTU6ODA4MC8nO1xudmFyIHByZWZpeCA9ICcvJztcbnZhciBwYXRoID0gJ2FwaS92MS9hY3Rpdml0eS93b3JsZGN1cC8nO1xudmFyIHV1aWQ7XG52YXIgcmVxVXJsID0gJy4uL2FwaS5qc29uJzsgLy8g5pys5Zyw5Li05pe25rWL6K+V55SoXG52YXIgdm90ZVRlYW07XG52YXIgY2FyZHMgPSB7XG4gIGRhdGVfMTogW10sXG4gIGRhdGVfMjogW10sXG4gIGRhdGVfMzogW10sXG4gIGRhdGVfNDogW10sXG4gIGRhdGVfNTogW11cbn07XG5jb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbmNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xubGV0IGRhdGVTdHJpbmdfMTtcbmxldCBkYXRlU3RyaW5nXzI7XG5sZXQgZGF0ZVN0cmluZ18zO1xubGV0IGRhdGVTdHJpbmdfNDtcbmxldCBkYXRlU3RyaW5nXzU7XG5cbi8vIOmAmueUqOWHveaVsOS7rDpcbi8vIDEuIGFqYXggZ2V0JnBvc3QgZnVuY3Rpb25zXG5jb25zdCBhamF4R2V0ID0gKHVybCwgc3VjY2Vzc19jYiwgZmFpbF9jYikgPT4ge1xuICAkLmFqYXgoe1xuICAgIHR5cGU6ICdHRVQnLFxuICAgIHVybDogdXJsLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSlcbiAgLmRvbmUoKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB7XG4gICAgc3VjY2Vzc19jYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4ge1xuICAgIGZhaWxfY2IoZXJyb3JUaHJvd24pO1xuICB9KTtcbn07XG5jb25zdCBhamF4UG9zdCA9ICh1cmwsIGRhdGEsIHN1Y2Nlc3NfY2IsIGZhaWxfY2IpID0+IHtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiAnUE9TVCcsXG4gICAgdXJsOiB1cmwsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnLFxuICAgIGRhdGE6IGRhdGFcbiAgfSlcbiAgLmRvbmUoKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB7XG4gICAgc3VjY2Vzc19jYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4ge1xuICAgIGZhaWxfY2IoZXJyb3JUaHJvd24pO1xuICB9KTtcbn07XG5cbi8vIDIuIOeUn+aIkCBodG1sIOe7hOS7tlxuY29uc3QgY3JlYXRlSHRtbFAgPSAodGV4dCwgc3R5bGUgPSB1bmRlZmluZWQpID0+IHtcbiAgaWYoc3R5bGUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAkKCc8cD4nICsgdGV4dCArICc8L3A+Jyk7XG4gIH1cblxuICAvLyDlpoLmnpzmnInmoLflvI/kvKDlhaXvvIzliqDkuIrmoLflvI9cbiAgdmFyIHN0eWxlcyA9ICcnO1xuICBmb3IodmFyIGtleSBpbiBzdHlsZSkge1xuICAgIHN0eWxlcyA9IHN0eWxlcyArIGtleSArICc6JyArIHN0eWxlW2tleV0gKyAnOyc7XG4gIH1cbiAgcmV0dXJuICQoJzxwIHN0eWxlPVwiJyArIHN0eWxlcyArICdcIj4nICsgdGV4dCArICc8L3A+Jyk7XG59O1xuY29uc3QgY3JlYXRlSHRtbEltZyA9IChzcmMsIGFsdCkgPT4ge1xuICByZXR1cm4gJCgnPGltZyBhbHQ9XCInICsgYWx0ICsgJ1wiIHNyYz1cIicgKyBzcmMgKyAnXCIgLz4nKTtcbn07XG5jb25zdCBjcmVhdGVIdG1sQnV0dG9uID0gKHRleHQsIHRlYW0sIHV1aWQsIGV4cGlyZWQpID0+IHtcbiAgaWYoZXhwaXJlZCkge1xuICAgIHZhciB0ZW1wQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLXRlYW09XCInICsgdGVhbSArICdcIiBkYXRhLXV1aWQ9XCInICsgdXVpZCArICdcIj7lt7Lnu5PmnZ88L2J1dHRvbj4nKTtcbiAgICB0ZW1wQnV0dG9uLmF0dHIoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgdGVtcEJ1dHRvbi5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnIzk1YTVhNicpO1xuICAgIHJldHVybiB0ZW1wQnV0dG9uO1xuICB9XG4gIHJldHVybiAkKCc8YnV0dG9uIGRhdGEtdGVhbT1cIicgKyB0ZWFtICsgJ1wiIGRhdGEtdXVpZD1cIicgKyB1dWlkICsgJ1wiPicgKyB0ZXh0ICsgJzwvYnV0dG9uPicpO1xufTtcbmNvbnN0IGNyZWF0ZUh0bWxEaXYgPSAobGlzdE9mRWxlbWVudHMsIGRpdkNsYXNzTmFtZSkgPT4ge1xuICB2YXIgdGVtcERpdiA9ICQoJzxkaXYgY2xhc3M9XCInICsgZGl2Q2xhc3NOYW1lICsgJ1wiPicgKyAnPC9kaXY+Jyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0T2ZFbGVtZW50c1tpXS5hcHBlbmRUbyh0ZW1wRGl2KTtcbiAgfVxuICByZXR1cm4gdGVtcERpdjtcbn07XG5cbi8vIDMuIOWKqOaAgeeUn+aIkOS4gOS4quavlOi1m+WvuemYteWNoVxuY29uc3QgY3JlYXRlSHRtbEdhbWVDYXJkID0gKFxuICBob3N0TmFtZSxcbiAgaG9zdE5hbWVDTixcbiAgaG9zdEZsYWcsXG4gIGhvc3RWb3RlLFxuICBndWVzdE5hbWUsXG4gIGd1ZXN0TmFtZUNOLFxuICBndWVzdEZsYWcsXG4gIGd1ZXN0Vm90ZSxcbiAgdGltZSxcbiAgdXVpZCxcbiAgZXhwaXJlZFxuKSA9PiB7XG4gIGNvbnN0IGhvc3RUaXRsZUVsZW1lbnQgPSBjcmVhdGVIdG1sUChob3N0TmFtZUNOKTtcbiAgY29uc3QgaG9zdEZsYWdFbGVtZW50ID0gY3JlYXRlSHRtbEltZyhob3N0RmxhZywgJ2hvc3RGTGFnJyk7XG4gIGNvbnN0IGhvc3RWb3RlTnVtYmVyID0gY3JlYXRlSHRtbFAoaG9zdFZvdGUsIHtcbiAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgJ21hcmdpbic6ICcwJ1xuICB9KTtcbiAgY29uc3QgaG9zdFZvdGVOdW1iZXJFbGVtZW50ID0gY3JlYXRlSHRtbERpdihbaG9zdFZvdGVOdW1iZXJdLCAncGFnZTAtZ2FtZWNhcmQtdm90ZU51bWJlcicpO1xuICBjb25zdCBob3N0Vm90ZUJ1dHRvbkVsZW1lbnQgPSBjcmVhdGVIdG1sQnV0dG9uKGhvc3ROYW1lQ04rJ+iDnCcsIGhvc3ROYW1lLCB1dWlkLCBleHBpcmVkKTtcblxuICBjb25zdCBndWVzdFRpdGxlRWxlbWVudCA9IGNyZWF0ZUh0bWxQKGd1ZXN0TmFtZUNOKTtcbiAgY29uc3QgZ3Vlc3RGbGFnRWxlbWVudCA9IGNyZWF0ZUh0bWxJbWcoZ3Vlc3RGbGFnLCAnZ3Vlc3RGTGFnJyk7XG4gIGNvbnN0IGd1ZXN0Vm90ZU51bWJlciA9IGNyZWF0ZUh0bWxQKGd1ZXN0Vm90ZSwge1xuICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAnbWFyZ2luJzogJzAnXG4gIH0pO1xuICBjb25zdCBndWVzdFZvdGVOdW1iZXJFbGVtZW50ID0gY3JlYXRlSHRtbERpdihbZ3Vlc3RWb3RlTnVtYmVyXSwgJ3BhZ2UwLWdhbWVjYXJkLXZvdGVOdW1iZXInKTtcbiAgY29uc3QgZ3Vlc3RWb3RlQnV0dG9uRWxlbWVudCA9IGNyZWF0ZUh0bWxCdXR0b24oZ3Vlc3ROYW1lQ04rJ+iDnCcsIGd1ZXN0TmFtZSwgdXVpZCwgZXhwaXJlZCk7XG5cbiAgY29uc3QgcGluZ1ZvdGVCdXR0b25FbGVtZW50ID0gY3JlYXRlSHRtbEJ1dHRvbign5omT5bmzJywgJ3BpbmcnLCB1dWlkLCBleHBpcmVkKTtcblxuICBjb25zdCBsZWZ0RGl2ID0gY3JlYXRlSHRtbERpdihbXG4gICAgaG9zdFRpdGxlRWxlbWVudCxcbiAgICBob3N0RmxhZ0VsZW1lbnQsXG4gICAgaG9zdFZvdGVOdW1iZXJFbGVtZW50LFxuICAgIGhvc3RWb3RlQnV0dG9uRWxlbWVudFxuICBdLCAncGFnZTAtZ2FtZWNhcmQtbGVmdCcpO1xuXG4gIGNvbnN0IG1pZERpdiA9IGNyZWF0ZUh0bWxEaXYoW1xuICAgIGNyZWF0ZUh0bWxQKCd2cycpLFxuICAgIGNyZWF0ZUh0bWxQKHRpbWUpLFxuICAgIHBpbmdWb3RlQnV0dG9uRWxlbWVudFxuICBdLCAncGFnZTAtZ2FtZWNhcmQtbWlkJyk7XG5cbiAgY29uc3QgcmlnaHREaXYgPSBjcmVhdGVIdG1sRGl2KFtcbiAgICBndWVzdFRpdGxlRWxlbWVudCxcbiAgICBndWVzdEZsYWdFbGVtZW50LFxuICAgIGd1ZXN0Vm90ZU51bWJlckVsZW1lbnQsXG4gICAgZ3Vlc3RWb3RlQnV0dG9uRWxlbWVudFxuICBdLCAncGFnZTAtZ2FtZWNhcmQtcmlnaHQnKTtcblxuICBjb25zdCBjYXJkRGl2ID0gY3JlYXRlSHRtbERpdihbXG4gICAgbGVmdERpdixcbiAgICBtaWREaXYsXG4gICAgcmlnaHREaXZcbiAgXSwgJ3BhZ2UwLXRpbWV0YWJsZS1nYW1lJyk7XG5cbiAgcmV0dXJuIGNhcmREaXY7XG59O1xuXG4vLyA0LiDmt7vliqDmiJbliKDpmaQg5p+Q5LiA5aSp55qE5q+U6LWb5Y2h54mHXG5jb25zdCBhZGRHYW1lQ2FyZHNPbk9uZURheUluSHRtbCA9IChjYXJkc09uT25lRGF5KSA9PiB7XG4gIGZvcihsZXQgaSBpbiBjYXJkc09uT25lRGF5KSB7XG4gICAgY2FyZHNPbk9uZURheVtpXS5hZGRDbGFzcygnYW5pbWF0ZWQgZmxpcEluWCcpO1xuICAgICQoJy5wYWdlMC10aW1ldGFibGUnKS5hcHBlbmQoY2FyZHNPbk9uZURheVtpXSk7XG4gIH1cbiAgLy8g57uZ5oqV56Wo5oyJ6ZKu5re75YqgY2xpY2vkuovku7bnm5HlkKxcbiAgJCgnLnBhZ2UwLXRpbWV0YWJsZS1nYW1lIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2b3RlVGVhbSA9IHRoaXMuZGF0YXNldC50ZWFtO1xuICAgIHV1aWQgPSB0aGlzLmRhdGFzZXQudXVpZDtcbiAgICAkKCcjd3JvbmdNc2cnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICQoJyNteU1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgfSk7XG59O1xuY29uc3QgcmVtb3ZlR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwgPSAoY2FyZHNPbk9uZURheSkgPT4ge1xuICBmb3IobGV0IGkgaW4gY2FyZHNPbk9uZURheSkge1xuICAgIGNhcmRzT25PbmVEYXlbaV0ucmVtb3ZlQ2xhc3MoJ2ZsaXBJblgnKTtcbiAgICBjYXJkc09uT25lRGF5W2ldLnJlbW92ZSgpO1xuICB9XG59O1xuXG5jb25zdCBwcmVsb2FkRmlsZXMgPSAoKSA9PiB7XG4gIHZhciBjc3NfdWVmYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgY3NzX3VlZmEudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgY3NzX3VlZmEucmVsICA9IFwic3R5bGVzaGVldFwiO1xuICBjc3NfdWVmYS5ocmVmID0gXCIvY3NzL3VlZmEuY3NzXCI7XG5cbiAgdmFyIGNzc19hbmltYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBjc3NfYW5pbWF0ZS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICBjc3NfYW5pbWF0ZS5yZWwgID0gXCJzdHlsZXNoZWV0XCI7XG4gIGNzc19hbmltYXRlLmhyZWYgPSBcIi9jc3MvYW5pbWF0ZS5taW4uY3NzXCI7XG5cbiAgdmFyIGpzX2Jvb3RzdHJhcCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICBqc19ib290c3RyYXAudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gIGpzX2Jvb3RzdHJhcC5zcmMgID0gXCIvanMvYm9vdHN0cmFwLm1pbi5qc1wiO1xuXG4gICQoJ2hlYWQnKS5maXJzdCgpLmFwcGVuZChjc3NfYW5pbWF0ZSk7XG4gICQoJ2hlYWQnKS5maXJzdCgpLmFwcGVuZChjc3NfdWVmYSk7XG4gICQoJ2h0bWwnKS5maXJzdCgpLmFwcGVuZChqc19ib290c3RyYXApO1xuXG4gICQoJyNmb290YmFsbCcpLmFwcGVuZChjcmVhdGVIdG1sSW1nKCcvL29vby4wbzAub29vLzIwMTYvMDYvMTUvNTc2MjJkZjA3NDRlMy5wbmcnLCAnZm9vdGJhbGwnKSk7XG4gICQoJyNsb2dvJykuYXBwZW5kKGNyZWF0ZUh0bWxJbWcoJy8vb29vLjBvMC5vb28vMjAxNi8wNi8xNS81NzYyMjg4NGU3M2JiLnBuZycsICdsb2dvJykpO1xufTtcblxuLy8gNS4gYWpheCBjYWxsYmFjayBmdW5jdGlvbnNcbmNvbnN0IGdldEluZm8gPSAoZGF0YSkgPT4ge1xuICAvLyDlvILmraXliqDovb3lhbblroMganPjgIFjc3Plkozlm77niYdcbiAgcHJlbG9hZEZpbGVzKCk7XG4gIGNoYW5nZVByb2dyZXNzQmFyVmFsdWUoNzApO1xuXG4gIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAkKCcjZGF0ZV8xJykudGV4dChkYXRlU3RyaW5nXzEuc3Vic3RyaW5nKDUpKTtcbiAgJCgnI2RhdGVfMicpLnRleHQoZGF0ZVN0cmluZ18yLnN1YnN0cmluZyg1KSk7XG4gICQoJyNkYXRlXzMnKS50ZXh0KGRhdGVTdHJpbmdfMy5zdWJzdHJpbmcoNSkpO1xuICAkKCcjZGF0ZV80JykudGV4dChkYXRlU3RyaW5nXzQuc3Vic3RyaW5nKDUpKTtcbiAgJCgnI2RhdGVfNScpLnRleHQoZGF0ZVN0cmluZ181LnN1YnN0cmluZyg1KSk7XG5cbiAgLy8g5aaC5p6c6Iez5bCR5pyJ5LiA5Zy65q+U6LWb77yM5YiZ6K6+572u5oqV56WobW9kYWznqpflj6Pph4znmoTms6jlhozpk77mjqVcbiAgaWYoZGF0YS5kYXRhLnJhY2VzLmxlbmd0aCA+IDApIHtcbiAgICAkKCcjbW9kYWwtY2xvc2UnKS5hdHRyKCdocmVmJywgZGF0YS5kYXRhLnJhY2VzWzBdLnJlZ2lzdGVyX3VybCk7XG4gIH1cblxuICAvLyDorr7nva5odG1sIHRpdGxlXG4gICQoJ3RpdGxlJykuZmlyc3QoKS50ZXh0KGRhdGEuZGF0YS50aXRsZSk7XG5cbiAgLy8g5bCG5Y2h54mH5a2Y5YKo5LqOY2FyZHNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEucmFjZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcmFjZSA9IGRhdGEuZGF0YS5yYWNlc1tpXTtcbiAgICAvLyBjb25zb2xlLmxvZyhyYWNlLmhvc3QuZmxhZyk7XG4gICAgdmFyIGV4cGlyZWQgPSByYWNlLm1ldGEuZXhwaXJlZDsgLy8g5q+U6LWb5piv5ZCm6L+H5pyfXG4gICAgdmFyIHRlbXBDYXJkID0gY3JlYXRlSHRtbEdhbWVDYXJkKFxuICAgICAgcmFjZS5ob3N0Lm5hbWUsXG4gICAgICByYWNlLmhvc3QubmFtZUNOLFxuICAgICAgcmFjZS5ob3N0LmZsYWcsXG4gICAgICByYWNlLmhvc3Qudm90ZSxcbiAgICAgIHJhY2UuZ3Vlc3QubmFtZSxcbiAgICAgIHJhY2UuZ3Vlc3QubmFtZUNOLFxuICAgICAgcmFjZS5ndWVzdC5mbGFnLFxuICAgICAgcmFjZS5ndWVzdC52b3RlLFxuICAgICAgcmFjZS5tZXRhLnN0YXJ0QXQuc3BsaXQoJyAnKVsxXS5zdWJzdHJpbmcoMCwgNSksXG4gICAgICByYWNlLnV1aWQsXG4gICAgICBleHBpcmVkXG4gICAgKTtcbiAgICBzd2l0Y2ggKGRhdGEuZGF0YS5yYWNlc1tpXS5tZXRhLnN0YXJ0QXQuc3BsaXQoJyAnKVswXSkge1xuICAgICAgY2FzZSBkYXRlU3RyaW5nXzE6XG4gICAgICAgIGNhcmRzLmRhdGVfMS5wdXNoKHRlbXBDYXJkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRhdGVTdHJpbmdfMjpcbiAgICAgICAgY2FyZHMuZGF0ZV8yLnB1c2godGVtcENhcmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZGF0ZVN0cmluZ18zOlxuICAgICAgICBjYXJkcy5kYXRlXzMucHVzaCh0ZW1wQ2FyZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkYXRlU3RyaW5nXzQ6XG4gICAgICAgIGNhcmRzLmRhdGVfNC5wdXNoKHRlbXBDYXJkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRhdGVTdHJpbmdfNTpcbiAgICAgICAgY2FyZHMuZGF0ZV81LnB1c2godGVtcENhcmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIOS4uuayoeaciei1m+S6i+eahGRhdGXmt7vliqDml6DotZvkuovljaHniYdcbiAgZm9yKHZhciBpIGluIGNhcmRzKSB7XG4gICAgaWYoY2FyZHNbaV0ubGVuZ3RoID09IDApIHtcbiAgICAgIGNhcmRzW2ldLnB1c2goY3JlYXRlSHRtbFAoJ+aXoOi1m+S6iycsIHtcbiAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAnY29sb3InOiAnI2ZmZicsXG4gICAgICAgICdmb250LXNpemUnOiAnMnJlbScsXG4gICAgICAgICd0ZXh0LWFsaWduJzogJ2NlbnRlcidcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cbiAgLy8g6buY6K6k5Li65LuK5aSp55qE5q+U6LWbXG4gIGFkZEdhbWVDYXJkc09uT25lRGF5SW5IdG1sKGNhcmRzLmRhdGVfMyk7XG4gIGNoYW5nZVByb2dyZXNzQmFyVmFsdWUoMTAwKTtcblxuICAvLyDliqDovb3lrozmr5XlkI7lgZzpob8xc++8jOWGjeaYvuekumNvbnRlbnTvvIzpmLLmraLmhI/lpJblj5HnlJ/vvIzmmL7npLrkuZ/mm7TmtYHnlYVcbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxvYWRFbmQoKTtcbiAgfSwgMTAwMCk7XG59O1xuY29uc3QgcG9zdFBob25lTnVtYmVyID0gKGRhdGEpID0+IHtcbiAgaWYoZGF0YS5lcnJjb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAkKCcjd3JvbmdNc2cnKS50ZXh0KCflj4LkuI7miJDlip/vvIEnKTtcbiAgICAkKCcjd3JvbmdNc2cnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAvLyDmipXnpajmiJDlip/lkI7vvIzov4fkuKTnp5LlhbPpl61tb2RhbOeql+WPo1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgJCgnI3dyb25nTXNnJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICQoJyNteU1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICB9LCAyMDAwKTtcbiAgICAvLyDmlLnlj5jlt7LmipXlnLrmrKHnmoTmjInpkq7moLflvI/vvIzlubZkaXNhYmxlZOaMiemSrlxuICAgICQoJy5wYWdlMC10aW1ldGFibGUtZ2FtZSBidXR0b24nKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgIGlmKHRoaXMuZGF0YXNldC51dWlkID09PSB1dWlkKSB7XG4gICAgICAgICQodGhpcykuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgaWYodm90ZVRlYW0gPT09IHRoaXMuZGF0YXNldC50ZWFtKSB7XG4gICAgICAgICAgaWYodm90ZVRlYW0gIT09ICdwaW5nJykge1xuICAgICAgICAgICAgdmFyIHRlbXBWb3RlTnVtYmVyID0gJCh0aGlzKS5wcmV2KCkuZmluZCgncCcpLnRleHQoKTtcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoJ3AnKS50ZXh0KChOdW1iZXIodGVtcFZvdGVOdW1iZXIpICsgMSkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJyNlNzRjM2MnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcjOTVhNWE2Jyk7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzKS50ZXh0KCflt7LmipXnpagnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXJyb3JNc2c7XG4gICAgc3dpdGNoIChkYXRhLmVycmNvZGUpIHtcbiAgICAgIGNhc2UgNDAwNzE3OlxuICAgICAgICBlcnJvck1zZyA9IFwi5oqV56Wo5bey5oiq5q2i77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDA3MTg6XG4gICAgICAgIGVycm9yTXNnID0gXCLlj5HnlJ/plJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQwMDcxOTpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaJi+acuuWPt+eggemUmeivr++8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDAwNzIwOlxuICAgICAgICBlcnJvck1zZyA9IFwi5Y+R55Sf6ZSZ6K+v77yM6K+36YeN5paw6L6T5YWl77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDA3MjE6XG4gICAgICAgIGVycm9yTXNnID0gXCLmraTmiYvmnLrlj7flt7LmipXov4fnpajkuoblk6bvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBlcnJvck1zZyA9IFwi5Y+R55Sf5pyq55+l6ZSZ6K+v77yM6K+36YeN5paw6L6T5YWl77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhlcnJvck1zZyk7XG4gICAgJCgnI3dyb25nTXNnJykudGV4dChlcnJvck1zZyk7XG4gICAgJCgnI3dyb25nTXNnJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gIH1cbn07XG5jb25zdCBoYW5kbGVBamF4RmFpbCA9IChlcnJvclRocm93bikgPT4ge1xuICAvLyBUT0RPOlxufTtcblxuLy8gNi4g5Yqg6L295a6M5oiQ77yM5pi+56S65YaF5a65XG5jb25zdCBsb2FkRW5kID0gKCkgPT4ge1xuICAkKCcjcHJlbG9hZC1wYWdlJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLmNvbnRhaW5lci13cmFwcGVyJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG59O1xuY29uc3QgY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSA9ICh2YWx1ZSkgPT4ge1xuICB2YXIgdGVtcFZhbCA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICQoJy5wcm9ncmVzcy1iYXInKS5hdHRyKCdhcmlhLXZhbHVlbm93JywgdGVtcFZhbCk7XG4gICQoJy5wcm9ncmVzcy1iYXInKS5jc3MoJ3dpZHRoJywgdGVtcFZhbCArICclJyk7XG59O1xuXG4vLyAqKioqKioqKioqKlxuLy8gKirnqIvluo/lvIDlp4sqKlxuLy8gKioqKioqKioqKipcbiQoZnVuY3Rpb24oKSB7XG4gIGFqYXhHZXQocmVxVXJsLCBnZXRJbmZvLCBoYW5kbGVBamF4RmFpbCk7XG4gIC8vIGFqYXhHZXQocHJlZml4ICsgcGF0aCwgZ2V0SW5mbywgaGFuZGxlQWpheEZhaWwpO1xuXG4gIC8vIOiuvue9rjXlpKnnmoTml7bpl7RzdHJpbmfvvIznlKjkuo7liKTmlq3mr5TotZvml6XmnJ9cbiAgc3dpdGNoIChkYXkpIHtcbiAgICBjYXNlIDI5OlxuICAgICAgZGF0ZVN0cmluZ18xID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTIpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMyA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgZGF5LnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzQgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsyKS50b1N0cmluZygpICsgJy0nICsgJzEnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzMDpcbiAgICAgIGRhdGVTdHJpbmdfMSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0yKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzMgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIGRheS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ180ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzIpLnRvU3RyaW5nKCkgKyAnLScgKyAnMSc7XG4gICAgICBkYXRlU3RyaW5nXzUgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMikudG9TdHJpbmcoKSArICctJyArICcyJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIGRhdGVTdHJpbmdfMSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSkudG9TdHJpbmcoKSArICctJyArICcyOSc7XG4gICAgICBkYXRlU3RyaW5nXzIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCkgKyAnLScgKyAnMzAnO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsxKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzIpLnRvU3RyaW5nKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCkgKyAnLScgKyAnMzAnO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzMgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIGRheS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ180ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzUgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMikudG9TdHJpbmcoKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMikudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMiA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0xKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsxKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzIpLnRvU3RyaW5nKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIOebkeWQrOaXpeacn+agj+eCueWHu+S6i+S7tu+8jOS4uuS6huWIh+aNouaXpeacn+WSjOavlOi1m+WNoeeJh1xuICAkKCcucGFnZTAtZGF0ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAkKCcucGFnZTAtZGF0ZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUtZGF0ZScpKSB7XG4gICAgICAgIHJlbW92ZUdhbWVDYXJkc09uT25lRGF5SW5IdG1sKGNhcmRzWyQodGhpcykuYXR0cignaWQnKV0pO1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGF0ZScpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZS1kYXRlJyk7XG4gICAgYWRkR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwoY2FyZHNbJCh0aGlzKS5hdHRyKCdpZCcpXSk7XG4gIH0pO1xuXG4gIC8vIOebkeWQrOaKleelqG1vZGFs5qGG5LqL5Lu2XG4gICQoJyNqb2luJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBwaG9uZU51bWJlciA9ICQoJyN1c2VyUGhvbmVJbnB1dCcpLnZhbCgpO1xuICAgIHZhciBwaG9uZU51bWJlclJlZ0V4cCA9IG5ldyBSZWdFeHAoJyheKDEzXFxcXGR8MTVbXjQsXFxcXERdfDE3WzEzNjc4XXwxOFxcXFxkKVxcXFxkezh9fDE3MFteMzQ2LFxcXFxEXVxcXFxkezd9KSQnLCAnZycpO1xuICAgIGlmKCFwaG9uZU51bWJlclJlZ0V4cC50ZXN0KHBob25lTnVtYmVyKSkge1xuICAgICAgJCgnI3dyb25nTXNnJykudGV4dCgn5omL5py65Y+35pyJ6K+v77yM6K+36YeN6K+V77yBJyk7XG4gICAgICAkKCcjd3JvbmdNc2cnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWpheFBvc3QoXG4gICAgICAgIHByZWZpeCArIHBhdGggKyB1dWlkICsgJy8nLFxuICAgICAgICAncGhvbmU9JyArIHBob25lTnVtYmVyICsgJyZ0ZWFtPScgKyB2b3RlVGVhbSxcbiAgICAgICAgcG9zdFBob25lTnVtYmVyLFxuICAgICAgICBoYW5kbGVBamF4RmFpbFxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
