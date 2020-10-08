const axios = require('axios')

exports.getActivity = function (){

    axios.get('https://www.boredapi.com/api/activity')
        .then( response => {

            console.log( response.data['activity'])
            createElements(response.data['activity']);
        })
        .catch( error => {
            console.log("inside catch:"+ error.message)
        })

    function createElements(resData){

        var spanElement = document.createElement('span');
        if( resData !== undefined)
            spanElement.innerText = resData;
        var divElement = document.querySelector('#div2');
        divElement.appendChild(spanElement);
    }
}
