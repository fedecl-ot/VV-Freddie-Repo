/*
	Script Name:   FormatCurrency
	Customer:      VisualVault
	Purpose:       The purpose of this function is to take a time string entered in any format and format it into a standard of HH:MM AM or HH:MM PM.
	Parameters:    The following represent variables passed into the function:
				   -timeVal: string value that represents the time
				  
	Return Value:  The following represents the value being returned from this function:
                   -newTimeStr: string value
                   -timeVal: string value
    
	Date of Dev: Unknown
	Last Rev Date: 06/22/2022
	Revision Notes:
				Unknown - Unknown: Initial creation of the business process.
                06/22/2022 - Franco Petosa Ayala - Update to ES6.
*/

//Get values from the original value passed to the function.
const colonPlacement = timeVal.search(":")
timeVal = timeVal.toUpperCase();
const isAM = timeVal.includes('AM');
const isPM = timeVal.includes('PM');

//Remove all characters
const s2 = ("" + timeVal).replace(/\D/g, '');

let newTimeStr = '';
//If colon was present, format the string.
if (colonPlacement > 0) {
    newTimeStr = s2.substr(0, colonPlacement) + ":" + s2.substr(colonPlacement, 2);
}
else {
    //Handle what occurs if a colon was not present.
    if (s2.length < 3) {
        //return when not enough characters were entered, time check will communicate the format.  
        return timeVal;
    }
    else if (s2.length == 3) {
        //Attempt to put the colon after the first character.
        newTimeStr = "0" + s2.substr(0, 1) + ":" + s2.substr(1, 2);
    }
    else if (s2.length ==4) {
        //Attempt to put the colon after the second character.
        newTimeStr = s2.substr(0, 2) + ":" + s2.substr(2, 2);
    }
    else if (s2.length > 4) {
        //Too many characters were entered, time check will communicate the format.
        return timeVal;
    }
}

//Add the time of day back into the string.
if (isAM) {
    newTimeStr = newTimeStr + " AM";
}
else if (isPM) {
    newTimeStr = newTimeStr + " PM";
}

return newTimeStr;