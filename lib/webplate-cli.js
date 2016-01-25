#! /usr/bin/env node

/*
 * webplate-cli
 * https://github.com/chrishumboldt/webplate-cli
 *
 * Copyright (c) 2015 Chris Humboldt
 * Licensed under the Apache 2.0 license.
 */

'use strict';

// Variables
var $arguments = process.argv.slice(2);
var $command = $arguments[0];
var $html = '';

// Requires
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var fs = require('fs');

// HTML
$html += '<!DOCTYPE html>\n';
$html += '<html>\n';
$html += '<head>\n\n';
$html += '\t<meta charset="utf-8">\n';
$html += '\t<meta http-equiv="x-ua-compatible" content="ie=edge">\n';
$html += '\t<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n';
$html += '\t<title>Project Name</title>\n\n';
$html += '</head>\n';
$html += '<body>\n\n';
$html += '\t<div id="webplate-content" style="display:none">\n';
$html += '\t\t/* Your content goes here */\n';
$html += '\t</div>\n\n';
$html += '\t<script id="webplate" src="webplate/start.js"></script>\n\n';
$html += '</body>\n';
$html += '</html>\n';

// Execute
switch ($command) {

	case 'build':
		process.chdir('engine');
		if ($arguments[1] === 'css') {
			console.log('Building your CSS...');
			var child = exec('gulp css');
			// Output
			child.stdout.on('data', function(data) {
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				console.log('Error: ' + data);
			});
		} else if ($arguments[1] === 'js') {
			console.log('Building your Javascript...');
			var child = exec('gulp js');
			// Output
			child.stdout.on('data', function(data) {
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				console.log('Error: ' + data);
			});
		} else if ($arguments[1] === 'setup') {
			console.log('Downloading dependencies (This might take a bit)...');
			var child_2 = exec('npm install');
			// Output
			child_2.stdout.on('data', function(data) {
				console.log(data);
			});
			child_2.on('close', function() {
				process.chdir('../');
				console.log('Everything has been downloaded. You are now ready to start building your project out.');
			});
		} else {
			console.log('Building your project...');
			var child = exec('gulp build');
			// Output
			child.stdout.on('data', function(data) {
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				console.log('Error: ' + data);
			});
		}
		break;

	case 'component':
		if (($arguments[1] === 'add') && ($arguments[2])) {
			process.chdir('engine');
			console.log('Downloading the component...');
			var child = exec('bower install ' + $arguments[2]);
			// Output
			child.stdout.on('data', function(data) {
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				console.log('Error: ' + data);
			});
			child.on('close', function() {
				console.log('The component has been added! You can view it under the project/components directory.');
			});
		} else if (($arguments[1] === 'remove') && ($arguments[2])) {
			process.chdir('engine');
			console.log('Removing the component...');
			var child = exec('bower uninstall ' + $arguments[2]);
			// Output
			child.stdout.on('data', function(data) {
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				console.log('Error: ' + data);
			});
			child.on('close', function(code) {
				console.log('The component has been removed. Ahhhhh.');
			});
		} else {
			console.log('Sorry but what Bower component do you want to install?');
			console.log('webplate component add <bower_component>');
		}
		break;

	case 'create':
		if ($arguments[1]) {
			mkdirp($arguments[1], function(err) {
				if (err) {
					console.error(err);
				} else {
					console.log('Creating your new project...');
					process.chdir($arguments[1]);
					fs.writeFile('.bowerrc', '{ "directory":"" }', function(error) {
						if ($arguments[2]) {
							var child = exec('bower install webplate#' + $arguments[2]);
						} else {
							var child = exec('bower install webplate');
						}
						// Output
						child.stdout.on('data', function(data) {
							console.log(data.trim());
						});
						child.stderr.on('data', function(data) {
							console.log('Error: ' + data);
						});
						child.on('close', function() {
							fs.unlinkSync('.bowerrc');
							fs.writeFile('index.html', $html, function(error) {
								if (error) return console.log(error);
								console.log('Your project has been created. Build something out of this world!');
							});
						});
					});
				}
			});
		} else {
			console.log('What would you like your project to be called?');
			console.log('Command: webplate create <project_name> <version|tag|optional>');
		}
		break;

	case 'download':
		console.log('Downloading Webplate...');
		fs.writeFile('.bowerrc', '{ "directory":"" }', function(error) {
			if ($arguments[1]) {
				var child = exec('bower install webplate#' + $arguments[1]);
			} else {
				var child = exec('bower install webplate');
			}
			// Output
			child.stdout.on('data', function(data) {
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				console.log('Error: ' + data);
			});
			child.on('close', function() {
				fs.unlinkSync('.bowerrc');
				console.log('Webplate has been downloaded!');
			});
		})
		break;

	case 'watch':
		process.chdir('engine');
		console.log('Watching project...');
		var child = exec('gulp watch');
		// Output
		child.stdout.on('data', function(data) {
			console.log(data.trim());
		});
		child.stderr.on('data', function(data) {
			console.log('Error: ' + data);
		});
		break;

	default:
		console.log('');
		console.log('So what command you wanna run?');
		console.log('');
		console.log('1) build');
		console.log('Build your project CSS and Javascript.');
		console.log('');
		console.log('2) build <css|js>');
		console.log('Build your project CSS or Javascript.');
		console.log('');
		console.log('3) build setup');
		console.log('Make your Webplate project build ready. This will download Gulp and all its dependecies.');
		console.log('');
		console.log('4) create <project_name> <version|tag|optional>');
		console.log('Create a new project with a fresh copy of Webplate and a starter index.html file.');
		console.log('');
		console.log('5) component add <bower_component>');
		console.log('Install a new Bower component of your choice. Bower is really awesome!');
		console.log('');
		console.log('6) download <version|tag|optional>');
		console.log('Download a crisp new copy of Webplate in the current directory.');
		console.log('');
		console.log('7) watch');
		console.log('Run the project watcher to watch for file changes. Any change will rebuild your CSS and Javascript and perform a live reload (if installed).');
		console.log('');
		break;
}