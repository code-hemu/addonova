const API = (() => {
  if (typeof browser !== 'undefined') return browser;
  if (typeof chrome !== 'undefined') return chrome;
  throw new Error('Extension API not found');
})();

const LINKS = {
    "support": API.runtime.getManifest().homepage_url,
    "review": "https://addons.opera.com/en/extensions/details/volume-booster-increase-sound/",
    "facebook": "https://www.facebook.com/codehemu/",
    "youtube": "https://www.youtube.com/@CodeHemu",
    "twitter": "https://x.com/CodeHemu"
};

