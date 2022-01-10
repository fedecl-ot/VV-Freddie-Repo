//pass in ControlName to validate a single item or nothing to validate everything.
var ErrorReporting = true

var RunAll = false
if (ControlName == null) {
    RunAll = true
}

/*************************************
    BEGIN CUSTOM VALIDATION CODE
**************************************/

//Customer DOB - Field that must be completed.
if (ControlName == 'DOB' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('DOB'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('DOB', 'A valid date needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('DOB')
    }
}
//Costumer name - Field that must be completed.
if (ControlName == 'Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Name', 'A name needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Name')
    }
}
//Other_Language_Dropdown - DropDown must be selected.
if (ControlName == 'OtherLanguageDropdown' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('OtherLanguageDropdown'), 'DDSelect') == false) {
        VV.Form.SetValidationErrorMessageOnField('OtherLanguageDropdown', 'Please make a selection.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('OtherLanguageDropdown')
    }
}
//Costumer phone - Field that must be completed.
if (ControlName == 'Phone' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Phone'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Phone', 'A phone number needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Phone')
    }
}
//Cell Stage0Score1 field must have a number entered.
if (ControlName == 'Stage0Score1' || RunAll) {
    if (VV.Form.GetFieldValue('Stage0Score1') < 1 || VV.Form.GetFieldValue('Stage0Score1') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage0Score1', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage0Score1')
    }
}
//Cell Stage0Score2 field must have a number entered.
if (ControlName == 'Stage0Score2' || RunAll) {
    if (VV.Form.GetFieldValue('Stage0Score2') < 1 || VV.Form.GetFieldValue('Stage0Score2') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage0Score2', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage0Score2')
    }
}
//Cell Stage0Score3 field must have a number entered.
if (ControlName == 'Stage0Score3' || RunAll) {
    if (VV.Form.GetFieldValue('Stage0Score3') < 1 || VV.Form.GetFieldValue('Stage0Score3') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage0Score3', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage0Score3')
    }
}
//Cell Stage0Score4 field must have a number entered.
if (ControlName == 'Stage0Score4' || RunAll) {
    if (VV.Form.GetFieldValue('Stage0Score4') < 1 || VV.Form.GetFieldValue('Stage0Score4') > 5) {
        VV.Form.SetValidationErrorMessageOnField('Stage0Score4', 'A number between 1-5 needs to be entered.')
        ErrorReporting = false
    } else {
        VV.Form.ClearValidationErrorOnField('Stage0Score4')
    }
}

return ErrorReporting
