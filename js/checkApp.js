var isFFOS = ("mozApps" in navigator && navigator.userAgent.search("Mobile") != -1);

if ( isFFOS ) {
  var manifestUrl = 'http://www.kranack.ovh/uploads/webradio-app/manifest.webapp';
  var req = navigator.mozApps.installPackage(manifestUrl);
  req.onsuccess = function() {
    console.log(this.result.origin);
  };
  req.onerror = function() {
    console.log(this.error.name);
  };
}