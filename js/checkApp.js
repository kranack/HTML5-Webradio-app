var isFFOS = ("mozApps" in navigator && navigator.userAgent.search("Mobile") != -1);

if ( isFFOS ) {
  var manifestUrl = 'http://i.sa.123.fr/uploads/webradio-app/manifest.webapp';
  var check = navigator.mozApps.checkInstalled(manifestUrl);
  check.onerror = function(e) {
	  alert("Error calling checkInstalled: " + check.error.name);
	};
	check.onsuccess = function(e) {
	  if (check.result) {
	    console.log("App is already installed!");
	  }
	  else {
	    var req = navigator.mozApps.install(manifestUrl);
		  req.onsuccess = function() {
		    console.log(this.result.origin);
		  };
		  req.onerror = function() {
		    console.log(this.error.name);
		  };
	  }
	};
}