import { Navbar } from "./components/Navbar";

function App({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="pt-32">{children}</div>
    </div>
  );
}

export default App;
