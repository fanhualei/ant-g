/**
 * List prompt example
 */

'use strict';
var inquirer = require('inquirer');
var _ = require('lodash');
var fuzzy = require('fuzzy');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

var states = [
    'Alabama',
    'Alaska',
    'American Samoa',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District Of Columbia',
    'Federated States Of Micronesia',
    'Florida',
    'Georgia',
    'Guam',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Marshall Islands',
    'Maryland',
];


function searchStates(answers, input) {
    input = input || '';
    return new Promise(function(resolve) {
        setTimeout(function() {
            var fuzzyResult = fuzzy.filter(input, states);
            resolve(
                fuzzyResult.map(function(el) {
                    return el.original;
                })
            );
        }, _.random(30, 500));
    });
}


inquirer
    .prompt([
        {
            type: 'autocomplete',
            name: 'state',
            message: 'Select a state to travel from',
            source: searchStates,
        },
    ])
    .then(function(answers) {
        console.log(JSON.stringify(answers, null, 2));
    });
