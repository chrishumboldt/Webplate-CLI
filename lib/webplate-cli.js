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
// ---------------------------------------------------------------------------------------
var $arguments 				= process.argv.slice(2);
var $command 				= $arguments[0];
var $html 					= '';


// Requires
// ---------------------------------------------------------------------------------------
var exec 					= require('child_process').exec;
var mkdirp 					= require('mkdirp');
var fs 						= require('fs');


// HTML
// ---------------------------------------------------------------------------------------
$html += '<!DOCTYPE html>\n\r';
$html +='<html>\n\r';
$html +='<head>\n\r\n\r';

	$html += '\t<!-- Meta setup -->\n\r';
    $html += '\t<meta charset="utf-8">\n\r';
    $html += '\t<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui">\n\r\n\r';

    $html += '\t<!-- Title -->\n\r';
    $html += '\t<title>Webplate Project</title>\n\r\n\r';

    $html += '\t<!-- Include Webplate -->\n\r';
    $html += '\t<script src="webplate/stack.js" id="webplate-stack"></script>\n\r\n\r';
    
$html += '</head>\n\r';
$html += '<body style="display:none">\n\r\n\r';

	$html += '\t<div class="banner fuse"><div class="limit">\n\r';
	$html += '\t\t<h1>Your Webplate Project is a go!</h1>\n\r';
	$html += '\t\t<p>We cannot wait to see what exciting new project you are going to build.</p>\n\r';
	$html += '\t</div></div>\n\r\n\r';

$html += '</body>\n\r';
$html += '</html>\n\r';


// Execute
// ---------------------------------------------------------------------------------------
switch($command)
{
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
				console.log('The component has been added! You can view it under the project/components directory.');
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
		}

		break;

	case 'create':

		if($arguments[1])
		{
			mkdirp($arguments[1], function(err)
			{
				if(err)
				{
					console.error(err);
				}
				else 
				{
					// Start message
					console.log('Creating your new project...');

					// Change the directory
					process.chdir($arguments[1]);

					// Create Bowerrc
					fs.writeFile('.bowerrc', '{ "directory":"" }', function(error)
					{
						// Download fresh copy of Webplate
						if($arguments[2])
						{
							var child 		= exec('bower install webplate#' + $arguments[2]);
						}
						else
						{
							var child 		= exec('bower install webplate');
						}

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
							// Remove bowerrc
							fs.unlinkSync('.bowerrc');

							// Start message
							console.log('Downloading dependencies...');

							// Change the directory
							process.chdir('webplate/engine');

							// Install dependancies
							var child_2 	= exec('npm install');

							// Output
							child_2.stdout.on('data', function(data)
							{
								console.log(data);
							});
							child_2.on('close', function() 
							{
								// Change the directory
								process.chdir('../../');

								// Create index.html
								fs.writeFile('index.html', $html, function(error)
								{
									if(error) return console.log(error);

									console.log('Your project has been created. Build something out of this world!');
								});
							});
							
							// Load dependecies
							// npm.load('package.json', function(err)
							// {
							// 	// catch errors
							// 	npm.commands.install(function(er, data)
							// 	{
							// 		console.log('');
							// 		console.log('Your project has been created. Build something out of this world!');
							// 	});
							// 	npm.on('log', function (message)
							// 	{
							// 		console.log(message);
							// 	});
							// });
						});
					});
				}
			});
		}
		else
		{
			console.log('What would you like your project to be called?');
			console.log('Command: webplate create <project_name> <version|tag|optional>');
		}

		break;

	case 'download':

		if($arguments[1])
		{
			var child 		= exec('bower install webplate#' + $arguments[1]);
		}
		else
		{
			var child 		= exec('bower install webplate');
		}

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

		console.log('');
		console.log('So what command you wanna run?');
		console.log('');
		console.log('1) build');
		console.log('Build your project SASS and Javascript.');
		console.log('');
		console.log('2) build <sass|js>');
		console.log('Build your project SASS or Javascript.');
		console.log('');
		console.log('3) create <project_name> <version|tag|optional>');
		console.log('Create a new project with a fresh copy of Webplate and a starter index.html file.');
		console.log('');
		console.log('4) component add <bower_component>');
		console.log('Install a new Bower component of your choice. Bower is really awesome!');
		console.log('');
		console.log('5) download <version|tag|optional>');
		console.log('Download a crisp new copy of Webplate in the current directory.');
		console.log('');
		console.log('6) watch');
		console.log('Run the project watcher to watch for file changes. Any change will rebuild your SASS and Javascript and perform a live reload (if installed).');
		console.log('');

		break;
}