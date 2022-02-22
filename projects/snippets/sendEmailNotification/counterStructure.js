await Promise.all(
    AuthArr.map(async (Auth) => {
        if (
            Auth['withCPRFound'] == 0 &&
            Auth['withoutCPRFound'] == 0 &&
            Auth['duplicateInCurrentPeriod'] == 0 &&
            Auth.record['end Date'] > cprObject.startdate &&
            Auth.record['start Date'] < cprObject.enddate
        ) {
            //It is not a duplicate and does not have duplicates in the current period.
            newRecCount++;
            let SBRCreationResponse = await NewSBRCreation(sbrTemplateID, cprObject, Auth, funderSvcArr, provArr);

            if (SBRCreationResponse == 'Created') {
                newRecSuccess++;
            } else {
                newRecError++;
            }

            if (newRecCount == newRecSuccess + newRecError) {
                autohirzationManaged = 'Complete';
            }
        }
    })
);
