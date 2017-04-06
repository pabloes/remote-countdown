/*var gui = require("nw.gui");

 // Extend application menu for Mac OS
 if (process.platform == "darwin") {
 var menu = new gui.Menu({type: "menubar"});
 menu.title="Godmodoro";
 menu.createMacBuiltin && menu.createMacBuiltin(window.document.title);
 gui.Window.get().menu = menu;
 }
 gui.Window.get().show();*/

import godmodoro from './godmodoro/godmodoro';

export default function () {
    let godmodoroClient = godmodoro();

    document.addEventListener("DOMContentLoaded", function () {
        let body = document.getElementById('body');

        body.onload = function(){
            applyBodyFontSize();
            body.onresize = applyBodyFontSize;
        };

        function applyBodyFontSize() {
            body.style.fontSize = getRelativeFontSize(body);
        }

        function getRelativeFontSize(element) {
            return Math.floor(Math.min(element.offsetWidth / 23, element.offsetHeight / 10)) + 'px';
        }
    });

    return godmodoroClient;
};