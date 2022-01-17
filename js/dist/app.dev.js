"use strict";

function identPageScroll() {
  try {
    var cleanClass = function cleanClass() {
      packeages.forEach(function (packeage) {
        packeage.classList.remove("active");
        delStickyEl(packeage);
      });
    };

    var scroll = function scroll(el) {
      var scrollElPos = el.getBoundingClientRect().top + window.scrollY;
      var headerH = header.offsetHeight + 2;
      $("body,html").animate({
        scrollTop: scrollElPos - headerH
      }, 1000);
      stickyEl(el);
    };

    var stickyEl = function stickyEl(el) {
      var pageW = document.documentElement.scrollWidth;
      if (pageW > 520 || !el) return;
      var packet = el.querySelector(".packet");
      var name = el.querySelector(".name");
      var btn = el.querySelector(".comeback");
      var count = null;
      packeages.forEach(function (item, i) {
        if (item == el) {
          var idx = i + 1;
          count = idx < 10 ? "0" + idx : idx;
        }
      });
      if (!packet || !name || !count) return;
      var text = {
        packet: packet.innerHTML,
        name: name.innerHTML
      };
      console.log("data", el);
      var stiky = document.createElement("div");
      stiky.classList.add("stiky");
      stiky.innerHTML = "\n            <div class=\"packet\">".concat(text.packet, "</div>\n            <div class=\"name\">").concat(text.name, "</div>\n            <div class=\"count\">").concat(count, "</div>\n            ");
      stiky.append(btn);
      el.append(stiky);
      window.addEventListener("scroll", function () {
        return stickyWatch(el);
      });
    };

    var delStickyEl = function delStickyEl(el) {
      if (!el.querySelector(".stiky")) return;
      var stiky = el.querySelector(".stiky");
      var btn = stiky.querySelector("button.comeback");
      el.append(btn);
      stiky.remove();
      window.removeEventListener("scroll", function () {
        return stickyWatch(el);
      });
    };

    var stickyWatch = function stickyWatch(el) {
      if (!document.querySelector(".stiky") || !el) return;
      var header = document.querySelector("header");
      var headerH = header.offsetHeight;
      var stiky = document.querySelector(".stiky");
      var scrollY = window.scrollY + headerH;
      var posElTop = el.getBoundingClientRect().top + window.scrollY;
      var posElBottom = el.getBoundingClientRect().bottom + window.scrollY;
      var posElBottomStyki = stiky.getBoundingClientRect().bottom + window.scrollY;
      var scrollY_height = scrollY + stiky.offsetHeight;

      if (scrollY < posElTop) {
        stiky.classList.remove("end");
        stiky.classList.remove("fixed");
      }

      if (scrollY >= posElTop && posElBottom > scrollY_height && !stiky.classList.contains("fixed")) {
        stiky.classList.remove("end");
        stiky.classList.add("fixed");
      }

      if (scrollY_height >= posElBottom) {
        stiky.classList.remove("fixed");
        stiky.classList.add("end");
      }
    };

    var resizeUpdate = function resizeUpdate() {
      if (document.documentElement.scrollWidth !== screenW) {
        cleanClass();
        screenW = document.documentElement.scrollWidth;
      }
    };

    if (!document.querySelector('.cost_block[data-action="true"]') || !document.querySelector('.packeage_block[data-action="true"]')) return;
    var header = document.querySelector("header");
    var parent = document.querySelector('.cost_block[data-action="true"]');
    var packets = parent.querySelectorAll(".packet");
    var parent_2 = document.querySelector('.packeage_block[data-action="true"]');
    var packeages = parent_2.querySelectorAll(".packeage");
    var btns = parent_2.querySelectorAll("button.comeback");
    var current_packet_btn = document.querySelector("button[data-packet_name]") || false;

    if (current_packet_btn) {
      current_packet_btn.addEventListener("click", function () {
        var packet_name = current_packet_btn.dataset.packet_name.trim();
        var idx = Array.from(packeages).findIndex(function (item) {
          return item.dataset.packet_name.trim() == packet_name;
        });
        cleanClass();

        if (packeages[idx]) {
          packeages[idx].classList.add("active");
          scroll(packeages[idx]);
        }
      });
    }

    packets.forEach(function (packet, idx) {
      packet.addEventListener("click", function () {
        cleanClass();

        if (packeages[idx]) {
          packeages[idx].classList.add("active");
          scroll(packeages[idx]);
        }
      });
    });
    btns.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        cleanClass();

        if (packets[i]) {
          scroll(packets[i]);
        } else {
          scroll(parent);
        }
      });
    });
    var screenW = document.documentElement.scrollWidth;
    window.addEventListener("resize", resizeUpdate);
  } catch (e) {
    console.log('Error on "identPageScroll" function', e);
  }
}

function pdfViewer() {
  try {
    var showPopup = function showPopup(callback) {
      if (!document.querySelector('.pdf_wrapper')) return;
      var popup = document.querySelector('.pdf_wrapper');
      var heder = document.querySelector('header');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = scrollbarWidth() + 'px';
      heder.style.paddingRight = scrollbarWidth() + 'px';
      document.documentElement.style.overflow = 'hidden';
      popup.classList.add('block');
      SLIDER.update();
      setTimeout(function () {
        popup.classList.add('show');
        callback;
      });
    };

    var closePopup = function closePopup() {
      console.log('popUP cCLOSE');
      if (!document.querySelector('.pdf_wrapper')) return;
      var popup = document.querySelector('.pdf_wrapper');
      var heder = document.querySelector('header');
      popup.classList.remove('show');
      setTimeout(function () {
        popup.classList.remove('block');
        document.body.removeAttribute('style');
        heder.removeAttribute('style');
        document.documentElement.removeAttribute('style');
      }, 300);
    };

    var scrollbarWidth = function scrollbarWidth() {
      var inner = document.createElement('p');
      inner.style.width = "100%";
      inner.style.height = "200px";
      var outer = document.createElement('div');
      outer.style.position = "absolute";
      outer.style.top = "0px";
      outer.style.left = "0px";
      outer.style.visibility = "hidden";
      outer.style.width = "200px";
      outer.style.height = "150px";
      outer.style.overflow = "hidden";
      outer.appendChild(inner);
      document.body.appendChild(outer);
      var w1 = inner.offsetWidth;
      outer.style.overflow = 'scroll';
      var w2 = inner.offsetWidth;
      if (w1 == w2) w2 = outer.clientWidth;
      document.body.removeChild(outer);
      return w1 - w2;
    };

    var createPDFCanvas = function createPDFCanvas(elem) {
      if (!elem.hasAttribute("data-path")) return;
      var url = elem.getAttribute("data-path");
      loaded = false;
      var loader = document.querySelector('#pdf_loading');

      if (loader) {
        loader.classList.remove('hide');
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc = "./js/pdf.worker.js";
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(function (pdf) {
        console.log("PDF loaded"); // Fetch the first page

        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {
          console.log("Page loaded");
          var scale = 0.6;
          var viewport = page.getViewport({
            scale: scale
          });
          console.log("viewport", viewport); // Prepare canvas using PDF page dimensions

          var canvas = document.getElementById("pdf");
          var context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width; // Render PDF page into canvas context

          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function () {
            console.log("Page rendered");
            loaded = true;

            if (loader) {
              loader.classList.add('hide');
            }
          });
        });
      }, function (reason) {
        // PDF loading error
        console.error(reason);
      });
    };

    var initSwiper = function initSwiper() {
      if (!document.querySelector('.pdf_wrapper .swiper_pdf')) {
        return false;
      }

      return new Swiper('.pdf_wrapper .swiper_pdf', {
        loop: false,
        slidesPerView: 4,
        spaceBetween: 25,
        rewind: true,
        breakpoints: {
          1180: {
            slidesPerView: 4
          },
          760: {
            slidesPerView: 3
          },
          280: {
            slidesPerView: 1
          }
        },
        navigation: {
          nextEl: '.swiper_pdf .swiper-button-next',
          prevEl: '.swiper_pdf .swiper-button-prev'
        }
      });
    };

    if (!document.querySelector('[data-pdf-show="true"]')) return;
    var loaded = null;
    var elems = document.querySelectorAll('[data-pdf-show="true"]');
    elems.forEach(function (elem) {
      elem.addEventListener("click", function (e) {
        showPopup(createPDFCanvas(elem));
        ;
      });
    });

    if (document.querySelector('[data-pdf-change="true"]')) {
      var changeElems = document.querySelectorAll('[data-pdf-change="true"]');
      changeElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
          var wrapper = document.querySelector('.pdf_wrapper');
          wrapper.scrollTop = 0;

          if (loaded) {
            createPDFCanvas(elem);
          }
        });
      });
    }

    var SLIDER = initSwiper();

    if (SLIDER) {
      var screenW = document.documentElement.scrollWidth;
      window.addEventListener('resize', function () {
        if (document.documentElement.scrollWidth !== screenW) {
          SLIDER.update();
          screenW = document.documentElement.scrollWidth;
        }
      });
    }

    var closeBtn = document.querySelector('.pdf_wrapper button[data-type="close"]') || false;

    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }

    document.addEventListener('click', function (e) {
      var targ = e.target.classList.contains('pdf_wrapper');
      var targ2 = e.target.classList.contains('container');

      if (targ || targ2) {
        closePopup();
      }
    });
  } catch (e) {
    console.log('Error on "pdfViewer" function', e);
  }
}

function showAndHideTxt() {
  try {
    if (!document.querySelector('[data-toggle-text="true"]')) return;
    var trigers = document.querySelectorAll('[data-toggle-text="true"]');
    trigers.forEach(function (triger) {
      triger.addEventListener('click', function () {
        var parent = triger.parentElement || false;
        if (!parent || !parent.classList.contains('text_field')) return false;
        var field = parent.querySelector('.field');
        if (!field) return false;

        if (triger.classList.contains('show')) {
          field.removeAttribute('style');
          triger.classList.remove('show');
        } else {
          var H = field.scrollHeight;
          triger.classList.add('show');
          field.style.maxHeight = H + 'px';
        }
      });
    });
  } catch (e) {
    console.log('Error on "showAndHideTxt" function', e);
  }
}

window.onload = function () {
  identPageScroll();
  pdfViewer();
  showAndHideTxt();
}; // var scrollElPos = scrollEl.getBoundingClientRect().top;
//     var headerH = header.offsetHeight;
//     $('body,html').animate({
//       scrollTop: scrollElPos - headerH
//     }, 1000);
//     return false;