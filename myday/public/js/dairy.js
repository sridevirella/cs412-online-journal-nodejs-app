let photo = require('./photos')

exports.getThought = function () {

    photo.getMemory()
    console.log('Dairy page, you to reflect on the amazing things that happened throughout your day and ' +
                'how you could improve for tomorrow.')
    return true;
}