import { Link } from 'react-router-dom';

function AuthHubPage() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <section className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-300">Auth Hub</p>
          <h1 className="text-3xl m-0">Login / Signup</h1>
          <p className="text-slate-300">Role selection and Admin MFA are built into this flow.</p>
          <div className="space-y-3">
            <input className="w-full rounded-lg bg-black/30 border border-white/10 p-3 text-white" placeholder="Email" />
            <input className="w-full rounded-lg bg-black/30 border border-white/10 p-3 text-white" placeholder="Password" type="password" />
            <select className="w-full rounded-lg bg-black/30 border border-white/10 p-3 text-white">
              <option>Student</option>
              <option>Mentor</option>
              <option>Admin</option>
            </select>
            <input className="w-full rounded-lg bg-black/30 border border-white/10 p-3 text-white" placeholder="Admin MFA Code (required for admins)" />
            <button className="w-full rounded-lg px-4 py-3 bg-violet-600 text-white font-semibold hover:bg-violet-500">Continue</button>
          </div>
        </div>
        <div className="rounded-2xl bg-black/30 p-5">
          <h3>Quick Demo Access</h3>
          <p className="text-slate-300">Open role dashboards:</p>
          <div className="flex flex-col gap-2">
            <Link className="rounded-lg bg-white/10 p-2 hover:bg-white/20" to="/dashboard/admin">Admin Dashboard</Link>
            <Link className="rounded-lg bg-white/10 p-2 hover:bg-white/20" to="/dashboard/mentor">Mentor Dashboard</Link>
            <Link className="rounded-lg bg-white/10 p-2 hover:bg-white/20" to="/dashboard/student">Student Dashboard</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthHubPage;
