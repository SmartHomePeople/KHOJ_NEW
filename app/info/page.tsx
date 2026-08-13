const SECTIONS = [
  {
    title: "Dates & Timings",
    body: "KHOJ 2026 runs Saturday, 14 March – Sunday, 15 March, 9:00 AM – 5:00 PM each day. Configure real dates in the admin Event Settings screen.",
  },
  {
    title: "Venue",
    body: "The school campus — Block A, Block B, Block C, and the Gymnasium. Enter through the Main Entrance near Block A.",
  },
  {
    title: "Rules for Visitors",
    body: "One rating per project, please — it keeps People's Choice fair. Be kind to presenters; most are sharing their first-ever science project.",
  },
  {
    title: "Accessibility",
    body: "Ramp access is available at every block entrance. Ask any KHOJ Help Desk volunteer for a printed large-text project directory.",
  },
  {
    title: "Emergency Information",
    body: "First Aid is staffed throughout the event at the Gymnasium. In an emergency, alert the nearest volunteer or staff member immediately.",
  },
  {
    title: "Contact",
    body: "Reach the KHOJ organizing committee at the Help Desk in the Atrium, or via the school office.",
  },
];

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Event Information</h1>
      <div className="mt-6 space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-display font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink/70 dark:text-paper/70">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
