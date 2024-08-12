// AISDataPage.js
import React from 'react';
import { generateShipData } from '../AIS/data';
import { LineChart, BarChart, Bar, PieChart, Pie, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AISDataPage = ({ year }) => {
  const shipData = generateShipData(year);
  const shipSpeeds = shipData.map(ship => ship.speed);
  const averageSpeed = (shipSpeeds.reduce((acc, speed) => acc + speed, 0) / shipSpeeds.length).toFixed(2);
  const statusData = [
    { name: 'Active', value: shipData.filter(ship => ship.status === 'Active').length },
    { name: 'Idle', value: shipData.filter(ship => ship.status === 'Idle').length },
    { name: 'Docked', value: shipData.filter(ship => ship.status === 'Docked').length },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">AIS Data for {year}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Line Chart for Speed over Time */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Speed Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={shipData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart for Speed Distribution */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Speed Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="speed" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Ship Status */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Ship Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Average Speed Display */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center">
          <h2 className="text-lg font-semibold mb-2">Average Speed</h2>
          <p className="text-3xl font-bold">{averageSpeed} knots</p>
        </div>
      </div>

      {/* Ship Details Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ship Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Route</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Speed (knots)</th>
              </tr>
            </thead>
            <tbody>
              {shipData.map((ship, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{ship.name}</td>
                  <td className="py-2 px-4 border-b">{ship.route}</td>
                  <td className="py-2 px-4 border-b">{ship.status}</td>
                  <td className="py-2 px-4 border-b">{ship.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AISDataPage;
