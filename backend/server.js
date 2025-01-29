const express = require("express")
const { exec } = require("child_process")
const cors = require("cors")

const app = express()
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
)
app.use(express.json())

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message)
      } else {
        resolve(stdout || "No output")
      }
    })
  })
}

// Input validation middleware
function validateAddress(req, res, next) {
  const { address } = req.body
  if (!address || typeof address !== "string" || address.length > 255) {
    return res.status(400).json({ error: "Invalid address" })
  }
  // Basic sanitization: remove any characters that aren't alphanumeric, dots, or hyphens
  req.sanitizedAddress = address.replace(/[^a-zA-Z0-9.-]/g, "")
  next()
}

app.post("/api/ping", validateAddress, async (req, res) => {
  try {
    const output = await runCommand(`ping ${req.sanitizedAddress}`)
    res.json({ output })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
})

app.post("/api/traceroute", validateAddress, async (req, res) => {
  try {
    const output = await runCommand(`tracert ${req.sanitizedAddress}`)
    res.json({ output })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
})

app.post("/api/nslookup", validateAddress, async (req, res) => {
  try {
    const output = await runCommand(`nslookup ${req.sanitizedAddress}`)
    res.json({ output })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
})

app.get("/api/netstat", async (req, res) => {
  try {
    const output = await runCommand(`netstat`)
    res.json({ output })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
})

app.get("/api/ipconfig", async (req, res) => {
  try {
    const output = await runCommand(`ipconfig`)
    res.json({ output })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))


