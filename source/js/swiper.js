var mySwiper = new Swiper ('.hometop-swiper', {
    direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    effect: 'creative',
    mousewheel: true,
    autoplay:true,
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.hometop-swiper-button-next',
      prevEl: '.hometop-swiper-button-prev',
    },
})