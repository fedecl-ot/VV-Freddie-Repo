//pass in ControlName to validate a single item or nothing to validate everything.
var ErrorReporting = true

var RunAll = false
if (ControlName == null) {
    RunAll = true
}

/*************************************
    BEGIN CUSTOM VALIDATION CODE
**************************************/

//Cell S1_Score1 field must have a number entered.
if (ControlName == 'Stage1Score1' || RunAll) {
    if (VV.Form.GetFieldValue('Stage1Score1') < 1 || VV.Form.GetFieldValue('Stage1Score1') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage1Score1', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage1Score1')
    }
}
//Cell Stage1Score2 field must have a number entered.
if (ControlName == 'Stage1Score2' || RunAll) {
    if (VV.Form.GetFieldValue('Stage1Score2') < 1 || VV.Form.GetFieldValue('Stage1Score2') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage1Score2', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage1Score2')
    }
}
//Cell Stage1Score3 field must have a number entered.
if (ControlName == 'Stage1Score3' || RunAll) {
    if (VV.Form.GetFieldValue('Stage1Score3') < 1 || VV.Form.GetFieldValue('Stage1Score3') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage1Score3', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage1Score3')
    }
}
//Cell Stage1Score4 field must have a number entered.
if (ControlName == 'Stage1Score4' || RunAll) {
    if (VV.Form.GetFieldValue('Stage1Score4') < 1 || VV.Form.GetFieldValue('Stage1Score4') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage1Score4', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage1Score4')
    }
}

return ErrorReporting
