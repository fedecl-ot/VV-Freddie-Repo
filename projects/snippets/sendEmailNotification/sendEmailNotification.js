// AUX FUNCTION TO SEND AN EMAIL NOTIFICATION AFTER A SCHEDULED PROCESS IS EXECUTED.

// Place all variables within the 'Configurable Variables' section.
const scheduledProcessName = 'scheduledProcessAsyncFreddie';

/***********************
    Email Variables
************************/

// Email addresses list to send notification.
const testEmailList = 'email1@gmail.com, email2@gmail.com';

// On 'true' sends the notification to all VaultAccess users email addresses.
const useTestEmails = false;

// List of email recipients to send email.
let emailList = '';

// Place this in the 'Helper Functions' section.
async function sendEmailNotification(processStatusMsj) {
    logger.info('Entered sendEmailNotification process.');

    // Get scheduled process execution date and time.
    const localISODate = new Date().toISOString().substring(0, 10);
    const localTime = new Date().toTimeString();

    // Email structure obj.
    let emailData = {};

    // Group of users to get email addresses.
    let groupsParamObj = [
        {
            name: 'groups',
            value: ['VaultAccess'],
        },
    ];

    // FETCH THE GROUP USERS' EMAILS.
    const resVisualAccessUsers = await vvClient.scripts
        .runWebService('LibGroupGetGroupUserEmails', groupsParamObj)
        .then((res) => parseRes(res, shortDescription))
        .then((res) => checkMetaAndStatus(res, shortDescription))
        .then((res) => checkDataPropertyExists(res, shortDescription))
        .then((res) => checkDataIsNotEmpty(res, shortDescription));

    // LOOPS EVERY USER TO GET THEIR EMAIL ADDRESSES TO SAVE IT AS A STRING OF EMAILS.
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
    if (useTestEmails) {
        emailList = emailData.recipients;
    } else {
        emailList = testEmailList;
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
