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
          <div className="w-full flex justify-between items-center mb-10 relative">
            <div className="text-left">
              <h1 className="text-7xl font-bold font-sans text-primary leading-[5rem]">
                Your Content <br /> Their Email
              </h1>
              <h2 className="text-9xl font-semibold font-sans text-primary my-8">
                No Effort Required
              </h2>
              <p className="text-xl font-light font-serif text-primary max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dapibus lacus et fermentum amet blandit.
              </p>
              <button className="bg-transparent border-2 border-primary text-primary font-light font-serif text-2xl px-8 py-3 rounded-lg mt-8">
                Get Started
              </button>
            </div>

            {/* Image Placeholder repositioned */}
            <div className="absolute top-[30%] right-[5%] transform -translate-y-1/2 w-[350px] h-[350px] border rounded-lg flex justify-center items-center">
              <span>Image Placeholder</span>
            </div>

            {/* Arrow */}
            <div className="absolute left-[500px] top-[20%] transform -translate-y-1/2 w-[100px] h-[50px] border rounded-lg flex justify-center items-center">
              <span>Arrow Placeholder</span>
            </div>
          </div>

          {/* Gears Placeholder */}
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] border rounded-lg flex justify-center items-center">
            <span>Gear Placeholder</span>
          </div>
        </div>
      </Section>

      {/* Section 2 */}
      <Section innerClassName="flex flex-col justify-center items-center">
        <h2 className="text-5xl font-bold text-primary">Our Features</h2>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl">
          Learn more about how we keep you updated with the latest news.
        </p>
      </Section>

      {/* Section 3 */}
      <Section innerClassName="flex flex-col justify-center items-center">
        <h2 className="text-5xl font-bold text-primary">Get Started</h2>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl">
          Sign up today and never miss an update again!
        </p>
        <button className="bg-primary text-white font-light text-2xl px-8 py-3 rounded-lg mt-8">
          Sign Up
        </button>
      </Section>
    </div>
  );
}

export default Home;
