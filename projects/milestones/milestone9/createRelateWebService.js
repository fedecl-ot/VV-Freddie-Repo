const logger = require('../log');

module.exports.getCredentials = function () {
    var options = {};
    options.customerAlias = 'Freddie';
    options.databaseAlias = 'Main';
    options.userId = 'federico.cuelho@onetree.com';
    options.password = '$63tQGM8$n#cwAse$hh9';
    options.clientId = '5154f244-dcd3-4b27-ad97-a52579f42bfd';
    options.clientSecret = 'tM/2PozM3S+rg3c/jCnDXofg7lZhd4PQmgRRZaS3AAg=';
    return options;
};

module.exports.main = async function (ffCollection, vvClient, response) {
    /*
    Script Name:    creatRelateWebService 
    Customer:       N/A
    Purpose:        Create and relate a new form record from Milestone9Related form template with Milestone9 form record.
    Parameters:     The following represent variables passed into the function:
                    templateName: Form template used to create new form record on a different template.
                    newFormTemplateName: Form template used to create new form record.
    Return Object:
                    outputCollection[0]: Status
                    outputCollection[1]: Short description message
                    outputCollection[2]: currentFormId
                    outputCollection[3]: newFormRevisionId
    Psuedo code: 
              1° Get current form field values.
              2° Save form field control values.
              3° Create new form record with saved form field control values.
              4° Save form record ID.
              5° Send response to client.

    Date of Dev:    01/21/2022
    Last Rev Date:  01/25/2022

    Revision Notes:
     01/21/2022 - FEDERICO CUELHO:  First Setup of the script.
     01/25/2022 - FEDERICO CUELHO:  Fix code structure and added client-side validation.
    */

    logger.info('Start of the process Milestone8 at ' + Date());

    /**************************************
     Response and error handling variables
    ***************************************/

    // Response array to be returned
    var outputCollection = [];
    // Array for capturing error messages that may occur during the process
    var errorLog = [];

    /***********************
     Configurable Variables
    ************************/

    const newFormTemplateName = 'Milestone9Related';

    /*****************
     Script Variables
    ******************/

    // Describes the process being checked using the parsing and checking helper functions
    var shortDescription = '';

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

            if (!field) {
                throw new Error(`The field '${fieldName}' was not found.`);
            } else {
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

    /**********
     MAIN CODE 
    **********/

    try {
        // 1.GET AND SAVES FORM FIELD CONTROL VALUES
        const firstName = getFieldValueByName('Name');
        const lastName = getFieldValueByName('Lastname');
        const currentFormId = getFieldValueByName('formId');

        // CHECKS IF REQUIRED PARAMENTERS ARE PRESENT
        if (!firstName || !lastName || !currentFormId) {
            // It could be more than one error, so we need to send all of them in one response
            throw new Error(errorLog.join('; '));
        }

        // 2.CREATES NEW OBJECT WITH SAVED FIELD CONTROL VALUES
        const newFormData = {
            Name: firstName,
            Lastname: lastName,
            DateStamp: new Date(),
        };
        shortDescription = 'New Form Creation Execution';

        // 3.CREATES NEW FORM RECORD WITH Milestone8 FORM RECORD FIELD CONTROL VALUES
        const postNewFormRecord = await vvClient.forms
            .postForms(null, newFormData, newFormTemplateName)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));

        // 4.SAVES NEW FORM REVISION ID TO UPDATE FORM FIELD CONTROL VALUES
        const newFormRevisionId = postNewFormRecord.data.revisionId;

        // 5.RELATES CURRENT FORM RECORD WITH NEW FORM RECORD
        await vvClient.forms
            .relateFormByDocId(newFormRevisionId, currentFormId)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription));

        // 6.BUILDS THE SUCCESS RESPONSE ARRAY
        outputCollection[0] = 'Success';
        outputCollection[1] = 'Form record created and related';
        outputCollection[2] = newFormRevisionId;
    } catch (error) {
        logger.info('Error encountered' + error);

        // BUILDS THE ERROR RESPONSE ARRAY

        outputCollection[0] = 'Error';

        if (errorLog.length > 0) {
            outputCollection[1] = 'Errors encountered';
            outputCollection[2] = `Error/s: ${errorLog.join('; ')}`;
        } else {
            outputCollection[1] = error.message ? error.message : `Unhandled error occurred: ${error}`;
        }
    } finally {
        // SENDS THE RESPONSE

        response.json(200, outputCollection);
    }
};
