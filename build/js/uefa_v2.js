'use strict';

/*  Global variables:
**  1. prefix - the host path of the ajax request url
**  2. path - the path under the host
**  3. uuid - a unique id for every game
**  4. voteTeam - the team that the user voted
**  5. cards - the vote timetable cards of recent 5 days(date_3 is today)
**  6. dateStrings - 5 strings that represent the date of recent 5 days, e.g. 2016-6-20
*/
// var prefix = 'http://10.124.18.115:8080/';
var prefix = '/';
var path = 'api/v1/activity/worldcup/';
var uuid;
// var reqUrl = '../api.json';
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

/* Ajax post function
** @param:
**    url - request url
**    data - the data to post to the server
**    success_cb - the success callback functions
**    fail_cb - the fail callback function
*/
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

/* Generate a style string using the input style object
** @param:
**    style - a style object under the global styles variable
** @return:
**    a style string, which can be applied inside a HTML DOM tag
*/
var generateStyleString = function generateStyleString(style) {
  var tempStyleString = '';
  for (var key in style) {
    tempStyleString = tempStyleString + key + ':' + style[key] + ';';
  }
  return tempStyleString;
};

/* Create a <p> DOM element
** @param:
**    text - the inner text to write in it (<p>text</p>)
**    style - the css style applied to this element, dafault to undefined
** @return: the reference of this element
*/
var createHtmlP = function createHtmlP(text) {
  var style = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

  if (style === undefined) {
    return $('<p>' + text + '</p>');
  }

  var tempStyleString = generateStyleString(style);
  return $('<p style="' + tempStyleString + '">' + text + '</p>');
};

/* Create a <img> DOM element
** @param:
**    src - the source path of the image
**    alt - the alternative text
**    style - the css style applied to this element, dafault to undefined
** @return: the reference of this element
*/
var createHtmlImg = function createHtmlImg(src, alt) {
  var style = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

  var tempImg;
  if (style === undefined) {
    tempImg = $('<img alt="' + alt + '" src="' + src + '" />');
  } else {
    var tempStyleString = generateStyleString(style);
    tempImg = $('<img alt="' + alt + '" src="' + src + '" style="' + tempStyleString + '" />');
  }
  return tempImg;
};

/* Create a <button> DOM element
** @param:
**    text - the inner text to write in it (<button>text</button>)
**    style - the css style applied to this element, dafault to undefined
**    dataset - necessary info
**      team - data-team mark in the tag to store the team name for voting purpose
**      uuid - data-uuid mark in the tag to store the uuid of this game for voting purpose
**      expired - if the game has ended, the value is true
** @return: the reference of this element
*/
var createHtmlButton = function createHtmlButton(text) {
  var style = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
  var dataset = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

  var tempButton;
  if (dataset.expired) {
    text = '已结束';
  }

  if (style === undefined) {
    tempButton = $('<button data-team="' + dataset.team + '" data-uuid="' + dataset.uuid + '">' + text + '</button>');
  } else {
    var tempStyleString = generateStyleString(style);
    tempButton = $('<button data-team="' + dataset.team + '" data-uuid="' + dataset.uuid + '" style="' + tempStyleString + '">' + text + '</button>');
  }
  if (dataset.expired) {
    tempButton.attr('disabled', 'disabled');
    tempButton.css('background-color', '#95a5a6');
  }
  return tempButton;
};

/* Create a <div> DOM element
** @param:
**    listOfElements - an array of elements to add to this div in order
**    style - the css style applied to this element, dafault to undefined
**    divClassName - the class name of this div element
** @return: the reference of this element
*/
var createHtmlDiv = function createHtmlDiv(listOfElements) {
  var style = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
  var divClassName = arguments[2];

  var tempDiv;
  if (style === undefined) {
    tempDiv = $('<div class="' + divClassName + '">' + '</div>');
  } else {
    var tempStyleString = generateStyleString(style);
    tempDiv = $('<div class="' + divClassName + '" style="' + tempStyleString + '">' + '</div>');
  }

  for (var i = 0; i < listOfElements.length; i++) {
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
var createHtmlGameCard = function createHtmlGameCard(hostName, hostNameCN, hostFlag, hostVote, guestName, guestNameCN, guestFlag, guestVote, time, uuid, expired) {
  var hostTitleElement = createHtmlP(hostNameCN, styles.gameCard.teamName);
  var hostFlagElement = createHtmlImg(hostFlag, 'hostFLag', styles.gameCard.teamFlag);
  var hostVoteNumber = createHtmlP(hostVote, styles.gameCard.vote.number);
  var hostVoteNumberElement = createHtmlDiv([hostVoteNumber], styles.gameCard.vote.box, 'page0-gamecard-voteNumber');
  var hostVoteButtonElement = createHtmlButton('胜', styles.gameCard.button.team, {
    team: hostName,
    uuid: uuid,
    expired: expired
  });

  var guestTitleElement = createHtmlP(guestNameCN, styles.gameCard.teamName);
  var guestFlagElement = createHtmlImg(guestFlag, 'guestFLag', styles.gameCard.teamFlag);
  var guestVoteNumber = createHtmlP(guestVote, styles.gameCard.vote.number);
  var guestVoteNumberElement = createHtmlDiv([guestVoteNumber], styles.gameCard.vote.box, 'page0-gamecard-voteNumber');
  var guestVoteButtonElement = createHtmlButton('胜', styles.gameCard.button.team, {
    team: guestName,
    uuid: uuid,
    expired: expired
  });

  var pingVoteButtonElement = createHtmlButton('平', styles.gameCard.button.ping, {
    team: 'ping',
    uuid: uuid,
    expired: expired
  });

  var leftDiv = createHtmlDiv([hostTitleElement, hostFlagElement, hostVoteNumberElement, hostVoteButtonElement], styles.gameCard.team, 'page0-gamecard-team');

  var midDiv = createHtmlDiv([createHtmlP('vs', styles.gameCard.vs), createHtmlP(time, styles.gameCard.time), pingVoteButtonElement], styles.gameCard.midInfo, 'page0-gamecard-mid');

  var rightDiv = createHtmlDiv([guestTitleElement, guestFlagElement, guestVoteNumberElement, guestVoteButtonElement], styles.gameCard.team, 'page0-gamecard-team');

  var cardDiv = createHtmlDiv([leftDiv, midDiv, rightDiv], styles.gameTimeTable, 'page0-timetable-game');

  return cardDiv;
};

/* Add the input cards to the timetable
** @param:
**    cardsOnOneDay - an array of game cards
*/
var addGameCardsOnOneDayInHtml = function addGameCardsOnOneDayInHtml(cardsOnOneDay) {
  for (var i in cardsOnOneDay) {
    cardsOnOneDay[i].addClass('animated flipInX');
    $('.page0-timetable').append(cardsOnOneDay[i]);
  }

  // Event listener for vote button
  $('.page0-timetable-game button').on('click', function (event) {
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
var removeGameCardsOnOneDayInHtml = function removeGameCardsOnOneDayInHtml(cardsOnOneDay) {
  for (var i in cardsOnOneDay) {
    cardsOnOneDay[i].removeClass('flipInX');
    cardsOnOneDay[i].remove();
  }
};

/* Load all needed files
** @param
*/
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

/* Ajax get action's sucess callback function
** @param:
**    data - the data returned by the ajax request
*/
var getInfo = function getInfo(data) {
  preloadFiles();
  changeProgressBarValue(70);

  $('#date_1').text(dateString_1.substring(5));
  $('#date_2').text(dateString_2.substring(5));
  $('#date_3').text(dateString_3.substring(5));
  $('#date_4').text(dateString_4.substring(5));
  $('#date_5').text(dateString_5.substring(5));

  if (data.data.races.length > 0) {
    $('#modal-close').attr('href', data.data.races[0].register_url);
  }
  $('title').first().text(data.data.title);

  for (var i = 0; i < data.data.races.length; i++) {
    var race = data.data.races[i];
    var expired = race.meta.expired;
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
  addGameCardsOnOneDayInHtml(cards.date_3);
  changeProgressBarValue(100);

  // After loading finished, show main content after 1 second
  window.setTimeout(function () {
    loadEnd();
  }, 1000);
};

/* Ajax post action's sucess callback function
** @param:
**    data - the data returned by the ajax request
*/
var postPhoneNumber = function postPhoneNumber(data) {
  if (data.errcode === undefined) {
    $('#wrongMsg').text('参与成功！');
    $('#wrongMsg').css('display', 'block');

    // vote success, close the modal window automatically after 2 seconds
    window.setTimeout(function () {
      $('#wrongMsg').css('display', 'none');
      $('#myModal').modal('hide');
    }, 2000);

    // style and disable the buttons of the voted game card
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
    $('#wrongMsg').text(errorMsg);
    $('#wrongMsg').css('display', 'block');
  }
};
var handleAjaxFail = function handleAjaxFail(errorThrown) {
  // TODO:
};

/* Hide progress-bar and show the main content when loading has finished
** @param
*/
var loadEnd = function loadEnd() {
  $('#preload-page').css('display', 'none');
  $('.container-wrapper').css('display', 'block');
};

/* Change the value of the progress-bar
** @param:
**    value - the value of the progress-bar to achieve
*/
var changeProgressBarValue = function changeProgressBarValue(value) {
  var tempVal = value.toString();
  $('.progress-bar').attr('aria-valuenow', tempVal);
  $('.progress-bar').css('width', tempVal + '%');
};

/*  ******************
**  Main program begin
**  ******************
*/
$(function () {
  // ajaxGet(reqUrl, getInfo, handleAjaxFail);
  ajaxGet(prefix + path, getInfo, handleAjaxFail);

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

  // Event listener for the top navigation bar to switch date
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

  // Event listener for the vote modal window
  // Use regular expression to test the phone number before making ajax request
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

var styles = {
  gameTimeTable: {
    'width': '90%',
    'height': 'auto',
    'margin': 'auto',
    'margin-top': '1rem',
    'padding': '.5rem .6rem',
    'display': 'flex',
    'justify-content': 'space-around',
    'align-items': 'center',
    'background-color': '#efefef',
    'border-radius': '3px',
    'box-shadow': '0px 2px 4px rgba(0,0,0,.25)'
  },
  gameCard: {
    team: {
      'width': '30%',
      'height': 'auto',
      'display': 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'color': '#27ae60',
      'text-align': 'center'
    },
    teamName: {
      'font-size': '.8rem'
    },
    teamFlag: {
      'width': '85%'
    },
    vote: {
      box: {
        'width': '85%',
        'height': 'auto',
        'padding': '.1rem 0',
        'margin-top': '.5rem',
        'border': '2px solid #e74c3c',
        'border-radius': '3px',
        'color': '#e74c3c',
        'font-size': '.7rem'
      },
      number: {
        'width': '100%',
        'margin': '0'
      }
    },
    midInfo: {
      'width': '30%',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-between',
      'font-size': '1.1rem',
      'letter-spacing': '.1rem',
      'text-align': 'center'
    },
    vs: {
      'margin': '0'
    },
    time: {
      'margin': '0',
      'margin-top': '1rem',
      'padding': '.1rem',
      'color': '#fff',
      'font-size': '.9rem',
      'background-color': '#2ecc71',
      'border-radius': '3px'
    },
    button: {
      team: {
        'width': '85%',
        'padding': '.2rem',
        'margin-top': '.5rem',
        'outline': 'none',
        'border': 'none',
        'border-radius': '3px',
        'background-color': '#3498db',
        'color': '#fff',
        'font-size': '.7rem'
      },
      ping: {
        'width': '100%',
        'padding': '.2rem',
        'margin': 'auto',
        'margin-top': '1rem',
        'outline': 'none',
        'border': 'none',
        'border-radius': '3px',
        'background-color': '#3498db',
        'color': '#fff',
        'font-size': '.7rem'
      }
    }
  }
};
//# sourceMappingURL=data:application/json;base64,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SFI7QUFJSCxzQkFBYyxPQUpYO0FBS0gsa0JBQVUsbUJBTFA7QUFNSCx5QkFBaUIsS0FOZDtBQU9ILGlCQUFTLFNBUE47QUFRSCxxQkFBYTtBQVJWLE9BREQ7QUFXSixjQUFRO0FBQ04saUJBQVMsTUFESDtBQUVOLGtCQUFVO0FBRko7QUFYSixLQWhCRTtBQWdDUixhQUFTO0FBQ1AsZUFBUyxLQURGO0FBRVAsaUJBQVcsTUFGSjtBQUdQLHdCQUFrQixRQUhYO0FBSVAseUJBQW1CLGVBSlo7QUFLUCxtQkFBYSxRQUxOO0FBTVAsd0JBQWtCLE9BTlg7QUFPUCxvQkFBYztBQVBQLEtBaENEO0FBeUNSLFFBQUk7QUFDRixnQkFBVTtBQURSLEtBekNJO0FBNENSLFVBQU07QUFDSixnQkFBVSxHQUROO0FBRUosb0JBQWMsTUFGVjtBQUdKLGlCQUFXLE9BSFA7QUFJSixlQUFTLE1BSkw7QUFLSixtQkFBYSxPQUxUO0FBTUosMEJBQW9CLFNBTmhCO0FBT0osdUJBQWlCO0FBUGIsS0E1Q0U7QUFxRFIsWUFBUTtBQUNOLFlBQU07QUFDSixpQkFBUyxLQURMO0FBRUosbUJBQVcsT0FGUDtBQUdKLHNCQUFjLE9BSFY7QUFJSixtQkFBVyxNQUpQO0FBS0osa0JBQVUsTUFMTjtBQU1KLHlCQUFpQixLQU5iO0FBT0osNEJBQW9CLFNBUGhCO0FBUUosaUJBQVMsTUFSTDtBQVNKLHFCQUFhO0FBVFQsT0FEQTtBQVlOLFlBQU07QUFDSixpQkFBUyxNQURMO0FBRUosbUJBQVcsT0FGUDtBQUdKLGtCQUFVLE1BSE47QUFJSixzQkFBYyxNQUpWO0FBS0osbUJBQVcsTUFMUDtBQU1KLGtCQUFVLE1BTk47QUFPSix5QkFBaUIsS0FQYjtBQVFKLDRCQUFvQixTQVJoQjtBQVNKLGlCQUFTLE1BVEw7QUFVSixxQkFBYTtBQVZUO0FBWkE7QUFyREE7QUFkQyxDQUFiIiwiZmlsZSI6InVlZmFfdjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAgR2xvYmFsIHZhcmlhYmxlczpcbioqICAxLiBwcmVmaXggLSB0aGUgaG9zdCBwYXRoIG9mIHRoZSBhamF4IHJlcXVlc3QgdXJsXG4qKiAgMi4gcGF0aCAtIHRoZSBwYXRoIHVuZGVyIHRoZSBob3N0XG4qKiAgMy4gdXVpZCAtIGEgdW5pcXVlIGlkIGZvciBldmVyeSBnYW1lXG4qKiAgNC4gdm90ZVRlYW0gLSB0aGUgdGVhbSB0aGF0IHRoZSB1c2VyIHZvdGVkXG4qKiAgNS4gY2FyZHMgLSB0aGUgdm90ZSB0aW1ldGFibGUgY2FyZHMgb2YgcmVjZW50IDUgZGF5cyhkYXRlXzMgaXMgdG9kYXkpXG4qKiAgNi4gZGF0ZVN0cmluZ3MgLSA1IHN0cmluZ3MgdGhhdCByZXByZXNlbnQgdGhlIGRhdGUgb2YgcmVjZW50IDUgZGF5cywgZS5nLiAyMDE2LTYtMjBcbiovXG4vLyB2YXIgcHJlZml4ID0gJ2h0dHA6Ly8xMC4xMjQuMTguMTE1OjgwODAvJztcbnZhciBwcmVmaXggPSAnLyc7XG52YXIgcGF0aCA9ICdhcGkvdjEvYWN0aXZpdHkvd29ybGRjdXAvJztcbnZhciB1dWlkO1xuLy8gdmFyIHJlcVVybCA9ICcuLi9hcGkuanNvbic7XG52YXIgdm90ZVRlYW07XG52YXIgY2FyZHMgPSB7XG4gIGRhdGVfMTogW10sXG4gIGRhdGVfMjogW10sXG4gIGRhdGVfMzogW10sXG4gIGRhdGVfNDogW10sXG4gIGRhdGVfNTogW11cbn07XG5jb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbmNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xubGV0IGRhdGVTdHJpbmdfMTtcbmxldCBkYXRlU3RyaW5nXzI7XG5sZXQgZGF0ZVN0cmluZ18zO1xubGV0IGRhdGVTdHJpbmdfNDtcbmxldCBkYXRlU3RyaW5nXzU7XG5cbi8qICBVdGlsaXR5IGZ1bmN0aW9ucyhnZW5lcmFsIGluZm8pOlxuKiogIDEuIGFqYXhHZXQsIGFqYXhQb3N0IC0gdXNlZCB3aGVuIG1ha2luZyBhbiBhamF4IHJlcXVlc3RcbioqICAyLiBjcmVhdGVIdG1sUCwgY3JlYXRlSHRtbEltZywgLi4uIC0gY3JlYXRlIGEgaHRtbCBET00gZWxlbWVudFxuKiogIDMuIGNyZWF0ZUh0bWxHYW1lQ2FyZCAtIHVzaW5nIHRoZSBmdW5jdGlvbnMgYWJvdmUgdG8gY3JlYXRlIGEgdGltZXRhYmxlIGNhcmQgZm9yIG9uZSBnYW1lXG4qKiAgNC4gYWRkR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwgLSBhZGQgdGhlIGNhcmRzIGluIHRoZSBpbnB1dCBhcnJheSB0byB0aGUgdGltYXRhYmxlIHZpZXdcbioqICA1LiByZW1vdmVHYW1lQ2FyZHNPbk9uZURheUluSHRtbCAtIHJlbW92ZSB0aGUgY2FyZHMgaW4gdGhlIGlucHV0IGFycmF5IGZyb20gdGhlIHRpbWF0YWJsZSB2aWV3XG4qKiAgNi4gcHJlbG9hZEZpbGVzIC0gbG9hZGluZyBhbGwgKGpzICYgY3NzICYgaW1nKSBmaWxlcyBpbnRvIHRoZSBodG1sXG4qKiAgNy4gZ2V0SW5mbyAtIHRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bnRpb24gZm9yIGdldHRpbmcgaW5pdGlhbCBpbmZvcm1hdGlvblxuKiogIDguIHBvc3RQaG9uZU51bWJlciAtIHRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBwb3N0aW5nIHRoZSBwaG9uZSBudW1iZXIgd2hlbiB2b3RpbmdcbioqICA5LiBoYW5kbGVBamF4RmFpbCAtIHNob3cgZXJyb3IgaW5mbyB3aGVuIHRoZSBhamF4IHJlcXVlc3QgZmFpbGVkXG4qKiAgMTAuIGxvYWRFbmQgLSBoaWRlIHRoZSBwcm9ncmVzcy1iYXIgdmlldyBhbmQgc2hvdyB0aGUgbWFpbiBjb250ZW50IGFmdGVyIGxvYWRpbmcgbmVjZXNzYXJ5IGRhdGFcbioqICAxMS4gY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSAtIGNoYW5nZSB0aGUgcHJvZ3Jlc3MtYmFyJ3MgdmFsdWUobGVuZ3RoKVxuKi9cblxuLyogQWpheCBnZXQgZnVuY3Rpb25cbioqIEBwYXJhbTpcbioqICAgIHVybCAtIHJlcXVlc3QgdXJsXG4qKiAgICBzdWNjZXNzX2NiIC0gdGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb25zXG4qKiAgICBmYWlsX2NiIC0gdGhlIGZhaWwgY2FsbGJhY2sgZnVuY3Rpb25cbiovXG5jb25zdCBhamF4R2V0ID0gKHVybCwgc3VjY2Vzc19jYiwgZmFpbF9jYikgPT4ge1xuICAkLmFqYXgoe1xuICAgIHR5cGU6ICdHRVQnLFxuICAgIHVybDogdXJsLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSlcbiAgLmRvbmUoKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB7XG4gICAgc3VjY2Vzc19jYihkYXRhKTtcbiAgfSlcbiAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4ge1xuICAgIGZhaWxfY2IoZXJyb3JUaHJvd24pO1xuICB9KTtcbn07XG5cbi8qIEFqYXggcG9zdCBmdW5jdGlvblxuKiogQHBhcmFtOlxuKiogICAgdXJsIC0gcmVxdWVzdCB1cmxcbioqICAgIGRhdGEgLSB0aGUgZGF0YSB0byBwb3N0IHRvIHRoZSBzZXJ2ZXJcbioqICAgIHN1Y2Nlc3NfY2IgLSB0aGUgc3VjY2VzcyBjYWxsYmFjayBmdW5jdGlvbnNcbioqICAgIGZhaWxfY2IgLSB0aGUgZmFpbCBjYWxsYmFjayBmdW5jdGlvblxuKi9cbmNvbnN0IGFqYXhQb3N0ID0gKHVybCwgZGF0YSwgc3VjY2Vzc19jYiwgZmFpbF9jYikgPT4ge1xuICAkLmFqYXgoe1xuICAgIHR5cGU6ICdQT1NUJyxcbiAgICB1cmw6IHVybCxcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCcsXG4gICAgZGF0YTogZGF0YVxuICB9KVxuICAuZG9uZSgoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpID0+IHtcbiAgICBzdWNjZXNzX2NiKGRhdGEpO1xuICB9KVxuICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB7XG4gICAgZmFpbF9jYihlcnJvclRocm93bik7XG4gIH0pO1xufTtcblxuLyogR2VuZXJhdGUgYSBzdHlsZSBzdHJpbmcgdXNpbmcgdGhlIGlucHV0IHN0eWxlIG9iamVjdFxuKiogQHBhcmFtOlxuKiogICAgc3R5bGUgLSBhIHN0eWxlIG9iamVjdCB1bmRlciB0aGUgZ2xvYmFsIHN0eWxlcyB2YXJpYWJsZVxuKiogQHJldHVybjpcbioqICAgIGEgc3R5bGUgc3RyaW5nLCB3aGljaCBjYW4gYmUgYXBwbGllZCBpbnNpZGUgYSBIVE1MIERPTSB0YWdcbiovXG5jb25zdCBnZW5lcmF0ZVN0eWxlU3RyaW5nID0gKHN0eWxlKSA9PiB7XG4gIHZhciB0ZW1wU3R5bGVTdHJpbmcgPSAnJztcbiAgZm9yKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICB0ZW1wU3R5bGVTdHJpbmcgPSB0ZW1wU3R5bGVTdHJpbmcgKyBrZXkgKyAnOicgKyBzdHlsZVtrZXldICsgJzsnO1xuICB9XG4gIHJldHVybiB0ZW1wU3R5bGVTdHJpbmc7XG59O1xuXG4vKiBDcmVhdGUgYSA8cD4gRE9NIGVsZW1lbnRcbioqIEBwYXJhbTpcbioqICAgIHRleHQgLSB0aGUgaW5uZXIgdGV4dCB0byB3cml0ZSBpbiBpdCAoPHA+dGV4dDwvcD4pXG4qKiAgICBzdHlsZSAtIHRoZSBjc3Mgc3R5bGUgYXBwbGllZCB0byB0aGlzIGVsZW1lbnQsIGRhZmF1bHQgdG8gdW5kZWZpbmVkXG4qKiBAcmV0dXJuOiB0aGUgcmVmZXJlbmNlIG9mIHRoaXMgZWxlbWVudFxuKi9cbmNvbnN0IGNyZWF0ZUh0bWxQID0gKHRleHQsIHN0eWxlID0gdW5kZWZpbmVkKSA9PiB7XG4gIGlmKHN0eWxlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJCgnPHA+JyArIHRleHQgKyAnPC9wPicpO1xuICB9XG5cbiAgY29uc3QgdGVtcFN0eWxlU3RyaW5nID0gZ2VuZXJhdGVTdHlsZVN0cmluZyhzdHlsZSk7XG4gIHJldHVybiAkKCc8cCBzdHlsZT1cIicgKyB0ZW1wU3R5bGVTdHJpbmcgKyAnXCI+JyArIHRleHQgKyAnPC9wPicpO1xufTtcblxuLyogQ3JlYXRlIGEgPGltZz4gRE9NIGVsZW1lbnRcbioqIEBwYXJhbTpcbioqICAgIHNyYyAtIHRoZSBzb3VyY2UgcGF0aCBvZiB0aGUgaW1hZ2VcbioqICAgIGFsdCAtIHRoZSBhbHRlcm5hdGl2ZSB0ZXh0XG4qKiAgICBzdHlsZSAtIHRoZSBjc3Mgc3R5bGUgYXBwbGllZCB0byB0aGlzIGVsZW1lbnQsIGRhZmF1bHQgdG8gdW5kZWZpbmVkXG4qKiBAcmV0dXJuOiB0aGUgcmVmZXJlbmNlIG9mIHRoaXMgZWxlbWVudFxuKi9cbmNvbnN0IGNyZWF0ZUh0bWxJbWcgPSAoc3JjLCBhbHQsIHN0eWxlID0gdW5kZWZpbmVkKSA9PiB7XG4gIHZhciB0ZW1wSW1nO1xuICBpZihzdHlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGVtcEltZyA9ICQoJzxpbWcgYWx0PVwiJyArIGFsdCArICdcIiBzcmM9XCInICsgc3JjICsgJ1wiIC8+Jyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRlbXBTdHlsZVN0cmluZyA9IGdlbmVyYXRlU3R5bGVTdHJpbmcoc3R5bGUpO1xuICAgIHRlbXBJbWcgPSAkKCc8aW1nIGFsdD1cIicgKyBhbHQgKyAnXCIgc3JjPVwiJyArIHNyYyArICdcIiBzdHlsZT1cIicgKyB0ZW1wU3R5bGVTdHJpbmcgKyAnXCIgLz4nKTtcbiAgfVxuICByZXR1cm4gdGVtcEltZztcbn07XG5cbi8qIENyZWF0ZSBhIDxidXR0b24+IERPTSBlbGVtZW50XG4qKiBAcGFyYW06XG4qKiAgICB0ZXh0IC0gdGhlIGlubmVyIHRleHQgdG8gd3JpdGUgaW4gaXQgKDxidXR0b24+dGV4dDwvYnV0dG9uPilcbioqICAgIHN0eWxlIC0gdGhlIGNzcyBzdHlsZSBhcHBsaWVkIHRvIHRoaXMgZWxlbWVudCwgZGFmYXVsdCB0byB1bmRlZmluZWRcbioqICAgIGRhdGFzZXQgLSBuZWNlc3NhcnkgaW5mb1xuKiogICAgICB0ZWFtIC0gZGF0YS10ZWFtIG1hcmsgaW4gdGhlIHRhZyB0byBzdG9yZSB0aGUgdGVhbSBuYW1lIGZvciB2b3RpbmcgcHVycG9zZVxuKiogICAgICB1dWlkIC0gZGF0YS11dWlkIG1hcmsgaW4gdGhlIHRhZyB0byBzdG9yZSB0aGUgdXVpZCBvZiB0aGlzIGdhbWUgZm9yIHZvdGluZyBwdXJwb3NlXG4qKiAgICAgIGV4cGlyZWQgLSBpZiB0aGUgZ2FtZSBoYXMgZW5kZWQsIHRoZSB2YWx1ZSBpcyB0cnVlXG4qKiBAcmV0dXJuOiB0aGUgcmVmZXJlbmNlIG9mIHRoaXMgZWxlbWVudFxuKi9cbmNvbnN0IGNyZWF0ZUh0bWxCdXR0b24gPSAodGV4dCwgc3R5bGUgPSB1bmRlZmluZWQsIGRhdGFzZXQgPSB1bmRlZmluZWQpID0+IHtcbiAgdmFyIHRlbXBCdXR0b247XG4gIGlmKGRhdGFzZXQuZXhwaXJlZCkge1xuICAgIHRleHQgPSAn5bey57uT5p2fJztcbiAgfVxuXG4gIGlmKHN0eWxlID09PSB1bmRlZmluZWQpIHtcbiAgICB0ZW1wQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLXRlYW09XCInICsgZGF0YXNldC50ZWFtICsgJ1wiIGRhdGEtdXVpZD1cIicgKyBkYXRhc2V0LnV1aWQgKyAnXCI+JyArIHRleHQgKyAnPC9idXR0b24+Jyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRlbXBTdHlsZVN0cmluZyA9IGdlbmVyYXRlU3R5bGVTdHJpbmcoc3R5bGUpO1xuICAgIHRlbXBCdXR0b24gPSAkKCc8YnV0dG9uIGRhdGEtdGVhbT1cIicgKyBkYXRhc2V0LnRlYW0gKyAnXCIgZGF0YS11dWlkPVwiJyArIGRhdGFzZXQudXVpZCArICdcIiBzdHlsZT1cIicgKyB0ZW1wU3R5bGVTdHJpbmcgKyAnXCI+JyArIHRleHQgKyAnPC9idXR0b24+Jyk7XG4gIH1cbiAgaWYoZGF0YXNldC5leHBpcmVkKSB7XG4gICAgdGVtcEJ1dHRvbi5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgIHRlbXBCdXR0b24uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJyM5NWE1YTYnKTtcbiAgfVxuICByZXR1cm4gdGVtcEJ1dHRvbjtcbn07XG5cbi8qIENyZWF0ZSBhIDxkaXY+IERPTSBlbGVtZW50XG4qKiBAcGFyYW06XG4qKiAgICBsaXN0T2ZFbGVtZW50cyAtIGFuIGFycmF5IG9mIGVsZW1lbnRzIHRvIGFkZCB0byB0aGlzIGRpdiBpbiBvcmRlclxuKiogICAgc3R5bGUgLSB0aGUgY3NzIHN0eWxlIGFwcGxpZWQgdG8gdGhpcyBlbGVtZW50LCBkYWZhdWx0IHRvIHVuZGVmaW5lZFxuKiogICAgZGl2Q2xhc3NOYW1lIC0gdGhlIGNsYXNzIG5hbWUgb2YgdGhpcyBkaXYgZWxlbWVudFxuKiogQHJldHVybjogdGhlIHJlZmVyZW5jZSBvZiB0aGlzIGVsZW1lbnRcbiovXG5jb25zdCBjcmVhdGVIdG1sRGl2ID0gKGxpc3RPZkVsZW1lbnRzLCBzdHlsZSA9IHVuZGVmaW5lZCwgZGl2Q2xhc3NOYW1lKSA9PiB7XG4gIHZhciB0ZW1wRGl2O1xuICBpZihzdHlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGVtcERpdiA9ICQoJzxkaXYgY2xhc3M9XCInICsgZGl2Q2xhc3NOYW1lICsgJ1wiPicgKyAnPC9kaXY+Jyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRlbXBTdHlsZVN0cmluZyA9IGdlbmVyYXRlU3R5bGVTdHJpbmcoc3R5bGUpO1xuICAgIHRlbXBEaXYgPSAkKCc8ZGl2IGNsYXNzPVwiJyArIGRpdkNsYXNzTmFtZSArICdcIiBzdHlsZT1cIicgKyB0ZW1wU3R5bGVTdHJpbmcgKyAnXCI+JyArICc8L2Rpdj4nKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0T2ZFbGVtZW50c1tpXS5hcHBlbmRUbyh0ZW1wRGl2KTtcbiAgfVxuICByZXR1cm4gdGVtcERpdjtcbn07XG5cbi8qIENyZWF0ZSBhIHRpbWV0YWJsZSBjYXJkIGZvciBvbmUgZ2FtZSwgaXRzZWxmIGlzIGFsc28gYSBkaXZcbioqIEBwYXJhbTpcbioqICAgIGhvc3ROYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGhvc3QgdGVhbVxuKiogICAgaG9zdE5hbWVDTiAtIHRoZSBDaGluZXNlIG5hbWUgb2YgdGhlIGhvc3QgdGVhbVxuKiogICAgaG9zdEZsYWcgLSB0aGUgdXJsIHRvIGdldCB0aGUgZmxhZyBpbWFnZSBvZiBob3N0IHRlYW1cbioqICAgIGhvc3RWb3RlIC0gdGhlIG51bWJlciBvZiB2b3RlcyBvZiBob3N0IHRlYW1cbioqICAgIGd1ZXN0TmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBndWVzdCB0ZWFtXG4qKiAgICBndWVzdE5hbWVDTiAtIHRoZSBDaGluZXNlIG5hbWUgb2YgdGhlIGd1ZXN0IHRlYW1cbioqICAgIGd1ZXN0RmxhZyAtIHRoZSB1cmwgdG8gZ2V0IHRoZSBmbGFnIGltYWdlIG9mIGd1ZXN0IHRlYW1cbioqICAgIGd1ZXN0Vm90ZSAtIHRoZSBudW1iZXIgb2Ygdm90ZXMgb2YgZ3Vlc3QgdGVhbVxuKiogICAgdGltZSAtIHRoZSBzdGFydCB0aW1lIG9mIHRoaXMgZ2FtZVxuKiogICAgdXVpZCAtIHRoZSB1bmlxdWUgaWQgb2YgdGhpcyBnYW1lXG4qKiAgICBleHBpcmVkIC0gaXMgdGhpcyBnYW1lIGVuZGVkIG9yIG5vdCwgdHJ1ZSBpZiBhbHJlYWR5IGVuZGVkLlxuKiogQHJldHVybjogdGhlIHJlZmVyZW5jZSBvZiB0aGlzIGVsZW1lbnRcbiovXG5jb25zdCBjcmVhdGVIdG1sR2FtZUNhcmQgPSAoXG4gIGhvc3ROYW1lLFxuICBob3N0TmFtZUNOLFxuICBob3N0RmxhZyxcbiAgaG9zdFZvdGUsXG4gIGd1ZXN0TmFtZSxcbiAgZ3Vlc3ROYW1lQ04sXG4gIGd1ZXN0RmxhZyxcbiAgZ3Vlc3RWb3RlLFxuICB0aW1lLFxuICB1dWlkLFxuICBleHBpcmVkXG4pID0+IHtcbiAgY29uc3QgaG9zdFRpdGxlRWxlbWVudCA9IGNyZWF0ZUh0bWxQKGhvc3ROYW1lQ04sIHN0eWxlcy5nYW1lQ2FyZC50ZWFtTmFtZSk7XG4gIGNvbnN0IGhvc3RGbGFnRWxlbWVudCA9IGNyZWF0ZUh0bWxJbWcoaG9zdEZsYWcsICdob3N0RkxhZycsIHN0eWxlcy5nYW1lQ2FyZC50ZWFtRmxhZyk7XG4gIGNvbnN0IGhvc3RWb3RlTnVtYmVyID0gY3JlYXRlSHRtbFAoaG9zdFZvdGUsIHN0eWxlcy5nYW1lQ2FyZC52b3RlLm51bWJlcik7XG4gIGNvbnN0IGhvc3RWb3RlTnVtYmVyRWxlbWVudCA9IGNyZWF0ZUh0bWxEaXYoW2hvc3RWb3RlTnVtYmVyXSwgc3R5bGVzLmdhbWVDYXJkLnZvdGUuYm94LCAncGFnZTAtZ2FtZWNhcmQtdm90ZU51bWJlcicpO1xuICBjb25zdCBob3N0Vm90ZUJ1dHRvbkVsZW1lbnQgPSBjcmVhdGVIdG1sQnV0dG9uKCfog5wnLCBzdHlsZXMuZ2FtZUNhcmQuYnV0dG9uLnRlYW0sIHtcbiAgICB0ZWFtOiBob3N0TmFtZSxcbiAgICB1dWlkOiB1dWlkLFxuICAgIGV4cGlyZWQ6IGV4cGlyZWQsXG4gIH0pO1xuXG4gIGNvbnN0IGd1ZXN0VGl0bGVFbGVtZW50ID0gY3JlYXRlSHRtbFAoZ3Vlc3ROYW1lQ04sIHN0eWxlcy5nYW1lQ2FyZC50ZWFtTmFtZSk7XG4gIGNvbnN0IGd1ZXN0RmxhZ0VsZW1lbnQgPSBjcmVhdGVIdG1sSW1nKGd1ZXN0RmxhZywgJ2d1ZXN0RkxhZycsIHN0eWxlcy5nYW1lQ2FyZC50ZWFtRmxhZyk7XG4gIGNvbnN0IGd1ZXN0Vm90ZU51bWJlciA9IGNyZWF0ZUh0bWxQKGd1ZXN0Vm90ZSwgc3R5bGVzLmdhbWVDYXJkLnZvdGUubnVtYmVyKTtcbiAgY29uc3QgZ3Vlc3RWb3RlTnVtYmVyRWxlbWVudCA9IGNyZWF0ZUh0bWxEaXYoW2d1ZXN0Vm90ZU51bWJlcl0sIHN0eWxlcy5nYW1lQ2FyZC52b3RlLmJveCwgJ3BhZ2UwLWdhbWVjYXJkLXZvdGVOdW1iZXInKTtcbiAgY29uc3QgZ3Vlc3RWb3RlQnV0dG9uRWxlbWVudCA9IGNyZWF0ZUh0bWxCdXR0b24oJ+iDnCcsIHN0eWxlcy5nYW1lQ2FyZC5idXR0b24udGVhbSwge1xuICAgIHRlYW06IGd1ZXN0TmFtZSxcbiAgICB1dWlkOiB1dWlkLFxuICAgIGV4cGlyZWQ6IGV4cGlyZWQsXG4gIH0pO1xuXG4gIGNvbnN0IHBpbmdWb3RlQnV0dG9uRWxlbWVudCA9IGNyZWF0ZUh0bWxCdXR0b24oJ+W5sycsIHN0eWxlcy5nYW1lQ2FyZC5idXR0b24ucGluZywge1xuICAgIHRlYW06ICdwaW5nJyxcbiAgICB1dWlkOiB1dWlkLFxuICAgIGV4cGlyZWQ6IGV4cGlyZWQsXG4gIH0pO1xuXG4gIGNvbnN0IGxlZnREaXYgPSBjcmVhdGVIdG1sRGl2KFtcbiAgICBob3N0VGl0bGVFbGVtZW50LFxuICAgIGhvc3RGbGFnRWxlbWVudCxcbiAgICBob3N0Vm90ZU51bWJlckVsZW1lbnQsXG4gICAgaG9zdFZvdGVCdXR0b25FbGVtZW50LFxuICBdLCBzdHlsZXMuZ2FtZUNhcmQudGVhbSwgJ3BhZ2UwLWdhbWVjYXJkLXRlYW0nKTtcblxuICBjb25zdCBtaWREaXYgPSBjcmVhdGVIdG1sRGl2KFtcbiAgICBjcmVhdGVIdG1sUCgndnMnLCBzdHlsZXMuZ2FtZUNhcmQudnMpLFxuICAgIGNyZWF0ZUh0bWxQKHRpbWUsIHN0eWxlcy5nYW1lQ2FyZC50aW1lKSxcbiAgICBwaW5nVm90ZUJ1dHRvbkVsZW1lbnQsXG4gIF0sIHN0eWxlcy5nYW1lQ2FyZC5taWRJbmZvLCAncGFnZTAtZ2FtZWNhcmQtbWlkJyk7XG5cbiAgY29uc3QgcmlnaHREaXYgPSBjcmVhdGVIdG1sRGl2KFtcbiAgICBndWVzdFRpdGxlRWxlbWVudCxcbiAgICBndWVzdEZsYWdFbGVtZW50LFxuICAgIGd1ZXN0Vm90ZU51bWJlckVsZW1lbnQsXG4gICAgZ3Vlc3RWb3RlQnV0dG9uRWxlbWVudCxcbiAgXSwgc3R5bGVzLmdhbWVDYXJkLnRlYW0sICdwYWdlMC1nYW1lY2FyZC10ZWFtJyk7XG5cbiAgY29uc3QgY2FyZERpdiA9IGNyZWF0ZUh0bWxEaXYoW1xuICAgIGxlZnREaXYsXG4gICAgbWlkRGl2LFxuICAgIHJpZ2h0RGl2LFxuICBdLCBzdHlsZXMuZ2FtZVRpbWVUYWJsZSwgJ3BhZ2UwLXRpbWV0YWJsZS1nYW1lJyk7XG5cbiAgcmV0dXJuIGNhcmREaXY7XG59O1xuXG4vKiBBZGQgdGhlIGlucHV0IGNhcmRzIHRvIHRoZSB0aW1ldGFibGVcbioqIEBwYXJhbTpcbioqICAgIGNhcmRzT25PbmVEYXkgLSBhbiBhcnJheSBvZiBnYW1lIGNhcmRzXG4qL1xuY29uc3QgYWRkR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwgPSAoY2FyZHNPbk9uZURheSkgPT4ge1xuICBmb3IobGV0IGkgaW4gY2FyZHNPbk9uZURheSkge1xuICAgIGNhcmRzT25PbmVEYXlbaV0uYWRkQ2xhc3MoJ2FuaW1hdGVkIGZsaXBJblgnKTtcbiAgICAkKCcucGFnZTAtdGltZXRhYmxlJykuYXBwZW5kKGNhcmRzT25PbmVEYXlbaV0pO1xuICB9XG5cbiAgLy8gRXZlbnQgbGlzdGVuZXIgZm9yIHZvdGUgYnV0dG9uXG4gICQoJy5wYWdlMC10aW1ldGFibGUtZ2FtZSBidXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdm90ZVRlYW0gPSB0aGlzLmRhdGFzZXQudGVhbTtcbiAgICB1dWlkID0gdGhpcy5kYXRhc2V0LnV1aWQ7XG4gICAgJCgnI3dyb25nTXNnJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gIH0pO1xufTtcblxuLyogUmVtb3ZlIHRoZSBpbnB1dCBjYXJkcyB0byB0aGUgdGltZXRhYmxlXG4qKiBAcGFyYW06XG4qKiAgICBjYXJkc09uT25lRGF5IC0gYW4gYXJyYXkgb2YgZ2FtZSBjYXJkc1xuKi9cbmNvbnN0IHJlbW92ZUdhbWVDYXJkc09uT25lRGF5SW5IdG1sID0gKGNhcmRzT25PbmVEYXkpID0+IHtcbiAgZm9yKGxldCBpIGluIGNhcmRzT25PbmVEYXkpIHtcbiAgICBjYXJkc09uT25lRGF5W2ldLnJlbW92ZUNsYXNzKCdmbGlwSW5YJyk7XG4gICAgY2FyZHNPbk9uZURheVtpXS5yZW1vdmUoKTtcbiAgfVxufTtcblxuLyogTG9hZCBhbGwgbmVlZGVkIGZpbGVzXG4qKiBAcGFyYW1cbiovXG5jb25zdCBwcmVsb2FkRmlsZXMgPSAoKSA9PiB7XG4gIHZhciBjc3NfdWVmYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgY3NzX3VlZmEudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgY3NzX3VlZmEucmVsICA9IFwic3R5bGVzaGVldFwiO1xuICBjc3NfdWVmYS5ocmVmID0gXCIvY3NzL3VlZmEuY3NzXCI7XG5cbiAgdmFyIGNzc19hbmltYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBjc3NfYW5pbWF0ZS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICBjc3NfYW5pbWF0ZS5yZWwgID0gXCJzdHlsZXNoZWV0XCI7XG4gIGNzc19hbmltYXRlLmhyZWYgPSBcIi9jc3MvYW5pbWF0ZS5taW4uY3NzXCI7XG5cbiAgdmFyIGpzX2Jvb3RzdHJhcCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICBqc19ib290c3RyYXAudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gIGpzX2Jvb3RzdHJhcC5zcmMgID0gXCIvanMvYm9vdHN0cmFwLm1pbi5qc1wiO1xuXG4gICQoJ2hlYWQnKS5maXJzdCgpLmFwcGVuZChjc3NfYW5pbWF0ZSk7XG4gICQoJ2hlYWQnKS5maXJzdCgpLmFwcGVuZChjc3NfdWVmYSk7XG4gICQoJ2h0bWwnKS5maXJzdCgpLmFwcGVuZChqc19ib290c3RyYXApO1xuXG4gICQoJyNmb290YmFsbCcpLmFwcGVuZChjcmVhdGVIdG1sSW1nKCcvL29vby4wbzAub29vLzIwMTYvMDYvMTUvNTc2MjJkZjA3NDRlMy5wbmcnLCAnZm9vdGJhbGwnKSk7XG4gICQoJyNsb2dvJykuYXBwZW5kKGNyZWF0ZUh0bWxJbWcoJy8vb29vLjBvMC5vb28vMjAxNi8wNi8xNS81NzYyMjg4NGU3M2JiLnBuZycsICdsb2dvJykpO1xufTtcblxuLyogQWpheCBnZXQgYWN0aW9uJ3Mgc3VjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uXG4qKiBAcGFyYW06XG4qKiAgICBkYXRhIC0gdGhlIGRhdGEgcmV0dXJuZWQgYnkgdGhlIGFqYXggcmVxdWVzdFxuKi9cbmNvbnN0IGdldEluZm8gPSAoZGF0YSkgPT4ge1xuICBwcmVsb2FkRmlsZXMoKTtcbiAgY2hhbmdlUHJvZ3Jlc3NCYXJWYWx1ZSg3MCk7XG5cbiAgJCgnI2RhdGVfMScpLnRleHQoZGF0ZVN0cmluZ18xLnN1YnN0cmluZyg1KSk7XG4gICQoJyNkYXRlXzInKS50ZXh0KGRhdGVTdHJpbmdfMi5zdWJzdHJpbmcoNSkpO1xuICAkKCcjZGF0ZV8zJykudGV4dChkYXRlU3RyaW5nXzMuc3Vic3RyaW5nKDUpKTtcbiAgJCgnI2RhdGVfNCcpLnRleHQoZGF0ZVN0cmluZ180LnN1YnN0cmluZyg1KSk7XG4gICQoJyNkYXRlXzUnKS50ZXh0KGRhdGVTdHJpbmdfNS5zdWJzdHJpbmcoNSkpO1xuXG4gIGlmKGRhdGEuZGF0YS5yYWNlcy5sZW5ndGggPiAwKSB7XG4gICAgJCgnI21vZGFsLWNsb3NlJykuYXR0cignaHJlZicsIGRhdGEuZGF0YS5yYWNlc1swXS5yZWdpc3Rlcl91cmwpO1xuICB9XG4gICQoJ3RpdGxlJykuZmlyc3QoKS50ZXh0KGRhdGEuZGF0YS50aXRsZSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEucmFjZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcmFjZSA9IGRhdGEuZGF0YS5yYWNlc1tpXTtcbiAgICB2YXIgZXhwaXJlZCA9IHJhY2UubWV0YS5leHBpcmVkO1xuICAgIHZhciB0ZW1wQ2FyZCA9IGNyZWF0ZUh0bWxHYW1lQ2FyZChcbiAgICAgIHJhY2UuaG9zdC5uYW1lLFxuICAgICAgcmFjZS5ob3N0Lm5hbWVDTixcbiAgICAgIHJhY2UuaG9zdC5mbGFnLFxuICAgICAgcmFjZS5ob3N0LnZvdGUsXG4gICAgICByYWNlLmd1ZXN0Lm5hbWUsXG4gICAgICByYWNlLmd1ZXN0Lm5hbWVDTixcbiAgICAgIHJhY2UuZ3Vlc3QuZmxhZyxcbiAgICAgIHJhY2UuZ3Vlc3Qudm90ZSxcbiAgICAgIHJhY2UubWV0YS5zdGFydEF0LnNwbGl0KCcgJylbMV0uc3Vic3RyaW5nKDAsIDUpLFxuICAgICAgcmFjZS51dWlkLFxuICAgICAgZXhwaXJlZFxuICAgICk7XG4gICAgc3dpdGNoIChkYXRhLmRhdGEucmFjZXNbaV0ubWV0YS5zdGFydEF0LnNwbGl0KCcgJylbMF0pIHtcbiAgICAgIGNhc2UgZGF0ZVN0cmluZ18xOlxuICAgICAgICBjYXJkcy5kYXRlXzEucHVzaCh0ZW1wQ2FyZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkYXRlU3RyaW5nXzI6XG4gICAgICAgIGNhcmRzLmRhdGVfMi5wdXNoKHRlbXBDYXJkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRhdGVTdHJpbmdfMzpcbiAgICAgICAgY2FyZHMuZGF0ZV8zLnB1c2godGVtcENhcmQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZGF0ZVN0cmluZ180OlxuICAgICAgICBjYXJkcy5kYXRlXzQucHVzaCh0ZW1wQ2FyZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkYXRlU3RyaW5nXzU6XG4gICAgICAgIGNhcmRzLmRhdGVfNS5wdXNoKHRlbXBDYXJkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmb3IodmFyIGkgaW4gY2FyZHMpIHtcbiAgICBpZihjYXJkc1tpXS5sZW5ndGggPT0gMCkge1xuICAgICAgY2FyZHNbaV0ucHVzaChjcmVhdGVIdG1sUCgn5peg6LWb5LqLJywge1xuICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICdjb2xvcic6ICcjZmZmJyxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6ICcycmVtJyxcbiAgICAgICAgJ3RleHQtYWxpZ24nOiAnY2VudGVyJ1xuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuICBhZGRHYW1lQ2FyZHNPbk9uZURheUluSHRtbChjYXJkcy5kYXRlXzMpO1xuICBjaGFuZ2VQcm9ncmVzc0JhclZhbHVlKDEwMCk7XG5cbiAgLy8gQWZ0ZXIgbG9hZGluZyBmaW5pc2hlZCwgc2hvdyBtYWluIGNvbnRlbnQgYWZ0ZXIgMSBzZWNvbmRcbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxvYWRFbmQoKTtcbiAgfSwgMTAwMCk7XG59O1xuXG4vKiBBamF4IHBvc3QgYWN0aW9uJ3Mgc3VjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uXG4qKiBAcGFyYW06XG4qKiAgICBkYXRhIC0gdGhlIGRhdGEgcmV0dXJuZWQgYnkgdGhlIGFqYXggcmVxdWVzdFxuKi9cbmNvbnN0IHBvc3RQaG9uZU51bWJlciA9IChkYXRhKSA9PiB7XG4gIGlmKGRhdGEuZXJyY29kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgJCgnI3dyb25nTXNnJykudGV4dCgn5Y+C5LiO5oiQ5Yqf77yBJyk7XG4gICAgJCgnI3dyb25nTXNnJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAvLyB2b3RlIHN1Y2Nlc3MsIGNsb3NlIHRoZSBtb2RhbCB3aW5kb3cgYXV0b21hdGljYWxseSBhZnRlciAyIHNlY29uZHNcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICQoJyN3cm9uZ01zZycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgfSwgMjAwMCk7XG5cbiAgICAvLyBzdHlsZSBhbmQgZGlzYWJsZSB0aGUgYnV0dG9ucyBvZiB0aGUgdm90ZWQgZ2FtZSBjYXJkXG4gICAgJCgnLnBhZ2UwLXRpbWV0YWJsZS1nYW1lIGJ1dHRvbicpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgaWYodGhpcy5kYXRhc2V0LnV1aWQgPT09IHV1aWQpIHtcbiAgICAgICAgJCh0aGlzKS5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICBpZih2b3RlVGVhbSA9PT0gdGhpcy5kYXRhc2V0LnRlYW0pIHtcbiAgICAgICAgICBpZih2b3RlVGVhbSAhPT0gJ3BpbmcnKSB7XG4gICAgICAgICAgICB2YXIgdGVtcFZvdGVOdW1iZXIgPSAkKHRoaXMpLnByZXYoKS5maW5kKCdwJykudGV4dCgpO1xuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgncCcpLnRleHQoKE51bWJlcih0ZW1wVm90ZU51bWJlcikgKyAxKS50b1N0cmluZygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnI2U3NGMzYycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJyM5NWE1YTYnKTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMpLnRleHQoJ+W3suaKleelqCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBlcnJvck1zZztcbiAgICBzd2l0Y2ggKGRhdGEuZXJyY29kZSkge1xuICAgICAgY2FzZSA0MDA3MTc6XG4gICAgICAgIGVycm9yTXNnID0gXCLmipXnpajlt7LmiKrmraLvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQwMDcxODpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuWPkeeUn+mUmeivr++8jOivt+mHjeaWsOi+k+WFpe+8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDAwNzE5OlxuICAgICAgICBlcnJvck1zZyA9IFwi5omL5py65Y+356CB6ZSZ6K+v77yBXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDA3MjA6XG4gICAgICAgIGVycm9yTXNnID0gXCLlj5HnlJ/plJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQwMDcyMTpcbiAgICAgICAgZXJyb3JNc2cgPSBcIuatpOaJi+acuuWPt+W3suaKlei/h+elqOS6huWTpu+8gVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGVycm9yTXNnID0gXCLlj5HnlJ/mnKrnn6XplJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgICQoJyN3cm9uZ01zZycpLnRleHQoZXJyb3JNc2cpO1xuICAgICQoJyN3cm9uZ01zZycpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICB9XG59O1xuY29uc3QgaGFuZGxlQWpheEZhaWwgPSAoZXJyb3JUaHJvd24pID0+IHtcbiAgLy8gVE9ETzpcbn07XG5cbi8qIEhpZGUgcHJvZ3Jlc3MtYmFyIGFuZCBzaG93IHRoZSBtYWluIGNvbnRlbnQgd2hlbiBsb2FkaW5nIGhhcyBmaW5pc2hlZFxuKiogQHBhcmFtXG4qL1xuY29uc3QgbG9hZEVuZCA9ICgpID0+IHtcbiAgJCgnI3ByZWxvYWQtcGFnZScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5jb250YWluZXItd3JhcHBlcicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xufTtcblxuLyogQ2hhbmdlIHRoZSB2YWx1ZSBvZiB0aGUgcHJvZ3Jlc3MtYmFyXG4qKiBAcGFyYW06XG4qKiAgICB2YWx1ZSAtIHRoZSB2YWx1ZSBvZiB0aGUgcHJvZ3Jlc3MtYmFyIHRvIGFjaGlldmVcbiovXG5jb25zdCBjaGFuZ2VQcm9ncmVzc0JhclZhbHVlID0gKHZhbHVlKSA9PiB7XG4gIHZhciB0ZW1wVmFsID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgJCgnLnByb2dyZXNzLWJhcicpLmF0dHIoJ2FyaWEtdmFsdWVub3cnLCB0ZW1wVmFsKTtcbiAgJCgnLnByb2dyZXNzLWJhcicpLmNzcygnd2lkdGgnLCB0ZW1wVmFsICsgJyUnKTtcbn07XG5cblxuLyogICoqKioqKioqKioqKioqKioqKlxuKiogIE1haW4gcHJvZ3JhbSBiZWdpblxuKiogICoqKioqKioqKioqKioqKioqKlxuKi9cbiQoZnVuY3Rpb24oKSB7XG4gIC8vIGFqYXhHZXQocmVxVXJsLCBnZXRJbmZvLCBoYW5kbGVBamF4RmFpbCk7XG4gIGFqYXhHZXQocHJlZml4ICsgcGF0aCwgZ2V0SW5mbywgaGFuZGxlQWpheEZhaWwpO1xuXG4gIHN3aXRjaCAoZGF5KSB7XG4gICAgY2FzZSAyOTpcbiAgICAgIGRhdGVTdHJpbmdfMSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0yKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzMgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIGRheS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ180ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzEpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzUgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMikudG9TdHJpbmcoKSArICctJyArICcxJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzA6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMikudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMiA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0xKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsyKS50b1N0cmluZygpICsgJy0nICsgJzEnO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzIpLnRvU3RyaW5nKCkgKyAnLScgKyAnMic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBkYXRlU3RyaW5nXzEgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCkgKyAnLScgKyAnMjknO1xuICAgICAgZGF0ZVN0cmluZ18yID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKS50b1N0cmluZygpICsgJy0nICsgJzMwJztcbiAgICAgIGRhdGVTdHJpbmdfMyA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgZGF5LnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzQgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsyKS50b1N0cmluZygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgZGF0ZVN0cmluZ18xID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKS50b1N0cmluZygpICsgJy0nICsgJzMwJztcbiAgICAgIGRhdGVTdHJpbmdfMiA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheS0xKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ18zID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNCA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsxKS50b1N0cmluZygpO1xuICAgICAgZGF0ZVN0cmluZ181ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5KzIpLnRvU3RyaW5nKCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgZGF0ZVN0cmluZ18xID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF5LTIpLnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXktMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfMyA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgZGF5LnRvU3RyaW5nKCk7XG4gICAgICBkYXRlU3RyaW5nXzQgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlLmdldE1vbnRoKCkrMSkudG9TdHJpbmcoKSArICctJyArIChkYXkrMSkudG9TdHJpbmcoKTtcbiAgICAgIGRhdGVTdHJpbmdfNSA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgJy0nICsgKGRhdGUuZ2V0TW9udGgoKSsxKS50b1N0cmluZygpICsgJy0nICsgKGRheSsyKS50b1N0cmluZygpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBFdmVudCBsaXN0ZW5lciBmb3IgdGhlIHRvcCBuYXZpZ2F0aW9uIGJhciB0byBzd2l0Y2ggZGF0ZVxuICAkKCcucGFnZTAtZGF0ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAkKCcucGFnZTAtZGF0ZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUtZGF0ZScpKSB7XG4gICAgICAgIHJlbW92ZUdhbWVDYXJkc09uT25lRGF5SW5IdG1sKGNhcmRzWyQodGhpcykuYXR0cignaWQnKV0pO1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGF0ZScpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZS1kYXRlJyk7XG4gICAgYWRkR2FtZUNhcmRzT25PbmVEYXlJbkh0bWwoY2FyZHNbJCh0aGlzKS5hdHRyKCdpZCcpXSk7XG4gIH0pO1xuXG4gIC8vIEV2ZW50IGxpc3RlbmVyIGZvciB0aGUgdm90ZSBtb2RhbCB3aW5kb3dcbiAgLy8gVXNlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byB0ZXN0IHRoZSBwaG9uZSBudW1iZXIgYmVmb3JlIG1ha2luZyBhamF4IHJlcXVlc3RcbiAgJCgnI2pvaW4nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIHBob25lTnVtYmVyID0gJCgnI3VzZXJQaG9uZUlucHV0JykudmFsKCk7XG4gICAgdmFyIHBob25lTnVtYmVyUmVnRXhwID0gbmV3IFJlZ0V4cCgnKF4oMTNcXFxcZHwxNVteNCxcXFxcRF18MTdbMTM2NzhdfDE4XFxcXGQpXFxcXGR7OH18MTcwW14zNDYsXFxcXERdXFxcXGR7N30pJCcsICdnJyk7XG4gICAgaWYoIXBob25lTnVtYmVyUmVnRXhwLnRlc3QocGhvbmVOdW1iZXIpKSB7XG4gICAgICAkKCcjd3JvbmdNc2cnKS50ZXh0KCfmiYvmnLrlj7fmnInor6/vvIzor7fph43or5XvvIEnKTtcbiAgICAgICQoJyN3cm9uZ01zZycpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhamF4UG9zdChcbiAgICAgICAgcHJlZml4ICsgcGF0aCArIHV1aWQgKyAnLycsXG4gICAgICAgICdwaG9uZT0nICsgcGhvbmVOdW1iZXIgKyAnJnRlYW09JyArIHZvdGVUZWFtLFxuICAgICAgICBwb3N0UGhvbmVOdW1iZXIsXG4gICAgICAgIGhhbmRsZUFqYXhGYWlsXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG59KTtcblxuXG52YXIgc3R5bGVzID0ge1xuICBnYW1lVGltZVRhYmxlOiB7XG4gICAgJ3dpZHRoJzogJzkwJScsXG4gICAgJ2hlaWdodCc6ICdhdXRvJyxcbiAgICAnbWFyZ2luJzogJ2F1dG8nLFxuICAgICdtYXJnaW4tdG9wJzogJzFyZW0nLFxuICAgICdwYWRkaW5nJzogJy41cmVtIC42cmVtJyxcbiAgICAnZGlzcGxheSc6ICdmbGV4JyxcbiAgICAnanVzdGlmeS1jb250ZW50JzogJ3NwYWNlLWFyb3VuZCcsXG4gICAgJ2FsaWduLWl0ZW1zJzogJ2NlbnRlcicsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2VmZWZlZicsXG4gICAgJ2JvcmRlci1yYWRpdXMnOiAnM3B4JyxcbiAgICAnYm94LXNoYWRvdyc6ICcwcHggMnB4IDRweCByZ2JhKDAsMCwwLC4yNSknLFxuICB9LFxuICBnYW1lQ2FyZDoge1xuICAgIHRlYW06IHtcbiAgICAgICd3aWR0aCc6ICczMCUnLFxuICAgICAgJ2hlaWdodCc6ICdhdXRvJyxcbiAgICAgICdkaXNwbGF5JzogJ2ZsZXgnLFxuICAgICAgJ2ZsZXgtZGlyZWN0aW9uJzogJ2NvbHVtbicsXG4gICAgICAnYWxpZ24taXRlbXMnOiAnY2VudGVyJyxcbiAgICAgICdjb2xvcic6ICcjMjdhZTYwJyxcbiAgICAgICd0ZXh0LWFsaWduJzogJ2NlbnRlcicsXG4gICAgfSxcbiAgICB0ZWFtTmFtZToge1xuICAgICAgJ2ZvbnQtc2l6ZSc6ICcuOHJlbScsXG4gICAgfSxcbiAgICB0ZWFtRmxhZzoge1xuICAgICAgJ3dpZHRoJzogJzg1JScsXG4gICAgfSxcbiAgICB2b3RlOiB7XG4gICAgICBib3g6IHtcbiAgICAgICAgJ3dpZHRoJzogJzg1JScsXG4gICAgICAgICdoZWlnaHQnOiAnYXV0bycsXG4gICAgICAgICdwYWRkaW5nJzogJy4xcmVtIDAnLFxuICAgICAgICAnbWFyZ2luLXRvcCc6ICcuNXJlbScsXG4gICAgICAgICdib3JkZXInOiAnMnB4IHNvbGlkICNlNzRjM2MnLFxuICAgICAgICAnYm9yZGVyLXJhZGl1cyc6ICczcHgnLFxuICAgICAgICAnY29sb3InOiAnI2U3NGMzYycsXG4gICAgICAgICdmb250LXNpemUnOiAnLjdyZW0nLFxuICAgICAgfSxcbiAgICAgIG51bWJlcjoge1xuICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICdtYXJnaW4nOiAnMCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbWlkSW5mbzoge1xuICAgICAgJ3dpZHRoJzogJzMwJScsXG4gICAgICAnZGlzcGxheSc6ICdmbGV4JyxcbiAgICAgICdmbGV4LWRpcmVjdGlvbic6ICdjb2x1bW4nLFxuICAgICAgJ2p1c3RpZnktY29udGVudCc6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICdmb250LXNpemUnOiAnMS4xcmVtJyxcbiAgICAgICdsZXR0ZXItc3BhY2luZyc6ICcuMXJlbScsXG4gICAgICAndGV4dC1hbGlnbic6ICdjZW50ZXInLFxuICAgIH0sXG4gICAgdnM6IHtcbiAgICAgICdtYXJnaW4nOiAnMCcsXG4gICAgfSxcbiAgICB0aW1lOiB7XG4gICAgICAnbWFyZ2luJzogJzAnLFxuICAgICAgJ21hcmdpbi10b3AnOiAnMXJlbScsXG4gICAgICAncGFkZGluZyc6ICcuMXJlbScsXG4gICAgICAnY29sb3InOiAnI2ZmZicsXG4gICAgICAnZm9udC1zaXplJzogJy45cmVtJyxcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyMyZWNjNzEnLFxuICAgICAgJ2JvcmRlci1yYWRpdXMnOiAnM3B4JyxcbiAgICB9LFxuICAgIGJ1dHRvbjoge1xuICAgICAgdGVhbToge1xuICAgICAgICAnd2lkdGgnOiAnODUlJyxcbiAgICAgICAgJ3BhZGRpbmcnOiAnLjJyZW0nLFxuICAgICAgICAnbWFyZ2luLXRvcCc6ICcuNXJlbScsXG4gICAgICAgICdvdXRsaW5lJzogJ25vbmUnLFxuICAgICAgICAnYm9yZGVyJzogJ25vbmUnLFxuICAgICAgICAnYm9yZGVyLXJhZGl1cyc6ICczcHgnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjMzQ5OGRiJyxcbiAgICAgICAgJ2NvbG9yJzogJyNmZmYnLFxuICAgICAgICAnZm9udC1zaXplJzogJy43cmVtJyxcbiAgICAgIH0sXG4gICAgICBwaW5nOiB7XG4gICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgJ3BhZGRpbmcnOiAnLjJyZW0nLFxuICAgICAgICAnbWFyZ2luJzogJ2F1dG8nLFxuICAgICAgICAnbWFyZ2luLXRvcCc6ICcxcmVtJyxcbiAgICAgICAgJ291dGxpbmUnOiAnbm9uZScsXG4gICAgICAgICdib3JkZXInOiAnbm9uZScsXG4gICAgICAgICdib3JkZXItcmFkaXVzJzogJzNweCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyMzNDk4ZGInLFxuICAgICAgICAnY29sb3InOiAnI2ZmZicsXG4gICAgICAgICdmb250LXNpemUnOiAnLjdyZW0nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
