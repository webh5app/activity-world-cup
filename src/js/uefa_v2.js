/*  Global variables:
**  1. prefix - the host path of the ajax request url
**  2. path - the path under the host
**  3. uuid - a unique id for every game
**  4. voteTeam - the team that the user voted
**  5. cards - the vote timetable cards of recent 5 days(date_3 is today)
**  6. dateStrings - 5 strings that represent the date of recent 5 days, e.g. 2016-6-20
*/
var prefix = 'http://10.124.18.115:8080/';
// var prefix = '/';
var path = 'api/v1/activity/worldcup/';
var uuid;
var reqUrl = '../api.json';
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

/*  Utility functions(general info):
**  1. ajaxGet, ajaxPost - used when making an ajax request
**  2. createHtmlP, createHtmlImg, ... - create a html DOM element
**  3. createHtmlGameCard - using the functions above to create a timetable card for one game
**  4. addGameCardsOnOneDayInHtml - add the cards in the input array to the timatable view
**  5. removeGameCardsOnOneDayInHtml - remove the cards in the input array from the timatable view
**  6. preloadFiles - loading all (js & css & img) files into the html
**  7. getInfo - the success callback funtion for getting initial information
**  8. postPhoneNumber - the success callback function for posting the phone number when voting
**  9. handleAjaxFail - show error info when the ajax request failed
**  10. loadEnd - hide the progress-bar view and show the main content after loading necessary data
**  11. changeProgressBarValue - change the progress-bar's value(length)
*/

/* Ajax get function
** @param:
**    url - request url
**    success_cb - the success callback functions
**    fail_cb - the fail callback function
*/
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

/* Ajax post function
** @param:
**    url - request url
**    data - the data to post to the server
**    success_cb - the success callback functions
**    fail_cb - the fail callback function
*/
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

/* Create a <p> DOM element
** @param:
**    text - the inner text to write in it (<p>text</p>)
**    style - the css style applied to this element, dafault to undefined
** @return: the reference of this element
*/
const createHtmlP = (text, style = undefined) => {
  if(style === undefined) {
    return $('<p>' + text + '</p>');
  }

  var styles = '';
  for(var key in style) {
    styles = styles + key + ':' + style[key] + ';';
  }
  return $('<p style="' + styles + '">' + text + '</p>');
};

/* Create a <img> DOM element
** @param:
**    src - the source path of the image
**    alt - the alternative text
** @return: the reference of this element
*/
const createHtmlImg = (src, alt) => {
  return $('<img alt="' + alt + '" src="' + src + '" />');
};

/* Create a <button> DOM element
** @param:
**    text - the inner text to write in it (<button>text</button>)
**    team - data-team mark in the tag to store the team name for voting purpose
**    uuid - data0uuid mark in the tag to store the uuid of this game for voting purpose
**    expired - if the game has ended, the value is true
** @return: the reference of this element
*/
const createHtmlButton = (text, team, uuid, expired) => {
  if(expired) {
    var tempButton = $('<button data-team="' + team + '" data-uuid="' + uuid + '">已结束</button>');
    tempButton.attr('disabled', 'disabled');
    tempButton.css('background-color', '#95a5a6');
    return tempButton;
  }
  return $('<button data-team="' + team + '" data-uuid="' + uuid + '">' + text + '</button>');
};

/* Create a <div> DOM element
** @param:
**    listOfElements - an array of elements to add to this div in order
**    divClassName - the class name of this div element
** @return: the reference of this element
*/
const createHtmlDiv = (listOfElements, divClassName) => {
  var tempDiv = $('<div class="' + divClassName + '">' + '</div>');
  for (let i = 0; i < listOfElements.length; i++) {
    listOfElements[i].appendTo(tempDiv);
  }
  return tempDiv;
};

/* Create a timetable card for one game, itself is also a div
** @param:
**    hostName - the name of the host team
**    hostNameCN - the Chinese name of the host team
**    hostFlag - the url to get the flag image of host team
**    hostVote - the number of votes of host team
**    guestName - the name of the guest team
**    guestNameCN - the Chinese name of the guest team
**    guestFlag - the url to get the flag image of guest team
**    guestVote - the number of votes of guest team
**    time - the start time of this game
**    uuid - the unique id of this game
**    expired - is this game ended or not, true if already ended.
** @return: the reference of this element
*/
const createHtmlGameCard = (
  hostName,
  hostNameCN,
  hostFlag,
  hostVote,
  guestName,
  guestNameCN,
  guestFlag,
  guestVote,
  time,
  uuid,
  expired
) => {
  const hostTitleElement = createHtmlP(hostNameCN);
  const hostFlagElement = createHtmlImg(hostFlag, 'hostFLag');
  const hostVoteNumber = createHtmlP(hostVote, {
    'width': '100%',
    'margin': '0'
  });
  const hostVoteNumberElement = createHtmlDiv([hostVoteNumber], 'page0-gamecard-voteNumber');
  const hostVoteButtonElement = createHtmlButton(hostNameCN+'胜', hostName, uuid, expired);

  const guestTitleElement = createHtmlP(guestNameCN);
  const guestFlagElement = createHtmlImg(guestFlag, 'guestFLag');
  const guestVoteNumber = createHtmlP(guestVote, {
    'width': '100%',
    'margin': '0'
  });
  const guestVoteNumberElement = createHtmlDiv([guestVoteNumber], 'page0-gamecard-voteNumber');
  const guestVoteButtonElement = createHtmlButton(guestNameCN+'胜', guestName, uuid, expired);

  const pingVoteButtonElement = createHtmlButton('打平', 'ping', uuid, expired);

  const leftDiv = createHtmlDiv([
    hostTitleElement,
    hostFlagElement,
    hostVoteNumberElement,
    hostVoteButtonElement
  ], 'page0-gamecard-left');

  const midDiv = createHtmlDiv([
    createHtmlP('vs'),
    createHtmlP(time),
    pingVoteButtonElement
  ], 'page0-gamecard-mid');

  const rightDiv = createHtmlDiv([
    guestTitleElement,
    guestFlagElement,
    guestVoteNumberElement,
    guestVoteButtonElement
  ], 'page0-gamecard-right');

  const cardDiv = createHtmlDiv([
    leftDiv,
    midDiv,
    rightDiv
  ], 'page0-timetable-game');

  return cardDiv;
};

/* Add the input cards to the timetable
** @param:
**    cardsOnOneDay - an array of game cards
*/
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
    $('#wrongMsg').css('display', 'none');
    $('#myModal').modal('show');
  });
};

/* Remove the input cards to the timetable
** @param:
**    cardsOnOneDay - an array of game cards
*/
const removeGameCardsOnOneDayInHtml = (cardsOnOneDay) => {
  for(let i in cardsOnOneDay) {
    cardsOnOneDay[i].removeClass('flipInX');
    cardsOnOneDay[i].remove();
  }
};

/* Load all needed files
** @param
*/
const preloadFiles = () => {
  var css_uefa = document.createElement('link');
  css_uefa.type = "text/css";
  css_uefa.rel  = "stylesheet";
  css_uefa.href = "/css/uefa.css";

  var css_animate = document.createElement('link');
  css_animate.type = "text/css";
  css_animate.rel  = "stylesheet";
  css_animate.href = "/css/animate.min.css";

  var js_bootstrap  = document.createElement("script");
  js_bootstrap.type = "text/javascript";
  js_bootstrap.src  = "/js/bootstrap.min.js";

  $('head').first().append(css_animate);
  $('head').first().append(css_uefa);
  $('html').first().append(js_bootstrap);

  $('#football').append(createHtmlImg('//ooo.0o0.ooo/2016/06/15/57622df0744e3.png', 'football'));
  $('#logo').append(createHtmlImg('//ooo.0o0.ooo/2016/06/15/57622884e73bb.png', 'logo'));
};

/* Ajax get action's sucess callback function
** @param:
**    data - the data returned by the ajax request
*/
const getInfo = (data) => {
  preloadFiles();
  changeProgressBarValue(70);

  $('#date_1').text(dateString_1.substring(5));
  $('#date_2').text(dateString_2.substring(5));
  $('#date_3').text(dateString_3.substring(5));
  $('#date_4').text(dateString_4.substring(5));
  $('#date_5').text(dateString_5.substring(5));

  if(data.data.races.length > 0) {
    $('#modal-close').attr('href', data.data.races[0].register_url);
  }
  $('title').first().text(data.data.title);

  for (var i = 0; i < data.data.races.length; i++) {
    var race = data.data.races[i];
    var expired = race.meta.expired;
    var tempCard = createHtmlGameCard(
      race.host.name,
      race.host.nameCN,
      race.host.flag,
      race.host.vote,
      race.guest.name,
      race.guest.nameCN,
      race.guest.flag,
      race.guest.vote,
      race.meta.startAt.split(' ')[1].substring(0, 5),
      race.uuid,
      expired
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

  for(var i in cards) {
    if(cards[i].length == 0) {
      cards[i].push(createHtmlP('无赛事', {
        'width': '100%',
        'color': '#fff',
        'font-size': '2rem',
        'text-align': 'center'
      }));
    }
  }
  addGameCardsOnOneDayInHtml(cards.date_3);
  changeProgressBarValue(100);

  // After loading finished, show main content after 1 second
  window.setTimeout(() => {
    loadEnd();
  }, 1000);
};

/* Ajax post action's sucess callback function
** @param:
**    data - the data returned by the ajax request
*/
const postPhoneNumber = (data) => {
  if(data.errcode === undefined) {
    $('#wrongMsg').text('参与成功！');
    $('#wrongMsg').css('display', 'block');

    // vote success, close the modal window automatically after 2 seconds
    window.setTimeout(function() {
      $('#wrongMsg').css('display', 'none');
      $('#myModal').modal('hide');
    }, 2000);

    // style and disable the buttons of the voted game card
    $('.page0-timetable-game button').each(function(i) {
      if(this.dataset.uuid === uuid) {
        $(this).attr('disabled', 'disabled');
        if(voteTeam === this.dataset.team) {
          if(voteTeam !== 'ping') {
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
    $('#wrongMsg').text(errorMsg);
    $('#wrongMsg').css('display', 'block');
  }
};
const handleAjaxFail = (errorThrown) => {
  // TODO:
};

/* Hide progress-bar and show the main content when loading has finished
** @param
*/
const loadEnd = () => {
  $('#preload-page').css('display', 'none');
  $('.container-wrapper').css('display', 'block');
};

/* Change the value of the progress-bar
** @param:
**    value - the value of the progress-bar to achieve
*/
const changeProgressBarValue = (value) => {
  var tempVal = value.toString();
  $('.progress-bar').attr('aria-valuenow', tempVal);
  $('.progress-bar').css('width', tempVal + '%');
};


/*  ******************
**  Main program begin
**  ******************
*/
$(function() {
  // ajaxGet(reqUrl, getInfo, handleAjaxFail);
  ajaxGet(prefix + path, getInfo, handleAjaxFail);

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

  // Event listener for the top navigation bar to switch date
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

  // Event listener for the vote modal window
  // Use regular expression to test the phone number before making ajax request
  $('#join').on('click', function(event) {
    event.preventDefault();
    var phoneNumber = $('#userPhoneInput').val();
    var phoneNumberRegExp = new RegExp('(^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7})$', 'g');
    if(!phoneNumberRegExp.test(phoneNumber)) {
      $('#wrongMsg').text('手机号有误，请重试！');
      $('#wrongMsg').css('display', 'block');
    } else {
      ajaxPost(
        prefix + path + uuid + '/',
        'phone=' + phoneNumber + '&team=' + voteTeam,
        postPhoneNumber,
        handleAjaxFail
      );
    }
  });
});
