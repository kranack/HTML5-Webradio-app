/************************************
 *
 *	@file=aap.js
 *	@author=Damien Calesse
 *
 ************************************/
var POOL_CURRENT_RADIO = 0;
var POOL_DATA_RADIOS = null;
var POOL_DATA_SERVERS = null;
var SERVER_URL = "http://i.sa.123.fr/uploads/webradio-server/";
var SERVER_URL_LIB = "http://i.sa.123.fr/uploads/webradio-server/lib/";

$(document).ready(function() {
	var regex = /^[a-zA-Z0-9\-]*.mp3/;
	
	// Initialize the player
	RADIO_PLAYER.init();
	
	$("#chooseRadio").blur(function() {
		POOL_CURRENT_RADIO = $(this).val();
		var val = POOL_DATA_RADIOS[POOL_CURRENT_RADIO].address;
		
		//POOL_SERVER = $(this).children(":selected").attr('id');
		$("#player").attr("src", val);
		//$("#player").attr("autoplay", autoplay);
		RADIO_PLAYER.onAir();
	});
});

var CHRONOS = function() {
	return {
		init : function() {
			setInterval(function() {
				RADIO_PLAYER.onAir();
			},	30000);
		}
	}

}();

var DATAS = function() {
	return {
		getRadiosList : function() {
			$.ajax({
				dataType: 'json',
				url: './radios.json',
				success: function(data) {
					POOL_DATA_RADIOS = data.radios;
					// Display the radios list
					RADIO_PLAYER.displayRadios();
					// Get infos from the radio playing
					RADIO_PLAYER.onAir();
				}
			});
		},
		getServersList : function() {
			$.ajax({
				dataType: 'json',
				url: './servers.json',
				success: function(data) {
					POOL_DATA_SERVERS = data.servers;
				}
			});
		}
	}
}();

var RADIO_PLAYER = function(){
	return {
		init: function(){
			// Get the servers list
			DATAS.getServersList();
			
			// Get and display the radio list
			DATAS.getRadiosList();
			
			// Set the display refresh on
			CHRONOS.init();

			RADIO_PLAYER.radioPlayerContainer = $("#player");
			RADIO_PLAYER.radioPlayer = RADIO_PLAYER.radioPlayerContainer[0];
			
			RADIO_PLAYER.btnPlay = $("#btn_play");
			RADIO_PLAYER.btnPause = $("#btn_pause");
			RADIO_PLAYER.btnStop = $("#btn_stop");
			RADIO_PLAYER.btnVolLess = $("#btn_vol_less");
			RADIO_PLAYER.btnVolMore = $("#btn_vol_more");
			
			RADIO_PLAYER.btnPrev = $('#btn_prev');
            RADIO_PLAYER.btnNext = $('#btn_next');
			
            $('#controls a').click(function(e){
				return false;
            });
			
			RADIO_PLAYER.btnPlay.click(
				function(){
					RADIO_PLAYER.radioPlayer.play();
					return false;
				}
			);
			
			RADIO_PLAYER.btnPause.click(
				function(){
					RADIO_PLAYER.radioPlayer.pause();
					return false;
				}
			);
			
			RADIO_PLAYER.btnStop.click(
				function(){
					RADIO_PLAYER.radioPlayer.pause();
					RADIO_PLAYER.radioPlayer.currentTime = 0;
					return false;
				}
			);
			
			RADIO_PLAYER.btnVolLess.click(
				function(){
					var vol = RADIO_PLAYER.radioPlayer.volume;
					vol-=0.2;
					if (vol<0) vol=0;
					RADIO_PLAYER.radioPlayer.volume = vol;
					return false;
				}
			);
			
			RADIO_PLAYER.btnVolMore.click(
				function(){
					var vol = RADIO_PLAYER.radioPlayer.volume;
					vol+=0.2;
					if (vol>1) vol=1;
					RADIO_PLAYER.radioPlayer.volume = vol;
					return false;
				}
			);
			
			 RADIO_PLAYER.radioPlayerContainer.bind('play', function() {
				RADIO_PLAYER.btnPlay.hide();
				RADIO_PLAYER.btnPause.show();
            });

            RADIO_PLAYER.radioPlayerContainer.bind('pause', function() {
				RADIO_PLAYER.btnPlay.show();
				RADIO_PLAYER.btnPause.hide();
            });
		},
		onAir : function() {
			$.ajax({
				dataType: 'json',
				url: SERVER_URL_LIB+'onAir.php',
				type: 'POST',
				data: 'server='+POOL_DATA_RADIOS[POOL_CURRENT_RADIO].id+'&address='+POOL_DATA_SERVERS[POOL_CURRENT_RADIO].address,
				success: function(r) {
					switch (POOL_DATA_RADIOS[POOL_CURRENT_RADIO].id) {
						case 'chillstep' :
							var art_inf = r.now_playing.artist.split("-");
							$("#infos").html(art_inf[1]+'-'+r.now_playing.track);
							$("#radio").html(art_inf[0]);
							break;
						default :
							if (r.now_playing.emission)
								if(r.now_playing.animateur)
									if (r.now_playing.track == null)
										$("#infos").html('<b>'+r.now_playing.emission+'</b> avec '+r.now_playing.animateur+'<br>'+setToLowerCase(r.now_playing.artist));
									else
										$("#infos").html('<b>'+r.now_playing.emission+'</b> avec '+r.now_playing.animateur+'<br>'+setToLowerCase(r.now_playing.artist)+'-'+r.now_playing.track);
								else
									if (r.now_playing.track == null)
										$("#infos").html('<b>'+r.now_playing.emission+'</b> <br>'+setToLowerCase(r.now_playing.artist));
									else
										$("#infos").html('<b>'+r.now_playing.emission+'</b> <br>'+setToLowerCase(r.now_playing.artist)+'-'+r.now_playing.track);
							else
								if (r.now_playing.track == 'null')
									$("#infos").html(setToLowerCase(r.now_playing.artist));
								else
									$("#infos").html(setToLowerCase(r.now_playing.artist)+'-'+r.now_playing.track);
							$("#radio").html(POOL_DATA_RADIOS[POOL_CURRENT_RADIO].name);
							break;
					}
					
					if (r.now_playing.cover)
						$("#cover").html('<a href="http://www.google.com/search?q='+setToLowerCase(r.now_playing.artist)+'" target="_blank" ><img src="'+r.now_playing.cover+'" alt/></a>');
					else
						$("#cover").html('');					
				}
			});
		},
		displayRadios : function() {
			var list = "";
			var normalList = "";
			for (var i=0; i<POOL_DATA_RADIOS.length; i++){
				list +='<option id="'+POOL_DATA_RADIOS[i].id+'" value="'+i+'" >';
				list +=POOL_DATA_RADIOS[i].name;
				list +='</option>';
				
				normalList +='<p id="'+POOL_DATA_RADIOS[i].id+'" value="'+i+'" >';
				normalList +=POOL_DATA_RADIOS[i].name;
				normalList +='</p>';
			}
			$("#chooseRadio").html(list);		
		}
	}
}();