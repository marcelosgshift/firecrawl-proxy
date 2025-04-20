import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  const key = process.env.FIRECRAWL_API_KEY
  res.json({
    message: "Servidor está rodando",
    apiKeyDetectada: key ? "✅ OK" : "❌ Ausente",
    apiKeyValor: key || null
  })
})

app.post("/api/crawl", async (req, res) => {
  const { url } = req.body

  if (!url) return res.status(400).json({ error: "URL is required" })

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.FIRECRAWL_API_KEY
      },
      body: JSON.stringify({ url, render: true, limit: 1 }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    const data = await response.json()
    res.status(response.ok ? 200 : response.status).json(data)
  } catch (err) {
    res.status(err.name === "AbortError" ? 504 : 500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
