import Identicon from 'identicon.js';
import {TimeSync} from "meteor/mizzao:timesync";

const identiconOptions = {
  background: [255, 255, 255, 255],         // rgba white
  margin: 0.2,                              // 20% margin
};

const getAvatarSvg = function (userId) {
  if (!userId) return null;
  return new Identicon(userId, identiconOptions).toString();
};

const getRelativeTime = function (timeAgo) {
  diff = moment.utc(TimeSync.serverTime() - timeAgo);
  time = diff.format("H:mm:ss");
  days = + diff.format("DDD") - 1;
  ago = days ? days + "d " : "";
  return "Last logged in " + ago + time + " ago";
};

const getUserStatus = function (user) {
  const userHasStatus = user.hasOwnProperty("status");
  const isOnline = userHasStatus ? user.status.online : false;
  const userHasLastLoginDate = userHasStatus && user.status.hasOwnProperty("lastLogin");
  const lastLogin = userHasLastLoginDate ? getRelativeTime(user.status.lastLogin.date) : "User is offline";
  return {
    isOnline,
    lastLogin
  };
};

export {getAvatarSvg, getRelativeTime, getUserStatus};

