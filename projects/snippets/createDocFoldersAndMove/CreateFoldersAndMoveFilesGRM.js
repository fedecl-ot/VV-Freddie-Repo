const logger = require('../log');

module.exports.getCredentials = function () {
    var options = {};
    options.customerAlias = 'SATrainingMarch2022';
    options.databaseAlias = 'Main';
    options.userId = 'training.api';
    options.password = 'p';
    options.clientId = 'bafd938d-6864-472c-9309-2b515bbf1007';
    options.clientSecret = 'rbQR7pXabAUts/lp5sczrbb5C2L/kF4EcOdF+OkPg68=';
    return options;
};

module.exports.main = async function (ffCollection, vvClient, response) {
    /* 
    Script Name:    CreateFoldersAndMoveFiles 
    Customer:       VisualVault
    Purpose:        The purpose of this script is to create a new folder for each document inside a selected folder, 
                    and then move each document to their new created folder.

    Parameters:     The following represent variables passed into the function:

    Return Array:   The following represents the array of information returned to the calling function.  This is a standardized response.
                    0 - Status: Success, Error
                    1 - Message
                  
    Pseudocode:     1.Checks if the required paramenters are present
                    2.Gets the source folder documents ids
                    3.Create a folder for each document
                    4.Moves each document to its folder
                    5.Builds the success response array
                    6.Sends email with errors
                    7.Sends the response

    Date of Dev:    11/20/2021
    Last Rev Date:  06/21/2022

    Revision Notes:
    11/20/2021 - Emanuel Jofré: Library creation
    06/21/2022 - Federico Cuelho: Modified to create folders and move docs into created folders.
    */

    logger.info('Start of the process CreateFoldersAndMoveFiles at ', Date());

    /**************************************
     Response and error handling variables
    ***************************************/

    // Response array to be returned
    // outputCollection[0]: Status
    // outputCollection[1]: Short description message
    const outputCollection = [];
    // Array for capturing error messages that may occur within helper functions.
    const errorLog = [];

    /***********************
     Configurable Variables 
    ************************/

    // Name of the parameter that contains the source folder name
    const sourcePathParamName = 'Source Folder';
    // Name of the parameter that contains the target folder name
    const targetPathParamName = 'Target Folder';
    // Name of the groups that will have permissions set in the folder.
    const permissionGroupsParamName = 'permissionGroups';
    // Coma separated email addresses to send error log to after the script is finished.
    const errorEmailList = 'emanuel.jofre@onetree.com';
    // Text to be added to the subject of the error log email.
    const emailSubject = 'Errors generated during new Plaidsoft registration ' + new Date().toLocaleString();
    // Text to be added to the intro of the error log email.
    const emailIntro = 'The following errors or messages were logged while processing the folders and documents for a new user: \n\n';

    /*****************
     Helper Functions
    ******************/

    function getFieldValueByName(fieldName, isRequired = true) {
        /*
        Check if a field was passed in the request and get its value
        Parameters:
            fieldName: The name of the field to be checked
            isRequired: If the field is required or not
        */

        let resp = null;

        try {
            // Tries to get the field from the passed in arguments
            const field = ffCollection.getFormFieldByName(fieldName);

            if (!field && isRequired) {
                throw new Error(`The field '${fieldName}' was not found.`);
            } else if (field) {
                // If the field was found, get its value
                let fieldValue = field.value ? field.value : null;

                if (typeof fieldValue === 'string') {
                    // Remove any leading or trailing spaces
                    fieldValue.trim();
                }

                if (fieldValue) {
                    // Sets the field value to the response
                    resp = fieldValue;
                } else if (isRequired) {
                    // If the field is required and has no value, throw an error
                    throw new Error(`The value property for the field '${fieldName}' was not found or is empty.`);
                }
            }
        } catch (error) {
            // If an error was thrown, add it to the error log
            errorLog.push(error);
        }
        return resp;
    }

    function parseRes(vvClientRes) {
        /*
        Generic JSON parsing function
        Parameters:
            vvClientRes: JSON response from a vvClient API method
        */
        let res = vvClientRes;

        try {
            // Parses the response in case it's a JSON string
            const jsObject = JSON.parse(res);
            // Handle non-exception-throwing cases:
            if (jsObject && typeof jsObject === 'object') {
                res = jsObject;
            }
        } catch (e) {
            // If an error ocurrs, it's because the resp is already a JS object and doesn't need to be parsed
        }
        return res;
    }

    function checkMetaAndStatus(vvClientRes, shortDescription, ignoreStatusCode = 999) {
        /*
        Checks that the meta property of a vvCliente API response object has the expected status code
        Parameters:
            vvClientRes: Parsed response object from a vvClient API method
            shortDescription: A string with a short description of the process
            ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkDataPropertyExists(), make sure to pass the same param as well.
        */
        if (!vvClientRes.meta) {
            throw new Error(`${shortDescription}. No meta object found in response. Check method call and credentials.`);
        }

        const status = vvClientRes.meta.status;

        // If the status is not the expected one, throw an error
        if (status !== 200 && status !== 201 && status !== ignoreStatusCode) {
            const errorReason = vvClientRes.meta.errors && vvClientRes.meta.errors[0] ? vvClientRes.meta.errors[0].reason : 'unspecified';
            throw new Error(`${shortDescription}. Status: ${vvClientRes.meta.status}. Reason: ${errorReason}`);
        }
        return vvClientRes;
    }

    function checkDataPropertyExists(vvClientRes, shortDescription, ignoreStatusCode = 999) {
        /*
        Checks that the data property of a vvCliente API response object exists 
        Parameters:
            res: Parsed response object from the API call
            shortDescription: A string with a short description of the process
            ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkMetaAndStatus(), make sure to pass the same param as well.
        */
        const status = vvClientRes.meta.status;

        if (status != ignoreStatusCode) {
            // If the data property doesn't exist, throw an error
            if (!vvClientRes.data) {
                throw new Error(`${shortDescription}. Data property was not present. Please, check parameters syntax. Status: ${status}.`);
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
            ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkMetaAndStatus(), make sure to pass the same param as well.
        */
        const status = vvClientRes.meta.status;

        if (status != ignoreStatusCode) {
            const dataIsArray = Array.isArray(vvClientRes.data);
            const dataIsObject = typeof vvClientRes.data === 'object';
            const isEmptyArray = dataIsArray && vvClientRes.data.length == 0;
            const isEmptyObject = dataIsObject && Object.keys(vvClientRes.data).length == 0;

            // If the data is empty, throw an error
            if (isEmptyArray || isEmptyObject) {
                throw new Error(`${shortDescription} returned no data. Please, check parameters syntax. Status: ${status}.`);
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

    async function createFolder(folderPath) {
        const shortDescription = `Post folder '${folderPath}'`;

        const folderData = {};

        const postFolderResp = await vvClient.library
            .postFolderByPath(null, folderData, folderPath)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));

        const newFolderID = postFolderResp.data.id;

        return newFolderID;
    }

    async function getDocumentsData(folderPath) {
        const shortDescription = `Get Documents Data for '${folderPath}'`;

        const getDocsArgs = {
            q: `FolderPath = '${folderPath}'`,
        };

        let getDocsResp = {};

        try {
            getDocsResp = await vvClient.documents
                .getDocuments(getDocsArgs)
                .then((res) => parseRes(res))
                .then((res) => checkMetaAndStatus(res, shortDescription))
                .then((res) => checkDataPropertyExists(res, shortDescription))
                .then((res) => checkDataIsNotEmpty(res, shortDescription));
        } catch (error) {
            errorLog.push(error);
        }

        return getDocsResp.data ? getDocsResp.data : [];
    }

    async function sendErrorLogEmail() {
        //This function sends an error log email. See configurable variables for settings.
        let body = emailIntro;

        for (let errorItem of errorLog) {
            //Generate the body of the email.
            body += '<li>' + errorItem + '</li>';
        }

        const emailData = {
            recipients: errorEmailList,
            subject: emailSubject,
            body: body,
        };

        await vvClient.email.postEmails(null, emailData);
    }

    /**********
     MAIN CODE
    ***********/

    try {
        const sourcePath = getFieldValueByName('FolderSelect');
        const targetPath = getFieldValueByName('TargetFolder');
        // const permissionGroups = getFieldValueByName(permissionGroupsParamName, false);

        // 1. Checks if the required paramenters are present
        if (!sourcePath || !targetPath) {
            // It could be more than one error, so we need to send all of them in one response
            throw new Error(errorLog.join('; '));
        }

        // 2. Gets the source folder documents ids
        const sourceDocsData = await getDocumentsData(sourcePath);

        // 3. Create a folder for each document
        await Promise.all(
            sourceDocsData.map(async (document) => {
                const newFolderId = await createFolder(`${targetPath}/${document.name}`);

                // 4. Moves each document to its folder
                let moveDocumentData = {
                    folderId: newFolderId,
                };

                await vvClient.documents.moveDocument(null, moveDocumentData, document.documentId);
            })
        );

        // 5. Builds the success response array
        outputCollection[0] = 'Success';
        outputCollection[1] = 'Create and Move Process Complete';
    } catch (err) {
        errorLog.push(err.message ? err.message : err);
        logger.info(JSON.stringify(errorLog));

        // Builds the error response array
        outputCollection[0] = 'Error';
        outputCollection[1] = err.message ? err.message : err;
    } finally {
        // 6. Sends email with errors
        if (errorLog.length > 0) {
            sendErrorLogEmail();
        }

        // 7. Sends the response
        response.json(200, outputCollection);
    }
};
