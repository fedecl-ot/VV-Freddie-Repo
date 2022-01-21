// CREATE AND RELATE NEW FORM RECORD for Milestone9Relate

var webSeviceName = 'createRelateWebService';
var newFormName = 'Milestone9Related';
var message; // the message is set below

VV.Form.ShowLoadingPanel();

function CallServerSide() {
    // Get all the form fields data
    var formData = VV.Form.getFormDataCollection();

    // Parse the data as a JSON string
    var data = JSON.stringify(formData);

    var requestObject = $.ajax({
        type: 'POST',
        url: VV.BaseAppUrl + 'api/v1/' + VV.CustomerAlias + '/' + VV.CustomerDatabaseAlias + '/scripts?name=createRecordWebService',
        contentType: 'application/json; charset=utf-8',
        data: data,
        success: '',
        error: '',
    });

    return requestObject;
}

//Saves the new form record.
VV.Form.DoAjaxFormSave().then(function () {
    $.when(CallServerSide())
        .always(function (resp) {
            var errorOnConexion = typeof resp.status != 'undefined';
            var errorOnServer = typeof resp.statusCode != 'undefined';
            var serverSentOKResponse = resp.meta.status == '200';
            var wsSentResponse = resp.data[0] != undefined;
            var wsSentSuccessResponse = resp.data[0] == 'Success';
            var wsSentErrorResponse = resp.data[0] == 'Error';

            if (errorOnConexion) {
                message =
                    'A status code of ' +
                    resp.status +
                    ' returned from the server.  There is a communication problem with the web servers.  If this continues, please contact the administrator and communicate to them this message and where it occurred.';
            } else if (errorOnServer) {
                message =
                    'A status code of ' +
                    resp.statusCode +
                    " with a message of '" +
                    resp.errorMessages[0].message +
                    "' returned from the server.  This may mean that the servers to run the business logic are not available.";
            } else if (serverSentOKResponse) {
                if (wsSentResponse) {
                    if (wsSentSuccessResponse) {
                        message = newFormName + ' form record has been created and related successfully.';

                        if (resp.meta.status == '200') {
                            if (resp.data[0] != undefined) {
                                if (resp.data[0] == 'Success') {
                                    //Saves and shows new form revision ID.
                                    var newFormRevisionId = resp.data[2];
                                    VV.Form.SetFieldValue('revisionId', newFormRevisionId);
                                }
                            }
                        }
                    } else if (wsSentErrorResponse) {
                        message = 'An error was encountered. ' + resp.data[1];
                    } else {
                        message =
                            'An unhandled response occurred when calling ' +
                            webSeviceName +
                            '. The form will not save at this time.  Please try again or communicate this issue to support.';
                    }
                } else {
                    message = 'The status of the response returned as undefined.';
                }
            } else {
                message =
                    'The following unhandled response occurred while attempting to retrieve data on the the server side get data logic.' +
                    resp.data.error +
                    '<br>';
            }
        })
        .then(function () {
            VV.Form.Global.DisplayMessaging(message, newFormName);
            VV.Form.HideLoadingPanel();
        });
});
