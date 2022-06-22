/*
    Script Name:   CaseTitleChange
    Customer:      VisualVault
    Purpose:       this function upper-cases every first letter and lower-cases the rest of the string passed as parameter
                   without modifying the position of the hyphens (in case an hyphen is included). 
                   Note: Any letter after white spaces or hyphens is considered as a first letter and will be upper-cased. 
                   e.g: 'JOHN-DOE' --> John-Doe
                        'JOHN DOE' --> John Doe
                        'john-smith' --> John-Doe
                        'john - doe' --> John-Doe
                        'john   -doe' --> John-Doe
    Parameters:    The following represent variables passed into the function:  
                   -str: string value (required)
    Return Value:  The following represents the value being returned from this function:
                    -newStr: string value formatted (At the end of the script)
    Date of Dev: 05/20/2022
    Last Rev Date: 05/20/2022
    Revision Notes:
    05/20/2022 - Franco Petosa Ayala: Initial creation of the business process.
    05/20/2022 - Franco Petosa Ayala: Update to ES6.
*/

let newStr = str.trim().toLowerCase(); //deletes white spaces and lower cases the letters
let strArr = []; //will contain each word of the str string as an item
const hyphenIncluded = str.includes('-'); //verify if there is an hyphen included in the passed string

//build up the str array e.g: [jhon,smith]
if (hyphenIncluded) {
    strArr = newStr.split('-');
} else {
    strArr = newStr.split(' ');
}

//upper case the first letter of each word, except for white spaces
const newStrArr = strArr.map((word) => {
    const cleanWord = word.trim(); //in case there is an internal white space e.g: ' doe'
    if (cleanWord != '') {
        const letterUpperCased = cleanWord[0].toUpperCase(); //upper cases the first letter
        const newWord = letterUpperCased + cleanWord.substring(1); //concats upper cased first letter with the rest of the word
        return newWord;
    }
});

//build the new formated string
if (hyphenIncluded) {
    newStr = newStrArr.join('-'); // e.g: Jhon-Doe
} else {
    newStr = newStrArr.join(' '); // e.g: Jhon Doe
}

// returns the formated string
return newStr;
