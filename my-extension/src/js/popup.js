document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('heading').textContent =
    chrome.i18n.getMessage('extensionName');
  document.getElementById('description').textContent =
    chrome.i18n.getMessage('extensionDescription');
});
