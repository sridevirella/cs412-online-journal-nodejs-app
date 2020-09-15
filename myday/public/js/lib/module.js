(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.welcome = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let photo = require('./photos')

exports.getThought = function () {

    photo.getMemory()
    console.log('Dairy page, you to reflect on the amazing things that happened throughout your day and ' +
                'how you could improve for tomorrow.')
    return true;
}
},{"./photos":2}],2:[function(require,module,exports){

exports.getMemory = function () {
    console.log('Photos page, You can upload and view your magical moments with a daily photo and ' +
                'a time line view to see all your daily photos.')
    return true;
}
},{}],3:[function(require,module,exports){
let dairy = require('./dairy')

exports.welcome = function () {

    dairy.getThought()
    console.log('Welcome page, displays your best memories such as a beautiful photo, ' +
                'highlighted thoughts from your journal and to-do list achievement from before day.')
    return true;
}
},{"./dairy":1}]},{},[3])(3)
});
