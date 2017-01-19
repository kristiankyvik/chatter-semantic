import Identicon from 'identicon.js';

const getAvatarSvg = function (userId) {
  if (!userId) return null;
  return new Identicon(userId).toString();
};

const getRelativeTime = function (timeAgo) {
  diff = moment.utc(TimeSync.serverTime() - timeAgo);
  time = diff.format("H:mm:ss");
  days = + diff.format("DDD") - 1;
  ago = days ? days + "d " : "";
  return "Last logged in " + ago + time + " ago";
};

export {getAvatarSvg, getRelativeTime};

