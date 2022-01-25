SELECT
    DISTINCT [City],
    [County]
FROM
    [City Lookup]
WHERE
    [County] = @Value
ORDER BY
    [City] ASC