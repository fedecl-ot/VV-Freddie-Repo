// Hypotetic btn_OnClick Template Code
// here all could be placed into a single webseervice instead of placing work load on client side
var formData = VV.Form.getFormDataCollection()
var Email = VV.Form.GetFieldValue('Email')
var FormInfo = {}
var FormInfo2 = {}

//unnecesary elaboration of query in Event Function
FormInfo.name = 'EmailLookupQuery'
FormInfo.value = {
    q: `[Email Address] eq '${Email}' and [Status] eq 'Active'`,
    expand: true,
}
//unnecesary calling of Email Body that is already on formData object
FormInfo2.name = 'EmailBody'

FormInfo2.value = VV.Form.GetFieldValue('Email Body')

formData.push(FormInfo)
formData.push(FormInfo2)

VV.Form.DoAjaxFormSave()
//The below could be achieved by managing the responses of the actions that are being carried out inside
VV.Form.Template.SendEmail().then(function () {
    VV.Form.LogEmail()
})
