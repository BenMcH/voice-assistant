const openai = require('openai');
const express = require('express')
const app = express()
const port = 3000

const config = new openai.Configuration({ apiKey: process.env.OPENAI_API_KEY })
const api = new openai.OpenAIApi(config);


app.use(express.static('public'))
app.use(express.json());

app.post('/answer', async (req, res) => {
	const { body } = req;
	if (body.question) {
		const ans = await api.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You are a chat bot that receives queries from a speech to text model from within a web browser. Please do your best to answer questions directly and succinctly. If a direct answer is not available, respond with suggested topics to ask about' },
				{ role: 'user', content: body.question }
			]
		})

		res.send(ans.data.choices[0].message);
	}
})

app.listen(port, () => {
	console.log(`Voice Assistant listening on port ${port}. Open in a chromium browser`)
})
