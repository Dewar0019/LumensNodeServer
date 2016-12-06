require('dotenv').config();
var autobahn = require('autobahn');
var unirest = require('unirest');
var authToken;
var authTokenExpiration;
var session;


var authURL = "https://brandeis-backend.siteworx.io/api/v1/auth/user"

var ids = {
    "back": "4cU2pb1qvtp",
    "left": "4cU2p6k7LUe",
    "right": "4cU2p8PEyST"
}

function getAuthToken() {
    console.log("Authenticating....");
    unirest.post(authURL)
        .type('json')
        .send({
            organization: process.env.ORGANIZATION,
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        })
        .end(function(response) {
            if (response.body !== undefined && response.body.errors == undefined) {
                console.log("Received Auth token");
                authToken = response.body.access_token;
                connection.open()
            } else {
                console.log(err);
                console.log("Could not get auth token");
            }
        });
}


function onchallenge(session, method, extra) {
    console.log("Challenge Authorization Requested");
    return authToken;
}

var connection = new autobahn.Connection({
    url: 'wss://backend-staging.siteworx.io:8444',
    realm: 'com.digitallumens',
    authmethods: ["ticket"],
    authid: "user",
    onchallenge: onchallenge
});


connection.onopen = function(newSession, details) {
    console.log("WAMP Connection Opened Successfully");
    session = newSession;
};


connection.onclose = function(reason, details) {
    console.log("Reason for closure: " + reason);
    console.log(details);

    authToken();
}


getAuthToken();

setInterval(function() {
    getAuthToken();
}, 3600000);


module.exports = {
    getLightLevels: function(light, callback) {
        var lightLevels = {};

        var setLights = {
            procedure: "getGroupSetting",
            token: authToken,
            id: ids[light],
            params: {}
        };

        session.call('com.digitallumens.client-service.settings', [], setLights).then(
            function(result) {
                lightLevels[light] = result.kwargs.setting.active_level;
                callback(null, lightLevels);
            },
            function(error) {
                console.dir(error);
            }
        );

    },

    setLightLevel: function(light, active_level) {
        var setLights = {
            procedure: "setGroupSetting",
            token: authToken,
            id: ids[light],
            params: {
                setting: {
                    "active_level": active_level,
                    "vacancy_enabled": true,
                    "inactive_level": 0,
                    "vacancy_delay_sec": 300
                }
            }
        };

        session.call('com.digitallumens.client-service.settings', [], setLights).then(
            function(result) {
                console.log("Successfully changed light level for " + light + " to " + active_level);
            },
            function(error) {
                console.dir(error);
            }
        );
    }


};