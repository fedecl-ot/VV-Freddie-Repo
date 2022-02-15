const logger = require('../log');
var Q = require('q');

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

module.exports.main = function (vvClient, response, token) {
    /*
      Script Name:   scheduledProcess
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
 
      Date of Dev:   01/31/2022
      Last Rev Date: 02/01/2022
 
      Revision Notes:
      01/31/2022 - FEDERICO CUELHO:     First Setup of the script.
      02/01/2022 - FEDERICO CUELHO:     Added response log report by email.
     */

    logger.info('Start of logic for scheduledProcess on ' + new Date());

    /***************
     Error handling
    ****************/

    // Array for capturing error messages that may occur during the execution of the script.
    var errorLog = [];

    /***********************
     Configurable Variables
    ************************/

    const templateName = 'Milestone11';
    const emails = 'federico.cuelho@onetree.com';

    /*****************
     Script Variables
    ******************/

    var responseMessage = '';
    // const scheduledProcessGUID = token;

    // Describes the process being checked using the parsing and checking helper functions
    var shortDescription = '';

    // Responses counters.
    var countOK = 0;
    var countError = 0;

    /*****************
     Helper Functions
    ******************/

    /**********
     MAIN CODE 
    **********/

    // CREATES QUERY DATA PROMISE TO SOLVE
    var result = Q.resolve();

    // SOLVES QUERY DATA PROMISE
    return result
        .then(function () {
            const queryName = 'Milestone11 Query';
            shortDescription = 'Custom Query using filter parameter for backward compatibility';
            const customQueryData = {
                filter: `[Name] = 'Freddie'`,
            };
            return vvClient.customQuery.getCustomQueryResultsByName(queryName, customQueryData);
        })
        .then(function parseRes(vvClientRes) {
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
        })
        .then(function checkMetaAndStatus(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
        })
        .then(function checkDataPropertyExists(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
        })
        .then(function checkDataIsNotEmpty(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
        })
        .then(function (customQueryResp) {
            // CREATES THE PROMISE TO SOLVE
            let promiseArray = Q.resolve();

            // LOOPS EVERY FORM RECORD TO UPDATE DATA
            customQueryResp.data.forEach(function (formRecord) {
                promiseArray = promiseArray.then(function () {
                    // SAVES THE FORM REVISION ID TO UPDATE THE NEW FORM RECORD
                    const formGUID = formRecord['dhid'];
                    shortDescription = `Update form ${formGUID}`;

                    // CREATES NEW OBJECT WITH UPDATED SAVED FORM CONTROL VALUES
                    const formFieldsToUpdate = {
                        name: 'Freddie',
                        lastname: 'Cuelho',
                    };
                    // UPDATES THE FORM RECORD
                    return vvClient.forms
                        .postFormRevision(null, formFieldsToUpdate, templateName, formGUID)
                        .then(function parseRes(vvClientRes) {
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
                        })
                        .then(function checkMetaAndStatus(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
                        })
                        .then(function checkDataPropertyExists(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
                                    throw new Error(
                                        `${shortDescription} data property was not present. Please, check parameters and syntax. Status: ${status}.`
                                    );
                                }
                            }

                            return vvClientRes;
                        })
                        .then(function checkDataIsNotEmpty(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
                        })
                        .then(function countSuccessResponses() {
                            countOK++;
                        })
                        .catch(function countErrorResponses() {
                            countError++;
                        });
                });
            });
            // SOLVES PROMISE
            return promiseArray;
        })
        .then(function () {
            // SENDS THE RESPONSE MESSAGE BY EMAIL
            responseMessage = `${templateName} records updated. Log report sent to your email.`;

            shortDescription = `Send email to ${emails}`;
            const emailObj = {
                recipients: emails,
                subject: 'Scheduled process log report',
                body: `
                    Hello,<br>
                    <br>
                    Here is your <strong>${templateName}</strong> update log report:
                    <ul>
                        <li>Records updated successfully: <strong>${countOK}</strong></li>
                        <li>Records failed to update: <strong>${countError}</strong></li>
                        <li>Total records: <strong>${countError + countOK}</strong></li>
                    </ul>
                    <br>
                    Regards,<br>
                    <br>
                    VisualVault.
                `,
            };
            return vvClient.email
                .postEmails(null, emailObj)
                .then(function parseRes(vvClientRes) {
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
                })
                .then(function checkMetaAndStatus(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
                })
                .then(function checkDataPropertyExists(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
                })
                .then(function checkDataIsNotEmpty(vvClientRes, shortDescription, ignoreStatusCode = 999) {
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
                })
                .then(function () {
                    // Uncomment the following line for testing. You will see the log ONLY if the process runs as a test.
                    response.json(200, responseMessage);

                    // Uncomment the following line for production. You will see the log ONLY if the process runs automatically.
                    // return vvClient.scheduledProcess.postCompletion(scheduledProcessGUID, 'complete', true, responseMessage);
                });
        })
        .catch(function (error) {
            // SEND THE ERROR RESPONSE MESSAGE
            if (errorLog.length > 0) {
                responseMessage = `Error/s: ${errorLog.join('; ')}`;
            } else {
                responseMessage = `Unhandeled error occurred: ${error}`;
            }

            // Uncomment the following line for testing. You will see the log ONLY if the process runs as a test.
            response.json(200, responseMessage);

            // Uncomment the following line for production. You will see the log ONLY if the process runs automatically.
            // return vvClient.scheduledProcess.postCompletion(scheduledProcessGUID, 'complete', false, responseMessage);
        });
};
