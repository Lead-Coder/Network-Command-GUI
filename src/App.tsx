import type React from "react"
import { useState } from "react"

const API_BASE_URL = "http://localhost:5000"

const App: React.FC = () => {
  const [command, setCommand] = useState("ping")
  const [address, setAddress] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const executeCommand = async () => {
    setLoading(true)
    setError("")
    setOutput("")
    try {
      const response = await fetch(`${API_BASE_URL}/api/${command}`, {
        method: ["netstat", "ipconfig"].includes(command) ? "GET" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: ["netstat", "ipconfig"].includes(command) ? undefined : JSON.stringify({ address }),
      })
      const data = await response.json()
      if (response.ok) {
        setOutput(data.output)
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch (err) {
      setError("Failed to fetch data. Please check your network connection and ensure the backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-6">Network Command Tool</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Command</label>
          <select
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="ping">Ping</option>
            <option value="traceroute">Traceroute</option>
            <option value="nslookup">nslookup</option>
            <option value="netstat">netstat</option>
            <option value="ipconfig">ifconfig</option>
          </select>
        </div>
        {!["netstat", "ipconfig"].includes(command) && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter domain or IP"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
        )}
        <button
          onClick={executeCommand}
          disabled={loading || (!["netstat", "ipconfig"].includes(command) && !address)}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-slate-800 font-semibold disabled:opacity-50">
          {loading ? "Executing..." : "Run Command"}
        </button>
        {output && (
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">Output</h3>
            <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto whitespace-pre-wrap">{output}</pre>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App


