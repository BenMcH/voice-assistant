let startTimestamp;
let recognition;

const regex = /(ok|hello|hey)?\s(ned|computer)\s*(?<question>.*)/i;

if (!('webkitSpeechRecognition' in window)) {
	upgrade();
} else {
	recognition = new webkitSpeechRecognition()
	recognition.continuous = true;

	recognition.onerror = function (event) {
		if (event.error == 'no-speech') {
			showInfo('info_no_speech');
		}
		if (event.error == 'audio-capture') {
			showInfo('info_no_microphone');
		}
		if (event.error == 'not-allowed') {
			if (event.timeStamp - startTimestamp < 100) {
				showInfo('info_blocked');
			} else {
				showInfo('info_denied');
			}
		}
	};

	recognition.onresult = function (event) {
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				const text = event.results[i][0].transcript;
				const match = text.match(regex)

				if (match) {
					fetch('/answer', {
						method: 'post',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ question: match.groups.question }),
					}).then(res => res.json()).then(data => {
						let utterance = new SpeechSynthesisUtterance(data.content);
						speechSynthesis.speak(utterance);
					})
				}
			}
		}
	};

	showInfo('')
	startButton({ timestamp: Date.now() })
}

function upgrade() {
	start_button.style.visibility = 'hidden';
	showInfo('info_upgrade');
}

let first_char = /\S/;
function capitalize(s) {
	return s.replace(first_char, function (m) { return m.toUpperCase(); });
}

function startButton(event) {
	recognition.lang = 'en-US';
	recognition.start();
	startTimestamp = event.timeStamp;
}

function showInfo(s) {
	if (s) {
		for (let child = info.firstChild; child; child = child.nextSibling) {
			if (child.style) {
				child.style.display = child.id == s ? 'inline' : 'none';
			}
		}
		info.style.display = 'display';
	} else {
		info.style.display = 'none';
	}
}

