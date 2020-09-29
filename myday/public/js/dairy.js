let photo = require('./photos')

exports.getThought = function (emitter) {

    photo.getMemory()

    console.log('Dairy page, you to reflect on the amazing things that happened throughout your day and ' +
    'how you could improve for tomorrow.')

    eventListener(emitter)
    return true;
}

function eventListener(emitter){

    console.log("==============Event Emitters==============")

    emitter.on('demo', function (event) {
        console.log('Received demo event ' + event.counter)
    })
}