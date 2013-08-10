(function() {
	// Create closure so I dont polute the global NS.
	var testing = false;

	var isTesting = function() {
		testing = true;
	};

	var doneTesting = function() {
		testing = false;
	};

	var startTesting = function($container) {
		isTesting();
		var $body = $('body', $container);
		for (var prop in CSSProps) {
			var val = CSSProps[prop];
			for (var ind in val.values) {
				$body.css(prop, val.values[ind]);
				console.log('Property: ' + prop + ', Value: ' + val.values[ind]);
			}
		}
		doneTesting();
	};

	var cancelTesting = function($container) {
		var $body = $('body', $container);
		for (var prop in CSSProps) {
			var val = CSSProps[prop];
			$body.css(prop, val.defaultValue);
			console.log('Property: ' + prop + ', Value: ' + val.defaultValue);
		}
		$body.removeAttr('style');
		doneTesting();
	};

	$(document).ready(function() {
		var $textarea 		= $('#code');
		var $iframe 		= $('#chopping-block iframe');
		var $iframeContents = $iframe.contents();

		var editor = CodeMirror.fromTextArea($textarea.get(0), {
			mode: 'htmlmixed',
			theme: 'monokai',
			lineNumbers: true
		});

		// Start the test on tab switch event
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			if ($(e.target).attr('href') != '#chopping-block')
				return cancelTesting($iframeContents);

			$('body', $iframeContents).html(editor.getValue());
			setTimeout(startTesting.bind(window, $iframeContents), 1000);
		});

		$('#clear-styles').click(function() {
			cancelTesting($iframeContents);
		});
	});
})();