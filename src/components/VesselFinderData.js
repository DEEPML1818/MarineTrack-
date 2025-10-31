import React, { useState, useEffect } from "react";
import {
  FaShip,
  FaAnchor,
  FaArrowDown,
  FaArrowUp,
  FaClock,
} from "react-icons/fa";

const VesselFinderData = ({ globalSelectedPort }) => {
  const [portData, setPortData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expected");
  console.log(portData);
  useEffect(() => {
    const fetchVesselFinderData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/vesselfinder/port/${globalSelectedPort}`,
        );
        const data = await response.json();
        setPortData(data);
      } catch (error) {
        console.error("Error fetching VesselFinder data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVesselFinderData();
    const interval = setInterval(fetchVesselFinderData, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [globalSelectedPort]);

  const renderVesselTable = (vessels, category) => {
    console.log(`Rendering ${category}:`, vessels);

    if (!vessels || vessels.length === 0) {
      return (
        <div className="text-center py-8 text-cyan-400/60">
          No vessels {category === "inPort" ? "in port" : `in ${category}`}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-400/30">
              <th className="text-left py-3 px-4 text-cyan-400">Vessel Name</th>
              <th className="text-left py-3 px-4 text-cyan-400">Type</th>
              {category === "inPort" && (
                <th className="text-left py-3 px-4 text-cyan-400">Built</th>
              )}
              {category === "inPort" && (
                <th className="text-left py-3 px-4 text-cyan-400">GT</th>
              )}
              <th className="text-left py-3 px-4 text-cyan-400">DWT</th>
              {category === "inPort" && (
                <th className="text-left py-3 px-4 text-cyan-400">Size (m)</th>
              )}
              {category === "inPort" && (
                <th className="text-left py-3 px-4 text-cyan-400">
                  Last Report
                </th>
              )}
              {category === "expected" && (
                <th className="text-left py-3 px-4 text-cyan-400">ETA</th>
              )}
              {category === "arrivals" && (
                <th className="text-left py-3 px-4 text-cyan-400">Arrived</th>
              )}
              {category === "departures" && (
                <th className="text-left py-3 px-4 text-cyan-400">Departed</th>
              )}
              {category !== "inPort" && (
                <th className="text-left py-3 px-4 text-cyan-400">
                  Destination
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {vessels.map((vessel, index) => (
              <tr
                key={index}
                className="border-b border-cyan-400/10 hover:bg-cyan-400/5"
              >
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {vessel.name}
                </td>
                <td className="py-3 px-4 text-cyan-400/80">
                  {vessel.type || "-"}
                </td>
                {category === "inPort" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.built || "-"}
                  </td>
                )}
                {category === "inPort" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.gt || "-"}
                  </td>
                )}
                <td className="py-3 px-4 text-cyan-400/80">
                  {vessel.dwt || "-"}
                </td>
                {category === "inPort" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.size || "-"}
                  </td>
                )}
                {category === "inPort" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.lastReport || "-"}
                  </td>
                )}
                {category === "expected" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.eta || "-"}
                  </td>
                )}
                {category === "arrivals" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.arrived || "-"}
                  </td>
                )}
                {category === "departures" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.departed || "-"}
                  </td>
                )}
                {category !== "inPort" && (
                  <td className="py-3 px-4 text-cyan-400/80">
                    {vessel.destination || "-"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/30">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400">
            Loading vessel data from VesselFinder...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
            <FaShip className="mr-3" />
            VesselFinder Real-Time Port Data
          </h2>
          <p className="text-cyan-400/60 text-sm mt-1">
            Live vessel tracking from VesselFinder.com
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-400 font-semibold">LIVE DATA</span>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400/60 mb-1">In Port</p>
              <p className="text-2xl font-bold text-cyan-400">
                {portData?.inPort?.length || 0}
              </p>
            </div>
            <FaAnchor className="text-3xl text-cyan-400/30" />
          </div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-400/60 mb-1">Expected</p>
              <p className="text-2xl font-bold text-green-400">
                {portData?.expected?.length || 0}
              </p>
            </div>
            <FaClock className="text-3xl text-green-400/30" />
          </div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-400/60 mb-1">Arrivals</p>
              <p className="text-2xl font-bold text-blue-400">
                {portData?.arrivals?.length || 0}
              </p>
            </div>
            <FaArrowDown className="text-3xl text-blue-400/30" />
          </div>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-400/60 mb-1">Departures</p>
              <p className="text-2xl font-bold text-orange-400">
                {portData?.departures?.length || 0}
              </p>
            </div>
            <FaArrowUp className="text-3xl text-orange-400/30" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-cyan-400/30">
        <button
          onClick={() => setActiveTab("inPort")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "inPort"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-cyan-400/60 hover:text-cyan-400"
          }`}
        >
          In Port ({portData?.inPort?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("expected")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "expected"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-cyan-400/60 hover:text-cyan-400"
          }`}
        >
          Expected ({portData?.expected?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("arrivals")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "arrivals"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-cyan-400/60 hover:text-cyan-400"
          }`}
        >
          Arrivals ({portData?.arrivals?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("departures")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "departures"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-cyan-400/60 hover:text-cyan-400"
          }`}
        >
          Departures ({portData?.departures?.length || 0})
        </button>
      </div>

      {/* Table Display */}
      <div className="bg-slate-900/50 rounded-xl p-4">
        {activeTab === "inPort" &&
          renderVesselTable(portData?.inPort, "inPort")}
        {activeTab === "expected" &&
          renderVesselTable(portData?.expected, "expected")}
        {activeTab === "arrivals" &&
          renderVesselTable(portData?.arrivals, "arrivals")}
        {activeTab === "departures" &&
          renderVesselTable(portData?.departures, "departures")}
      </div>

      {portData?.timestamp && (
        <div className="mt-4 text-right text-xs text-cyan-400/60">
          Last updated: {new Date(portData.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default VesselFinderData;
