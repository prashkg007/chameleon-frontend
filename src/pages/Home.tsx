export default function Home() {
	return (
		<div className="grid" style={{ gap: 24 }}>
			<section className="hero">
				<h1 style={{ margin: 0, fontSize: 40 }}>Invisible AI help for coding interviews</h1>
				<p className="small">Undetectable during screen sharing. Works with Google Meet, Zoom, HackerRank, CodeSignal, and more.</p>
				<div style={{ display: 'flex', gap: 12 }}>
					<a href="/subscribe" className="btn">Subscribe</a>
					<a href="/pricing" className="btn secondary">View pricing</a>
				</div>
			</section>
			<section className="grid cols-3">
				<div className="panel">
					<h3>Invisible</h3>
					<p className="small">Remains hidden on screen shares and never steals focus.</p>
				</div>
				<div className="panel">
					<h3>Fast</h3>
					<p className="small">Instant responses with lightweight footprint.</p>
				</div>
				<div className="panel">
					<h3>Simple</h3>
					<p className="small">Minimal UI with keyboard shortcuts you already know.</p>
				</div>
			</section>
		</div>
	)
}








