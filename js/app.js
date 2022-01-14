
function identPageScroll(){
    try{
        if(!document.querySelector('.cost_block[data-action="true"]')||!document.querySelector('.packeage_block[data-action="true"]')) return;
        let header = document.querySelector('header');

        let parent = document.querySelector('.cost_block[data-action="true"]');
        let packets = parent.querySelectorAll('.packet');

        let parent_2 = document.querySelector('.packeage_block[data-action="true"]');
        let packeages = parent_2.querySelectorAll('.packeage');
        let btns = parent_2.querySelectorAll('button.comeback');

        let current_packet_btn = document.querySelector('button[data-packet_name]')||false;
        if(current_packet_btn){
            current_packet_btn.addEventListener('click',()=>{
                let packet_name = current_packet_btn.dataset.packet_name.trim();
                let idx = Array.from(packeages).findIndex((item)=>item.dataset.packet_name.trim()==packet_name)
                cleanClass();
                if(packeages[idx]){
                    packeages[idx].classList.add('active');
                    scroll(packeages[idx]);
                }
            });
        }

        function cleanClass(){
            packeages.forEach((packeage)=>{
                packeage.classList.remove('active');
                delStickyEl(packeage);
            });
        }

        packets.forEach((packet,idx)=>{
            packet.addEventListener('click',()=>{
                cleanClass();
                if(packeages[idx]){
                    packeages[idx].classList.add('active');
                    scroll(packeages[idx]);
                }
            });
        });
        btns.forEach((btn,i)=>{
            btn.addEventListener('click',()=>{
                cleanClass();
                if(packets[i]){
                    scroll(packets[i]);
                }else{
                    scroll(parent);
                }
            })
        });

        function scroll(el){
            let scrollElPos = el.getBoundingClientRect().top + window.scrollY;
            let headerH = header.offsetHeight + 2;
            $('body,html').animate({
                scrollTop: scrollElPos - headerH
              }, 1000);
              stickyEl(el);
        }
        function stickyEl(el){
            let pageW = document.documentElement.scrollWidth;
            if(pageW>520||!el)return;
            let packet = el.querySelector('.packet');
            let name = el.querySelector('.name');
            let btn = el.querySelector('.comeback');
            let count = null;
            packeages.forEach((item,i)=>{
                if(item == el){
                    let idx = i + 1;
                    count= idx<10?'0'+idx:idx;
                }
            });
            if(!packet||!name||!count)return;
            let text = {
                packet:packet.innerHTML,
                name:name.innerHTML,
            }
            console.log('data',el)
            let stiky = document.createElement('div');
            stiky.classList.add('stiky');
            stiky.innerHTML=`
            <div class="packet">${text.packet}</div>
            <div class="name">${text.name}</div>
            <div class="count">${count}</div>
            `;
            stiky.append(btn);
            el.append(stiky);
            window.addEventListener('scroll',()=>stickyWatch(el));

        }
        function delStickyEl(el){
            if(!el.querySelector('.stiky'))return;
            let stiky = el.querySelector('.stiky');
            let btn = stiky.querySelector('button.comeback');
            el.append(btn);
            stiky.remove();
            window.removeEventListener('scroll',()=>stickyWatch(el))
        }

        function stickyWatch(el){
            if(!document.querySelector('.stiky')||!el)return;
            let header = document.querySelector('header');
            let headerH =  header.offsetHeight;
            let stiky = document.querySelector('.stiky');

            let scrollY = window.scrollY + headerH;
            let posElTop = el.getBoundingClientRect().top + window.scrollY ;
            let posElBottom = el.getBoundingClientRect().bottom + window.scrollY;
            let posElBottomStyki = stiky.getBoundingClientRect().bottom + window.scrollY;

            let scrollY_height = scrollY + stiky.offsetHeight;

            if(scrollY<posElTop){
                stiky.classList.remove('end')
                stiky.classList.remove('fixed');
            }

            if(scrollY>=posElTop&&posElBottom>scrollY_height&&!stiky.classList.contains('fixed')){
                stiky.classList.remove('end')

                stiky.classList.add('fixed');
            }
            
            if(scrollY_height>=posElBottom){
                stiky.classList.remove('fixed');
                stiky.classList.add('end')
            }

        }

        window.addEventListener("resize",cleanClass);

        

    }catch(e){
        console.log('Error on "identPageScroll" function',e);
    }
}

window.onload=function(){
    identPageScroll();
}

// var scrollElPos = scrollEl.getBoundingClientRect().top;
//     var headerH = header.offsetHeight;
//     $('body,html').animate({
//       scrollTop: scrollElPos - headerH
//     }, 1000);
//     return false;