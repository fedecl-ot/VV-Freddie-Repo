//pass in ControlName to validate a single item or nothing to validate everything.
var ErrorReporting = true;

var RunAll = false;
if (ControlName == null) {
    RunAll = true;
}

/*************************************
    BEGIN CUSTOM VALIDATION CODE
**************************************/

//Costumer name - Field that must be completed.
if (ControlName == 'Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Name', 'A name needs to be entered.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Name');
    }
}

//Costumer lastname - Field that must be completed.
if (ControlName == 'Lastname' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Lastname'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Lastname', 'A lastname needs to be entered.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Lastname');
    }
}

return ErrorReporting;
