function identPageScroll() {
  try {
    if (
      !document.querySelector('.cost_block[data-action="true"]') ||
      !document.querySelector('.packeage_block[data-action="true"]')
    )
      return;
    let header = document.querySelector("header");

    let parent = document.querySelector('.cost_block[data-action="true"]');
    let packets = parent.querySelectorAll(".packet");

    let parent_2 = document.querySelector(
      '.packeage_block[data-action="true"]'
    );
    let packeages = parent_2.querySelectorAll(".packeage");
    let btns = parent_2.querySelectorAll("button.comeback");

    let current_packet_btn =
      document.querySelector("button[data-packet_name]") || false;
    if (current_packet_btn) {
      current_packet_btn.addEventListener("click", () => {
        let packet_name = current_packet_btn.dataset.packet_name.trim();
        let idx = Array.from(packeages).findIndex(
          (item) => item.dataset.packet_name.trim() == packet_name
        );
        cleanClass();
        if (packeages[idx]) {
          packeages[idx].classList.add("active");
          scroll(packeages[idx]);
        }
      });
    }

    function cleanClass() {
      packeages.forEach((packeage) => {
        packeage.classList.remove("active");
        delStickyEl(packeage);
      });
    }

    packets.forEach((packet, idx) => {
      packet.addEventListener("click", () => {
        cleanClass();
        if (packeages[idx]) {
          packeages[idx].classList.add("active");
          scroll(packeages[idx]);
        }
      });
    });
    btns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        cleanClass();
        if (packets[i]) {
          scroll(packets[i]);
        } else {
          scroll(parent);
        }
      });
    });

    function scroll(el) {
      let scrollElPos = el.getBoundingClientRect().top + window.scrollY;
      let headerH = header.offsetHeight + 2;
      $("body,html").animate(
        {
          scrollTop: scrollElPos - headerH,
        },
        1000
      );
      stickyEl(el);
    }
    function stickyEl(el) {
      let pageW = document.documentElement.scrollWidth;
      if (pageW > 520 || !el) return;
      let packet = el.querySelector(".packet");
      let name = el.querySelector(".name");
      let btn = el.querySelector(".comeback");
      let count = null;
      packeages.forEach((item, i) => {
        if (item == el) {
          let idx = i + 1;
          count = idx < 10 ? "0" + idx : idx;
        }
      });
      if (!packet || !name || !count) return;
      let text = {
        packet: packet.innerHTML,
        name: name.innerHTML,
      };
      console.log("data", el);
      let stiky = document.createElement("div");
      stiky.classList.add("stiky");
      stiky.innerHTML = `
            <div class="packet">${text.packet}</div>
            <div class="name">${text.name}</div>
            <div class="count">${count}</div>
            `;
      stiky.append(btn);
      el.append(stiky);
      window.addEventListener("scroll", () => stickyWatch(el));
    }
    function delStickyEl(el) {
      if (!el.querySelector(".stiky")) return;
      let stiky = el.querySelector(".stiky");
      let btn = stiky.querySelector("button.comeback");
      el.append(btn);
      stiky.remove();
      window.removeEventListener("scroll", () => stickyWatch(el));
    }

    function stickyWatch(el) {
      if (!document.querySelector(".stiky") || !el) return;
      let header = document.querySelector("header");
      let headerH = header.offsetHeight;
      let stiky = document.querySelector(".stiky");

      let scrollY = window.scrollY + headerH;
      let posElTop = el.getBoundingClientRect().top + window.scrollY;
      let posElBottom = el.getBoundingClientRect().bottom + window.scrollY;
      let posElBottomStyki =
        stiky.getBoundingClientRect().bottom + window.scrollY;

      let scrollY_height = scrollY + stiky.offsetHeight;

      if (scrollY < posElTop) {
        stiky.classList.remove("end");
        stiky.classList.remove("fixed");
      }

      if (
        scrollY >= posElTop &&
        posElBottom > scrollY_height &&
        !stiky.classList.contains("fixed")
      ) {
        stiky.classList.remove("end");

        stiky.classList.add("fixed");
      }

      if (scrollY_height >= posElBottom) {
        stiky.classList.remove("fixed");
        stiky.classList.add("end");
      }
    }
    let screenW = document.documentElement.scrollWidth;
    function resizeUpdate() {
      if (document.documentElement.scrollWidth !== screenW) {
        cleanClass();
        screenW = document.documentElement.scrollWidth;
      }
    }

    window.addEventListener("resize", resizeUpdate);
  } catch (e) {
    console.log('Error on "identPageScroll" function', e);
  }
}

function pdfViewer() {
  try {
    if (!document.querySelector('[data-pdf-show="true"]')) return;
    let loaded = null;
    let elems = document.querySelectorAll('[data-pdf-show="true"]');
    elems.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        showPopup(createPDFCanvas(elem));
        ;
      });
    });
    if(document.querySelector('[data-pdf-change="true"]')){
        let changeElems = document.querySelectorAll('[data-pdf-change="true"]');
        changeElems.forEach(elem=>{
            elem.addEventListener('click',()=>{
                let wrapper = document.querySelector('.pdf_wrapper');
                wrapper.scrollTop= 0;
                if(loaded){
                    createPDFCanvas(elem);
                }
            });
        });
    }
    const SLIDER = initSwiper();
    if(SLIDER){
        let screenW = document.documentElement.scrollWidth;
        window.addEventListener('resize',()=>{
            if (document.documentElement.scrollWidth !== screenW) {
                SLIDER.update();
                screenW = document.documentElement.scrollWidth;
              }
        });
    }
    let closeBtn = document.querySelector('.pdf_wrapper button[data-type="close"]')||false;
    if(closeBtn){
        closeBtn.addEventListener('click',closePopup);
    }
    document.addEventListener('click',(e)=>{
        let targ = e.target.classList.contains('pdf_wrapper');
        let targ2 = e.target.classList.contains('container');
        if(targ||targ2){
            closePopup()
        }
    });


    function showPopup(callback){
        if(!document.querySelector('.pdf_wrapper'))return;
        let popup = document.querySelector('.pdf_wrapper');
        let heder = document.querySelector('header');
        document.body.style.overflow='hidden';
        document.body.style.paddingRight = scrollbarWidth() + 'px';
        heder.style.paddingRight = scrollbarWidth() + 'px';
        document.documentElement.style.overflow='hidden';

        popup.classList.add('block');
        SLIDER.update();
        setTimeout(()=>{
            popup.classList.add('show');
            callback
        });
        
    }
    function closePopup(){
        console.log('popUP cCLOSE')
        if(!document.querySelector('.pdf_wrapper'))return;
        let popup = document.querySelector('.pdf_wrapper');
        let heder = document.querySelector('header');
        popup.classList.remove('show');
        setTimeout(()=>{
            popup.classList.remove('block');
            document.body.removeAttribute('style')
            heder.removeAttribute('style')
            document.documentElement.removeAttribute('style')
        },300)
    }

    function scrollbarWidth() {
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
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);

  return (w1 - w2);
      }

    function createPDFCanvas(elem) {
      if (!elem.hasAttribute("data-path")) return;
      let url = elem.getAttribute("data-path");
        loaded = false;
      let loader = document.querySelector('#pdf_loading');
      if(loader){
        loader.classList.remove('hide');
      }
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = "./js/pdf.worker.js";
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(
        function (pdf) {
          console.log("PDF loaded");

          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function (page) {
            console.log("Page loaded");

            var scale = 0.6;
            var viewport = page.getViewport({ scale: scale });
            console.log("viewport", viewport);
            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById("pdf");
            var context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
              console.log("Page rendered");
              loaded = true;
              if(loader){
                loader.classList.add('hide');
              }
            });
          });
        },
        function (reason) {
          // PDF loading error
          console.error(reason);
        }
      );
    }

    function initSwiper(){
        if(!document.querySelector('.pdf_wrapper .swiper_pdf')){
            return false;
        }
        return  new Swiper('.pdf_wrapper .swiper_pdf', {
            loop: false,
            slidesPerView: 4,
            spaceBetween: 25,
            rewind:true,
            breakpoints:{
                1180:{
                    slidesPerView:4,
                },
                760:{
                    slidesPerView:3,
                },
                280:{
                    slidesPerView:1,
                },
            },
            navigation: {
              nextEl: '.swiper_pdf .swiper-button-next',
              prevEl: '.swiper_pdf .swiper-button-prev',
            },
          
          });
    }
  } catch (e) {
    console.log('Error on "pdfViewer" function', e);
  }
}

function showAndHideTxt(){
  try{
    if(!document.querySelector('[data-toggle-text="true"]'))return;
    let trigers = document.querySelectorAll('[data-toggle-text="true"]');
    trigers.forEach(triger=>{
      triger.addEventListener('click',()=>{
        let parent = triger.parentElement||false;
        if(!parent||!parent.classList.contains('text_field'))return false;
        let field = parent.querySelector('.field');
        if(!field) return false;
        if(triger.classList.contains('show')){
          field.removeAttribute('style');
          triger.classList.remove('show')
        }else{
          let H = field.scrollHeight;
          triger.classList.add('show');
          field.style.maxHeight = H + 'px';
        }
      })
     
    })
  }catch(e){
    console.log('Error on "showAndHideTxt" function', e);
  }
}

window.onload = function () {
  identPageScroll();
  pdfViewer();
  showAndHideTxt();
};

// var scrollElPos = scrollEl.getBoundingClientRect().top;
//     var headerH = header.offsetHeight;
//     $('body,html').animate({
//       scrollTop: scrollElPos - headerH
//     }, 1000);
//     return false;
