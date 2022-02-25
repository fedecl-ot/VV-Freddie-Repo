const logger = require('../log');

module.exports.getCredentials = function () {
    var options = {};
    options.customerAlias = 'Freddie';
    options.databaseAlias = 'Main';
    options.userId = 'freddie.api';
    options.password = 'kWKpqKcNZt37&6Ve^ec*';
    options.clientId = '2a819d70-3e2d-47ae-bf11-74a781d7b598';
    options.clientSecret = '9h2xdjIwXVvfw1h3hf+KCLQb9SAjNnmX0eT5+DeCALo=';
    return options;
};

module.exports.main = async function (vvClient, response, token) {
    /*
      Script Name:   scheduledProcessAsyncFreddie
      Customer:      N/A
      Purpose:       The purpose of this script is to update a set of queried form records with new data.
      Parameters:    The following are parameters that need to be passed into this libarary node script.
                     - Parameters are not required for a scheduled process.
 
      Return Object:
                     - Message will be sent back and logged to VV and to an email recipient as part of the ending of this scheduled process.
      Psuedo code:
                     1. Get form records from a base query and filter results by given column and value.
                     2. Loop every form record and updates form values from a custom created object.
                     3. Send response to client to log for all record updated.
                     4. Send response to email recipient for all record updated.
 
      Date of Dev:   01/30/2022
      Last Rev Date: 02/01/2022
 
      Revision Notes:
      01/30/2022 - FEDERICO CUELHO:     First Setup of the script.
     */

    logger.info('Start of logic for scheduledProcess on ' + new Date());

    /***************
     Error handling
    ****************/

    // Array for capturing error messages that may occur during the execution of the script.
    let errorLog = [];

    /***********************
     Configurable Variables
    ************************/

    const formTemplateName = 'Milestone11';

    // Place all variables in the 'Configurable Variables' section.
    const scheduledProcessName = 'scheduledProcessAsyncFreddie';

    /***********************
        Email Variables
    ************************/

    // Email addresses list to send notification.
    let testEmailList = 'email1@gmail.com, email2@gmail.com';

    // On 'false' sends the notification to all VaultAccess users email addresses.
    const useTestEmailsList = true;

    // List of email recipients to send email.
    let emailList = '';

    /*****************
     Script Variables
    ******************/

    let responseMessage = '';
    // const scheduledProcessGUID = token;

    // Describes the process being checked using the parsing and checking helper functions
    let shortDescription = '';

    /*****************
     Helper Functions
    ******************/

    function parseRes(vvClientRes) {
        /*
        Generic JSON parsing function
        Parameters:
                vvClientRes: JSON response from a vvClient API method
        */
        try {
            // Parses the response in case it's a JSON string
            const jsObject = JSON.parse(vvClientRes);
            // Handle non-exception-throwing cases:
            if (jsObject && typeof jsObject === 'object') {
                vvClientRes = jsObject;
            }
        } catch (e) {
            // If an error ocurrs, it's because the resp is already a JS object and doesn't need to be parsed
        }
        return vvClientRes;
    }
    function checkMetaAndStatus(vvClientRes, shortDescription, ignoreStatusCode = 999) {
        /*
        Checks that the meta property of a vvCliente API response object has the expected status code
        Parameters:
                vvClientRes: Parsed response object from a vvClient API method
                shortDescription: A string with a short description of the process
                ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkData(), make sure to pass the same param as well.
        */
        if (!vvClientRes.meta) {
            throw new Error(`${shortDescription} error. No meta object found in response. Check method call parameters and credentials.`);
        }

        const status = vvClientRes.meta.status;

        // If the status is not the expected one, throw an error
        if (status != 200 && status != 201 && status != ignoreStatusCode) {
            const errorReason = vvClientRes.meta.errors && vvClientRes.meta.errors[0] ? vvClientRes.meta.errors[0].reason : 'unspecified';
            throw new Error(`${shortDescription} error. Status: ${vvClientRes.meta.status}. Reason: ${errorReason}`);
        }
        return vvClientRes;
    }
    function checkDataPropertyExists(vvClientRes, shortDescription, ignoreStatusCode = 999) {
        /*
        Checks that the data property of a vvCliente API response object exists 
        Parameters:
                res: Parsed response object from the API call
                shortDescription: A string with a short description of the process
                ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkMeta(), make sure to pass the same param as well.
        */
        const status = vvClientRes.meta.status;

        if (status != ignoreStatusCode) {
            // If the data property doesn't exist, throw an error
            if (!vvClientRes.data) {
                throw new Error(`${shortDescription} data property was not present. Please, check parameters and syntax. Status: ${status}.`);
            }
        }

        return vvClientRes;
    }
    function checkDataIsNotEmpty(vvClientRes, shortDescription, ignoreStatusCode = 999) {
        /*
        Checks that the data property of a vvCliente API response object is not empty
        Parameters:
                res: Parsed response object from the API call
                shortDescription: A string with a short description of the process
                ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkMeta(), make sure to pass the same param as well.
        */
        const status = vvClientRes.meta.status;

        if (status != ignoreStatusCode) {
            const dataIsArray = Array.isArray(vvClientRes.data);
            const dataIsObject = typeof vvClientRes.data === 'object';
            const isEmptyArray = dataIsArray && vvClientRes.data.length == 0;
            const isEmptyObject = dataIsObject && Object.keys(vvClientRes.data).length == 0;

            // If the data is empty, throw an error
            if (isEmptyArray || isEmptyObject) {
                throw new Error(`${shortDescription} returned no data. Please, check parameters and syntax. Status: ${status}.`);
            }
            // If it is a Web Service response, check that the first value is not an Error status
            if (dataIsArray) {
                const firstValue = vvClientRes.data[0];

                if (firstValue == 'Error') {
                    throw new Error(`${shortDescription} returned an error. Please, check called Web Service. Status: ${status}.`);
                }
            }
        }
        return vvClientRes;
    }
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
      Last Rev Date: 02/25/2022
 
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

      02/25/2022 - FEDERICO CUELHO:     - Relocated map function.
                                        - Added shortDescription msjs on helper functions.
                                        - Deleted unnecesary else clause and emailData variable.
                                        
     */

        logger.info('Entered sendEmailNotification process.');

        // Get scheduled process execution date and time.
        const localISODate = new Date().toISOString().substring(0, 10);
        const localTime = new Date().toTimeString();

        // Group of users to get email addresses.
        const groupsParamObj = [
            {
                name: 'groups',
                value: ['VaultAccess'],
            },
        ];

        // FETCH THE GROUP USER DATA WHEN NOT USING testEmailList.
        shortDescription = `Run Web Service: LibGroupGetGroupUserEmails`;

        if (!useTestEmailsList) {
            const resVisualAccessUsers = await vvClient.scripts
                .runWebService('LibGroupGetGroupUserEmails', groupsParamObj)
                .then((res) => parseRes(res, shortDescription))
                .then((res) => checkMetaAndStatus(res, shortDescription))
                .then((res) => checkDataPropertyExists(res, shortDescription))
                .then((res) => checkDataIsNotEmpty(res, shortDescription));

            // LOOPS EVERY USER  DATA TO GET THEIR EMAIL ADDRESSES TO SAVE IT AS A STRING OF EMAILS.
            resVisualAccessUsers.data[2].map(async (userData) => {
                emailList += userData['emailAddress'] + ',';
            });
        }

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
        shortDescription = `Email sent successfully to: ${emailList}`;

        await vvClient.email
            .postEmails(null, emailObj)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));

        logger.info('Email sent successfully.');
    }

    /**********
     MAIN CODE 
    **********/

    try {
        // GETS FORM RECORDS FROM A BASE QUERY AND FILTER RESULTS BY GIVEN COLUMN AND VALUE.
        const queryName = 'Milestone11 Query';
        shortDescription = 'Custom Query using filter parameter for backward compatibility';
        const customQueryData = {
            filter: "[Name] = 'Gregorio'",
        };

        const customQueryResp = await vvClient.customQuery
            .getCustomQueryResultsByName(queryName, customQueryData)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));

        // LOOPS EVERY FORM RECORD TO UPDATE DATA
        customQueryResp.data.map(async (formRecord) => {
            const formGUID = formRecord['dhid'];
            const shortDescription = `Update form ${formGUID}`;

            // CREATES NEW OBJECT WITH UPDATED SAVED FORM CONTROL VALUES
            const formFieldsToUpdate = {
                name: 'Fedi',
                lastname: 'Cuelho',
            };

            // UPDATES THE FORM RECORD
            await vvClient.forms
                .postFormRevision(null, formFieldsToUpdate, formTemplateName, formGUID)
                .then((res) => parseRes(res))
                .then((res) => checkMetaAndStatus(res, shortDescription))
                .then((res) => checkDataPropertyExists(res, shortDescription))
                .then((res) => checkDataIsNotEmpty(res, shortDescription));
        });

        // SEND THE SUCCESS RESPONSE MESSAGE
        responseMessage = 'Success';

        //SEND EMAIL NOTIFICATION TO EMAIL ADDRESSES.
        await sendEmailNotification(responseMessage);

        // Uncomment the following line for testing. You will see the log ONLY if the process runs as a test.
        response.json(200, responseMessage);

        // Uncomment the following line for production. You will see the log ONLY if the process runs automatically.
        // return vvClient.scheduledProcess.postCompletion(scheduledProcessGUID, 'complete', true, responseMessage);
    } catch (error) {
        // SEND THE ERROR RESPONSE MESSAGE
        if (errorLog.length > 0) {
            responseMessage = `Error/s: ${errorLog.join('; ')}`;
        } else {
            responseMessage = `Unhandeled error occurred: ${error}`;
        }

        //SEND EMAIL NOTIFICATION TO EMAIL ADDRESSES.
        await sendEmailNotification(responseMessage);

        // Uncomment the following line for testing. You will see the log ONLY if the process runs as a test.
        response.json(200, responseMessage);

        // Uncomment the following line for production. You will see the log ONLY if the process runs automatically.
        // return vvClient.scheduledProcess.postCompletion(scheduledProcessGUID, 'complete', false, responseMessage);
    }
};
