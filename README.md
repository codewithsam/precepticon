# precepticon
A rule validation library to compare and validate 2 values according to the list of cases based on its priority counter


# Usage

```sh
const Precepticon = require('precepticon');
const RuleSet = require('./pathtolib/Ruleset');
const precepticon = new Preceptor();

```

Below is working configuration file of one of our projects. This configuration file will help you understand the different type of options this library provides

```
let rules = {
        expressions: {
            any: {
            key: constants.rules.NAME_PHONE_ZIP,
            priority: 100,
            all: [
                        {
                            fact: 'name',
                            value: () => argsInput.name,
                            matchCriteria: {
                                threshold: 50,
                                validator: floppyNameMatch
                            }
                        },
                        {
                            fact: 'phone',
                            operator: 'indexOf',
                            hooks: {
                                pre: cleanup.phone_no
                            },
                            value: () => argsInput.phone
                        },
                        {
                            fact: 'zip',
                            operator: 'indexOf',
                            hooks: {
                                pre: cleanup.zip
                            },
                            value: () => argsInput.zip
                        }
                    ]
                },
                {
                    key: constants.rules.NAME_ZIP_ADDRESS,
                    priority: 90,
                    all: [
                        {
                            fact: 'name',
                            value: () => argsInput.name,
                            matchCriteria: {
                                threshold: retryThreshold,
                                validator: strictNameMatch
                            }
                        },
                        {
                            fact: 'zip',
                            operator: 'indexOf',
                            hooks: {
                                pre: cleanup.zip
                            },
                            value: () => argsInput.zip
                        },
                        {
                            fact: 'address',
                            value: () => argsInput.address,
                            hooks: {
                                pre: cleanup.removeAddressAbbr
                            },
                            matchCriteria: {
                                threshold: addressThreshold,
                                validator: floppyAddressMatch
                            }
                        },
                        {
                            fact: 'city',
                            operator: 'indexOf',
                            value: () => argsInput.city,
                        },
                        {
                            fact: 'state',
                            operator: 'indexOf',
                            hooks: {
                                post: stateMatchWithAbbr
                            },
                            value: () => argsInput.state,
                        }
                    ]
                },
                {
                    key: constants.rules.PARTIAL_MATCH,
                    priority: 80,
                    all: [
                        {
                            fact: 'name',
                            value: () => argsInput.name,
                            matchCriteria: {
                                threshold: 50,
                                validator: floppyNameMatch
                            }
                        },
                        {
                            fact: 'phone',
                            operator: 'excludes',
                            hooks: {
                                pre: cleanup.phone_no
                            },
                            value: () => argsInput.phone
                        },
                        {
                            fact: 'zip',
                            operator: 'indexOf',
                            hooks: {
                                pre: cleanup.zip
                            },
                            value: () => argsInput.zip
                        },
                        {
                            fact: 'address',
                            value: () => argsInput.address,
                            matchCriteria: {
                                threshold: retryThreshold,
                                validator: (factBody) => factBody.value == undefined
                            }
                        },

                    ],
                    onSuccess: ()=>{
                        return {
                            exception: ERROR_SEARCH_PARTIAL_MATCH
                        }
                    }
                },
                {
                    key: constants.rules.STRICT_NAME_MATCH,
                    priority: 50,
                    all: [
                        {
                            fact: 'name',
                            value: () => argsInput.name,
                            matchCriteria: {
                                threshold: 100,
                                validator: strictNameMatch
                            }
                        }
                    ]
                }
            ]
        }
}
```

```
precepticon.addRules(rules);
```

```
precepticon.validate({
    name: "MSI GV62 8RE-016 15.6" IPS GTX 1060 i5-8300H 8 GB Memory"
    zip: "112114"
    phone: "9876543212",
    address: "72 DLF Phase 5",
    city: "Oakland"
    state: "California"
})
    .then(function(validCase){
        if(validCase.length < 1) return false;
        validCase.forEach(function(caseObj){
            if(caseObj.getKey() === constants.rules.PARTIAL_MATCH){
                throw errors[caseObj.getThence().exception];
            }
        });
        console.log("One of the case matched!");
    });
```