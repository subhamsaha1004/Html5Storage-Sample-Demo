(function(window){
	var doc = window.document,
			$ = function(selector){
				var result = doc.querySelectorAll(selector);

				return (result.length > 1) ? result : result[0];
			},
			message = $('.message');

	var favcolor = $('#favcolor'),
			fontsz = $('#fontsz');

	// Strong the items on submit
	$('#save').addEventListener('click', setItems, false);

	// Clearing the items on reset
	$('#reset').addEventListener('click', clearItems, false);

	applySettings();

	function setItems(e){
		if("localStorage" in window && window["localStorage"] !== null){
			try{
				console.log(favcolor.value, fontsz.value)
				localStorage.setItem('bgcolor', favcolor.value);
				localStorage.fontsize = fontsz.value;

				// Setting the message to show to the user
				message.classList.remove('error');
				message.classList.remove('otherTab');
				message.classList.add('success');
				message.innerHTML = "Values successfully saved";

				// Apply the setttings
				applySettings();
			} catch(e) {
				if(e == QUOTA_EXCEEDED_ERR){
					message.innerHTML = "Quota exceeded";
					message.classList.remove('success');
					message.classList.remove('otherTab');
					message.classList.add('error');
					console.log(e);
				}
			}
		} else {
			message.innerHTML = 'Cannot store the data as your browser does not support localStorage';
			message.classList.add('error');
		}
	}

	function clearItems(e){
		if(localStorage.length != 0){
			// Clearing the localStorage
			localStorage.removeItem("bgcolor");
	    localStorage.removeItem("fontsize");

	    // Setting the message
	    message.classList.remove('error');
	    message.classList.remove('otherTab');
			message.classList.add('success');
			message.innerHTML = "Values have been cleared";

			// Resetting everything to the defaults
	    setDefaults();
	  }
	}

	function applySettings(otherTab){
		if(localStorage.length != 0){
			doc.body.style.backgroundColor = localStorage.getItem('bgcolor');
			doc.body.style.fontSize = localStorage.fontsize + 'px';
			favcolor.value = localStorage.bgcolor;
			fontsz.value = localStorage.fontsize;
			if(otherTab){
				message.classList.remove('error');
				message.classList.remove('success');
				message.classList.add('otherTab');
				message.innerHTML = "Value changed in other tab. Applied here";
			}
		}
	}

	function setDefaults(otherTab){
		doc.body.style.backgroundColor = "#fff";
		doc.body.style.fontSize = '14px';
		favcolor.value = '#ffffff';
		fontsz.value = '13';
		if(otherTab){
			message.classList.remove('error');
			message.classList.remove('success');
			message.classList.add('otherTab');
			message.innerHTML = "Value changed in other tab. Applied here";
		}
	}

	// Applying the changes on storage event
	window.addEventListener('storage', handleStorage, false);
	function handleStorage(e){
		if(localStorage.length != 0){
			applySettings(true);
		}else {
			setDefaults(true);
		}
		for(var prop in e){
			console.log(prop + ': ' + e[prop]);
		}
	}

}(this));