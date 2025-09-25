export default function Pricing() {
	return (
		<div className="grid" style={{ gap: 24 }}>
			<h1>Pricing</h1>
			<div className="panel">
				<h3 style={{ marginTop: 0 }}>Pro</h3>
				<p className="small">Unlimited usage. Priority answers. Multi-platform support.</p>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
					<strong style={{ fontSize: 28 }}>$25</strong><span className="small">/mo billed annually</span>
				</div>
				<div style={{ marginTop: 12 }}>
					<a className="btn" href="/subscribe">Subscribe</a>
				</div>
			</div>
		</div>
	)
}








