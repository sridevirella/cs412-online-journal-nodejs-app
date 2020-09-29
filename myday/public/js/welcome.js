let dairy = require('./dairy')
let moment = require('moment')
let EventEmitter = require('events').EventEmitter

exports.welcome = function () {

    packageDemo()
    console.log('==============Modules================')
    console.log('Welcome page, displays your best memories such as a beautiful photo, ' +
        'highlighted thoughts from your journal and to-do list achievement from before day.')

    eventEmitterDemo()
    return true;
}

function packageDemo(){

    let selectedDate = "Tue Sept 22 2020 19:08:55"
    console.log('==============Package================')
    console.log( 'Moment.js package usage demo for date format: ' )
    console.log( 'User selected date is: ',selectedDate)
    console.log('Formatted date: ',moment(selectedDate, 'ddd MMM D YYYY HH:mm:ss').format("DD/MM/YYYY"))
    console.log('Date Time format: ',moment(selectedDate, 'ddd MMM D YYYY HH:mm:ss').format("MMMM Do YYYY, h:mm:ss a"))
}

function eventEmitterDemo(){

    let emitter = new EventEmitter()
    dairy.getThought(emitter)

    for( let i = 1; i <= 10; i++ ){
        console.log('pre-emitter')
        emitter.emit('demo', {counter : i} )
        console.log('post-emitter')
    }
}







