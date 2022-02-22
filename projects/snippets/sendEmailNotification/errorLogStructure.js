const sendErrorLogEmail = async function () {
    logger.info('FSFN IMPORT. Entered sendErrorLogEmail process.');
    let emailList = testEmailList;

    //Fetch the admin users' emails
    let respAdminEmail = await vvClient.scripts.runWebService('GetGroupUserEmails', groupsParamObj);
    if (respAdminEmail.data) {
        const emailData = respAdminEmail.data.data;
        for (var c = 0; c < emailData.length; c++) {
            if (emailList.length == 0) {
                emailList = emailData[c]['emailAddress'];
            } else {
                emailList = emailList + ',' + emailData[c]['emailAddress'];
            }
        }
    }

    logger.info('FSFN IMPORT: Attempting to send error log.');
    let body = 'The following errors or messages were logged while processing the FSFN Import <br><br>';
    body += '<ul>';
    for (let errorItem of errors) {
        //Generate the body of the email.
        body += '<li>' + errorItem + '</li>';
    }
    body += '</ul>';
    let emailData = {};
    if (useTestEmail == 0) {
        emailData.recipients = emailList;
    } else {
        emailData.recipients = testEmailList;
    }
    emailData.subject = 'Errors or messages generated during FSFN Import on ' + moment().format('MM/DD/YYYY');
    emailData.body = body;

    const resp = await vvClient.email.postEmails(null, emailData);
    if (!resp.meta || resp.meta.status !== 201) {
        errorAfterSent.push('Issue occurred while sending error log email to admin staff.');
        logger.info('FSFN IMPORT: Issue occurred while sending error log email to admin staff.');
    }
    logger.info('FSFN IMPORT: Email sent successfully.');
};
