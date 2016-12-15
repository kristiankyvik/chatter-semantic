import Identicon from 'identicon.js';

const getAvatarSvg = function (userId) {
  if (!userId) return null;
  return new Identicon(userId).toString();
};

export {getAvatarSvg};

