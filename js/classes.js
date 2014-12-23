/*----------- Config ----------------------*/

var DEBUG = 0;
var POOL_CURRENT_RADIO = getRadio();
var POOL_DATA_RADIOS = [];
var POOL_DATA_SERVERS = [];
var SERVER_URL = "http://i.sa.123.fr/uploads/webradio-server/";

// -----------------------------------------


      /************************************
       *
       *    Classes Definition
       *
       ***********************************/


      var Comet = Class.create();
      Comet.prototype = {

        server: '',
        address: '',
        name: '',
        url: '',
        noerror: true,
        current_track: '',

        initialize: function() {},

        setDatas: function(server, name, address, url)
        { 
          this.server = server;
          this.address = address;
          this.name = name;
          this.url = url;
          displayDebug('Comet initialized');
        },

        connect: function()
        {
          this.ajax = new Ajax.Request(this.url, {
            method: 'GET',
            parameters: { 'server' : this.server, 'address' : this.address, 'current_track': this.current_track },
            onSuccess: function(transport) {
              // handle the server response
                displayDebug('OK : '+transport.responseText);
                var response = transport.responseText.evalJSON();
                this.comet.current_track = response['now_playing']['track'];
                displayDebug('current_track : '+response['now_playing']['track']);
                this.comet.handleResponse(response);
                displayDebug('OK : Handle response');
                this.comet.noerror = true;
                displayDebug('OK : set noerror to true');
            },
            onFailure: function(transport) { console.log(transport.status +': Something went wrong'); },
            onComplete: function(transport) {
              // send a new ajax request when this request is finished

              if (!this.comet.noerror) {
                // if a connection problem occurs, try to reconnect each 5 seconds
                setTimeout(function(){ comet.connect() }, 5000); 
               displayDebug('Error : set Timeout');
              }
              else {
                this.comet.connect();
               displayDebug('Connect again');
              }
              this.comet.noerror = false;
            }
          });
          this.ajax.comet = this;
        },

        disconnect: function()
        {
        	this.ajax.comet = null;
        	this.ajax = null;
        },

        handleResponse: function(response)
        {
          $('radio').innerHTML = this.name;
          $('infos').innerHTML = this.parseResponse(response);
        },

        parseResponse: function(response)
        {
          var r = '';
          displayDebug('DEBUT PARSEREPONSE');
          
          if (response['now_playing']['emission']) {
            displayDebug('EMISSION == TRUE');
            if(response['now_playing']['animateur']) {
              displayDebug('ANIMATEUR == TRUE');
              if (response['now_playing']['track'] == '')
                r = '<b>'+response['now_playing']['emission'] + '</b> avec ' + response['now_playing']['animateur'] + '<br>' + setToLowerCase(response['now_playing']['artist']);
              else
                r = '<b>'+response['now_playing']['emission'] + '</b> avec '+response['now_playing']['animateur'] + '<br>' + setToLowerCase(response['now_playing']['artist']) + ' - ' + response['now_playing']['track'];
            } else {
              displayDebug('ANIMATEUR == FALSE');
              if (response['now_playing']['track'] == '')
                r = '<b>' + response['now_playing']['emission'] + '</b> <br>' + setToLowerCase(response['now_playing']['artist']);
              else
                r = '<b>' + response['now_playing']['emission'] + '</b> <br>' + setToLowerCase(response['now_playing']['artist']) + ' - ' + response['now_playing']['track'];
            }
          } else {
            displayDebug('EMISSION == FALSE');
            if (response['now_playing']['track'] == '')
              r = setToLowerCase(response['now_playing']['artist']);
            else
              r = setToLowerCase(response['now_playing']['artist']) + ' - ' + response['now_playing']['track'];
          }

          if (response['now_playing']['cover'])
            $('cover').innerHTML = '<a href="http://www.google.com/search?q=' + setToLowerCase(response['now_playing']['artist']) + '" target="_blank" ><img src="' + response['now_playing']['cover'] + '" alt/></a>';
          else
            $('cover').innerHTML = '';

          return r;
        }
      };

      var Datas = Class.create();
      Datas.prototype = {
        initialize: function() {},
        getRadiosList : function() {
          this.ajax = new Ajax.Request('./radios.json', {
              method: 'GET',
              onSuccess: function(transport) {
                data = transport.responseText.evalJSON();
                POOL_DATA_RADIOS = data['radios'];
              },
              onFailure: function(transport) { console.log('GET RADIOS LIST: Something went wrong'); },
              
            });
        },
        getServersList : function() {
          this.ajax = new Ajax.Request('./servers.json', {
              method: 'GET',
              onSuccess: function(transport) {
                data = transport.responseText.evalJSON();
                POOL_DATA_SERVERS = data['servers'];
              },
              onFailure: function(transport) { console.log('GET SERVERS LIST: Something went wrong'); },
              
            });
        }
      };

      var Player = Class.create();
      Player.prototype = {

        radioPlayerContainer: null,
        radioPlayer: null,
        btnPlay: null,
        btnPause: null,
        btnStop: null,
        btnVolLess: null,
        btnVolMore: null,

        initialize: function() {

          this.btnPlay = $('btn_play');
          this.btnPause = $('btn_pause');
          this.btnStop = $('btn_stop');
          this.btnVolLess = $('btn_vol_less');
          this.btnVolMore = $('btn_vol_more');

          this.btnPlay.hide();
          this.btnPause.hide();
          this.btnPause.hide();
          this.btnStop.hide();
          this.btnVolLess.hide();
          this.btnVolMore.hide();

        },
        displayRadios : function()
        {
          var list = '';
          for (var i=0; i<POOL_DATA_RADIOS.length; i++){
            if (POOL_CURRENT_RADIO == i)
              list +='<option id="'+POOL_DATA_RADIOS[i]['id']+'" value="'+i+'" selected>';
            else
              list +='<option id="'+POOL_DATA_RADIOS[i]['id']+'" value="'+i+'" >';
            list +=POOL_DATA_RADIOS[i]['name'];
            list +='</option>';
          }
          $("chooseRadio").innerHTML = list;
        }
      };

var datas = new Datas();
datas.getServersList();
datas.getRadiosList();
var player = new Player();
player.displayRadios.delay(1);

