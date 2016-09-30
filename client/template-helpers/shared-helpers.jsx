import Identicon from 'identicon.js';

const getAvatarSvg = function(username) {
  if (!username) return null;
  return new Identicon(username).toString();
};

export {getAvatarSvg};

