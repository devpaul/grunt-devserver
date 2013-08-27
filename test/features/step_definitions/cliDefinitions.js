function cliDefinitions() {
    this.Given(/^I am in the assets folder$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback.pending();
    });

    this.When(/^I run devserver from the command line$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback.pending();
    });

    this.Then(/^I expect a server to be started$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback.pending();
    });
}

module.exports = cliDefinitions;