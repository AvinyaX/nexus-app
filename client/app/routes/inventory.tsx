import { useState, useEffect } from "react";
import type { Route } from "./+types/inventory";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Inventory Management - Hardware Store" },
    { name: "description", content: "Track and manage inventory across multiple locations" },
  ];
}

export default function Inventory() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">
            Track stock levels, manage locations, and monitor reorder points
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Stock Adjustment
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Add Location
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mb-8 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Demo Interface</h3>
            <div className="mt-2 text-sm text-blue-700">
              This inventory management interface shows the planned functionality for Phase 3 implementation.
              Features include multi-location tracking, automatic reorder alerts, and stock movement history.
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">7</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Locations and Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Locations */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Warehouse Locations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: "Main Warehouse", items: 892, value: "₹12,45,678" },
                { name: "Display Store", items: 234, value: "₹3,67,890" },
                { name: "Storage Room", items: 121, value: "₹1,89,432" },
              ].map((location, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{location.value}</p>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { item: "LED Bulb 9W", type: "Sale", qty: "-5", location: "Main Warehouse", time: "2 hours ago" },
                { item: "Steel Hammer", type: "Purchase", qty: "+20", location: "Main Warehouse", time: "4 hours ago" },
                { item: "Wire Cable", type: "Transfer", qty: "-10", location: "Display Store", time: "1 day ago" },
                { item: "PVC Pipe", type: "Adjustment", qty: "+2", location: "Storage Room", time: "2 days ago" },
              ].map((movement, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{movement.item}</h4>
                    <p className="text-sm text-gray-600">{movement.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      movement.type === 'Sale' ? 'bg-red-100 text-red-800' :
                      movement.type === 'Purchase' ? 'bg-green-100 text-green-800' :
                      movement.type === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {movement.type} {movement.qty}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{movement.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: "Steel Screws 2mm", sku: "SCR-2MM-001", current: 5, reorder: 20, location: "Main Warehouse" },
                { name: "Electrical Wire 1.5mm", sku: "WIRE-1.5-001", current: 8, reorder: 50, location: "Storage Room" },
                { name: "Paint Brush 2 inch", sku: "BRUSH-2-001", current: 2, reorder: 10, location: "Display Store" },
              ].map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {item.current}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.reorder}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Reorder</button>
                    <button className="text-green-600 hover:text-green-900">Adjust</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}