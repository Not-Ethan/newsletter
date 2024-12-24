import React from "react";
import Navbar from "../components/Navbar";
import InteractiveBlob from "../components/InteractiveBlob";

const Dashboard: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Prevent default form submission
  
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });
  
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="relative h-screen bg-background-light overflow-hidden overscroll-none">
      {/* Interactive Gradient Blobs */}
      <InteractiveBlob
        baseX={100}
        baseY={100}
        gradient="bg-gradient-to-r from-gradientStart-light to-gradientMid-light"
        driftRange={10}
      />
      <InteractiveBlob
        baseX={window.innerWidth - 200}
        baseY={window.innerHeight - 300}
        gradient="bg-gradient-to-t from-gradientEnd-light to-gradientMid-light"
        driftRange={10}
      />
      <InteractiveBlob
        baseX={300}
        baseY={window.innerHeight - 150}
        gradient="bg-gradient-to-tr from-gradientEnd-dark to-gradientEnd-light"
        driftRange={10}
      />

      {/* Navbar */}
      <nav className="h-16 bg-background-light flex items-center justify-center z-20 relative">
        <div className="flex-grow">
          <Navbar />
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 z-20 relative pointer-events-none">
        <h2 className="text-2xl font-semibold text-primary">Welcome to Your Dashboard</h2>
        <p className="text-gray-700 mt-4">
          Manage everything
        </p>
        {/* Example Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pointer-events-auto">
          {/* Card 1 with Form */}
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold">Card 1</h3>
            <form onSubmit={handleSubmit} action="/api/transcribe" method="POST" className="mt-4">
              <div className="mb-4">
                <label htmlFor="YoutubeURL" className="block text-sm font-medium text-gray-700">
                  YouTube URL
                </label>
                <input
                  type="text"
                  id="YoutubeURL"
                  name="youtubeURL"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md shadow hover:bg-primary-dark focus:outline-none"
              >
                Submit
              </button>
            </form>
          </div>
          {/* Card 2 */}
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold">Card 2</h3>
            <p>Some information for card 2.</p>
          </div>
          {/* Card 3 */}
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold">Card 3</h3>
            <p>Some information for card 3.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
