export default function OfflinePage() {
  return (
    <main className="offline-page">
      <section className="card">
        <div className="large-icon" aria-hidden="true">↻</div>
        <p className="eyebrow">Mode hors connexion</p>
        <h1>Cap Secondaire reste avec toi</h1>
        <p>Les exercices déjà ouverts et ta progression locale demeurent disponibles. Les nouvelles réponses seront synchronisées automatiquement au retour de la connexion.</p>
        <Link className="primary-button offline-link" href="/">Retourner à l’application</Link>
      </section>
    </main>
  );
}
import Link from "next/link";
