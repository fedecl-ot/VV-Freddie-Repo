let logger = require('../log');

module.exports.getCredentials = function () {
    var options = {};
    options.customerAlias = 'Freddie';
    options.databaseAlias = 'Main';
    options.userId = 'freddie.API';
    options.password = 'Federico41';
    options.clientId = '24209932-7733-490c-8b00-0bf0c69759c4';
    options.clientSecret = '9ulj97b5CH0ygeT0xP3Bs//QdyQ5pvB4fBE4LiNpcH0=';
    return options;
};

module.exports.main = async function (ffCollection, vvClient, response) {
    /*Script Name:  verifyUniqueWebService
   Customer:      N/A
   Purpose:       The purpose of this process is to verify if the form record is unique.
   Parameters:    TemplateID - (String, Required) Used in the query to verify if the record is unique or unique matched.
                  name - (String, Required) Used in the query to verify if the record is unique or unique matched.
                  lastName - (String, Required) Used in the query to verify if the record is unique or unique matched.
                  formId - (String, Required) Used in the query to verify if the record is unique or unique matched.
              
   Return Array:  1. Status: 'Success', 'Error'
                  2. Message
                  3. Status of the verify call
                  
   Pseudo code:   1. Build query formatted variables.
                  2. Call VerifyUniqueRecord webservice to determine whether the template record is unique per the passed in information.
                  3. Send response with return array.
 
   Date of Dev:   1/26/2020
   Last Rev Date: N/A
   Revision Notes:
   1/26/2020  - FEDERICO CUELHO: Script created.
   */

    logger.info('Start of the process Milestone10 at ' + Date());

    /**********************
   Configurable Variables
  ***********************/
    //Template ID
    let TemplateID = 'Milestone10';

    // Error message guidances
    let missingFieldGuidance = 'Please provide a value for the missing field and try again, or contact a system administrator if this problem continues.';

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = [];

    // Array for capturing error messages that may occur within helper functions.
    let errorLog = [];

    /*********************
     Form Record Variables
    **********************/
    //Create variables for the values on the form record
    var name = getFieldValueByName('Name');
    var lastName = getFieldValueByName('Lastname');
    let formId = getFieldValueByName('Record ID');

    // Specific fields are detailed in the errorLog sent in the response to the client.
    if (errorLog.length > 0) {
        throw new Error(`${missingFieldGuidance}`);
    }

    /****************
     Helper Functions
    *****************/
    // Check if field object has a value property and that value is truthy before returning value.
    function getFieldValueByName(fieldName, isOptional) {
        try {
            let fieldObj = ffCollection.getFormFieldByName(fieldName);
            let fieldValue = fieldObj && (fieldObj.hasOwnProperty('value') ? fieldObj.value : null);

            if (fieldValue === null) {
                throw new Error(`A value property for ${fieldName} was not found.`);
            }
            if (!isOptional && !fieldValue) {
                throw new Error(`A value for ${fieldName} was not provided.`);
            }
            return fieldValue;
        } catch (error) {
            errorLog.push(error);
        }
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

    try {
        /****************
     BEGIN ASYNC CODE
    *****************/

        //1. Builds query formatted variables.
        let uniqueRecordArr = [
            {
                name: 'templateId',
                value: TemplateID,
            },
            {
                name: 'query',
                value: `[Name] eq '${name}' AND [Lastname] eq '${lastName}'`,
            },
            {
                name: 'formId',
                value: formId,
            },
        ];

        let shortDescription = `Run Web Service: LibFormVerifyUnique`;

        // 2 - Calls LibFormVerifyUniqueRecord ws to determine whether the template record is unique per the passed in information.
        const runWSResp = await vvClient.scripts
            .runWebService('LibFormVerifyUniqueRecord', uniqueRecordArr)
            .then((res) => parseRes(res, shortDescription))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription));

        const verifyUniqueData = runWSResp.data;

        // 3. Sends response to client with return response and status array.
        switch (verifyUniqueData.status) {
            case 'Not Unique':
                outputCollection[0] = 'Success';
                outputCollection[1] = `This record is a duplicate of another record. ${verifyUniqueData.statusMessage}.`;
                break;
            case 'Unique':
                outputCollection[0] = 'Success';
                outputCollection[1] = `This record is the only record created. ${verifyUniqueData.statusMessage}.`;
                break;
            case 'Unique Matched':
                outputCollection[0] = 'Success';
                outputCollection[1] = `The actual record is the only record. ${verifyUniqueData.statusMessage}.`;
                break;
            default:
                throw new Error(`The call to LibFormVerifyUniqueRecord returned with an error. ${verifyUniqueData.statusMessage}.`);
        }
    } catch (error) {
        // Log errors captured.
        logger.info(JSON.stringify(`${error} ${errorLog}`));
        outputCollection[0] = 'Error';
        outputCollection[1] = `${errorLog.join(' ')} ${error.message}`;
    } finally {
        response.json(200, outputCollection);
    }
};
