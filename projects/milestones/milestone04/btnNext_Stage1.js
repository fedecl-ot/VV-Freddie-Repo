//Validates Stage1 field control values.
var isFormValid = VV.Form.Template.Stage1_Validation()

if (isFormValid) {
    VV.Form.SetFieldValue('Stage', 2)
} else {
    VV.Form.Global.DisplayMessaging('Please complete the required fields.', 'CUSTOMER SURVEY FORM')
}
