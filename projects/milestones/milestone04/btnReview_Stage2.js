//Validates Stage2 field control values.
var isFormValid = VV.Form.Template.Stage2_Validation()

if (isFormValid) {
    VV.Form.SetFieldValue('Stage', 3)
} else {
    VV.Form.Global.DisplayMessaging('Please complete the required fields.', 'CUSTOMER SURVEY FORM')
}
