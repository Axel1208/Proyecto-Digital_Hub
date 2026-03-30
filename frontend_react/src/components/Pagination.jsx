const Pagination = ({ page, total, perPage, onChange }) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return (
    <div className="pagination">
      <button className="pag-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>&#8592;</button>
      {pages.map(p => (
        <button key={p} className={`pag-btn ${p === page ? 'pag-active' : ''}`} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button className="pag-btn" onClick={() => onChange(page + 1)} disabled={page === totalPages}>&#8594;</button>
      <span className="pag-info">{((page-1)*perPage)+1}-{Math.min(page*perPage,total)} de {total}</span>
    </div>
  );
};
export default Pagination;
