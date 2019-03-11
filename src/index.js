import { EventEmitter } from 'events';
import template from './light-player.ejs';
import './light-player.less';

import playIcon from './assets/play.svg';
import pauseIcon from './assets/pause.svg';
import volumeIcon from './assets/volume.svg';

function isPlainObject(o) {
  if (typeof o !== 'object' || o === null) {
    return false;
  }
  let proto = o;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return proto === Object.getPrototypeOf(o);
}

const debounce = (fn, delay) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

function resolveConstructorOpts(opts) {
  if (!isPlainObject(opts)) {
    throw new Error(
      `Invalid options. Options must be undefined or a plain object but got ${opts}`
    );
  }
  if (opts.el && opts.el.src) {
    opts.src = opts.el.src;
  }
  if (!opts.src) {
    throw new Error(`Invalid options. Cannot resolve src:${opts.src}`);
  }
  const m = /\.(\w+)(?:\?|#|$)/.exec(opts.src);
  if (m) {
    opts.type = m[1];
  }
  if (!opts.type) {
    throw new Error(`Invalid options. Cannot resolve type:${opts.type}`);
  }
  return opts;
}

const defaultLightPlayerConstructorOpts = {
  acceptVideoType: /mp4|m3u8|flv/,
  acceptAudioType: /mp3/,
  attrs: [],
  playIcon,
  pauseIcon,
  volumeIcon,
  volume: 1,
  progress: 0,
  autoplay: false
};

function initView(player) {
  const $$el = player.$$el;
  const $$controls = player.$$el.querySelector('.controls-bar');
  const $$media = player.$$el.querySelector('.media-elem');
  const $$playBtn = player.$$el.querySelector('.play-btn');
  const $$pauseBtn = player.$$el.querySelector('.pause-btn');
  const $$opts = player.$$opts;

  player.$$controls = $$controls;
  player.$$media = $$media;
  player.$$playBtn = $$playBtn;
  player.$$pauseBtn = $$pauseBtn;
}

function initEvent(player) {
  player.$$media.addEventListener('play', function(e) {
    player.$$playBtn.style.display = 'none';
    player.$$pauseBtn.style.display = 'block';
  });

  player.$$media.addEventListener('pause', function(e) {
    player.$$playBtn.style.display = 'block';
    player.$$pauseBtn.style.display = 'none';
  });

  if (player.$$opts.autoplay) {
    function onLoadedMetaData(e) {
      player.$$media.removeEventListener('loadedmetadata', onLoadedMetaData);
      player.$$media.play();
    }
    player.$$media.addEventListener('loadedmetadata', onLoadedMetaData);
  }

  player.$$playBtn.addEventListener('click', function(e) {
    player.$$media.play();
  });

  player.$$pauseBtn.addEventListener('click', function(e) {
    player.$$media.pause();
  });
}

function initPlay(player) {
  const $$media = player.$$media;
  const $$opts = player.$$opts;
  let mime;
  if ($$opts.acceptAudioType.test($$opts.type)) {
    mime = 'audio/';
  } else {
    mime = 'video/';
  }
  mime += $$opts.type;
  if ($$media.canPlayType(mime)) {
    $$media.src = $$opts.src;
  }
}

/**
 * @param {Object} opts - LightPlayerConstructorConfig
 * @param {string} opts.src - 播放地址
 * @param {string} opts.type - 视频格式。当播放地址未能明显指出格式时，需要传入type字段指定格式
 * @param {boolean} opts.autoplay - 自动播放
 */

let id = 0;

class LightPlayerConstructor extends EventEmitter {
  constructor(el, _opts) {
    const opts = Object.assign({}, defaultLightPlayerConstructorOpts, _opts);
    if (typeof el === 'string') {
      el = document.querySelector(el);
    }
    if (!el) {
      throw new Error(`no elem match your selector`);
    }
    super();

    this.$$id = ++id;
    this.$$opts = resolveConstructorOpts(opts);
    const htmlStr = template(opts);
    el.innerHTML = htmlStr;
    this.$$el = el;

    initView(this);
    initEvent(this);
    initPlay(this);

    console.log(this);
  }
}

export default LightPlayerConstructor;

new LightPlayerConstructor('#light-player', {
  src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
  autoplay: true
});
