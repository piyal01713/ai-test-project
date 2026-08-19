export default function Home() {
  return (
    <main style={{ padding: 'var(--space-2xl)', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Lynk</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-md)' }}>
        Your local network file transfer application.
      </p>
      
      <div style={{
        marginTop: 'var(--space-xl)',
        padding: 'var(--space-2xl)',
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <h2>Drag and drop files here</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>or click to select files</p>
      </div>
    </main>
  );
}
