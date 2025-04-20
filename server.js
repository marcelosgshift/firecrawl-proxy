import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.get("/", (req, res) => {
  res.send({
    message: "Servidor está rodando",
    apiKeyDetectada: process.env.FIRECRAWL_API_KEY ? "✅ OK" : "❌ NÃO DETECTADA",
    apiKeyValor: process.env.FIRECRAWL_API_KEY || "⚠️ indefinida"
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
