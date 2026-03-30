import { Link } from 'react-router-dom';
import { pricingTiers } from '../data/mockTenant';

function LandingPage() {
  return (
    <div className="min-h-screen px-6 py-10 md:px-16">
      <section className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-5xl m-0 font-black bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
          Authix Mentorship Cloud
        </h1>
        <p className="text-lg text-slate-200 max-w-2xl">
          Launch white-labeled mentorship businesses with tenant-safe architecture, role-based dashboards, and Stripe-powered monetization.
        </p>
        <div className="flex gap-3">
          <Link to="/auth" className="rounded-xl px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold">
            Get Started
          </Link>
          <Link to="/dashboard/student" className="rounded-xl px-5 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold">
            Demo Student View
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <h2 className="m-0">Find a Mentor</h2>
          <div className="mt-3 flex gap-2">
            <input className="flex-1 rounded-lg bg-black/30 border border-white/10 p-2 text-white" placeholder="Search skills..." />
            <button className="rounded-lg px-4 py-2 bg-cyan-600 text-white">Search</button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <h2 className="m-0">Why Teams Pick Authix</h2>
          <ul className="text-slate-200">
            <li>Tenant-safe multi-organization architecture</li>
            <li>Mentor and student lifecycle workflows</li>
            <li>90/10 Stripe Connect split automation</li>
          </ul>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-8 grid gap-4 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <article key={tier.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="m-0">{tier.name}</h3>
            <p className="text-3xl my-2 font-bold">{tier.price}</p>
            <ul className="text-slate-300">
              {tier.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;
