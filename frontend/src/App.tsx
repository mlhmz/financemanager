import { Navbar } from "./components/Navbar"

function App({ children }: { children: React.ReactNode }) {

  return (
    <div>
      <Navbar />
      <div>
        { children }
      </div>
    </div>
  )
}

export default App
