import { Router } from "wouter";
import AppRouter from "./routes/AppRouter";

const App = () => {

  return (
    <div>
      <Router>
        <AppRouter />
      </Router>
    </div>
  )
}

export default App
