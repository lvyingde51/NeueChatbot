﻿
var builder = require('botbuilder');

var fetchUrl = require("fetch").fetchUrl;

module.exports = {
    help: function (session) {
        session.endDialog('Hi! Wie kann ich dir helfen?');
    },    

    leistungsabfrage: function (session, args, next) {
        // try extracting entities
        var fitnessCenterEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'FitnessCenter');

        console.log('Fitness Leistung abfragen');

        if (fitnessCenterEntity) {
            var urlFitness = "http://chatbotsandbox.getsandbox.com/v1.0/fitnesses/" + fitnessCenterEntity.entity.toString();

            console.log(urlFitness.toString());

            fetchUrl(urlFitness, function (error, meta, body) {
                console.log(body.toString());
                var obj = JSON.parse(body);
                console.log(obj.certified);

                if (!!JSON.parse(String(obj.certified).toLowerCase())) {
                    session.dialogData.searchType = 'FitnessCenter';
                    builder.Prompts.text(session, 'Ihr Fitnesszentrum ist zertifiziert');

                } else {
                    // no entities detected, ask user for a destination
                    builder.Prompts.text(session, 'Ihr Fitnesszentrum ist leider nicht zertifiziert');
                }
            });
        } else {
            console.log('Fitness Zentrum wird nicht identifiziert');

            session.beginDialog('FitnessZentrumFragen');
        }
    },

    FitnessZentrumFragen: function (session) {
        session.endDialog('Wo möchten Sie Fitness Abo abschliessen');
    },

    Versicherungstyp: function (session) {
        session.endDialog('Welche Versicherung hast du?');
    }
}