//pass in ControlName to validate a single item or nothing to validate everything.
var ErrorReporting = true

var RunAll = false
if (ControlName == null) {
    RunAll = true
}

/*************************************
    BEGIN CUSTOM VALIDATION CODE
**************************************/

//Stage3Feedback textbox must have a value entered.
if (ControlName == 'Stage3Feedback' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Stage3Feedback'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Stage3Feedback', 'A comment needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage3Feedback')
    }
}

return ErrorReporting
