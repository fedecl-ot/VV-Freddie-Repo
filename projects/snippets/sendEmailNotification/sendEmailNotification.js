// AUXILIARY FUNCTION TO SEND AN EMAIL NOTIFICATION AFTER A SCHEDULED PROCESS IS EXECUTED WITH THE PROCESS RESULT AND ERROR LOG SUMMARY.

// Place all variables within the 'Configurable Variables' section.
const scheduledProcessName = 'scheduledProcessAsyncFreddie';

/***********************
    Email Variables
************************/

// Email addresses list to send notification.
const testEmailList = 'email1@gmail.com, email2@gmail.com';

// On 'false' sends the notification to all VaultAccess users email addresses.
const useTestEmailsList = true;

// List of email recipients to send email.
let emailList = '';

// Place this in the 'Helper Functions' section.
async function sendEmailNotification(processStatusMsj) {
    /*
      Script Name:   sendEmailNotification
      Customer:      N/A
      Purpose:       Auxiliary function intended to be used in Scheduled Processes to send an email with a summary of the process result and error logs.
      Parameters:    The following are parameters that need to be passed into this auxiliary script.
                     processStatusMsj - Process status message shown within the email body.
 
      Return Object:
                     - N/A.
      Psuedo code:
                     1. Call LibGroupGetGroupUserEmails library to fetch VaultAcces user group data.
                     2. Loop every user data to get their email addresses to save it as a string of emails.
                     3. Check for errors within the log.
                     4. Determine email recipients.
                     5. Build email structure.
                     6. Send email.
 
      Date of Dev:   02/22/2022
      Last Rev Date: 02/24/2022
 
      Revision Notes:
      02/22/2022 - FEDERICO CUELHO:     First Setup of the script.
      02/22/2022 - FEDERICO CUELHO:     - Added comments.
                                        - Added parsing and error handling functions.
                                        - Replace the for iteration for a map function.
                                        - Relocated variables.
                                        - Modified chained variables into single variable declarations.
                                        - Modified email subject structure.

      02/24/2022 - FEDERICO CUELHO:     - Modified boolean logic on useTestEmailsList for better reading.
                                        - Added condition to execute LibGroupGetGroupUserEmails ws.
                                        - Set groupsParamObj as constant.
     */

    logger.info('Entered sendEmailNotification process.');

    // Get scheduled process execution date and time.
    const localISODate = new Date().toISOString().substring(0, 10);
    const localTime = new Date().toTimeString();

    // Email structure obj.
    let emailData = {};

    // Group of users to get email addresses.
    const groupsParamObj = [
        {
            name: 'groups',
            value: ['VaultAccess'],
        },
    ];

    // FETCH THE GROUP USER DATA WHEN NOT USING testEmailList.
    if (!useTestEmailsList) {
        const resVisualAccessUsers = await vvClient.scripts
            .runWebService('LibGroupGetGroupUserEmails', groupsParamObj)
            .then((res) => parseRes(res, shortDescription))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));
    }

    // LOOPS EVERY USER  DATA TO GET THEIR EMAIL ADDRESSES TO SAVE IT AS A STRING OF EMAILS.
    resVisualAccessUsers.data[2].map(async (userData) => {
        emailList += userData['emailAddress'] + ',';
    });

    // Error variable.
    let errorItem = '';

    // CONTROL TO SHOW ERRORS LOG LIST.
    if (errorLog.length > 0) {
        errorItem = errorLog.join('</li><li>');
    } else {
        errorItem = 'No errors were logged.';
    }

    // DETERMINES EMAIL RECIPIENTS.
    if (useTestEmailsList) {
        emailList = testEmailList;
    } else {
        emailList = emailData.recipients;
    }

    // BUILDS EMAIL STRUCTURE.
    const emailObj = {
        recipients: emailList,
        subject: `${scheduledProcessName}, ${localISODate}, ${localTime}`,
        body: `
            Hello,<br>
            <br>
            Here is your scheduled process report:
            <ul>
                <li>Status: <strong>${processStatusMsj}</strong>.</li>
                <li>Date: ${localISODate}.</li>
                <li>Time: ${localTime}.</li>
            </ul>
            <br>
            Errors found:
            <ul>
                <li>${errorItem}</li>
            </ul>
            <br>
            Regards,<br>
            <br>
            VisualVault.
        `,
    };

    // SENDS EMAIL.
    await vvClient.email
        .postEmails(null, emailObj)
        .then((res) => parseRes(res))
        .then((res) => checkMetaAndStatus(res, shortDescription))
        .then((res) => checkDataPropertyExists(res, shortDescription))
        .then((res) => checkDataIsNotEmpty(res, shortDescription));

    logger.info('Email sent successfully.');
}

// Place the following right above your scheduled process final response status within your try and catch.
await sendEmailNotification(responseMessage);
