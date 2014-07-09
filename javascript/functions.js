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
	return (DEBUG) ? console.log(message) : false;
}