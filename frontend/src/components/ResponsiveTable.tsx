import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  actions?: (row: any) => React.ReactNode;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ data, columns, actions }) => {
  return (
    <div className="responsive-table-container">
      {/* Desktop Table View */}
      <div className="desktop-table">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && <td>{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {data.map((row, index) => (
          <div key={row.id || index} className="mobile-card">
            <div className="card-header">
              <h3>{row.fullName || row.name || 'User'}</h3>
            </div>
            <div className="card-content">
              {columns.map((column) => (
                <div key={column.key} className="card-row">
                  <span className="card-label">{column.label}:</span>
                  <span className="card-value">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
            {actions && (
              <div className="card-actions">
                {actions(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveTable;
