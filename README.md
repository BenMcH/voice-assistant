# OpenAI chatbot

This is a micro proof of concept combining a single endpoint express api with the ChatGPT api and SpeechSynthesis/SpeechRecognition APIs in the browser.

The index.html file will load in scripts and listen to the users' microphone for the following trigger phases:

* ok computer
* hello computer
* hey computer
* computer
* ok ned
* hello ned
* hey ned
* ned

Once the browser hears one of these phrases, it will continue listening until the user stops talking, at which point an API request will be made to `/answer` which will retreive a response from the chatGPT API and speak aloud in the users browser.
