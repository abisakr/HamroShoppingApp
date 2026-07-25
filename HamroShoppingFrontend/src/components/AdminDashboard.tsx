const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100">
          <h3 className="font-bold opacity-80 uppercase text-xs tracking-widest">Total Sales</h3>
          <p className="text-4xl font-black mt-2">$24,500</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Total Orders</h3>
          <p className="text-4xl font-black mt-2 text-gray-900">1,240</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Active Users</h3>
          <p className="text-4xl font-black mt-2 text-gray-900">850</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard