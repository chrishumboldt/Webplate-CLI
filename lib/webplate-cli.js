#! /usr/bin/env node
/*
 * webplate-cli
 * https://github.com/chrishumboldt/webplate-cli
 *
 * Copyright (c) 2015 Chris Humboldt
 * Licensed under the Apache-2 license.
 */

'use strict';


// Variables
// ---------------------------------------------------------------------------------------
var $arguments 				= process.argv.slice(2);
var $command 				= $arguments[0];


// Use child process
// ---------------------------------------------------------------------------------------
var exec 					= require('child_process').exec;


// Execute
// ---------------------------------------------------------------------------------------
switch($command)
{
	case 'component':

		if(($arguments[1] === 'add') && ($arguments[2]))
		{
			// Change the directory
			process.chdir('engine');

			// Start message
			console.log('Downloading the component...');

			// Run the build
			var child 			= exec('bower install ' + $arguments[2]);

			// Output
			child.stdout.on('data', function(data)
			{
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) 
			{
				console.log('Error: ' + data);
			});
			child.on('close', function() 
			{
				if(child.stdout)
				{
					console.log('The component has been added! View it under the project/components directory.');
				}
			});
		}
		else if(($arguments[1] === 'remove') && ($arguments[2]))
		{
			// Change the directory
			process.chdir('engine');

			// Start message
			console.log('Removing the component...');

			// Run the build
			var child 			= exec('bower uninstall ' + $arguments[2]);

			// Output
			child.stdout.on('data', function(data)
			{
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) 
			{
				console.log('Error: ' + data);
			});
			child.on('close', function(code) 
			{
				console.log('The component has been removed. Ahhhhh.');
			});
		}
		else
		{
			console.log('Sorry but what Bower component do you want to install?');
			console.log('webplate component add <bower_component>');
			console.log('');
		}

		break;

	case 'build':

		// Change the directory
		process.chdir('engine');

		// Check what to do
		if($arguments[1] === 'sass')
		{
			// Start message
			console.log('Building your SASS...');

			// Run the build
			var child 			= exec('grunt sass');

			// Output
			child.stdout.on('data', function(data)
			{
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) 
			{
				console.log('Error: ' + data);
			});
		}
		else if($arguments[1] === 'js')
		{
			// Start message
			console.log('Building your Javascript...');

			// Run the build
			var child 			= exec('grunt uglify');

			// Output
			child.stdout.on('data', function(data)
			{
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) 
			{
				console.log('Error: ' + data);
			});
		}
		else
		{
			// Start message
			console.log('Building your project...');

			// Run the build
			var child 			= exec('grunt build');

			// Output
			child.stdout.on('data', function(data)
			{
				console.log(data.trim());
			});
			child.stderr.on('data', function(data) 
			{
				console.log('Error: ' + data);
			});
		}

		break;

	case 'watch':

		process.chdir('engine');

		// Start message
		console.log('Watching project...');

		// Run the watch
		var child 			= exec('grunt watch');

		// Output
		child.stdout.on('data', function(data)
		{
			console.log(data.trim());
		});
		child.stderr.on('data', function(data) 
		{
			console.log('Error: ' + data);
		});

		break;

	default:

		console.log('So what command you wanna run?');
		console.log('');
		console.log('1) install');
		console.log('This command allows you to install a fresh copy of Webplate in the current directory');
		console.log('');
		console.log('2) component add');
		console.log('This command allows you to install a new Bower component of your choice. Bower is really awesome.');
		console.log('');

		break;
}