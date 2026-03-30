function StatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  const className =
    key === 'paid' ? 'status-paid' : key === 'pending' ? 'status-pending' : 'status-active';

  return <span className={`status-badge ${className}`}>{status}</span>;
}

export default StatusBadge;
