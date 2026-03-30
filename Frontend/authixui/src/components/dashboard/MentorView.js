function MentorView() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Rich-text Content CMS</h3>
        <textarea
          rows={8}
          className="mt-3 w-full rounded-lg bg-black/30 border border-white/10 p-3 text-white"
          placeholder="Create lesson content, notes, and assignments."
        />
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Session Scheduler</h3>
        <p className="text-slate-300">Calendar UI placeholder for mentoring slots.</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-black/30 p-2">Mon 10AM</div>
          <div className="rounded-lg bg-black/30 p-2">Wed 2PM</div>
          <div className="rounded-lg bg-black/30 p-2">Fri 6PM</div>
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Student Progress Tracking</h3>
        <p className="text-slate-300">Watch each learner's completion trend.</p>
        <ul className="text-slate-200">
          <li>Sneha: 72%</li>
          <li>David: 41%</li>
          <li>Elena: 88%</li>
        </ul>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="m-0 text-xl text-white">Earnings Dashboard</h3>
        <p className="text-slate-300">You receive 90% after platform fee split.</p>
        <div className="space-y-2 text-slate-200">
          <div className="rounded-lg bg-black/30 p-2">This month: $3,920</div>
          <div className="rounded-lg bg-black/30 p-2">Pending payout: $740</div>
        </div>
      </section>
    </div>
  );
}

export default MentorView;
