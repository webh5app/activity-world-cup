var $ = $ || {};
$.alert = function (content, title, buttonText) {
  title = title || "哎呀，你出错啦!";
  buttonText = buttonText || "确定";
  var listener = function (e) {
    e = e || window.Event;
    var el = e.target || e.srcElement;
    switch (el.className) {
      case "ealert-button":
        var ealert = document.querySelector(".ealert");
        ealert.parentElement.removeChild(ealert);
        removeEventListener("click", listener, false);
        break;
    }
  };

  addEventListener("click", listener, false);

  document.querySelector("body").innerHTML += `
    <div class="ealert wrapper">
      <div class="cell">
        <div class="ealert-body ealert-body-in">
          <div class="ealert-inner">
            <div class="ealert-title">${title}</div>
            <div class="ealert-content">${content}</div>
          </div>
          <div class="ealert-button">${buttonText}</div>
        </div>
      </div>
    </div>
  `;
};

$.showPreloader = function (message) {
  $.hidePreloader();

  const div = document.createElement('div');
  div.className = 'preloader';
  div.innerHTML += `
    <div class="preloader">
      <div class="spinner">
        <div class="spinner-container container1">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container2">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container3">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
      </div>
      <div class="message">${message ? message : ''}</div>
    </div>
  `;
  document.querySelector("body").appendChild(div);
}

$.hidePreloader = () => {
  let preloader = document.querySelector(".preloader");
  if (preloader)
    preloader.parentElement.removeChild(preloader);
}

;(function ($) {
  const prefix = "http://www.uberqd.com";
  const path = "/api/v1/activity/worldcup";
  let uuid = "38550e68-b2fd-46ab-9176-202b15f723fd";

  const imgPath = "/images";

  const fullpath = `${prefix}${path}/${uuid}/`;

  $(document).ready(function () {
    $.get(fullpath)
     .done(function (data, status, xhr) {

       if (data.errcode) {
         $.alert(data.errmsg, '无效请求');
         return ;
       }

      document.title = data.title.replace('<br/>', '');
      $('.page-one .title').html(data.title);

      $('.team-host .vote-btn').data("team", data.host.name);
      $('.team-host .vote-btn').html(`支持${data.host.nameCN}`);
      $('.team-host .flag').attr("src", `${imgPath}/${data.host.flag}.png`);
      $('.team-host .vote-status .count').html(parseInt(data.host.vote*2.2));
      console.log(data);

      $('.team-guest .vote-btn').data("team", data.guest.name);
      $('.team-guest .vote-btn').html(`支持${data.guest.nameCN}`);
      $('.team-guest .flag').attr("src", `${imgPath}/${data.guest.flag}.png`);
      $('.team-guest .vote-status .count').html(data.guest.vote);


     })
     .fail(function (xhr, errType, error) {
       $.alert(error);
     });
  });

  const data = {
    _team: '',
    _phone: '',
    setTeam: (team) => data._team = team,
    setPhone: (phone) => data._phone = phone,
    encode: (phone) => `team=${data._team}&phone=${data._phone}`,
  };

  const checkPhone = (phone) => {
    return /^1[3|4|5|7|8][0-9]{9}$/.test(phone) ? true : false;
  }

  const sendRequest = (pdata) => {
    $.ajax({
      url: fullpath,
      type: 'POST',
      data: pdata,
      dataType: 'json',
    })
    .done(function (data, status, xhr) {
      $.hidePreloader();

      if (data.errcode) {
        $.alert(data.errmsg, '无效请求');
      } else {
        // $.alert(`恭喜你，成功支持${data.team}！`);

        $(".page-two").hide();
        $(".page-three").show();
      }
    });
  };


  $(document).on("click", ".vote-btn", function (event) {
    data.setTeam($(this).data("team"));

    $(".page-one").hide();
    $(".page-two").show();
  });

  $(document).on("click", ".confirm-phone", function (event) {

    if (! checkPhone($(".phone-input").val())) {
      $.alert('无效的号码', '出错啦!');
      return ;
    }

    data.setPhone($(".phone-input").val());
    $.showPreloader("正在为您支持的球队助力，请稍等...");
    sendRequest(data.encode());
  });

})(Zepto)
