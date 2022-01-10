//Validates Stage0 field control values.
var isFormValid = VV.Form.Template.Stage0_and_CustomerInfo_Validation()

if (isFormValid) {
    VV.Form.SetFieldValue('Stage', 1)
} else {
    VV.Form.Global.DisplayMessaging('Please complete the required fields.', 'CUSTOMER SURVEY FORM')
}
