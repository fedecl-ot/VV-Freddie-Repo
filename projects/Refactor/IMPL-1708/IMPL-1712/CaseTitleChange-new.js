/*
    Script Name:   CaseTitleChange
    Customer:      VisualVault
    Purpose:       This global function modifies a passed string as parameter to a specific format and returns it
                   Ex: 'JOHN-SMITH' --> John-Smith
                       'JOHN SMITH' --> John Smith
                       'john-smith' --> John-Smith
                       'john - smith' --> John-Smith
                       'john   -smith' --> John-Smith
    Parameters:    The following represent variables passed into the function:  
                   -str: string value (required)
    Return Value:  The following represents the value being returned from this function:
                    -newStr: string value formatted
    Date of Dev: 
    Last Rev Date:
    Last Update: 20/05/2022 - Franco Petosa Ayala 
    Revision Notes:
*/

let newStr = str.trim().toLowerCase(); //deletes blank spaces and lower cases the letters
let strArr = []; //will contain each word of the str string as an item
const hyphenIncluded = str.includes('-'); //returns true or false

//build up the str array Ex:[jhon,smith]
if(hyphenIncluded){
    strArr = newStr.split('-');
}else {
    strArr = newStr.split(' ');
}

//upper case the first letter of each word, except for blank spaces 
const newStrArr = strArr.map( word => {
    const cleanWord = word.trim(); //in case there is an internal blank space Ex: ' smith'
    if( cleanWord != '') {
        const letterUpperCased = cleanWord[0].toUpperCase(); //upper case first letter
        const newWord = letterUpperCased + cleanWord.substring(1); //concats upper cased first letter with the rest of the word
        return newWord
    }
})

//build the new formated string
if(hyphenIncluded){
    newStr = newStrArr.join('-'); // Ex: Jhon-Smith
}else {
    newStr = newStrArr.join(' '); // Ex: Jhon Smith
}

return newStr