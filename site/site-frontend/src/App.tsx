import './App.css'
import Navbar from './Navbar'
function App() {

  return (
    <div>
      <Navbar />
      <section className="bg-gradient-to-tr from-gradientStart-light to-primary h-screen text-primary flex overflow-hidden justify-center items-center">
        <div className="w-[95%] h-[90%] bg-background-light shadow-solid-black rounded-md flex items-center justify-center">
          <div className="text-center mx-60 mt-24 flex flex-col justify-start items-start">
              <h1 className="text-8xl font-semibold text-primary">Newslettr</h1>
              <h2 className="text-3xl font-semibold text-primary my-2 max-w">The best way to stay up to date with the latest news</h2>
              <button className="bg-transparent border-2 border-primary text-primary font-light text-xl px-6 py-2 rounded-lg mt-7">Get Started</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
