var RENDERER = {
    POINT_INTERVAL : 5,
    FISH_COUNT : 9,
    MAX_INTERVAL_COUNT : 40,
    INIT_HEIGHT_RATE : 0.5,
    THRESHOLD : 50,
    
    init : function(){
        this.setParameters();
        this.reconstructMethods();
        this.setup();
        this.bindEvent();
        this.render();
    },
    setParameters : function(){
        this.$window = window;
        this.$document = document.body
        this.$container = document.getElementById('jsi-flying-fish-container');
        this.$canvas = document.createElement('canvas');
        this.$container.appendChild(this.$canvas)
        this.context = this.$canvas.getContext('2d');
        this.points = [];
        this.fishes = [];
        this.watchIds = [];
    },
    createSurfacePoints : function(){
        var count = Math.round(this.width / this.POINT_INTERVAL);
        this.pointInterval = this.width / (count - 1);
        this.points.push(new SURFACE_POINT(this, 0));
        
        for(var i = 1; i < count; i++){
            var point = new SURFACE_POINT(this, i * this.pointInterval),
                previous = this.points[i - 1];
                
            point.setPreviousPoint(previous);
            previous.setNextPoint(point);
            this.points.push(point);
        }
    },
    reconstructMethods : function(){
        this.watchWindowSize = this.watchWindowSize.bind(this);
        this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
        this.startEpicenter = this.startEpicenter.bind(this);
        this.moveEpicenter = this.moveEpicenter.bind(this);
        this.reverseVertical = this.reverseVertical.bind(this);
        this.render = this.render.bind(this);
    },
    setup : function(){
        this.points.length = 0;
        this.fishes.length = 0;
        this.watchIds.length = 0;
        this.intervalCount = this.MAX_INTERVAL_COUNT;
        this.width = this.$container.offsetWidth;
        this.height = this.$container.offsetHeight;
        this.fishCount = this.FISH_COUNT * this.width / 500 * this.height / 500;
        this.$canvas.width = this.width;
        this.$canvas.height = this.height;
        this.reverse = false;
        
        this.fishes.push(new FISH(this));
        this.createSurfacePoints();
    },
    watchWindowSize : function(){
        this.clearTimer();
        this.tmpWidth = this.$window.width;
        this.tmpHeight = this.$window.height;
        this.watchIds.push(setTimeout(this.jdugeToStopResize, this.WATCH_INTERVAL));
    },
    clearTimer : function(){
        while(this.watchIds.length > 0){
            clearTimeout(this.watchIds.pop());
        }
    },
    jdugeToStopResize : function(){
        var width = this.$window.width(),
            height = this.$window.height(),
            stopped = (width == this.tmpWidth && height == this.tmpHeight);
            
        this.tmpWidth = width;
        this.tmpHeight = height;
        
        if(stopped){
            this.setup();
        }
    },
    bindEvent : function(){
        
        this.$window.onresize = this.watchWindowSize;
        this.$container.onmouseenter = this.startEpicenter;
        this.$container.addEventListener('onmousemove', this.moveEpicenter);
        
    },
    getAxis : function(event){
 
        var offset = this.getOffset(this.$container);
        return {
            x : event.clientX - offset.left + this.$document.scrollLeft,
            y : event.clientY - offset.top + this.$document.scrollTop
        };
    },
 
    getOffset: function(Node, offset) {    
        if (!offset) {        
              offset = {};
              offset.top = 0; 
              offset.left = 0;
        }
        if (Node == document.body) {
                //当该节点为body节点时，结束递归        
                return offset;   
         }
        offset.top += Node.offsetTop;    offset.left += Node.offsetLeft;
        return this.getOffset(Node.parentNode, offset);//向上累加offset里的值
    },
    startEpicenter : function(event){
        this.axis = this.getAxis(event);
    },
    moveEpicenter : function(event){
        var axis = this.getAxis(event);
        
        if(!this.axis){
            this.axis = axis;
        }
        this.generateEpicenter(axis.x, axis.y, axis.y - this.axis.y);
        this.axis = axis;
    },
    generateEpicenter : function(x, y, velocity){
        if(y < this.height / 2 - this.THRESHOLD || y > this.height / 2 + this.THRESHOLD){
            return;
        }
        var index = Math.round(x / this.pointInterval);
        
        if(index < 0 || index >= this.points.length){
            return;
        }
        this.points[index].interfere(y, velocity);
    },
    reverseVertical : function(){
        this.reverse = !this.reverse;
    },
    controlStatus : function(){
        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].updateSelf();
        }
        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].updateNeighbors();
        }
        if(this.fishes.length < this.fishCount){
            if(--this.intervalCount == 0){
                this.intervalCount = this.MAX_INTERVAL_COUNT;
                this.fishes.push(new FISH(this));
            }
        }
    },
    render : function(){
        var datatheme = document.documentElement.getAttribute("data-theme");
        requestAnimationFrame(this.render);
        this.controlStatus();
        this.context.clearRect(0, 0, this.width, this.height);
        if (datatheme === 'light') {
            this.context.fillStyle = '#F7F9FE';
        } else {
            this.context.fillStyle = '#181C27';
        }
        
        for(var i = 0, count = this.fishes.length; i < count; i++){
            this.fishes[i].render(this.context);
        }
        this.context.save();
        this.context.globalCompositeOperation = 'xor';
        this.context.beginPath();
        this.context.moveTo(0, this.reverse ? 0 : this.height);
        
        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].render(this.context);
        }
        this.context.lineTo(this.width, this.reverse ? 0 : this.height);
        this.context.closePath();
        this.context.fill();
        this.context.restore();
    }
};
var SURFACE_POINT = function(renderer, x){
    this.renderer = renderer;
    this.x = x;
    this.init();
};
SURFACE_POINT.prototype = {
    SPRING_CONSTANT : 0.03,
    SPRING_FRICTION : 0.9,
    WAVE_SPREAD : 0.3,
    ACCELARATION_RATE : 0.01,
    
    init : function(){
        this.initHeight = this.renderer.height * this.renderer.INIT_HEIGHT_RATE;
        this.height = this.initHeight;
        this.fy = 0;
        this.force = {previous : 0, next : 0};
    },
    setPreviousPoint : function(previous){
        this.previous = previous;
    },
    setNextPoint : function(next){
        this.next = next;
    },
    interfere : function(y, velocity){
        this.fy = this.renderer.height * this.ACCELARATION_RATE * ((this.renderer.height - this.height - y) >= 0 ? -1 : 1) * Math.abs(velocity);
    },
    updateSelf : function(){
        this.fy += this.SPRING_CONSTANT * (this.initHeight - this.height);
        this.fy *= this.SPRING_FRICTION;
        this.height += this.fy;
    },
    updateNeighbors : function(){
        if(this.previous){
            this.force.previous = this.WAVE_SPREAD * (this.height - this.previous.height);
        }
        if(this.next){
            this.force.next = this.WAVE_SPREAD * (this.height - this.next.height);
        }
    },
    render : function(context){
        if(this.previous){
            this.previous.height += this.force.previous;
            this.previous.fy += this.force.previous;
        }
        if(this.next){
            this.next.height += this.force.next;
            this.next.fy += this.force.next;
        }
        context.lineTo(this.x, this.renderer.height - this.height);
    }
};
var FISH = function(renderer){
    this.renderer = renderer;
    this.init();
};
FISH.prototype = {
    GRAVITY : 0.4,
    
    init : function(){
        this.direction = Math.random() < 0.5;
        this.x = this.direction ? (this.renderer.width + this.renderer.THRESHOLD) : -this.renderer.THRESHOLD;
        this.previousY = this.y;
        this.vx = this.getRandomValue(4, 10) * (this.direction ? -1 : 1);
        
        if(this.renderer.reverse){
            this.y = this.getRandomValue(this.renderer.height * 1 / 10, this.renderer.height * 4 / 10);
            this.vy = this.getRandomValue(2, 5);
            this.ay = this.getRandomValue(0.05, 0.2);
        }else{
            this.y = this.getRandomValue(this.renderer.height * 6 / 10, this.renderer.height * 9 / 10);
            this.vy = this.getRandomValue(-5, -2);
            this.ay = this.getRandomValue(-0.2, -0.05);
        }
        this.isOut = false;
        this.theta = 0;
        this.phi = 0;
    },
    getRandomValue : function(min, max){
        return min + (max - min) * Math.random();
    },
    reverseVertical : function(){
        this.isOut = !this.isOut;
        this.ay *= -1;
    },
    controlStatus : function(context){
        this.previousY = this.y;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.ay;
        
        if(this.renderer.reverse){
            if(this.y > this.renderer.height * this.renderer.INIT_HEIGHT_RATE){
                this.vy -= this.GRAVITY;
                this.isOut = true;
            }else{
                if(this.isOut){
                    this.ay = this.getRandomValue(0.05, 0.2);
                }
                this.isOut = false;
            }
        }else{
            if(this.y < this.renderer.height * this.renderer.INIT_HEIGHT_RATE){
                this.vy += this.GRAVITY;
                this.isOut = true;
            }else{
                if(this.isOut){
                    this.ay = this.getRandomValue(-0.2, -0.05);
                }
                this.isOut = false;
            }
        }
        if(!this.isOut){
            this.theta += Math.PI / 20;
            this.theta %= Math.PI * 2;
            this.phi += Math.PI / 30;
            this.phi %= Math.PI * 2;
        }
        this.renderer.generateEpicenter(this.x + (this.direction ? -1 : 1) * this.renderer.THRESHOLD, this.y, this.y - this.previousY);
        
        if(this.vx > 0 && this.x > this.renderer.width + this.renderer.THRESHOLD || this.vx < 0 && this.x < -this.renderer.THRESHOLD){
            this.init();
        }
    },
    render : function(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(Math.PI + Math.atan2(this.vy, this.vx));
        context.scale(1, this.direction ? 1 : -1);
        context.beginPath();
        context.moveTo(-30, 0);
        context.bezierCurveTo(-20, 15, 15, 10, 40, 0);
        context.bezierCurveTo(15, -10, -20, -15, -30, 0);
        context.fill();
        
        context.save();
        context.translate(40, 0);
        context.scale(0.9 + 0.2 * Math.sin(this.theta), 1);
        context.beginPath();
        context.moveTo(0, 0);
        context.quadraticCurveTo(5, 10, 20, 8);
        context.quadraticCurveTo(12, 5, 10, 0);
        context.quadraticCurveTo(12, -5, 20, -8);
        context.quadraticCurveTo(5, -10, 0, 0);
        context.fill();
        context.restore();
        
        context.save();
        context.translate(-3, 0);
        context.rotate((Math.PI / 3 + Math.PI / 10 * Math.sin(this.phi)) * (this.renderer.reverse ? -1 : 1));
        
        context.beginPath();
        
        if(this.renderer.reverse){
            context.moveTo(5, 0);
            context.bezierCurveTo(10, 10, 10, 30, 0, 40);
            context.bezierCurveTo(-12, 25, -8, 10, 0, 0);
        }else{
            context.moveTo(-5, 0);
            context.bezierCurveTo(-10, -10, -10, -30, 0, -40);
            context.bezierCurveTo(12, -25, 8, -10, 0, 0);
        }
        context.closePath();
        context.fill();
        context.restore();
        context.restore();
        this.controlStatus(context);
    }
};
$(function(){
	RENDERER.init();
});

function clickEffect() {
  let balls = [];
  let longPressed = false;
  let longPress;
  let multiplier = 0;
  let width, height;
  let origin;
  let normal;
  let ctx;
  const colours = ["#214EC2", "#3E83E1", "#66A7DD", "#3E83E1"];
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 9999999; position: fixed; pointer-events: none;");
  const pointer = document.createElement("span");
  pointer.classList.add("pointer");
  document.body.appendChild(pointer);
 
  if (canvas.getContext && window.addEventListener) {
    ctx = canvas.getContext("2d");
    updateSize();
    window.addEventListener('resize', updateSize, false);
    loop();
    window.addEventListener("mousedown", function(e) {
      pushBalls(randBetween(10, 20), e.clientX, e.clientY);
      document.body.classList.add("is-pressed");
      longPress = setTimeout(function(){
        document.body.classList.add("is-longpress");
        longPressed = true;
      }, 500);
    }, false);
    window.addEventListener("mouseup", function(e) {
      clearInterval(longPress);
      document.body.classList.remove("is-pressed");
    }, false);
    window.addEventListener("mousemove", function(e) {
      let x = e.clientX;
      let y = e.clientY;
      pointer.style.top = y + "px";
      pointer.style.left = x + "px";
    }, false);
  } else {
    console.log("canvas or addEventListener is unsupported!");
  }
 
 
  function updateSize() {
    canvas.width = window.innerWidth * 1;
    canvas.height = window.innerHeight * 1;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(1, 1);
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
    origin = {
      x: width / 2,
      y: height / 2
    };
    normal = {
      x: width / 2,
      y: height / 2
    };
  }
  class Ball {
    constructor(x = origin.x, y = origin.y) {
      this.x = x;
      this.y = y;
      this.angle = Math.PI * 2 * Math.random();
      this.multiplier = randBetween(6, 12);
      this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
      this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
      this.r = randBetween(5, 9) + 3 * Math.random();
      this.color = colours[Math.floor(Math.random() * colours.length)];
    }
    update() {
      this.x += this.vx - normal.x;
      this.y += this.vy - normal.y;
      normal.x = -2 / window.innerWidth * Math.sin(this.angle);
      normal.y = -2 / window.innerHeight * Math.cos(this.angle);
      this.r -= 0.3;
      this.vx *= 0.83;
      this.vy *= 0.83;
    }
  }
 
  function pushBalls(count = 17, x = origin.x, y = origin.y) {
    for (let i = -10; i < count; i++) {
      balls.push(new Ball(x, y));
    }
  }
 
  function randBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
 
  function loop() {
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (b.r < 0) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
      ctx.fill();
      b.update();
    }
    multiplier -= 0.4;
    removeBall();
    requestAnimationFrame(loop);
  }
 
  function removeBall() {
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
        balls.splice(i, 1);
      }
    }
  }
}
clickEffect();