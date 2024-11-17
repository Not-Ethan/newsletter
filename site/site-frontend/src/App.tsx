import './App.css'
import Navbar from './Navbar'
function App() {

  return (
<div className="relative">
  {/* Fixed Gradient Background */}
  <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-tr from-gradientStart-light to-primary -z-10"></div>

  {/* Section 1 */}
  <section className="h-screen flex justify-center items-center">
    <div className="w-[95%] h-[90%] bg-background-light shadow-solid-black rounded-md flex flex-col">
      <Navbar />
      <div className="text-center mx-10 flex grow flex-col justify-center items-center">
        <h1 className="text-8xl font-semibold font-serif text-primary">Newsletta</h1>
        <h2 className="text-3xl font-thin font-serif text-primary my-2 max-w-3xl">
          The best way to stay up to date with the latest news
        </h2>
        <button className="bg-transparent border-2 border-primary text-primary font-light font-serif text-xl px-6 py-2 rounded-lg mt-7">
          Get Started
        </button>
      </div>
    </div>
  </section>

  {/* Section 2 */}
  <section className="h-screen flex justify-center items-center">
    <div className="w-[95%] h-[90%] bg-background-light shadow-solid-black rounded-md flex flex-col justify-center items-center">
      <h2 className="text-4xl font-bold text-primary">Our Features</h2>
      <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl">
        Learn more about how we keep you updated with the latest news.
      </p>
    </div>
  </section>

  {/* Section 3 */}
  <section className="h-screen flex justify-center items-center">
    <div className="w-[95%] h-[90%] bg-background-light shadow-solid-black rounded-md flex flex-col justify-center items-center">
      <h2 className="text-4xl font-bold text-primary">Get Started</h2>
      <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl">
        Sign up today and never miss an update again!
      </p>
      <button className="bg-primary text-white font-light text-xl px-6 py-2 rounded-lg mt-7">
        Sign Up
      </button>
    </div>
  </section>
</div>

  )
}

export default App
