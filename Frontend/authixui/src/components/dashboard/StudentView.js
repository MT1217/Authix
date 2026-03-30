function StudentView() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Branded Marketplace</h3>
        <div className="flex gap-2 mt-3">
          <input className="flex-1 rounded-lg bg-black/30 border border-white/10 p-2 text-white" placeholder="Find a mentor..." />
          <select className="rounded-lg bg-black/30 border border-white/10 p-2 text-white">
            <option>Category</option>
            <option>Web Dev</option>
            <option>AI/ML</option>
          </select>
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Stripe Checkout</h3>
        <p className="text-slate-300">Secure checkout for purchasing mentorship packages.</p>
        <button className="rounded-lg px-4 py-2 text-white bg-cyan-600 hover:bg-cyan-500">Proceed to Checkout</button>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">My Courses Library</h3>
        <ul className="text-slate-200">
          <li>Advanced MERN Bootcamp</li>
          <li>System Design for Juniors</li>
        </ul>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Progress Visualization</h3>
        <p className="text-slate-300">Course completion graph placeholder.</p>
        <div className="h-28 rounded-xl bg-gradient-to-r from-violet-600/40 to-cyan-400/40" />
      </section>
    </div>
  );
}

export default StudentView;
