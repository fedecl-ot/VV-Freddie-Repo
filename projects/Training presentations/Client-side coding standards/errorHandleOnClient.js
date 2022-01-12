/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
if (resp.meta.status == '200') {
    if (resp.data[0] != 'undefined') {
        if (resp.data[0] == 'Success') {
            messageData = 'The record has been saved.'
            var title = 'Save Form'
            if (VV.Form.GetFieldValue('Form Saved') === 'false') {
                VV.Form.SetFieldValue('Form Saved', 'True')
                VV.Form.DoPostbackSave()
                VV.Form.HideLoadingPanel()
                VV.Form.Global.DisplayMessaging(messageData, title)
            } else {
                VV.Form.DoAjaxFormSave().then(function (resp) {
                    VV.Form.HideLoadingPanel()
                    VV.Form.Global.DisplayMessaging(messageData, title)
                })
            }
        } else if (resp.data[0] == 'Error') {
            messageData = 'An error was encountered. ' + resp.data[1]
            VV.Form.HideLoadingPanel()
            VV.Form.Global.DisplayMessaging(messageData)
        } else {
            messageData =
                'An unhandled response occurred when calling Customer Save. The form will not save at this time.  Please try again or communicate this issue to support.'
            VV.Form.HideLoadingPanel()
            VV.Form.Global.DisplayMessaging(messageData)
        }
    } else {
        messageData = 'The status of the response returned as undefined.'
        VV.Form.HideLoadingPanel()
        VV.Form.Global.DisplayMessaging(messageData)
    }
} else {
    messageData =
        'The following unhandled response occurred while attempting to retrieve data on the the server side get data logic.' + resp.data.error + '<br>'
    VV.Form.Global.DisplayMessaging(messageData)
}
