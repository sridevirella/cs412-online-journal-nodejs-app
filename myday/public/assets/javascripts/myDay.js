$(document).ready(function() {
    $('#heartIcon').hide()
    $('#search-checkbox').hide()
    $('input[type="radio"]').click(function() {
        if($(this).attr('id') === 'searchByFavorite') {
            $('#heartIcon').show()
            $('#search-checkbox').prop('checked', true)
        }
        else {
            $('#heartIcon').hide()
            $('#search-checkbox').prop('checked', false)
        }
    })

    $('#addHeartIcon').click(function() {
        if($(this).attr('id') === 'addHeartIcon') {

            $('#addHeartIcon').css('color', 'red')
            $('#favorite').prop('checked', true)
        }
        else {
            $('#addHeartIcon').css('color', 'black')
            $('#favorite').prop('checked', false)
        }
    })
})



$(function () {
    let duration = 4000
    setTimeout(function ()
    { $('#flashMessage').hide()
    }, duration)
})

$(document).ready(function() {
    $('#searchWord').hide()
    $('#searchDate').hide()
    $('input[type="radio"]').click(function () {
        if ($(this).attr('id') === 'searchWordRadio') {
            $('#searchWord').show()
        } else {
            $('#searchWord').hide()
        }
    })
})

$(document).ready(function() {
    $('#searchDate').hide()
    $('#searchWord').hide()
    $('input[type="radio"]').click(function () {
        if ($(this).attr('id') === 'searchDateRadio') {
            $('#searchDate').show()
        } else {
            $('#searchDate').hide()
        }
    })
})