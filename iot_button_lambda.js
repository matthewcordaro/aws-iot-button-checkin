'use strict';

const AWS = require('aws-sdk');
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

// !!CHANGE THIS!! Enter your phone number. Include country and area code.
const PHONE_NUMBER = '1-555-555-5555'; 

exports.handler = (event, context, callback) => {
    
    // Messages for single click, double click and long click
    const singleClick = 'Short Press Alert! UTC: ';
    const doubleClick = 'Double Press Alert! UTC: ';
    const longClick = 'Long Press Alert! UTC: ';
    
    console.log('Received event:', event);

    console.log(`Sending SMS to ${PHONE_NUMBER}`);

    var currentTime = new Date();
    // NOTE: all Lambda functions run on UTC

    var currentHour = currentTime.getHours();
    var currentMin =  currentTime.getMinutes();
    var currentSec =  currentTime.getSeconds();

    var localHour;
    var absLocalTimeZone;

    // !!CHANGE THIS!! Enter difference in hours between your local time and UTC. 
    var localTimeZone = 0;
    /* Example: For PST (UTC -7), enter -7. For CET (UTC +1), enter 1. 
    NOTE: Timezones with half and quarter hour offset such as IST are not supported. Enter nearest timezone with full hour offset, or enter 0 to keep it in UTC
    NOTE 2.0: Do not try to enter invalid timezone values like numbers > 12, or letters. Your code will NOT work, you have been warned! */

    // UTC to local timezone conversion
    if (localTimeZone < 0){
        absLocalTimeZone = localTimeZone * (-1);
        if(currentHour >= 0 && currentHour < absLocalTimeZone){
            localHour = currentHour + localTimeZone +24;
        }
        if(currentHour >= absLocalTimeZone && currentHour < 24){
            localHour = currentHour + localTimeZone;
        }
    }

    else if (localTimeZone > 0){
        if(currentHour >= 0 && currentHour < (24 - localTimeZone)){
            localHour = currentHour + localTimeZone;
        }
        if(currentHour >= (24 - localTimeZone) && currentHour < 24){
            localHour = currentHour + localTimeZone - 24;
        }
    }

    else{
        localHour = currentHour;
    }

    // Convert minutes to 2 digits. eg: 5 to 05
    if (currentMin.toString().length == 1) {
            currentMin = "0" + currentMin;
    }

    // Convert seconds to 2 digits. eg: 5 to 05
    if (currentSec.toString().length == 1) {
            currentSec = "0" + currentSec;
    }

    // Construct time in proper format
    var currentLocalTime = localHour + ':' + currentMin + ':' + currentSec;
    
    // Default is single click
    var smsMessage = singleClick + currentLocalTime;
    
    // If button clicked twice
    if(event.clickType == "DOUBLE"){
        smsMessage = doubleClick + currentLocalTime;
    }

    // If button long pressed
    if(event.clickType == "LONG"){
        smsMessage = longClick + currentLocalTime;
    }
    
    const params = {
        PhoneNumber: PHONE_NUMBER,
        Message: smsMessage,
    };
    // Result will go to function callback
    SNS.publish(params, callback);
};
