// 全局变量:
var prefix = 'http://10.124.18.115:8080/';
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
const date = new Date();
const day = date.getDate();
let dateString_1;
let dateString_2;
let dateString_3;
let dateString_4;
let dateString_5;


// 通用函数们:
// 1. ajax get&post functions
const ajaxGet = (url, success_cb, fail_cb) => {
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
const ajaxPost = (url, data, success_cb, fail_cb) => {
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

// 2. 生成 html 组件
const createHtmlP = (text, style = undefined) => {
  if(style === undefined) {
    return $('<p>' + text + '</p>');
  }

  // 如果有样式传入，加上样式
  var styles = '';
  for(var key in style) {
    styles = styles + key + ':' + style[key] + ';';
  }
  return $('<p style="' + styles + '">' + text + '</p>');
};
const createHtmlImg = (src, alt) => {
  return $('<img alt="' + alt + '" src="' + src + '" />');
};
const createHtmlButton = (text, team, uuid) => {
  return $('<button data-team="' + team + '" data-uuid="' + uuid + '">' + text + '</button>');
};
const createHtmlDiv = (listOfElements, divClassName) => {
  var tempDiv = $('<div class="' + divClassName + '">' + '</div>');
  for (let i = 0; i < listOfElements.length; i++) {
    listOfElements[i].appendTo(tempDiv);
  }
  return tempDiv;
};

// 3. 动态生成一个比赛对阵卡
const createHtmlGameCard = (
  hostName,
  hostNameCN,
  guestName,
  guestNameCN,
  time,
  uuid
) => {
  const hostTitle = createHtmlP(hostNameCN);
  // const hostFlag = createHtmlImg('./images/' + hostName + '.png', 'hostFLag');
  const hostFlag = createHtmlImg('./images/french.png', 'hostFLag');
  const hostVoteButton = createHtmlButton('点击投票', hostName, uuid);
  const guestTitle = createHtmlP(guestNameCN);
  // const guestFlag = createHtmlImg('./images/' + guestName + '.png', 'guestFLag');
  const guestFlag = createHtmlImg('./images/romania.png', 'guestFLag');
  const guestVoteButton = createHtmlButton('点击投票', guestName, uuid);
  const leftDiv = createHtmlDiv([hostTitle, hostFlag, hostVoteButton], 'page0-gamecard-left');
  const midDiv = createHtmlDiv([createHtmlP('vs'), createHtmlP(time)], 'page0-gamecard-mid');
  const rightDiv = createHtmlDiv([guestTitle, guestFlag, guestVoteButton], 'page0-gamecard-right');
  const cardDiv = createHtmlDiv([leftDiv, midDiv, rightDiv], 'page0-timetable-game');

  return cardDiv;
};

// 4. 添加或删除 某一天的比赛卡片
const addGameCardsOnOneDayInHtml = (cardsOnOneDay) => {
  for(let i in cardsOnOneDay) {
    cardsOnOneDay[i].addClass('animated flipInX');
    $('.page0-timetable').append(cardsOnOneDay[i]);
  }
  // 给投票按钮添加click事件监听
  $('.page0-timetable-game button').on('click', function(event) {
    event.preventDefault();
    voteTeam = this.dataset.team;
    uuid = this.dataset.uuid;
    $('#myModal').modal('show');
  });
};
const removeGameCardsOnOneDayInHtml = (cardsOnOneDay) => {
  for(let i in cardsOnOneDay) {
    cardsOnOneDay[i].removeClass('flipInX');
    cardsOnOneDay[i].remove();
  }
};

// 5. ajax callback functions
const getInfo = (data) => {
  console.log(data);
  $('#date_1').text(dateString_1.substring(5));
  $('#date_2').text(dateString_2.substring(5));
  $('#date_3').text(dateString_3.substring(5));
  $('#date_4').text(dateString_4.substring(5));
  $('#date_5').text(dateString_5.substring(5));

  // 将卡片存储于cards
  for (var i = 0; i < data.data.races.length; i++) {
    // console.log(data.data.races[i].meta.startAt.split(' ')[0]);
    var race = data.data.races[i];
    var tempCard = createHtmlGameCard(
      race.host.name,
      race.host.nameCN,
      race.guest.name,
      race.guest.nameCN,
      race.meta.startAt.split(' ')[1].substring(0, 5),
      race.uuid
    );
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
  for(var i in cards) {
    if(cards[i].length == 0) {
      cards[i].push(createHtmlP('无赛事', {
        'width': '100%',
        'font-size': '2rem',
        'text-align': 'center'
      }));
    }
  }
  // 默认为今天的比赛
  addGameCardsOnOneDayInHtml(cards.date_3);
};
const postPhoneNumber = (data) => {
  if(data.errcode === undefined) {
    $('#wrongMsg').text('参与成功！');
    $('#wrongMsg').css('display', 'block');
    // 投票成功后，过两秒关闭modal窗口
    window.setTimeout(function() {
      $('#wrongMsg').css('display', 'none');
      $('#myModal').modal('hide');
    }, 2000);
    // 改变已投场次的按钮样式，并disabled按钮
    $('.page0-timetable-game button').each(function(i) {
      console.log(this.dataset.uuid);
      if(this.dataset.uuid == uuid) {
        $(this).attr('disabled', 'disabled');
        $(this).css('background-color', '#95a5a6');
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
  }
};
const handleAjaxFail = (errorThrown) => {
  // TODO 可用进度条替代
};


// ***********
// **程序开始**
// ***********
(function() {
  ajaxGet(reqUrl, getInfo, handleAjaxFail);

  // 设置5天的时间string，用于判断比赛日期
  switch (day) {
    case 29:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day-2).toString();
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day-1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day+1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth()+2).toString() + '-' + '1';
      break;
    case 30:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day-2).toString();
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day-1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth()+2).toString() + '-' + '1';
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth()+2).toString() + '-' + '2';
      break;
    case 1:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth()).toString() + '-' + '29';
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth()).toString() + '-' + '30';
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day+1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day+2).toString();
      break;
    case 2:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth()).toString() + '-' + '30';
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day-1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day+1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day+2).toString();
      break;
    default:
      dateString_1 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day-2).toString();
      dateString_2 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day-1).toString();
      dateString_3 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + day.toString();
      dateString_4 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day+1).toString();
      dateString_5 = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + (day+2).toString();
      break;
  }

  // 监听日期栏点击事件，为了切换日期和比赛卡片
  $('.page0-date').on('click', function(event) {
    event.preventDefault();
    $('.page0-date').each(function() {
      if($(this).hasClass('active-date')) {
        removeGameCardsOnOneDayInHtml(cards[$(this).attr('id')]);
        $(this).removeClass('active-date');
      }
    });
    $(this).addClass('active-date');
    addGameCardsOnOneDayInHtml(cards[$(this).attr('id')]);
  });

  // 监听投票modal框事件
  $('#join').on('click', function(event) {
    event.preventDefault();
    var phoneNumber = $('#userPhoneInput').val();
    var phoneNumberRegExp = new RegExp('(^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7})$', 'g');
    if(!phoneNumberRegExp.test(phoneNumber)) {
      $('#wrongMsg').text('手机号有误，请重试！');
      $('#wrongMsg').css('display', 'block');
    } else {
      ajaxPost(
        prefix + path + uuid,
        'phone=' + phoneNumber + '&team=' + voteTeam,
        postPhoneNumber,
        handleAjaxFail
      );
    }
  });
})();
