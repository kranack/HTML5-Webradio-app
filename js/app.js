/************************************
 *
 *	@file=app.js
 *	@author=Damien Calesse
 *
 ************************************/


reloadPlayer(POOL_DATA_RADIOS[POOL_CURRENT_RADIO]['address']);

var comet = new Comet();
comet.setDatas(POOL_DATA_RADIOS[POOL_CURRENT_RADIO]['id'], POOL_DATA_RADIOS[POOL_CURRENT_RADIO]['name'], POOL_DATA_SERVERS[POOL_CURRENT_RADIO]['address'], SERVER_URL+'onAir.php');
comet.connect();

$('chooseRadio').observe('blur', function(event) {
  POOL_CURRENT_RADIO = this.value;
  var val = POOL_DATA_RADIOS[POOL_CURRENT_RADIO]['address'];
  
  // Set new value in storage
  saveRadio(POOL_CURRENT_RADIO);
  reloadPlayer(val);

  comet.setDatas(POOL_DATA_RADIOS[POOL_CURRENT_RADIO]['id'], POOL_DATA_RADIOS[POOL_CURRENT_RADIO]['name'], POOL_DATA_SERVERS[POOL_CURRENT_RADIO]['address'], SERVER_URL+'onAir.php');
  comet.connect();
});