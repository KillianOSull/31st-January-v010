//MQTT broker dashboard available at 	http://www.hivemq.com/demos/websocket-client/
var mqtt = require('mqtt')
//var mqttClient  = mqtt.connect('mqtt://broker.mqttdashboard.com');
/*
var options = {
  //port: 8000,
  clientId: 'mqttjs_1998',
  username: "Killian",
  password: "pass",
};
*/

const host = 'mqtt://broker.mqttdashboard.com'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

var mqttClient  = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectionTimeout: 4000,
  username: 'killian',
  password: 'pass',
  reconnectPeriod: 1000,
})

var topicToPublishTo="topic/Notifications"											//creates a topic to publish to
var topicToSubscribeTo="topic/Commands"

const deviceOfInterest = 'CC:0C:27:E4:90:EC'									//mac address of device

const buttonServiceOfInterestUuid = '00000001-0002-0003-0004-0x2000' 					//uuid of button service
const buttonACharacteristicOfInterestUuid = '00000001-0002-0003-0004-0x2001' 				//uuid of read/notify characteristic of button A service
const buttonBCharacteristicOfInterestUuid = '00000001-0002-0003-0004-0x2002' 				//uuid of read/notify characteristic of button B service

const ledServiceOfInterestUuid = '00000001-0002-0003-0004-000000003000' 					//uuid of LED service
const ledCharacteristicOfInterestUuid = '00000001-0002-0003-0004-000000003001' 					//uuid of read/write characteristic of LED service

var buttonChar;													//variable actuatorChat
var ledChar;
											//variable notifychar
mqttClient.on('connect', connectCallback); 

function connectCallback() {
   console.log("connected to cloud MQTT broker");
   mqttClient.subscribe(topicToSubscribeTo, mqttSubscribeCallback);						//call error when subscribing
   mqttClient.publish(topicToPublishTo, '- Publish "Commands" to see all the commands available', publishCallback);	//publish a message to the topic specified above
   mqttClient.publish(topicToPublishTo, '- To Send commands to the security system, please publish to "topic/Commands"', publishCallback);//publish a message to the topic specified above
   mqttClient.publish(topicToPublishTo, '- To Recieve Notificeations, please subscribe to "topic/Notifications"', publishCallback);//publish a message to the topicspecified above
   mqttClient.publish(topicToPublishTo, '- Hello and Welcome', publishCallback);		//publish a message to the topic specified above
}


//********************************Error-checking-functions********************************//
function mqttSubscribeCallback(error, granted) { 									//callback error or granted when subscribing to topic 		
   	if (error) {
		console.log("error subscribing to topic");								//prints error
	}
	else {	
		console.log("subscribed to and awaiting messages on topic '" + topicToSubscribeTo + "'");		//prints success	
        }
}		
function publishCallback(error) {    										//callback error or granted when publishing to broker     
   	if (error) {
		console.log("error publishing data");									//prints error
	} 
	else {	 
        console.log("Message is published to topic '" + topicToPublishTo+ "'");						//prints on console success on publishing to broker
        //mqttClient.end(); // Close the connection to the broker when published
    	}
}
//********************************Error-checking-functions********************************//

const main = async() => { 											//main function
console.log('Start of programme')
mqttClient.on('message', messageEventHandler);

/*													
  	const {createBluetooth}=require('node-ble') 								//nodejs ble module/library
  	const { bluetooth, destroy } = createBluetooth()							//get bluetooth adapter
  	const adapter = await bluetooth.defaultAdapter() 							//get an available Bluetooth adapter
  	//if(!await adapter.isDiscovering()){
  	   await adapter.startDiscovery() 									//using the adapter, start a device discovery session  
  	//}
  	console.log('Discovering')										//prints on command line
  	
  	device = await adapter.waitDevice(deviceOfInterest)						//usese devices specified mac addess from top of programme
  	console.log('got device', await device.getAddress())							//await device.getAddress())
  	const deviceName = await device.getName()								//gets the name of the device
  	console.log('got device remote name', deviceName)							//prints on command line
  	console.log('got device user friendly name', await device.toString())					//prints on command line
  	console.log('Device: [', deviceName , '] is within range')

  	await adapter.stopDiscovery() 										//stops looking for devices
  	console.log("Stopping Discovery")
  														//connect to the specific device
  	device.connect()
  	console.log("Connected to device: " + deviceName)
  
  	const gattServer = device.gatt()
  	console.log("Im here")
  	//services = await gattServer.services(buttonServiceOfInterestUuid)
	//console.log("services are " + services)
  	
  	if (gattServer.includes(buttonServiceOfInterestUuid)) {
  		console.log('got the Button service')
  		const primaryService = await gattServer.getPrimaryService(buttonServiceOfInterestUuid)	
	 	buttonChar = await primaryService.getCharacteristic(buttonACharacteristicOfInterestUuid)  	//uuid of read/write characteristic of LED service
	}
  /*
  	if(device.connect() == 'true'){
  	   console.log("connected to device : " + deviceName)
  	}							//prints on command line
  	
  	await new Promise(resolve => setTimeout(resolve, 10000))						//waits 1 min
  	
  	await device.disconnect()
  	destroy()
  	console.log('disconnected')
  */	


//***********************************Publishing-commands**********************************//
async function messageEventHandler(topic, message, packet) {
        
	if(message.toString().toLowerCase() == "commands"){
		mqttClient.publish(topicToPublishTo,"- report", publishCallback);
		mqttClient.publish(topicToPublishTo,"- arm", publishCallback);
		mqttClient.publish(topicToPublishTo,"- disarm", publishCallback);
		mqttClient.publish(topicToPublishTo,"- unlock", publishCallback);
		mqttClient.publish(topicToPublishTo,"- lock", publishCallback);
		mqttClient.publish(topicToPublishTo,"The Commands are as follows:", publishCallback);
		mqttClient.publish(topicToPublishTo,'The message Published is "Commands"', publishCallback);
	}
	else if(message.toString().toLowerCase() == "lock"){
		mqttClient.publish(topicToPublishTo,'The doors are locked"', publishCallback);
		mqttClient.publish(topicToPublishTo,'The message Published is "Lock"', publishCallback);
	}
	else if(message.toString().toLowerCase() == "unlock"){
		mqttClient.publish(topicToPublishTo,'The doors are unlocked"', publishCallback);
		mqttClient.publish(topicToPublishTo,'The message Published is "Unlock"', publishCallback);
	}
	else if(message.toString().toLowerCase() == "arm"){
		mqttClient.publish(topicToPublishTo,'The system is armed', publishCallback);
		mqttClient.publish(topicToPublishTo,'The message Published is "Arm"', publishCallback);
	}
	else if(message.toString().toLowerCase() == "disarm"){
		mqttClient.publish(topicToPublishTo,'The system is disarmed', publishCallback);
		mqttClient.publish(topicToPublishTo,'The message Published is "Disarm"', publishCallback);
	}
	else if(message.toString().toLowerCase() == "report"){
		mqttClient.publish(topicToPublishTo,'The system Report is', publishCallback);
		mqttClient.publish(topicToPublishTo,'The message Published is "Report"', publishCallback);
	}
	else{
	mqttClient.publish(topicToPublishTo,"Invalid Command", publishCallback);
	}  
   }


//***********************************Publishing-commands**********************************//	
	
} 	
main()
  .then()
   .catch(console.error)
