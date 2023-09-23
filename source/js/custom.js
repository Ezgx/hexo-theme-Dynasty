var custom = {
    getTimeState: function() {
        var e = (new Date).getHours()
          , t = "";
        return 0 <= e && e <= 5 ? t = "晚安😴" : 5 < e && e <= 10 ? t = "早上好👋" : 10 < e && e <= 14 ? t = "中午好👋" : 14 < e && e <= 18 ? t = "下午好👋" : 18 < e && e <= 24 && (t = "晚上好👋"),
        t
    },
    sayhi: function() {
        var e = document.getElementById("author-info__sayhi");
        e && (e.innerHTML = custom.getTimeState() + "！我是")
    },
}
custom.sayhi();

// 返回顶部 显示网页阅读进度
window.onscroll = percent; // 执行函数
// 页面百分比
function percent() {
  let a = document.documentElement.scrollTop || window.pageYOffset, // 卷去高度
    b =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ) - document.documentElement.clientHeight, // 整个网页高度 减去 可视高度
    result = Math.round((a / b) * 100), // 计算百分比
    btn = document.querySelector("#percent"); // 获取图标
    conbtn = document.querySelector('#buttons.conbtn')
    if (result > 10) {
      conbtn.style.left = 'calc(100% + 7px)'
    } else {
      conbtn.style.left = 'calc(100% - 40px)'
    }
    if (result > 0, result != 100) {
      btn.innerHTML = result;
    } else if (result != 100) {
      btn.innerHTML = result;
    } else if (result = 100) {
      btn.innerHTML = '&#xe62a;';
      btn.style.fontFamily = 'dys'
      btn.style.fontSize = '26px'
    }
}
percent();

const nav = {
copytext: function copytext() {
  var navbar = document.getElementById('navbar')
  var navmenus = document.getElementById('nav-menus')
  var text = document.getElementById('notebar')
  var percent = document.getElementById('buttons')
  percent.style.scale = '0'
  setTimeout("document.getElementById('buttons').style.scale = '1'", 2000)
  text.innerHTML = '复制成功'
  navbar.style.width = '330px'
  setTimeout("document.getElementById('navbar').style.width = 'fit-content'", 2000)
  navmenus.style.display = 'none'
  setTimeout("document.getElementById('nav-menus').style.display = 'block'", 2000)
  text.style.display = 'block'
  setTimeout("document.getElementById('notebar').style.display = 'none'", 2000)
},

darkmode: function darkmode() {
  var navbar = document.getElementById('navbar')
  var navmenus = document.getElementById('nav-menus')
  var text = document.getElementById('notebar')
  var percent = document.getElementById('buttons')
  percent.style.scale = '0'
  setTimeout("document.getElementById('buttons').style.scale = '1'", 2000)
  text.innerHTML = '切换成功'
  navbar.style.width = '330px'
  setTimeout("document.getElementById('navbar').style.width = 'fit-content'", 2000)
  navmenus.style.display = 'none'
  setTimeout("document.getElementById('nav-menus').style.display = 'block'", 2000)
  text.style.display = 'block'
  setTimeout("document.getElementById('notebar').style.display = 'none'", 2000)
},

asidehidetxt: function asidehidetxt() {
  var navbar = document.getElementById('navbar')
  var navmenus = document.getElementById('nav-menus')
  var text = document.getElementById('notebar')
  var percent = document.getElementById('buttons')
  percent.style.scale = '0'
  setTimeout("document.getElementById('buttons').style.scale = '1'", 2000)
  text.innerHTML = '设置成功'
  navbar.style.width = '330px'
  setTimeout("document.getElementById('navbar').style.width = 'fit-content'", 2000)
  navmenus.style.display = 'none'
  setTimeout("document.getElementById('nav-menus').style.display = 'block'", 2000)
  text.style.display = 'block'
  setTimeout("document.getElementById('notebar').style.display = 'none'", 2000)
},

hometophide: function hometophide() {
  var navbar = document.getElementById('navbar')
  var navmenus = document.getElementById('nav-menus')
  var text = document.getElementById('notebar')
  var percent = document.getElementById('buttons')
  percent.style.scale = '0'
  setTimeout("document.getElementById('buttons').style.scale = '1'", 2000)
  text.innerHTML = '设置成功'
  navbar.style.width = '330px'
  setTimeout("document.getElementById('navbar').style.width = 'fit-content'", 2000)
  navmenus.style.display = 'none'
  setTimeout("document.getElementById('nav-menus').style.display = 'block'", 2000)
  text.style.display = 'block'
  setTimeout("document.getElementById('notebar').style.display = 'none'", 2000)
},

randompost: function randompost() {
  var navbar = document.getElementById('navbar')
  var navmenus = document.getElementById('nav-menus')
  var text = document.getElementById('notebar')
  var percent = document.getElementById('buttons')
  percent.style.scale = '0'
  setTimeout("document.getElementById('buttons').style.scale = '1'", 2000)
  text.innerHTML = '正在跳转'
  navbar.style.width = '330px'
  setTimeout("document.getElementById('navbar').style.width = 'fit-content'", 2000)
  navmenus.style.display = 'none'
  setTimeout("document.getElementById('nav-menus').style.display = 'block'", 2000)
  text.style.display = 'block'
  setTimeout("document.getElementById('notebar').style.display = 'none'", 2000)
}
}

function toggleTheme() {
  var currentTheme = document.documentElement.getAttribute("data-theme");
  var targetTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", targetTheme);
  /* new Vue({
    data: function () {
        this.$notify({
            title: "切换成功",
            message: "dark/light",
            position: 'top-left',
            offset: 50,
            showClose: true,
            type: "success",
            duration: 4000
        });
    }
  }) */
  nav.darkmode()
}

function showconsolebtn() {
  var consolebtn = document.getElementById('console-pannel');
  if (consolebtn.style.scale === '1') {
    consolebtn.style.scale = '0';
  } else {
    consolebtn.style.scale = '1'
  }
}

function hideaside() {
  var aside = document.getElementById('aside-content');
  var postmodule = document.getElementsByClassName('maininner')[0];
  nav.asidehidetxt()
  if (aside.style.display === 'none') {
    aside.style.display = 'block';
    postmodule.style.width = '74%';
    /* new Vue({
      data: function () {
          this.$notify({
              title: "设置成功",
              message: "已显示侧边栏",
              position: 'top-left',
              offset: 50,
              showClose: true,
              type: "success",
              duration: 4000
          });
      }
    }) */
  }
  else {
    aside.style.display = 'none';
    postmodule.style.width = '100%';
    
  }
}

function hidehometop() {
  var hometop = document.getElementsByClassName('hometop')[0];
  var main = document.getElementById('content-inner');
  if (hometop.style.display === 'none') {
    hometop.style.display = 'block';
    main.style.top = '-40px'
  }
  else {
    hometop.style.display = 'none';
    main.style.top = 'unset'
  }
  nav.hometophide()
}
  
//首页顶部推荐文章轮播图
var ark_swiper = new Swiper("#ark-swiper-container", {
  direction: "horizontal", //横向切换
  loop: true,
  grabCursor : true,//鼠标悬停时显示抓手
  updateOnWindowResize: true,
  slidesPerView: 1,
  effect: "cube",
  spaceBetween: 30,
  mousewheel: true,
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: true,
  delay: 2000
});

const box = document.querySelector('#totopbtn')
    const mousedown = (event) => {
      //开关打开
      isDown = true;
      let innerX = event.clientX - box.offsetLeft
      let innerY = event.clientY - box.offsetTop

      box.style.borderWidth = "1px";
      box.style.borderStyle = "solid";
      box.style.borderColor = "black";
      // 移动时
      document.onmousemove = function (event) {
        box.style.left = event.clientX - innerX + "px"
        box.style.top = event.clientY - innerY + "px"
      }

      // 抬起时
      document.onmouseup = function () {
        document.onmousemove = null
        document.mousedown = null
        control()
        box.style.borderWidth = "";
        box.style.borderStyle = "";
        box.style.borderColor = "";
        //开关关闭
        clickFlag = endTime - startTime < 200;
        isDown = false;
      }
    }
    // 按下时
    box.addEventListener('mousedown', mousedown, false)

    
    var ele = document.querySelector('#totopbtn');
    // 记录的是元素当前位置
    var currentPosition = { x: 0, y: 0 };
    // 手指偏移位置，是touchmove中的坐标减去刚触摸时候的坐标得到并更新
    var offset = {};
    // 手指刚触摸时候的坐标
    var touchStartPositon = {};
    // 移动标志，主要用来解决touchend中currentPosition无意义累加的问题，下方会说明什么是无意义累加
    var moveFlag = false;
    // 监听，冒泡
    ele.addEventListener('touchstart', touchStart, false)
    ele.addEventListener('touchmove', touchMove, false)
    ele.addEventListener('touchend', touchEnd, false)
    function touchStart(e) {
        var touch = e.targetTouches[0];
        // 触摸时候记录手指初始位置
        touchStartPositon.x = touch.pageX;
        touchStartPositon.y = touch.pageY;
    }
    function touchMove(e) {
        moveFlag = true;

        // 屏蔽默认函数，当有上下滚动条时候，touchMove默认的是滚动屏幕
        e.preventDefault();
        var touch = e.changedTouches[0];

        // 得到用户拖动的相对x y距离，记录在offset中
        offset.x = touch.pageX - touchStartPositon.x;
        offset.y = touch.pageY - touchStartPositon.y;

        // offset + currentPostion就是css要移动的距离
        move({ x: currentPosition.x + offset.x, y: currentPosition.y + offset.y });

    }
    function touchEnd(e) {
        
        if (!moveFlag) return;

        // 无意义累加就在这里：
        // 用户第一次操作：完成一次拖动，此时offset中x y是有值的
        // 用户第二次操作：点击元素但是没有拖动，currentPostion就会加上offset中的值
        // 用户第三次操作：再次拖动，currentPositon中的值就不准了，因为多加了一次offset
        // 所以判断如果是moveFlag = false时候就直接退出
        currentPosition.x += offset.x
        currentPosition.y += offset.y
        // 对于无意义累加问题，当然也可以通过把offset置位o来解决
        // offset = { x: 0, y: 0 };
        moveFlag = false;

    }

    function move(param) {
        // 利用transform属性做到移动
        ele.style.transform = "translate3d(" + param.x + "px, " + param.y + "px, 0)"
    }
