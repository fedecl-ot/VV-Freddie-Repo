/*
    Script Name:   AdminSave
    Customer:      VisualVault
    Purpose:       This function checks if the Admin Override is still checked and reminds users to uncheck and save.
    REQUIREMENTS:  The Admin Override checkbox must be named "Admin Override" on each form template. 
    Parameters:    The following represent variables passed into the function:  
                   No Parameters
    Return Value:  The following represents the value being returned from this function:
                        No Information returned       
    Date of Dev:   10/07/2019
    Last Rev Date: 05/08/2020
    Revision Notes:
    10/07/2019 - Kendra Austin: Initial creation of the business process.
    05/08/2020 - Kendra Austin: Add ajax save before postback save. Until new form designer, this is needed to prevent manually set drop-downs from reverting to the top value.
                                Also added record save confirmation. 
*/

var okfunction = function () {
    VV.Form.DoAjaxFormSave().then(function (resp) {
        VV.Form.DoPostbackSave();
        var messageData = "The form record has been saved.";
        VV.Form.Global.DisplayMessaging(messageData);
    });
}

var cancelfunction = function () {

}

if (VV.Form.GetFieldValue('Admin Override').toLowerCase() == 'true') {
    var messagedata = 'The Admin Override checkbox is still checked. This means read-only fields can be edited, and hidden information can be seen. Are you sure you want to save?';
    VV.Form.Global.DisplayConfirmMessaging(messagedata, 'Confirm', okfunction, cancelfunction);
}
else {
    okfunction();
}