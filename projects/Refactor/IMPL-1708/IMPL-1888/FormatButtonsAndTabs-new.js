/*
    Script Name:   FormatButtonsAndTabs
    Customer:      VisualVault
    Purpose:       This function ensures buttons in containers with tab or menu style are always clickable, even in read-only mode.
				   It also hides the VV default close button, then finds all buttons labeled "Close" 
				   and formats them with red color and clickable even in read-only mode.
		USE: Put this function in the onLoad and EventsEnd events of the template.
             It is necessary to call the function any time the read-only mode of the container changes.
             It is recommended to put the function inside a setTimeout and be triggered by the change event of the field control which determines the read-only mode status.
             Parameters:    None
    Return Value:  None 
    Date of Dev:   07/28/2020
    Last Rev Date: 07/06/2022
    Revision Notes:
    07/28/2020 - Kendra Austin: Initial creation of the business process.
    07/06/2022 - Franco Petosa Ayala: Update to ES6
*/

//Hide VV's close button:  
$('.CloseContainer').hide();

//Change color of VV Form close buttons and close button to work even in Read Only:
$("[value='Close']").css("background-color", "#D50000").css("color", "#FFF")

//Find all containers with these styles
const styleList = ['.styleMenu', '.styleTabButtons'];

styleList.forEach( style => {
    //Get the list of controls in this container. 
    const tabList = [...$(style).children()];

    //Iterate through each tab button in this style and make it active even in read only mode: 
    tabList.forEach( tab => {
        const tabName = $(tab).attr('vvfieldnamewrapper');
        $(`[vvfieldname = '${tabName}']`).removeAttr('disabled').removeAttr('readonly');
    })
});