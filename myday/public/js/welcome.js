let dairy = require('./dairy')

exports.welcome = function () {

    dairy.getThought()
    console.log('Welcome page, displays your best memories such as a beautiful photo, ' +
                'highlighted thoughts from your journal and to-do list achievement from before day.')
    return true;
}