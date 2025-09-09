import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'orbee';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Garantir que o tema orbee seja aplicado na inicialização
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', 'orbee');
      localStorage.setItem('theme', 'orbee');
    }
  }, []);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        <div className="flex items-center">
          <span className="label-text mr-2">Theme:</span>
          <select className="select select-bordered" onChange={handleThemeChange} value={theme}>
            <option value="orbee">orbee</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="cupcake">cupcake</option>
            <option value="bumblebee">bumblebee</option>
            <option value="emerald">emerald</option>
            <option value="corporate">corporate</option>
            <option value="synthwave">synthwave</option>
            <option value="retro">retro</option>
            <option value="cyberpunk">cyberpunk</option>
            <option value="valentine">valentine</option>
            <option value="halloween">halloween</option>
            <option value="garden">garden</option>
            <option value="forest">forest</option>
            <option value="aqua">aqua</option>
            <option value="lofi">lofi</option>
            <option value="pastel">pastel</option>
            <option value="fantasy">fantasy</option>
            <option value="wireframe">wireframe</option>
            <option value="black">black</option>
            <option value="luxury">luxury</option>
            <option value="dracula">dracula</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="stat-title">Downloads</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <div className="stat-title">New Users</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <div className="stat-title">New Registers</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
        <div className="stats shadow">
            <div className="stat">
                <div className="stat-figure text-secondary">
                <div className="avatar online">
                    <div className="w-16 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                </div>
                <div className="stat-value">86%</div>
                <div className="stat-title">Tasks done</div>
                <div className="stat-desc text-secondary">31 tasks remaining</div>
            </div>
        </div>
      </div>

      {/* Chart and other components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">NDVI Analysis</h2>
            {/* Placeholder for a chart */}
            <div className="h-64 bg-base-300 rounded-box flex items-center justify-center">
              <p className="text-base-content/50">Chart will be here</p>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <ul className="list-disc list-.inside">
              <li>User 'John Doe' uploaded a new field.</li>
              <li>NDVI analysis complete for 'Field A'.</li>
              <li>New recommendation available for 'Field B'.</li>
              <li>User 'Jane Smith' joined the community.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;