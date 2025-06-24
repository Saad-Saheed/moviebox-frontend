import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, maxVisible = 5 }) => {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start + 1 < maxVisible) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    // First page and ellipsis
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    // Main visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Ellipsis and last page
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <hr className="my-5" />
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination flex-wrap">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              style={{ minWidth: 36, fontSize: '1rem' }}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {generatePages().map((page, idx) => (
            <li
              key={idx}
              className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
            >
              {page === '...' ? (
                <span className="page-link" style={{ minWidth: 36, fontSize: '1rem' }}>…</span>
              ) : (
                <button
                  className="page-link"
                  style={{ minWidth: 36, fontSize: '1rem' }}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              style={{ minWidth: 36, fontSize: '1rem' }}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <style>
        {`
          @media (max-width: 576px) {
            .pagination .page-link {
              padding: 0.25rem 0.5rem;
              font-size: 0.9rem;
            }
            .pagination {
              flex-wrap: wrap;
              gap: 2px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Pagination;
