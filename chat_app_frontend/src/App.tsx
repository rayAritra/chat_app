import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected");
      setSocket(ws);
    };

    ws.onmessage = (message) => {
      console.log("received message", message.data);
      setLatestMessage((prev) => [...prev, message.data]);
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    // ✅ CLEANUP
    return () => {
      ws.close();
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <>
      <h2>WebSocket Chat</h2>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={() => {
            socket.send(input);
            setInput("");
          }}
        >
          Send
        </button>

        {latestMessage.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </>
  );
}

export default App;