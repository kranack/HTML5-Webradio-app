/************************************
 *
 *	@file=storage.js
 *	@author=Damien Calesse
 *
 ************************************/

function saveRadio(radio) {
	localStorage.setItem("radio", radio);
}

function getRadio() {
	return localStorage.getItem("radio");
}