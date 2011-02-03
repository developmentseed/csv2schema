Convert CSV file to JSON schema, in a particular way.  For example:

    "name","title","desc","type"
    "first","First Name","Student's first name","string"
    "last","Last Name","Student's last name","string"
    "score","Test score","Student's test score","seriesYear"

becomes:

{
    "type": "object",
    "properties": {
        "first": {
            "title": "First Name",
            "desc": "Student's first name",
            "type": "string"
        },
        "last": {
            "title": "Last Name",
            "desc": "Student's last name",
            "type": "string"
        },
        "score": {
            "title": "Test score",
            "desc": "Student's test score",
            "patternProperties": {
                "^[0-9]{4}$": {
                    "type": "string"
                }
            },
            "type": "object"
        }
    }
}

### Handlers

You can write handlers which let you mix-in a custom handler for the 'type' column.

### Assumptions

* First column contains keys
* Only 'type' column supports handlers
* If handler not found for given type, defaults to flat key:value
