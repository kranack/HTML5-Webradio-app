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


require(['classes'], function() {
	require(['app']);
});