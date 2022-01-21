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
    Script Name:    updateRecordWebService 
    Customer:       N/A
    Purpose:        Updates form control values on a form record.
    Parameters:     The following represent variables passed into the function:
                    newFormTemplateName: Form template used to update new form record.
    Return Object:
                    outputCollection[0]: Status
                    outputCollection[1]: Short description message
    Psuedo code: 
              1° Get updated form field control values.
              2° Get the form record to update.
              3° Save form revision ID from form record to update.
              4° Save updated form field control values.
              5° Update form record with updated field control values.
              6° Send response to client.

    Date of Dev:   01/19/2022
    Last Rev Date: 01/21/2022

    Revision Notes:
     01/19/2022 - FEDERICO CUELHO:  First Setup of the script.
     01/21/2022 - FEDERICO CUELHO:  Comments correction and redundant code fixes.
    */

    logger.info('Start of the process Milestone8DataReq at ' + Date());

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

    const newFormTemplateName = 'Milestone8DataReq';

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
        // 1.GET THE UPDATED FIELD CONTROL VALUES
        const name = getFieldValueByName('Name');
        const lastName = getFieldValueByName('lastName');
        const formID = getFieldValueByName('formID');

        // CHECKS IF REQUIRED PARAMENTERS ARE PRESENT
        if (!name || !lastName || !formID) {
            // It could be more than one error, so we need to send all of them in one response
            throw new Error(errorLog.join('; '));
        }

        shortDescription = `Get form ${formID}`;

        // 2.GET THE NEW FORM TO UPDATE FIELD CONTROL VALUES
        var getFormsParams = {
            q: `[instanceName] eq '${formID}'`,
            expand: true, // true to get all form fields
        };

        const getFormsRes = await vvClient.forms
            .getForms(getFormsParams, newFormTemplateName)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));

        // 3.SAVES THE FORM REVISION ID TO UPDATE THE NEW FORM RECORD
        const formGUID = getFormsRes.data[0].revisionId;

        shortDescription = `Update form ${formGUID}`;
        // 4.CREATES NEW OBJECT WITH UPDATED SAVED FORM CONTROL VALUES
        const formFieldsToUpdate = {
            Firstname: name,
            Lastname: lastName,
            DateStamp: new Date(),
        };

        // 5.UPDATES FIELD CONTROL VALUES ON NEW FORM RECORD
        await vvClient.forms
            .postFormRevision(null, formFieldsToUpdate, newFormTemplateName, formGUID)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));

        // 6.BUILD THE SUCCESS RESPONSE ARRAY
        outputCollection[0] = 'Success';
        outputCollection[1] = 'Form record updated.';
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
