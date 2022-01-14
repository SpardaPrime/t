"use strict";

function identPageScroll() {
  try {
    var cleanClass = function cleanClass() {
      packeages.forEach(function (packeage) {
        packeage.classList.remove('active');
        delStickyEl(packeage);
      });
    };

    var scroll = function scroll(el) {
      var scrollElPos = el.getBoundingClientRect().top + window.scrollY;
      var headerH = header.offsetHeight + 2;
      $('body,html').animate({
        scrollTop: scrollElPos - headerH
      }, 1000);
      stickyEl(el);
    };

    var stickyEl = function stickyEl(el) {
      var pageW = document.documentElement.scrollWidth;
      if (pageW > 520 || !el) return;
      var packet = el.querySelector('.packet');
      var name = el.querySelector('.name');
      var btn = el.querySelector('.comeback');
      var count = null;
      packeages.forEach(function (item, i) {
        if (item == el) {
          var idx = i + 1;
          count = idx < 10 ? '0' + idx : idx;
        }
      });
      if (!packet || !name || !count) return;
      var text = {
        packet: packet.innerHTML,
        name: name.innerHTML
      };
      console.log('data', el);
      var stiky = document.createElement('div');
      stiky.classList.add('stiky');
      stiky.innerHTML = "\n            <div class=\"packet\">".concat(text.packet, "</div>\n            <div class=\"name\">").concat(text.name, "</div>\n            <div class=\"count\">").concat(count, "</div>\n            ");
      stiky.append(btn);
      el.append(stiky);
      window.addEventListener('scroll', function () {
        return stickyWatch(el);
      });
    };

    var delStickyEl = function delStickyEl(el) {
      if (!el.querySelector('.stiky')) return;
      var stiky = el.querySelector('.stiky');
      var btn = stiky.querySelector('button.comeback');
      el.append(btn);
      stiky.remove();
      window.removeEventListener('scroll', function () {
        return stickyWatch(el);
      });
    };

    var stickyWatch = function stickyWatch(el) {
      if (!document.querySelector('.stiky') || !el) return;
      var header = document.querySelector('header');
      var headerH = header.offsetHeight;
      var stiky = document.querySelector('.stiky');
      var scrollY = window.scrollY + headerH;
      var posElTop = el.getBoundingClientRect().top + window.scrollY;
      var posElBottom = el.getBoundingClientRect().bottom + window.scrollY;
      var posElBottomStyki = stiky.getBoundingClientRect().bottom + window.scrollY;
      var scrollY_height = scrollY + stiky.offsetHeight;

      if (scrollY < posElTop) {
        stiky.classList.remove('end');
        stiky.classList.remove('fixed');
      }

      if (scrollY >= posElTop && posElBottom > scrollY_height && !stiky.classList.contains('fixed')) {
        stiky.classList.remove('end');
        stiky.classList.add('fixed');
      }

      if (scrollY_height >= posElBottom) {
        stiky.classList.remove('fixed');
        stiky.classList.add('end');
      }
    }; // window.addEventListener("resize",cleanClass);


    if (!document.querySelector('.cost_block[data-action="true"]') || !document.querySelector('.packeage_block[data-action="true"]')) return;
    var header = document.querySelector('header');
    var parent = document.querySelector('.cost_block[data-action="true"]');
    var packets = parent.querySelectorAll('.packet');
    var parent_2 = document.querySelector('.packeage_block[data-action="true"]');
    var packeages = parent_2.querySelectorAll('.packeage');
    var btns = parent_2.querySelectorAll('button.comeback');
    var current_packet_btn = document.querySelector('button[data-packet_name]') || false;

    if (current_packet_btn) {
      current_packet_btn.addEventListener('click', function () {
        var packet_name = current_packet_btn.dataset.packet_name.trim();
        var idx = Array.from(packeages).findIndex(function (item) {
          return item.dataset.packet_name.trim() == packet_name;
        });
        cleanClass();

        if (packeages[idx]) {
          packeages[idx].classList.add('active');
          scroll(packeages[idx]);
        }
      });
    }

    packets.forEach(function (packet, idx) {
      packet.addEventListener('click', function () {
        cleanClass();

        if (packeages[idx]) {
          packeages[idx].classList.add('active');
          scroll(packeages[idx]);
        }
      });
    });
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        cleanClass();

        if (packets[i]) {
          scroll(packets[i]);
        } else {
          scroll(parent);
        }
      });
    });
  } catch (e) {
    console.log('Error on "identPageScroll" function', e);
  }
}

window.onload = function () {
  identPageScroll();
}; // var scrollElPos = scrollEl.getBoundingClientRect().top;
//     var headerH = header.offsetHeight;
//     $('body,html').animate({
//       scrollTop: scrollElPos - headerH
//     }, 1000);
//     return false;