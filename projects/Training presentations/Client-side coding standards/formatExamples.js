var successMessage
var dateObj = VV.Form.GetDateObjectFromCalendar('fieldName')

//var dateObj = new Date();
VV.Form.SetFieldValue(
    'nameOfFieldtoSet',
    (dateObj.getMonth() + 1).toString() + '/' + dateObj.getDate().toString() + '/' + dateObj.getFullYear().toString()
)(
    // eslint-disable-next-line no-unexpected-multiline
    `${successMessage} The form will be saved when the yellow banner appears.`
)

// eslint-disable-next-line no-unused-vars
const absValue = (number) => {}
