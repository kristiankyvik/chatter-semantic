import Identicon from 'identicon.js';

const getAvatarSvg = function(username) {
  return new Identicon(username).toString();
};

export {getAvatarSvg};

