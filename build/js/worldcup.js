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

    $('#flag1').attr('src', 'http://o82r0gv7d.bkt.clouddn.com/images/' + hostFlag + '.png');
    $('#flag2').attr('src', 'http://o82r0gv7d.bkt.clouddn.com/images/' + guestFlag + '.png');
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
//# sourceMappingURL=data:application/json;base64,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QSxRQUFHLGtCQUFrQixJQUFsQixDQUF1QixXQUF2QixDQUFILEVBQXdDO0FBQ3RDLFVBQUksYUFBYSxXQUFXLFdBQVgsR0FBeUIsUUFBekIsR0FBb0MsT0FBckQ7QUFDQSxRQUFFLG9CQUFGLEVBQXdCLFFBQXhCLENBQWlDLFNBQWpDO0FBQ0EsYUFBTyxNQUFQLEVBQWUsT0FBZixFQUF3QixVQUF4QixFQUFvQyxrQkFBcEM7QUFDRCxLQUpELE1BSU87O0FBRUwsYUFBTyxVQUFQLENBQWtCLFlBQU07QUFDdEIsVUFBRSxzQkFBRixFQUEwQixXQUExQixDQUFzQyxjQUF0QztBQUNBLFVBQUUsb0JBQUYsRUFBd0IsSUFBeEIsQ0FBNkIsU0FBN0I7QUFDQSxVQUFFLG1CQUFGLEVBQXVCLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DLFVBQUMsS0FBRCxFQUFXO0FBQzVDLGdCQUFNLGNBQU47QUFDQSxZQUFFLHNCQUFGLEVBQTBCLFFBQTFCLENBQW1DLGNBQW5DO0FBQ0EsWUFBRSxtQkFBRixFQUF1QixHQUF2QixDQUEyQixFQUEzQjtBQUNBLFlBQUUsbUJBQUYsRUFBdUIsS0FBdkI7QUFDRCxTQUxEO0FBTUQsT0FURCxFQVNHLENBVEg7QUFVRDtBQUNILEdBckJEO0FBd0JELENBcElBLEVBb0lFLEtBcElGIiwiZmlsZSI6IndvcmxkY3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbigkKXtcbiAgdmFyIHByZWZpeCA9ICdodHRwOi8vMTAuMTI0LjE4LjExNTo4MDgwLyc7XG4gIHZhciBwYXRoID0gJ2FwaS92MS9hY3Rpdml0eS93b3JsZGN1cC8nXG4gIHZhciB1dWlkID0gJzUyYWI3YmMzLWIzNmQtNDU0ZS1hOWUzLTc5YzcyODkxYWJmNi8nO1xuICB2YXIgYWpheFVybCA9IHByZWZpeCArIHBhdGggKyB1dWlkO1xuICB2YXIgcmVnaXN0ZXJVcmw7XG4gIC8vIGNvbnNvbGUubG9nKGFqYXhVcmwpO1xuICB2YXIgaG9zdE5hbWUsIGhvc3RGbGFnO1xuICB2YXIgZ3Vlc3ROYW1lLCBndWVzdEZsYWc7XG4gIHZhciB2b3RlRm9yO1xuICB2YXIgc2hvd1ZvdGVOdW1iZXJzID0gKGRhdGEpID0+IHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICByZWdpc3RlclVybCA9IGRhdGEucmVnaXN0ZXJfdXJsO1xuICAgIGhvc3ROYW1lID0gZGF0YS5ob3N0Lm5hbWVDTjtcbiAgICBob3N0RmxhZyA9IGRhdGEuaG9zdC5mbGFnO1xuICAgIGd1ZXN0TmFtZSA9IGRhdGEuZ3Vlc3QubmFtZUNOO1xuICAgIGd1ZXN0RmxhZyA9IGRhdGEuZ3Vlc3QuZmxhZztcbiAgICAkKCcjdm90ZS1idXR0b24tMScpLnRleHQoJ+aUr+aMgScgKyBob3N0TmFtZSk7XG4gICAgJCgnI3ZvdGUtYnV0dG9uLTInKS50ZXh0KCfmlK/mjIEnICsgZ3Vlc3ROYW1lKTtcbiAgICAkKCcjdm90ZS1udW1iZXItY291bnRyeS0xJykudGV4dChkYXRhLmhvc3Qudm90ZSk7XG4gICAgJCgnI3ZvdGUtbnVtYmVyLWNvdW50cnktMicpLnRleHQoZGF0YS5ndWVzdC52b3RlKTtcblxuICAgICQoJyNmbGFnMScpLmF0dHIoJ3NyYycsICdodHRwOi8vbzgycjBndjdkLmJrdC5jbG91ZGRuLmNvbS9pbWFnZXMvJyArIGhvc3RGbGFnICsgJy5wbmcnKTtcbiAgICAkKCcjZmxhZzInKS5hdHRyKCdzcmMnLCAnaHR0cDovL284MnIwZ3Y3ZC5ia3QuY2xvdWRkbi5jb20vaW1hZ2VzLycgKyBndWVzdEZsYWcgKyAnLnBuZycpO1xuICAgICQoJy5jb250ZW50LXJlZ2lzdGVyLWNvbnRhaW5lciBhJykuYXR0cignaHJlZicsIHJlZ2lzdGVyVXJsKTtcbiAgfTtcblxuICB2YXIgZG9BamF4ID0gKHJlcVR5cGUsIHVybCwgcGFyYW1ldGVycywgY2FsbGJhY2spID0+IHtcbiAgICBpZiAocmVxVHlwZSA9PT0gJ2dldCcpIHtcbiAgICAgIHZhciB4aHIgPSAkLmdldEpTT04odXJsLCBwYXJhbWV0ZXJzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHhociA9ICQucG9zdCh1cmwsIHBhcmFtZXRlcnMpO1xuICAgIH1cblxuICAgIC8vIFByb21pc2UgY2FsbGJhY2tzXG4gICAgeGhyLmRvbmUoKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB7XG4gICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9KVxuICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIudG9TdHJpbmcoKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgZG9BamF4KCdnZXQnLCBhamF4VXJsLCB7fSwgc2hvd1ZvdGVOdW1iZXJzKTtcblxuXG4gICQoJyN2b3RlLWJ1dHRvbi0xJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2b3RlRm9yID0gaG9zdE5hbWU7XG4gICAgJCgnLmNvbnRhaW5lcicpLmFkZENsYXNzKCd0cmFuc2ZlcjEnKTtcbiAgfSk7XG5cbiAgJCgnI3ZvdGUtYnV0dG9uLTInKS5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZvdGVGb3IgPSBndWVzdE5hbWU7XG4gICAgJCgnLmNvbnRhaW5lcicpLmFkZENsYXNzKCd0cmFuc2ZlcjEnKTtcbiAgfSk7XG5cbiAgdmFyIGNvbmZpcm1QaG9uZU51bWJlciA9IChkYXRhKSA9PiB7XG4gICAgJCgnI3Byb2Nlc3MtY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ3RvZ2dsZWQnKTtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAvKiDplJnor6/lj4LmlbDmj5DnpLrvvJpcbiAgICAqKiA0MDA3MTgg57y65bCR5Y+C5pWwIHBob25lPSguLi4pJnRlYW0oLi4uKVxuICAgICoqIDQwMDcxOSDmiYvmnLrlj7fplJnor69cbiAgICAqKiA0MDA3MjAg6Zif5ZCN6ZSZ6K+vXG4gICAgKiogNDAwNzIxIOaKlei/h+elqOS6hlxuICAgICovXG5cbiAgICBpZihkYXRhLmVycmNvZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgJCgnLmNvbnRhaW5lcicpLmFkZENsYXNzKCd0cmFuc2ZlcjInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGVycm9yO1xuICAgICAgc3dpdGNoIChkYXRhLmVycmNvZGUpIHtcbiAgICAgICAgY2FzZSA0MDA3MTg6XG4gICAgICAgICAgZXJyb3IgPSBcIuWPkeeUn+mUmeivr++8jOivt+mHjeaWsOi+k+WFpe+8gVwiO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY29kZTogNDAwNzE4LCDnvLrlsJHlj4LmlbAgcGhvbmU9KC4uLikmdGVhbSguLi4pXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwMDcxOTpcbiAgICAgICAgICBlcnJvciA9IFwi5omL5py65Y+356CB6ZSZ6K+v77yBXCI7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBjb2RlOiA0MDA3MTksIOaJi+acuuWPt+eggemUmeivr++8gVwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0MDA3MjA6XG4gICAgICAgICAgZXJyb3IgPSBcIuWPkeeUn+mUmeivr++8jOivt+mHjeaWsOi+k+WFpe+8gVwiO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY29kZTogNDAwNzIwLCDpmJ/kvI3lkI3np7DplJnor6/vvIFcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDAwNzIxOlxuICAgICAgICAgIGVycm9yID0gXCLmraTmiYvmnLrlj7flt7LmipXov4fnpajkuoblk6bvvIFcIjtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGNvZGU6IDQwMDcyMSwg5q2k5omL5py65Y+35bey5oqV6L+H56Wo77yBXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGVycm9yID0gXCLlj5HnlJ/mnKrnn6XplJnor6/vvIzor7fph43mlrDovpPlhaXvvIFcIjtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gZXJyb3IhXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICQoJyNhbGVydC1ib3gtY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2Rpc3BsYXktbm9uZScpO1xuICAgICAgICAkKCcjYWxlcnQtYm94LWNvbnRlbnQnKS50ZXh0KGVycm9yKTtcbiAgICAgICAgJCgnI2FsZXJ0LWJveC1idXR0b24nKS5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICQoJyNhbGVydC1ib3gtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2Rpc3BsYXktbm9uZScpO1xuICAgICAgICAgICQoJy5wYWdlMiBmb3JtIGlucHV0JykudmFsKCcnKTtcbiAgICAgICAgICAkKCcucGFnZTIgZm9ybSBpbnB1dCcpLmZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gICQoJyNjb25maXJtJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgIHZhciBwaG9uZU51bWJlciA9ICQoJy5wYWdlMiBmb3JtIGlucHV0JykudmFsKCk7XG4gICAgIHZhciBwaG9uZU51bWJlclJlZ0V4cCA9IG5ldyBSZWdFeHAoJyheKDEzXFxcXGR8MTVbXjQsXFxcXERdfDE3WzEzNjc4XXwxOFxcXFxkKVxcXFxkezh9fDE3MFteMzQ2LFxcXFxEXVxcXFxkezd9KSQnLCAnZycpO1xuICAgICBpZihwaG9uZU51bWJlclJlZ0V4cC50ZXN0KHBob25lTnVtYmVyKSkge1xuICAgICAgIHZhciBwYXJhbWV0ZXJzID0gJ3Bob25lPScgKyBwaG9uZU51bWJlciArICcmdGVhbT0nICsgdm90ZUZvcjtcbiAgICAgICAkKCcjcHJvY2Vzcy1jb250YWluZXInKS5hZGRDbGFzcygndG9nZ2xlZCcpO1xuICAgICAgIGRvQWpheCgncG9zdCcsIGFqYXhVcmwsIHBhcmFtZXRlcnMsIGNvbmZpcm1QaG9uZU51bWJlcik7XG4gICAgIH0gZWxzZSB7XG4gICAgICAgLy8g5omL5py65Y+35qC85byP6ZSZ6K+vXG4gICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgJCgnI2FsZXJ0LWJveC1jb250YWluZXInKS5yZW1vdmVDbGFzcygnZGlzcGxheS1ub25lJyk7XG4gICAgICAgICAkKCcjYWxlcnQtYm94LWNvbnRlbnQnKS50ZXh0KCfmiYvmnLrlj7fnoIHmnInor6/vvIEnKTtcbiAgICAgICAgICQoJyNhbGVydC1ib3gtYnV0dG9uJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICQoJyNhbGVydC1ib3gtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2Rpc3BsYXktbm9uZScpO1xuICAgICAgICAgICAkKCcucGFnZTIgZm9ybSBpbnB1dCcpLnZhbCgnJyk7XG4gICAgICAgICAgICQoJy5wYWdlMiBmb3JtIGlucHV0JykuZm9jdXMoKTtcbiAgICAgICAgIH0pO1xuICAgICAgIH0sIDApO1xuICAgICB9XG4gIH0pO1xuXG5cbn0pKFplcHRvKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
