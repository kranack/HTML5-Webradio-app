/************************************
 *
 *	@file=functions.js
 *	@author=Damien Calesse
 *
 ************************************/


function setToLowerCase (str) {
	return (str) ? str.toLowerCase() : '';
}

function displayDebug(message) {
	return (DEBUG) ? console.debug(message) : false;
}

function saveRadio(radio) {
	localStorage.setItem("radio", radio);
}

function getRadio() {
	if (localStorage.getItem("radio") == null) {
		saveRadio(0);
		return 0;
	} else {
		return localStorage.getItem("radio");
	}
}

function reloadPlayer(value) {
	$('player').writeAttribute('src', value);
	$('player').load();
	$('player').play();
}

require(['classes'], function() {
	setTimeout(function() {require(['app']);}, 500);
});