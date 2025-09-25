import config from '../config';

export default function Subscribe() {
	const startCheckout = async () => {
		const res = await fetch(`${config.apiBaseUrl}/checkout/start`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ plan: 'pro' })
		})
		if (!res.ok) return alert('Failed to start checkout')
		const data = (await res.json()) as { url: string }
		window.location.href = data.url
	}
	return (
		<div className="grid" style={{ gap: 16 }}>
			<h1>Subscribe</h1>
			<p className="small">You will be redirected to complete your purchase.</p>
			<button className="btn" onClick={startCheckout}>Proceed to checkout</button>
		</div>
	)
}
