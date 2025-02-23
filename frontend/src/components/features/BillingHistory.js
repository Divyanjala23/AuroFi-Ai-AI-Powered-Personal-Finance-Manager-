import React from 'react';

const BillingHistory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-teal-800 mb-6">Billing History</h1>
        <div className="space-y-6">
          <p className="text-teal-600">View your billing history here.</p>
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;