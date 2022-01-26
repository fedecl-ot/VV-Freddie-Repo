// VERIFY UNIQUE FORM RECORD for Milestone10

var webSeviceName = 'verifyUniqueWebService';
var newFormName = 'Milestone10';
var message; // the message is set below

//Show VV spinner logo.
VV.Form.ShowLoadingPanel();

function CallServerSide() {
    // Get all the form fields data
    var formData = VV.Form.getFormDataCollection();
    var FormInfo = {};
    FormInfo.name = 'Record ID';
    FormInfo.value = VV.Form.DataID;
    formData.push(FormInfo);

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
                    message = newFormName + resp.data[1];

                    if (resp.meta.status == '200') {
                        if (resp.data[0] != undefined) {
                            if (resp.data[0] == 'Success') {
                                //Saves current form record.
                                VV.Form.DoAjaxFormSave();
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
                'The following unhandled response occurred while attempting to retrieve data on the the server side get data logic.' + resp.data.error + '<br>';
        }
    })
    .then(function () {
        //Show msj modal.
        VV.Form.Global.DisplayMessaging(message, newFormName);
        //Hide VV spinner logo.
        VV.Form.HideLoadingPanel();
    });
