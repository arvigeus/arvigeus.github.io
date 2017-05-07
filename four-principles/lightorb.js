function LightOrb(elem, position, overflow) {
  elem = $(elem);
  overflow = overflow === true || overflow == "true";
  var self = this,
    active,
    Radius,
    radius, //Default and current radius
    FontSize,
    fontSize, //Default and current font size
    outerWrapper,
    innerWrapper,
    shadow = new TimelineMax({ repeat: -1, yoyo: true }),
    shadowR;

  this.getActive = function() {
    return active;
  };

  this.setActive = function(state) {
    var x = state ? position.x : -9999;
    var y = state ? position.y : -9999;
    var display = state ? "inline-block" : "none";
    outerWrapper.css({
      left: x,
      top: y,
      display: display
    });
    active = state;
  };

  this.getRadius = function() {
    return parseInt(innerWrapper.css("border-radius"), 10);
  };

  function resize(params, callback) {
    function checkSizeOverflow() {
      if (innerWrapper[0].scrollWidth > innerWrapper.innerWidth() * 0.7) {
        t = t / r * (innerWrapper[0].scrollWidth / 2 - r);
        radius = r = innerWrapper[0].scrollWidth / 2;
        TweenLite.fromTo(
          innerWrapper,
          t,
          { width: 2 * radius, height: 2 * radius },
          { width: 2 * r, height: 2 * r }
        );
      }
    }
    var r = Number(params.radius) || Radius, t = Number(params.time) || 0.75;
    if (r < 10) r = 10;
    if (isNaN(params.x)) params.x = position.x + r;
    if (isNaN(params.y)) params.y = position.y + r;
    var fontSize = {
      start: 20 + radius / Radius * 80 + "%",
      end: r / Radius * 100 + "%"
    };
    var opacity, overflow;
    if (r == 10) {
      opacity = [1, 0.3];
      overflow = "hidden";
    } else {
      opacity = [0.3, 1];
      overflow = "visible";
    }

    position = self.getProperCoords(params.x, params.y, r);
    var currPos = { x: position.x - radius, y: position.y - radius };

    TweenLite.fromTo(
      elem,
      t,
      { opacity: opacity[0], fontSize: fontSize.start },
      { opacity: opacity[1], fontSize: fontSize.end, overflow: overflow }
    );
    TweenLite.fromTo(
      innerWrapper,
      t,
      { width: 2 * radius, height: 2 * radius },
      { width: 2 * r, height: 2 * r, onComplete: checkSizeOverflow }
    );
    TweenLite.fromTo(
      outerWrapper,
      t,
      { left: currPos.x, top: currPos.y },
      { left: position.x - r, top: position.y - r, onComplete: callback }
    );

    radius = r;
  }

  function leave(callback) {
    var directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"], coords = [];

    var wh = $(window).height(), ww = $(window).width(), pxs = ww / 2000; //pixel per second
    for (var i = 0; i <= 2; i++) {
      var dir, x, y, cx, cy, tmp;
      var speed;
      //Set initial/continual values
      if (i === 0) {
        dir = directions[getRandom(0, 7)];
        cx = parseInt(innerWrapper.offset().left, 10);
        cy = parseInt(innerWrapper.offset().top, 10);
      } else {
        dir = directions.indexOf(coords[i - 1].direction);
        dir += getRandom(0, 100) % 2 ? -1 : 1;
        if (dir < 0) dir += directions.length;
        else if (dir >= directions.length) dir -= directions.length;
        dir = directions[dir];
        cx = coords[i - 1].x;
        cy = coords[i - 1].y;
      }

      switch (dir) {
        case "n":
          x = cx;
          y = getRandom(cy / 3, cy);
          speed = y / pxs;
          break;
        case "ne":
          tmp = ww - cx;
          if (cy < tmp) tmp = cy;
          tmp = Math.sqrt(2 * Math.pow(tmp, 2));
          tmp = Math.sqrt(Math.pow(getRandom(tmp / 3, tmp), 2) / 2);
          x = cx + tmp;
          y = cy - tmp;
          speed = tmp / pxs;
          break;
        case "e":
          tmp = ww - cx;
          tmp = getRandom(tmp / 3, tmp);
          x = cx + tmp;
          y = cy;
          speed = tmp / pxs;
          break;
        case "se":
          tmp = ww - cx;
          if (wh - cy < tmp) tmp = wh - cy;
          tmp = Math.sqrt(2 * Math.pow(tmp, 2));
          tmp = getRandom(tmp / 3, tmp);
          tmp = Math.sqrt(Math.pow(tmp, 2) / 2);
          x = cx + tmp;
          y = cy + tmp;
          speed = tmp / pxs;
          break;
        case "s":
          tmp = wh - cy;
          tmp = getRandom(tmp / 3, tmp);
          x = cx;
          y = cy + tmp;
          speed = tmp / pxs;
          break;
        case "sw":
          tmp = wh - cy;
          if (cx < tmp) tmp = cx;
          tmp = Math.sqrt(2 * Math.pow(tmp, 2));
          tmp = getRandom(tmp / 3, tmp);
          tmp = Math.sqrt(Math.pow(tmp, 2) / 2);
          x = cx - tmp;
          y = cy + tmp;
          speed = tmp / pxs;
          break;
        case "w":
          x = getRandom(cx / 3, cx);
          y = cy;
          speed = x / pxs;
          break;
        case "nw":
          tmp = cx < cy ? cx : cy;
          tmp = Math.sqrt(2 * Math.pow(tmp, 2));
          tmp = Math.sqrt(Math.pow(getRandom(tmp / 3, tmp), 2) / 2);
          x = cx - tmp;
          y = cy - tmp;
          speed = tmp / pxs;
      }

      if (i == 2) {
        if (/w/.test(dir)) x = -2 * radius;
        else if (/e/.test(dir)) x = ww + 2 * radius;
        if (/n/.test(dir)) y = -2 * radius;
        else if (/s/.test(dir)) y = wh + 2 * radius;
      }

      coords.push({
        x: x,
        y: y,
        speed: speed / 1000,
        direction: dir
      });
    }

    new TimelineLite()
      .to(outerWrapper, coords[0].speed, {
        left: coords[0].x,
        top: coords[0].y
      })
      .to(outerWrapper, coords[1].speed, {
        left: coords[1].x,
        top: coords[1].y
      })
      .to(outerWrapper, coords[2].speed, {
        left: coords[2].x,
        top: coords[2].y,
        onComplete: callback
      });
  }

  this.getProperCoords = function(cx, cy, r) {
    if (isNaN(r)) r = Radius;
    var winWidth = $(window).width(),
      winHeight = $(window).height(),
      padding = 40;
    if (cx + r + padding > winWidth) cx -= cx + r + padding - winWidth;
    if (cy + r + padding > winHeight) cy -= cy + r + padding - winHeight;
    if (cx < r) cx = r;
    if (cy < r) cy = r;
    return { x: cx, y: cy };
  };

  this.animate = function(animation, params, callback) {
    if (!active) return;
    if (params === undefined) params = {};
    else if (typeof params == "function") {
      callback = params;
      params = {};
    } else if (typeof callback != "function") callback = function() {};

    switch (animation) {
      case "expand":
        radius = 10;
        resize(params, callback);
        break;
      case "shrink":
        if (isNaN(params.radius)) params.radius = 10;
        resize(params, callback);
        break;
      case "shine":
        break;
      case "leave":
        leave(callback);
        break;
    }
  };

  function constructor() {
    elem.addClass("light-orb content");

    //Wrap classes to object
    if (!elem.parent().hasClass("light-orb inner-wrapper")) {
      elem.wrap('<div class="light-orb inner-wrapper"></div>');
    }
    innerWrapper = elem.parent();

    if (!innerWrapper.parent().hasClass("light-orb outer-wrapper")) {
      innerWrapper.wrap('<div class="light-orb outer-wrapper"></div>');
    }
    outerWrapper = innerWrapper.parent();

    //Make circle
    var area = Math.sqrt(elem.width() * elem.height());

    //Additional rounding
    elem.css({
      width: area,
      height: "auto"
    });
    area = Math.sqrt(elem.width() * elem.height());

    //Length of diagonal from the center to the edge of the element
    Radius = radius =
      Math.sqrt(Math.pow(area / 2, 2) + Math.pow(area / 2, 2)) + 20;
    FontSize = fontSize = parseInt(elem.css("font-size"), 10);

    if (!position) position = {};
    if (!position.x) position.x = outerWrapper.offset().left;
    if (!position.y) position.y = outerWrapper.offset().top;
    position.x = parseInt(position.x, 10);
    position.y = parseInt(position.y, 10);

    elem.css({
      width: "70%",
      height: "70%"
    });

    innerWrapper.css({
      width: 2 * radius,
      height: 2 * radius
    });
    outerWrapper.css("position", "absolute");

    outerWrapper.css({
      left: position.x,
      top: position.x,
      position: "absolute"
    });
  }

  constructor();
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
