var RENDERER = {
    POINT_INTERVAL: 5,
    FISH_COUNT: 9,
    MAX_INTERVAL_COUNT: 50,
    INIT_HEIGHT_RATE: 0.5,
    THRESHOLD: 50,
    init: function() {
        this.setParameters();
        this.reconstructMethods();
        this.setup();
        this.bindEvent();
        this.render()
    },
    setParameters: function() {
        this.$window = $(window);
        this.$container = $("#jsi-flying-fish-container");
        this.$canvas = $("<canvas />");
        this.context = this.$canvas.appendTo(this.$container).get(0).getContext("2d");
        this.points = [];
        this.fishes = [];
        this.watchIds = []
    },
    createSurfacePoints: function() {
        var a = Math.round(this.width / this.POINT_INTERVAL);
        this.pointInterval = this.width / (a - 1);
        this.points.push(new SURFACE_POINT(this,0));
        for (var b = 1; b < a; b++) {
            var c = new SURFACE_POINT(this,b * this.pointInterval)
              , d = this.points[b - 1];
            c.setPreviousPoint(d);
            d.setNextPoint(c);
            this.points.push(c)
        }
    },
    reconstructMethods: function() {
        this.watchWindowSize = this.watchWindowSize.bind(this);
        this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
        this.startEpicenter = this.startEpicenter.bind(this);
        this.moveEpicenter = this.moveEpicenter.bind(this);
        this.reverseVertical = this.reverseVertical.bind(this);
        this.render = this.render.bind(this)
    },
    setup: function() {
        this.points.length = 0;
        this.fishes.length = 0;
        this.watchIds.length = 0;
        this.intervalCount = this.MAX_INTERVAL_COUNT;
        this.width = this.$container.width();
        this.height = this.$container.height();
        this.fishCount = this.FISH_COUNT * this.width / 500 * this.height / 500;
        this.$canvas.attr({
            width: this.width,
            height: this.height
        });
        this.reverse = false;
        this.fishes.push(new FISH(this));
        this.createSurfacePoints()
    },
    watchWindowSize: function() {
        this.clearTimer();
        this.tmpWidth = this.$window.width();
        this.tmpHeight = this.$window.height();
        this.watchIds.push(setTimeout(this.jdugeToStopResize, this.WATCH_INTERVAL))
    },
    clearTimer: function() {
        while (this.watchIds.length > 0) {
            clearTimeout(this.watchIds.pop())
        }
    },
    jdugeToStopResize: function() {
        var c = this.$window.width()
          , a = this.$window.height()
          , b = (c == this.tmpWidth && a == this.tmpHeight);
        this.tmpWidth = c;
        this.tmpHeight = a;
        if (b) {
            this.setup()
        }
    },
    bindEvent: function() {
        this.$window.on("resize", this.watchWindowSize);
        this.$container.on("mouseenter", this.startEpicenter);
        this.$container.on("mousemove", this.moveEpicenter)
    },
    getAxis: function(a) {
        var b = this.$container.offset();
        return {
            x: a.clientX - b.left + this.$window.scrollLeft(),
            y: a.clientY - b.top + this.$window.scrollTop()
        }
    },
    startEpicenter: function(a) {
        this.axis = this.getAxis(a)
    },
    moveEpicenter: function(b) {
        var a = this.getAxis(b);
        if (!this.axis) {
            this.axis = a
        }
        this.generateEpicenter(a.x, a.y, a.y - this.axis.y);
        this.axis = a
    },
    generateEpicenter: function(c, d, b) {
        if (d < this.height / 2 - this.THRESHOLD || d > this.height / 2 + this.THRESHOLD) {
            return
        }
        var a = Math.round(c / this.pointInterval);
        if (a < 0 || a >= this.points.length) {
            return
        }
        this.points[a].interfere(d, b)
    },
    reverseVertical: function() {
        this.reverse = !this.reverse;
        for (var b = 0, a = this.fishes.length; b < a; b++) {
            this.fishes[b].reverseVertical()
        }
    },
    controlStatus: function() {
        for (var b = 0, a = this.points.length; b < a; b++) {
            this.points[b].updateSelf()
        }
        for (var b = 0, a = this.points.length; b < a; b++) {
            this.points[b].updateNeighbors()
        }
        if (this.fishes.length < this.fishCount) {
            if (--this.intervalCount == 0) {
                this.intervalCount = this.MAX_INTERVAL_COUNT;
                this.fishes.push(new FISH(this))
            }
        }
    },
    render: function() {
        requestAnimationFrame(this.render);
        this.controlStatus();
        this.context.clearRect(0, 0, this.width, this.height);
        var datatheme = document.documentElement.getAttribute("data-theme");
        if (datatheme === 'light') {
            this.context.fillStyle = '#F7F9FE';
        } else {
            this.context.fillStyle = '#181C27';
        }
        for (var b = 0, a = this.fishes.length; b < a; b++) {
            this.fishes[b].render(this.context)
        }
        this.context.save();
        this.context.globalCompositeOperation = "xor";
        this.context.beginPath();
        this.context.moveTo(0, this.reverse ? 0 : this.height);
        for (var b = 0, a = this.points.length; b < a; b++) {
            this.points[b].render(this.context)
        }
        this.context.lineTo(this.width, this.reverse ? 0 : this.height);
        this.context.closePath();
        this.context.fill();
        this.context.restore()
    }
};
var SURFACE_POINT = function(a, b) {
    this.renderer = a;
    this.x = b;
    this.init()
};
SURFACE_POINT.prototype = {
    SPRING_CONSTANT: 0.03,
    SPRING_FRICTION: 0.9,
    WAVE_SPREAD: 0.3,
    ACCELARATION_RATE: 0.01,
    init: function() {
        this.initHeight = this.renderer.height * this.renderer.INIT_HEIGHT_RATE;
        this.height = this.initHeight;
        this.fy = 0;
        this.force = {
            previous: 0,
            next: 0
        }
    },
    setPreviousPoint: function(a) {
        this.previous = a
    },
    setNextPoint: function(a) {
        this.next = a
    },
    interfere: function(b, a) {
        this.fy = this.renderer.height * this.ACCELARATION_RATE * ((this.renderer.height - this.height - b) >= 0 ? -1 : 1) * Math.abs(a)
    },
    updateSelf: function() {
        this.fy += this.SPRING_CONSTANT * (this.initHeight - this.height);
        this.fy *= this.SPRING_FRICTION;
        this.height += this.fy
    },
    updateNeighbors: function() {
        if (this.previous) {
            this.force.previous = this.WAVE_SPREAD * (this.height - this.previous.height)
        }
        if (this.next) {
            this.force.next = this.WAVE_SPREAD * (this.height - this.next.height)
        }
    },
    render: function(a) {
        if (this.previous) {
            this.previous.height += this.force.previous;
            this.previous.fy += this.force.previous
        }
        if (this.next) {
            this.next.height += this.force.next;
            this.next.fy += this.force.next
        }
        a.lineTo(this.x, this.renderer.height - this.height)
    }
};
var FISH = function(a) {
    this.renderer = a;
    this.init()
};
FISH.prototype = {
    GRAVITY: 0.4,
    init: function() {
        this.direction = Math.random() < 0.5;
        this.x = this.direction ? (this.renderer.width + this.renderer.THRESHOLD) : -this.renderer.THRESHOLD;
        this.previousY = this.y;
        this.vx = this.getRandomValue(4, 10) * (this.direction ? -1 : 1);
        if (this.renderer.reverse) {
            this.y = this.getRandomValue(this.renderer.height * 1 / 10, this.renderer.height * 4 / 10);
            this.vy = this.getRandomValue(2, 5);
            this.ay = this.getRandomValue(0.05, 0.2)
        } else {
            this.y = this.getRandomValue(this.renderer.height * 6 / 10, this.renderer.height * 9 / 10);
            this.vy = this.getRandomValue(-5, -2);
            this.ay = this.getRandomValue(-0.2, -0.05)
        }
        this.isOut = false;
        this.theta = 0;
        this.phi = 0
    },
    getRandomValue: function(b, a) {
        return b + (a - b) * Math.random()
    },
    reverseVertical: function() {
        this.isOut = !this.isOut;
        this.ay *= -1
    },
    controlStatus: function(a) {
        this.previousY = this.y;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.ay;
        if (this.renderer.reverse) {
            if (this.y > this.renderer.height * this.renderer.INIT_HEIGHT_RATE) {
                this.vy -= this.GRAVITY;
                this.isOut = true
            } else {
                if (this.isOut) {
                    this.ay = this.getRandomValue(0.05, 0.2)
                }
                this.isOut = false
            }
        } else {
            if (this.y < this.renderer.height * this.renderer.INIT_HEIGHT_RATE) {
                this.vy += this.GRAVITY;
                this.isOut = true
            } else {
                if (this.isOut) {
                    this.ay = this.getRandomValue(-0.2, -0.05)
                }
                this.isOut = false
            }
        }
        if (!this.isOut) {
            this.theta += Math.PI / 20;
            this.theta %= Math.PI * 2;
            this.phi += Math.PI / 30;
            this.phi %= Math.PI * 2
        }
        this.renderer.generateEpicenter(this.x + (this.direction ? -1 : 1) * this.renderer.THRESHOLD, this.y, this.y - this.previousY);
        if (this.vx > 0 && this.x > this.renderer.width + this.renderer.THRESHOLD || this.vx < 0 && this.x < -this.renderer.THRESHOLD) {
            this.init()
        }
    },
    render: function(a) {
        a.save();
        a.translate(this.x, this.y);
        a.rotate(Math.PI + Math.atan2(this.vy, this.vx));
        a.scale(1, this.direction ? 1 : -1);
        a.beginPath();
        a.moveTo(-30, 0);
        a.bezierCurveTo(-20, 15, 15, 10, 40, 0);
        a.bezierCurveTo(15, -10, -20, -15, -30, 0);
        a.fill();
        a.save();
        a.translate(40, 0);
        a.scale(0.9 + 0.2 * Math.sin(this.theta), 1);
        a.beginPath();
        a.moveTo(0, 0);
        a.quadraticCurveTo(5, 10, 20, 8);
        a.quadraticCurveTo(12, 5, 10, 0);
        a.quadraticCurveTo(12, -5, 20, -8);
        a.quadraticCurveTo(5, -10, 0, 0);
        a.fill();
        a.restore();
        a.save();
        a.translate(-3, 0);
        a.rotate((Math.PI / 3 + Math.PI / 10 * Math.sin(this.phi)) * (this.renderer.reverse ? -1 : 1));
        a.beginPath();
        if (this.renderer.reverse) {
            a.moveTo(5, 0);
            a.bezierCurveTo(10, 10, 10, 30, 0, 40);
            a.bezierCurveTo(-12, 25, -8, 10, 0, 0)
        } else {
            a.moveTo(-5, 0);
            a.bezierCurveTo(-10, -10, -10, -30, 0, -40);
            a.bezierCurveTo(12, -25, 8, -10, 0, 0)
        }
        a.closePath();
        a.fill();
        a.restore();
        a.restore();
        this.controlStatus(a)
    }
};
$(function() {
    RENDERER.init()
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