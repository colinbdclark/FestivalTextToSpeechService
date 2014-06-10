/*!
FLOE Festival Text to Speech Service

Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.
*/

"use strict";

var http = require("http");
var url = require("url");
var spawn = require("child_process").spawn;

http.createServer(function (req, res) {
    res.setHeader("Content-Type", "audio/wave");
    res.setHeader("Content-Disposition", "attachment; filename=tts.wav");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Parse user query.
    var query = url.parse(req.url, true).query;

    // Extract the text from the |q| parameter.
    var echo = spawn("echo", [query.q], {stdio: ["pipe", "pipe", "pipe"]});

    // Send the text to text2wave and stream the speech back to the user.
    var text2wave = spawn("/usr/bin/text2wave", [], {
        stdio: ["pipe", "pipe", "pipe"]
    });
    echo.stdout.pipe(text2wave.stdin, {end: true});
    text2wave.stdout.pipe(res, {end: true});
}).listen(8080);
