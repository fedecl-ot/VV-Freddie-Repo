/*
	Script Name:   FormatTime
	Customer:      VisualVault
	Purpose:       The purpose of this function is to take a time string entered in any format and format it into a standard of HH:MM AM or HH:MM PM.
	Parameters:    The following represent variables passed into the function:
				   -passedString: string value that represents the time
				  
	Return Value:  The following represents the value being returned from this function:
                   -passedString: string value (In case format is not applyable)
                   -stringTime: string value   (In case format is applyable)
    
	Date of Dev: 06/22/2022
	Last Rev Date: 06/22/2022
	Revision Notes:
				06/22/2022 - Franco Petosa Ayala: Initial creation of the business process.
*/

//verify the string contains "AM/PM/:"
let stringTime = passedString.toUpperCase();
let isAM = stringTime.includes("AM");
let isPM = stringTime.includes("PM");
const isColon = stringTime.includes(":");

//build the string array based on the timeString digits
let stringArr = stringTime.split("")
stringArr = stringArr.filter(digit => {
  if(!isNaN(digit) && digit != " "){
    return true
  }else if(digit == ":"){
     return true
  }else{
    return false
  }
})

//verify is not an empty array
if(stringArr.length === 0){
    return passedString
}

//build the string time only with time logical simbols: numbers and ":"
stringTime = stringArr.join("")

let hour = '';
let minutes = '';
  
if(isColon){ // expected passed parameter value: HH:MM

    hour = stringTime.split(":")[0]; //catch hour digits
    minutes = stringTime.split(":")[1]; //catch minutes digits

}else if(stringTime.length === 4){ // expected passed parameter value: HHMM
  
    //verify is valid military time format HHMM
    if(parseFloat(stringTime) > 2400){
        return passedString
    }
  
    //In military time format the 2 first digit corresponds to the hour and the other last 2 to the minutes
    hour = stringTime[0] + stringTime[1] ; //catch hour digits
    minutes = stringTime[2] + stringTime[3]; //catch minutes digits
  
}else if(isAM || isPM){ // expected stringTime value: HH
    hour = stringTime;
    minutes = '00';
}else{
    //In this case it is assumed that the passedString value is not a valid string time
    return passedString
}

//verify is valid hour and minute format HH / MM
if(hour === "" || minutes === ""){
    return passedString
}else if(hour.length > 2 || minutes.length > 2){
    return passedString
}

//verify the hour has a logical value between 0 and 23
if(parseFloat(hour) >= 24){
    return passedString
}
  
//verify the minutes have a logical value between 0 and 59
if(parseFloat(minutes) >= 60){
    return passedString
}
  
//build the string time formated

//if AM/PM is missing it can still be assumed by the hour
if(!isAM && !isPM && parseFloat(hour) < 12){
    isAM = true;
}else if(!isAM && !isPM && parseFloat(hour) >= 12){
    isPM = true;
}
  
//format hour to HH
if(parseFloat(hour) < 10){
    hour = `0${parseFloat(hour)}`;
}else if(parseFloat(hour) >= 12 && parseFloat(hour) < 22){
    hour = `0${parseFloat(hour)-12}`;
}else if(parseFloat(hour) >= 22){
    hour = `${parseFloat(hour)-12}`;
}

//format hour to MM
if(parseFloat(minutes) < 10){
    minutes = `0${parseFloat(minutes)}`;
}else if(minutes === undefined){
    minutes = `00`;
}
  
//concat AM or PM to stringTime 
if(isAM){
    stringTime = `${hour}:${minutes} AM`
}else if(isPM){
    stringTime = `${hour}:${minutes} PM`
}

return stringTime

