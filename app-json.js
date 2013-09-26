(function(window){
	var doc = window.document,
			$ = function(selector){
				var result = doc.querySelectorAll(selector);

				return (result.length > 1) ? result : result[0];
			}

	// Adding JSON to localstorage
	$('#savejson').addEventListener('click', saveJson, false);
	$('#resetjson').addEventListener('click', clearJson, false);

	function saveJson(e){
		var values = {};
		[].forEach.call($('.inpCls'), function(inp){
			values[inp.name] = inp.value;
		});

		// Stores the js objects as a string
		localStorage.setItem('jsonval', JSON.stringify(values));
		// Parses the saved string into a JavaScript object again 
		console.log(JSON.parse(localStorage.getItem("jsonval")));
	}

	function clearJson(){
		localStorage.removeItem('jsonval');
	}

	// Store image data into localStorage. Load the image from the server through javascript the first time, but for every other oage load after that, we read the saved image form localStorage instead

	// Get reference to image element
	var img = $('#img');
			storageFiles = JSON.parse(localStorage.getItem('storageFiles')) || {},
			storageFilesDate = storageFiles.date,
			date = new Date(),
			todaysDate = (date.getMonth() + 1).toString() + date.getDate().toString();
	
	// Compare date and localStorage if it does not exist or is too old
	if(typeof storageFilesDate === "undefined" || storageFilesDate < todaysDate){
		// take action as image is loaded
		img.addEventListener('load', function(e){
			var canvas = doc.createElement('canvas'),
					context = canvas.getContext('2d');

			// make sure canvas is as big as the image
			canvas.width = img.width;
			canvas.height = img.height;

			// draw the image into the canvas element
			context.drawImage(img, 0, 0, img.width, img.height);

			// get the image as data url
			storageFiles.imgDataUrl = canvas.toDataURL("image/jpg");

			// set the date for localstorage
			storageFiles.date = todaysDate;

			// save image into localstorage
			try{
				localStorage.setItem('storageFiles', JSON.stringify(storageFiles));
			} catch(e){
				console.log('Storage failed: ' + e);
			}
		}, false);

		// 
		img.setAttribute('src', 'images/subham.jpg');
	} else {
		// Use the image form localStorage
		img.setAttribute('src', storageFiles.imgDataUrl);
		console.log(JSON.parse(localStorage.getItem('storageFiles')));
	}

	$('#clearImage').addEventListener('click', function(e){
		if(storageFiles.length != 0){
			localStorage.removeItem('storageFiles');
		}
	}, false);

	// Storing any other kind of file in localstorage. This is a generalised approach. We are using here another image file
	var fileStorage = localStorage.getItem('someFile'),
			file = $('#img2');

	if(fileStorage){
		console.log(fileStorage);
		file.setAttribute('src', fileStorage);
	} else {
		var xhr = new XMLHttpRequest(),
				blob,
				fileReader = new FileReader();

		xhr.open('GET', 'images/sherlock.jpg', true);
		//Set the response type to arraybuffer, blob can be an option too rendering manual creation of blob unneccessary
		xhr.responseType = 'arraybuffer';
		// xhr.responseType = 'blob';

		xhr.addEventListener('load', function(){
			// Create a blob from the response
			blob = new Blob([xhr.response], { type: "image/png" });

			// Onload needed because chroem does not support addeventlistener for filereader
			fileReader.onload = function(e){
				var result = e.target.result;
				file.setAttribute('src', result);

				try {
					localStorage.setItem('someFile', result);
				} catch(e) {
					console.log('Storage Faild: ' + e);
				}
			}

			// load blob as data url, if responseType is blob then we can directly load xhr.response
			fileReader.readAsDataURL(blob);
			// fileReader.readAsDataURL(xhr.response);
		}, false);

		xhr.send()
	}

	$('#clearFile').addEventListener('click', function(e){
		if(fileStorage){
			localStorage.removeItem('someFile');
		}
	}, false);

}(this));