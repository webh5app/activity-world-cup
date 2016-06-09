'use strict';

;(function ($) {
  var prefix = 'http://10.124.18.115:8080/';
  var path = 'api/v1/activity/worldcup/';
  var uuid = '52ab7bc3-b36d-454e-a9e3-79c72891abf6/';
  var ajaxUrl = prefix + path + uuid;
  var registerUrl;
  // console.log(ajaxUrl);
  var hostName, hostFlag;
  var guestName, guestFlag;
  var voteFor;
  var showVoteNumbers = function showVoteNumbers(data) {
    console.log(data);
    registerUrl = data.register_url;
    hostName = data.host.nameCN;
    hostFlag = data.host.flag;
    guestName = data.guest.nameCN;
    guestFlag = data.guest.flag;
    $('#vote-button-1').text('支持' + hostName);
    $('#vote-button-2').text('支持' + guestName);
    $('#vote-number-country-1').text(data.host.vote);
    $('#vote-number-country-2').text(data.guest.vote);

    $('#flag1').attr('src', './images/' + hostFlag + '.png');
    $('#flag2').attr('src', './images/' + guestFlag + '.png');
    $('.content-register-container a').attr('href', registerUrl);
  };

  var doAjax = function doAjax(reqType, url, parameters, callback) {
    if (reqType === 'get') {
      var xhr = $.getJSON(url, parameters);
    } else {
      var xhr = $.post(url, parameters);
    }

    // Promise callbacks
    xhr.done(function (data, textStatus, jqXHR) {
      callback(data);
    }).fail(function (jqXHR, textStatus, err) {
      console.log(err.toString());
    });
  };

  doAjax('get', ajaxUrl, {}, showVoteNumbers);

  $('#vote-button-1').on('click', function (event) {
    event.preventDefault();
    voteFor = hostName;
    $('.container').addClass('transfer1');
  });

  $('#vote-button-2').on('click', function (event) {
    event.preventDefault();
    voteFor = guestName;
    $('.container').addClass('transfer1');
  });

  var confirmPhoneNumber = function confirmPhoneNumber(data) {
    $('#process-container').removeClass('toggled');
    // console.log(data);
    /* 错误参数提示：
    ** 400718 缺少参数 phone=(...)&team(...)
    ** 400719 手机号错误
    ** 400720 队名错误
    ** 400721 投过票了
    */

    if (data.errcode === undefined) {
      $('.container').addClass('transfer2');
    } else {
      var error;
      switch (data.errcode) {
        case 400718:
          error = "发生错误，请重新输入！";
          console.log("Error code: 400718, 缺少参数 phone=(...)&team(...)");
          break;
        case 400719:
          error = "手机号码错误！";
          console.log("Error code: 400719, 手机号码错误！");
          break;
        case 400720:
          error = "发生错误，请重新输入！";
          console.log("Error code: 400720, 队伍名称错误！");
          break;
        case 400721:
          error = "此手机号已投过票了哦！";
          console.log("Error code: 400721, 此手机号已投过票！");
          break;
        default:
          error = "发生未知错误，请重新输入！";
          console.log("Unknown error!");
          break;
      }

      window.setTimeout(function () {
        $('#alert-box-container').removeClass('display-none');
        $('#alert-box-content').text(error);
        $('#alert-box-button').on('click', function (event) {
          event.preventDefault();
          $('#alert-box-container').addClass('display-none');
          $('.page2 form input').val('');
          $('.page2 form input').focus();
        });
      }, 0);
    }
  };

  $('#confirm').on('click', function (event) {
    event.preventDefault();
    var phoneNumber = $('.page2 form input').val();
    var phoneNumberRegExp = new RegExp('(^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7})$', 'g');
    if (phoneNumberRegExp.test(phoneNumber)) {
      var parameters = 'phone=' + phoneNumber + '&team=' + voteFor;
      $('#process-container').addClass('toggled');
      doAjax('post', ajaxUrl, parameters, confirmPhoneNumber);
    } else {
      // 手机号格式错误
      window.setTimeout(function () {
        $('#alert-box-container').removeClass('display-none');
        $('#alert-box-content').text('手机号码有误！');
        $('#alert-box-button').on('click', function (event) {
          event.preventDefault();
          $('#alert-box-container').addClass('display-none');
          $('.page2 form input').val('');
          $('.page2 form input').focus();
        });
      }, 0);
    }
  });
})(Zepto);
//# sourceMappingURL=data:application/json;base64,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QUFrQixJQUFsQixDQUF1QixXQUF2QixDQUFILEVBQXdDO0FBQ3RDLFVBQUksYUFBYSxXQUFXLFdBQVgsR0FBeUIsUUFBekIsR0FBb0MsT0FBckQ7QUFDQSxRQUFFLG9CQUFGLEVBQXdCLFFBQXhCLENBQWlDLFNBQWpDO0FBQ0EsYUFBTyxNQUFQLEVBQWUsT0FBZixFQUF3QixVQUF4QixFQUFvQyxrQkFBcEM7QUFDRCxLQUpELE1BSU87O0FBRUwsYUFBTyxVQUFQLENBQWtCLFlBQU07QUFDdEIsVUFBRSxzQkFBRixFQUEwQixXQUExQixDQUFzQyxjQUF0QztBQUNBLFVBQUUsb0JBQUYsRUFBd0IsSUFBeEIsQ0FBNkIsU0FBN0I7QUFDQSxVQUFFLG1CQUFGLEVBQXVCLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DLFVBQUMsS0FBRCxFQUFXO0FBQzVDLGdCQUFNLGNBQU47QUFDQSxZQUFFLHNCQUFGLEVBQTBCLFFBQTFCLENBQW1DLGNBQW5DO0FBQ0EsWUFBRSxtQkFBRixFQUF1QixHQUF2QixDQUEyQixFQUEzQjtBQUNBLFlBQUUsbUJBQUYsRUFBdUIsS0FBdkI7QUFDRCxTQUxEO0FBTUQsT0FURCxFQVNHLENBVEg7QUFVRDtBQUNILEdBckJEO0FBd0JELENBcElBLEVBb0lFLEtBcElGIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbigkKXtcbiAgdmFyIHByZWZpeCA9ICdodHRwOi8vMTAuMTI0LjE4LjExNTo4MDgwLyc7XG4gIHZhciBwYXRoID0gJ2FwaS92MS9hY3Rpdml0eS93b3JsZGN1cC8nXG4gIHZhciB1dWlkID0gJzUyYWI3YmMzLWIzNmQtNDU0ZS1hOWUzLTc5YzcyODkxYWJmNi8nO1xuICB2YXIgYWpheFVybCA9IHByZWZpeCArIHBhdGggKyB1dWlkO1xuICB2YXIgcmVnaXN0ZXJVcmw7XG4gIC8vIGNvbnNvbGUubG9nKGFqYXhVcmwpO1xuICB2YXIgaG9zdE5hbWUsIGhvc3RGbGFnO1xuICB2YXIgZ3Vlc3ROYW1lLCBndWVzdEZsYWc7XG4gIHZhciB2b3RlRm9yO1xuICB2YXIgc2hvd1ZvdGVOdW1iZXJzID0gKGRhdGEpID0+IHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICByZWdpc3RlclVybCA9IGRhdGEucmVnaXN0ZXJfdXJsO1xuICAgIGhvc3ROYW1lID0gZGF0YS5ob3N0Lm5hbWVDTjtcbiAgICBob3N0RmxhZyA9IGRhdGEuaG9zdC5mbGFnO1xuICAgIGd1ZXN0TmFtZSA9IGRhdGEuZ3Vlc3QubmFtZUNOO1xuICAgIGd1ZXN0RmxhZyA9IGRhdGEuZ3Vlc3QuZmxhZztcbiAgICAkKCcjdm90ZS1idXR0b24tMScpLnRleHQoJ+aUr+aMgScgKyBob3N0TmFtZSk7XG4gICAgJCgnI3ZvdGUtYnV0dG9uLTInKS50ZXh0KCfmlK/mjIEnICsgZ3Vlc3ROYW1lKTtcbiAgICAkKCcjdm90ZS1udW1iZXItY291bnRyeS0xJykudGV4dChkYXRhLmhvc3Qudm90ZSk7XG4gICAgJCgnI3ZvdGUtbnVtYmVyLWNvdW50cnktMicpLnRleHQoZGF0YS5ndWVzdC52b3RlKTtcblxuICAgICQoJyNmbGFnMScpLmF0dHIoJ3NyYycsICcuL2ltYWdlcy8nICsgaG9zdEZsYWcgKyAnLnBuZycpO1xuICAgICQoJyNmbGFnMicpLmF0dHIoJ3NyYycsICcuL2ltYWdlcy8nICsgZ3Vlc3RGbGFnICsgJy5wbmcnKTtcbiAgICAkKCcuY29udGVudC1yZWdpc3Rlci1jb250YWluZXIgYScpLmF0dHIoJ2hyZWYnLCByZWdpc3RlclVybCk7XG4gIH07XG5cbiAgdmFyIGRvQWpheCA9IChyZXFUeXBlLCB1cmwsIHBhcmFtZXRlcnMsIGNhbGxiYWNrKSA9PiB7XG4gICAgaWYgKHJlcVR5cGUgPT09ICdnZXQnKSB7XG4gICAgICB2YXIgeGhyID0gJC5nZXRKU09OKHVybCwgcGFyYW1ldGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB4aHIgPSAkLnBvc3QodXJsLCBwYXJhbWV0ZXJzKTtcbiAgICB9XG5cbiAgICAvLyBQcm9taXNlIGNhbGxiYWNrc1xuICAgIHhoci5kb25lKChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4ge1xuICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfSlcbiAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyLnRvU3RyaW5nKCkpO1xuICAgIH0pO1xuICB9O1xuXG4gIGRvQWpheCgnZ2V0JywgYWpheFVybCwge30sIHNob3dWb3RlTnVtYmVycyk7XG5cblxuICAkKCcjdm90ZS1idXR0b24tMScpLm9uKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdm90ZUZvciA9IGhvc3ROYW1lO1xuICAgICQoJy5jb250YWluZXInKS5hZGRDbGFzcygndHJhbnNmZXIxJyk7XG4gIH0pO1xuXG4gICQoJyN2b3RlLWJ1dHRvbi0yJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2b3RlRm9yID0gZ3Vlc3ROYW1lO1xuICAgICQoJy5jb250YWluZXInKS5hZGRDbGFzcygndHJhbnNmZXIxJyk7XG4gIH0pO1xuXG4gIHZhciBjb25maXJtUGhvbmVOdW1iZXIgPSAoZGF0YSkgPT4ge1xuICAgICQoJyNwcm9jZXNzLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCd0b2dnbGVkJyk7XG4gICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgLyog6ZSZ6K+v5Y+C5pWw5o+Q56S677yaXG4gICAgKiogNDAwNzE4IOe8uuWwkeWPguaVsCBwaG9uZT0oLi4uKSZ0ZWFtKC4uLilcbiAgICAqKiA0MDA3MTkg5omL5py65Y+36ZSZ6K+vXG4gICAgKiogNDAwNzIwIOmYn+WQjemUmeivr1xuICAgICoqIDQwMDcyMSDmipXov4fnpajkuoZcbiAgICAqL1xuXG4gICAgaWYoZGF0YS5lcnJjb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICQoJy5jb250YWluZXInKS5hZGRDbGFzcygndHJhbnNmZXIyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlcnJvcjtcbiAgICAgIHN3aXRjaCAoZGF0YS5lcnJjb2RlKSB7XG4gICAgICAgIGNhc2UgNDAwNzE4OlxuICAgICAgICAgIGVycm9yID0gXCLlj5HnlJ/plJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGNvZGU6IDQwMDcxOCwg57y65bCR5Y+C5pWwIHBob25lPSguLi4pJnRlYW0oLi4uKVwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0MDA3MTk6XG4gICAgICAgICAgZXJyb3IgPSBcIuaJi+acuuWPt+eggemUmeivr++8gVwiO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY29kZTogNDAwNzE5LCDmiYvmnLrlj7fnoIHplJnor6/vvIFcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDAwNzIwOlxuICAgICAgICAgIGVycm9yID0gXCLlj5HnlJ/plJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGNvZGU6IDQwMDcyMCwg6Zif5LyN5ZCN56ew6ZSZ6K+v77yBXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwMDcyMTpcbiAgICAgICAgICBlcnJvciA9IFwi5q2k5omL5py65Y+35bey5oqV6L+H56Wo5LqG5ZOm77yBXCI7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBjb2RlOiA0MDA3MjEsIOatpOaJi+acuuWPt+W3suaKlei/h+elqO+8gVwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlcnJvciA9IFwi5Y+R55Sf5pyq55+l6ZSZ6K+v77yM6K+36YeN5paw6L6T5YWl77yBXCI7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIGVycm9yIVwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkKCcjYWxlcnQtYm94LWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdkaXNwbGF5LW5vbmUnKTtcbiAgICAgICAgJCgnI2FsZXJ0LWJveC1jb250ZW50JykudGV4dChlcnJvcik7XG4gICAgICAgICQoJyNhbGVydC1ib3gtYnV0dG9uJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkKCcjYWxlcnQtYm94LWNvbnRhaW5lcicpLmFkZENsYXNzKCdkaXNwbGF5LW5vbmUnKTtcbiAgICAgICAgICAkKCcucGFnZTIgZm9ybSBpbnB1dCcpLnZhbCgnJyk7XG4gICAgICAgICAgJCgnLnBhZ2UyIGZvcm0gaW5wdXQnKS5mb2N1cygpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfTtcblxuICAkKCcjY29uZmlybScpLm9uKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICB2YXIgcGhvbmVOdW1iZXIgPSAkKCcucGFnZTIgZm9ybSBpbnB1dCcpLnZhbCgpO1xuICAgICB2YXIgcGhvbmVOdW1iZXJSZWdFeHAgPSBuZXcgUmVnRXhwKCcoXigxM1xcXFxkfDE1W140LFxcXFxEXXwxN1sxMzY3OF18MThcXFxcZClcXFxcZHs4fXwxNzBbXjM0NixcXFxcRF1cXFxcZHs3fSkkJywgJ2cnKTtcbiAgICAgaWYocGhvbmVOdW1iZXJSZWdFeHAudGVzdChwaG9uZU51bWJlcikpIHtcbiAgICAgICB2YXIgcGFyYW1ldGVycyA9ICdwaG9uZT0nICsgcGhvbmVOdW1iZXIgKyAnJnRlYW09JyArIHZvdGVGb3I7XG4gICAgICAgJCgnI3Byb2Nlc3MtY29udGFpbmVyJykuYWRkQ2xhc3MoJ3RvZ2dsZWQnKTtcbiAgICAgICBkb0FqYXgoJ3Bvc3QnLCBhamF4VXJsLCBwYXJhbWV0ZXJzLCBjb25maXJtUGhvbmVOdW1iZXIpO1xuICAgICB9IGVsc2Uge1xuICAgICAgIC8vIOaJi+acuuWPt+agvOW8j+mUmeivr1xuICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICQoJyNhbGVydC1ib3gtY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2Rpc3BsYXktbm9uZScpO1xuICAgICAgICAgJCgnI2FsZXJ0LWJveC1jb250ZW50JykudGV4dCgn5omL5py65Y+356CB5pyJ6K+v77yBJyk7XG4gICAgICAgICAkKCcjYWxlcnQtYm94LWJ1dHRvbicpLm9uKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAkKCcjYWxlcnQtYm94LWNvbnRhaW5lcicpLmFkZENsYXNzKCdkaXNwbGF5LW5vbmUnKTtcbiAgICAgICAgICAgJCgnLnBhZ2UyIGZvcm0gaW5wdXQnKS52YWwoJycpO1xuICAgICAgICAgICAkKCcucGFnZTIgZm9ybSBpbnB1dCcpLmZvY3VzKCk7XG4gICAgICAgICB9KTtcbiAgICAgICB9LCAwKTtcbiAgICAgfVxuICB9KTtcblxuXG59KShaZXB0byk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
