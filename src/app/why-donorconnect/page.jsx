export default function WhyDonorConnectPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full bg-white shadow rounded p-8">
        <h1 className="text-3xl font-bold mb-4">Why DonorConnect?</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Solution Idea</h2>
          <p className="mb-2">DonorConnect is a donor retention platform designed to help nonprofits convert first-time donors into repeat supporters. It provides actionable insights and automates engagement workflows to maximize donor lifetime value.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Key Features & Reasoning</h2>
          <ul className="list-disc pl-6 mb-2">
            <li>Donor risk prediction: Focuses outreach on at-risk donors.</li>
            <li>Automated workflows: Streamlines follow-ups and engagement.</li>
            <li>Campaign and segment management: Enables targeted fundraising.</li>
            <li>Comprehensive dashboard: Tracks retention metrics and donor health.</li>
          </ul>
          <p>Features were chosen to address the most common pain points in nonprofit fundraising: donor churn, lack of actionable data, and manual processes.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Challenges & Planning</h2>
          <ul className="list-disc pl-6 mb-2">
            <li>Multi-tenant data isolation: Solved with organizationId on all models.</li>
            <li>Authentication: Custom session management for security and compatibility.</li>
            <li>Data realism: Seeded database with realistic donor profiles and risk levels.</li>
            <li>Scalability: Designed API and schema for future integrations (CRM, email, analytics).</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">System Summary</h2>
          <p className="mb-2">DonorConnect consists of:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>Pages: Home, Why DonorConnect, Dashboard, Donors, Donations, Campaigns, Segments, Workflows, Tasks, Login</li>
            <li>Data: Users, Organizations, Donors, Donations, Campaigns, Segments, Workflows, Tasks</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
