import Navbar from "../components/Navbar";
import InteractiveBlob from "../components/InteractiveBlob";

function Dashboard() {
  return (
    <div className="relative h-screen bg-background-light overflow-hidden overscroll-none">
      {/* Interactive Gradient Blobs */}
      <InteractiveBlob
        baseX={100}
        baseY={100}
        gradient="bg-gradient-to-r from-gradientStart-light to-gradientMid-light"
        driftRange={100}
      />
      <InteractiveBlob
        baseX={window.innerWidth - 200}
        baseY={window.innerHeight - 300}
        gradient="bg-gradient-to-t from-gradientEnd-light to-gradientMid-light"
        driftRange={100}
      />
      <InteractiveBlob
        baseX={300}
        baseY={window.innerHeight - 150}
        gradient="bg-gradient-to-tr from-gradientEnd-dark to-gradientEnd-light"
        driftRange={100}
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
          This is your simplified, functional dashboard. Add your features here!
        </p>
        {/* Example Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pointer-events-auto">
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold">Card 1</h3>
            <p>Some information for card 1.</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold">Card 2</h3>
            <p>Some information for card 2.</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-bold">Card 3</h3>
            <p>Some information for card 3.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
