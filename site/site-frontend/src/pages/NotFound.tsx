import Navbar from '../components/Navbar';
import '../styles/App.css';

function NotFound() {
  return (
    <div className="relative h-screen bg-background-light flex flex-col justify-center items-center">
      <Navbar />
      <div className="text-center mx-10 flex flex-col justify-center items-center">
        <h1 className="text-8xl font-semibold font-serif text-primary">404</h1>
        <h2 className="text-3xl font-thin font-serif text-primary my-2 max-w-3xl">
          Page Not Found
        </h2>
        <button className="bg-transparent border-2 border-primary text-primary font-light font-serif text-xl px-6 py-2 rounded-lg mt-7">
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;

