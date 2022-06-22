/*
    Script Name:   ActivateTabs
    Customer:      VisualVault
    Purpose:       This function ensures buttons in containers with tab or menu style are always clickable, even in read-only mode.
    		USE: Put this function in the Load event of the template.
    Parameters:    None
    Return Value:  None 
    Date of Dev:   07/28/2020
    Last Rev Date: 
    Last Update: ES6 Update 19/05/2022 - Franco Petosa Ayala
    Revision Notes:
    07/28/2020 - Kendra Austin: Initial creation of the business process. 
*/

const styleList = ['.styleMenu', '.styleTabButtons'];

styleList.forEach( style => {
    //Get the list of controls in this container. 
    const tabList = [...$(style).children()];

    //Iterate through each tab button in this style and make it active even in read only mode: 
    tabList.forEach( tab => {
        const tabName = $(tab).attr('vvfieldnamewrapper');
        $("[vvfieldname='" + tabName + "']").removeAttr('disabled').removeAttr('readonly');
    })
});