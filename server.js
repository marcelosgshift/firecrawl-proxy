import express from "express"
import fetch from "node-fetch"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send({ message: "Servidor ScrapingBee rodando!" })
})

app.post("/api/crawl", async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: "URL is required" })

  const apiKey = process.env.SCRAPINGBEE_API_KEY
  const endpoint = `https://app.scrapingbee.com/api/v1/`

  try {
    const response = await fetch(`${endpoint}?api_key=${apiKey}&url=${encodeURIComponent(url)}&render_js=false`)
    const data = await response.text() // texto cru da página
    res.send(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
