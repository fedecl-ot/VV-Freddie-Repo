//VALIDATES INPUT FIELDS PRIOR CALL WEB SERVICE
var isFormValid = VV.Form.Template.formValidation();

//Show VV spinner logo.
VV.Form.ShowLoadingPanel();

if (isFormValid) {
    //Calls web service.
    VV.Form.Template.callVerifyUniqueWebService();
} else {
    //Hide VV spinner logo.
    VV.Form.HideLoadingPanel();

    //Show msj modal.
    VV.Form.Global.DisplayMessaging('Please complete the required fields.', 'CUSTOMER FORM');
}
