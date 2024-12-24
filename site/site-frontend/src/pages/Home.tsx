import '../styles/App.css';
import Navbar from '../components/Navbar';
import Section from '../components/Section';

function Home() {
  return (
    <div className="relative snap-y snap-mandatory overflow-y-scroll h-screen">
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-pattern -z-10"></div>
      <div className="section-vignette-overlay"></div>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

     {/* Section 1 */}
      <Section innerClassName="flex flex-col">
        <div className="text-center mx-10 flex grow flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center mb-10">
            <div className="text-left">
              <h1 className="text-5xl font-bold font-sans text-primary">
                Your Content <br /> Their Email
              </h1>
              <h2 className="text-8xl font-semibold font-serif text-primary my-5">
                No Effort Required
              </h2>
              <p className="text-lg font-light font-serif text-primary max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dapibus lacus et fermentum amet blandit.
              </p>
              <button className="bg-transparent border-2 border-primary text-primary font-light font-serif text-xl px-6 py-2 rounded-lg mt-7">
                Get Started
              </button>
            </div>
            <div className="w-[300px] h-[300px] border rounded-lg flex justify-center items-center">
              <span>Image Placeholder</span>
            </div>
          </div>
          <div className="absolute left-[300px] top-[150px] w-[100px] h-[50px] border rounded-lg flex justify-center items-center">
            <span>Arrow Placeholder</span>
          </div>
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] border rounded-lg flex justify-center items-center">
            <span>Gear Placeholder</span>
          </div>
        </div>
      </Section>

      {/* Section 2 */}
      <Section innerClassName="flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold text-primary">Our Features</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl">
          Learn more about how we keep you updated with the latest news.
        </p>
      </Section>

      {/* Section 3 */}
      <Section innerClassName="flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold text-primary">Get Started</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl">
          Sign up today and never miss an update again!
        </p>
        <button className="bg-primary text-white font-light text-xl px-6 py-2 rounded-lg mt-7">
          Sign Up
        </button>
      </Section>
    </div>
  );
}

export default Home;