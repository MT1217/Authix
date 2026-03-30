function AdminView() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Branding Engine</h3>
        <p className="text-slate-300">Update tenant logo, primary color and subdomain preview.</p>
        <div className="space-y-2">
          <input className="w-full rounded-lg bg-black/30 border border-white/10 p-2 text-white" placeholder="Tenant Name" />
          <input className="w-full rounded-lg bg-black/30 border border-white/10 p-2 text-white" placeholder="Subdomain" />
          <button className="rounded-lg px-4 py-2 text-white bg-violet-600 hover:bg-violet-500">Save Branding</button>
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Mentor Approval Queue</h3>
        <p className="text-slate-300">Review pending mentors and control platform quality.</p>
        <ul className="text-slate-200">
          <li>Riya Sharma - AI Mentor - Pending</li>
          <li>Alex Cruz - Data Mentor - Pending</li>
        </ul>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
        <h3 className="m-0 text-xl text-white">Platform Revenue Analytics</h3>
        <p className="text-slate-300">Admin sees 10% platform cut from all mentor transactions.</p>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div className="rounded-xl bg-black/30 p-3">Gross Volume: $12,840</div>
          <div className="rounded-xl bg-black/30 p-3">Platform Revenue: $1,284</div>
          <div className="rounded-xl bg-black/30 p-3">Active Tenants: 14</div>
        </div>
      </section>
    </div>
  );
}

export default AdminView;
