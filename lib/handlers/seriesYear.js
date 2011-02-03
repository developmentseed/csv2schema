var seriesYear = {
    type: 'patternProperties',
    value: {
        '^[0-9]{4}$': {
            type: 'string',
        }
    }
}

module.exports = seriesYear;
