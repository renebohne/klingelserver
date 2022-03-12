var udp = require('dgram');


var mqtt = require('mqtt')

var lastMessageTimestamp= Date.now();


function  sendMQTT(klingelId, buttonId, batteryLevel)
{
var client  = mqtt.connect('mqtt://192.168.100.110:1883');
client.on('connect', function () {
      client.publish('klingel/'+klingelId+'/event', ''+buttonId);
client.publish('klingel/'+klingelId+'/battery',''+batteryLevel);
  });
}


// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error',function(error){
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message',function(msg,info){
var receiveTimestamp= Date.now();

  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
for(i=0; i<msg.length; i++)
{
console.log(""+msg[i]);
}

//sending msg
server.send(msg,info.port,info.address,function(error){
  if(error){
    client.close();
  }else{
    console.log('Data sent !!!');
  }

});

if((receiveTimestamp - lastMessageTimestamp) > 3000)
{

lastMessageTimestamp = receiveTimestamp;

  if(msg.length==5)
  {
    sendMQTT(msg[0], msg[1],msg[4]);
 }
}
});

//emits when socket is ready and listening for datagram msgs
server.on('listening',function(){
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
  console.log('Socket is closed !');
});

server.bind(2222);
