(function() {
  var global = this;
  require.load = function (context, moduleName, url) {
    url = chrome.extension.getURL(url);

    if (location.protocol == 'chrome-extension:') { // background page
      var script = document.createElement('script');
      script.setAttribute("src", url);
      script.onload = function() {
        context.completeLoad(moduleName);
      };
      document.body.appendChild(script);
    } else { // content script
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url + '?r=' + new Date().getTime(), true);
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          eval.call(global, xhr.responseText + '\n//@ sourceURL=' + url);
          context.completeLoad(moduleName);
        }
      };
      xhr.send(null);
    }  
  };
})();