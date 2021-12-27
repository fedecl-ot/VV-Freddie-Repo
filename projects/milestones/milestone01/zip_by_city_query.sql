SELECT
    DISTINCT [Zip Code],
    [City]
FROM
    [City Lookup]
WHERE
    [City] = @Value
ORDER BY
    [Zip Code] ASC