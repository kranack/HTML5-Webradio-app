$(document).ready(function() {
	var request = navigator.mozApps.checkInstalled("http://i.sa.123.fr/uploads/webradio-app/manifest.webapp");
	request.onsuccess = function() {
	  if (!request.result) {
	    var request_install = navigator.mozApps.install("http://i.sa.123.fr/uploads/webradio-app/manifest.webapp");
		request_install.onsuccess = function() {
		  alert('Application successfully installed');
		};
		request_install.onerror = function() {
			alert('Error installing application: ' + this.error.name);
		};
	  }
	};
	request.onerror = function() {
	  alert('Error checking installation status: ' + this.error.message);
	};
});