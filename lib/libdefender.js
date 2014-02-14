'use strict';

function handleErr(err) {
    if (err) console.log('\n### err: ', err);
}

function authenticate(wdClient, credentials, selectors) {
    wdClient.setValue(
        selectors.user,
        credentials.user,
        handleErr
    ).
    setValue(
        selectors.pass,
        credentials.pass,
        handleErr
    );
}

function handleMissingArgs(program) {
    console.log('\n### Missing arguments, showing usage...'.red);
    console.log(program.usage());

    console.log('\n### Exiting.');
    process.exit(1);
}

module.exports = {
    authenticate: authenticate,
    handleErr: handleErr,
    handleMissingArgs: handleMissingArgs
};