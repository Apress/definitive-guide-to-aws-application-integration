module.exports = {
    configure_credentials: function(AWS)
    {
        // AWS.config.region = 'us-west-2'; // Region
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId: 'us-west-2:fa17c899-4319-4048-a8ff-fa2a7fd73868',
        // });
        AWS.config.region = 'us-east-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:d02dc5fc-bec0-4863-8e30-5b2291203121',
        });
    },
    get_time: function () {
        return new Date().toISOString().replace('Z', '')
            .replace('T', ' ');
    }
};