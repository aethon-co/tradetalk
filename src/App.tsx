import './App.css'

function App() {

  return (
    <>
      <h1>Participant Registration</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" placeholder="Enter your name" />
        <input type="email" placeholder="Enter your email" />
        <input type="text" placeholder="Enter your password" />
        <input type="text" placeholder="Enter your college name" />
        <input type="number" placeholder="Enter your year of graduation" />
        <input type="number" placeholder="Enter your phone number" />
      </div>
      <button onClick={() => console.log("Submitted")} style={{ marginTop: "10px" }}>Submit</button>
    </>
  )
}

export default App
