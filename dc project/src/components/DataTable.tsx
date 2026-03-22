import React from 'react';

interface DataTableProps {
  title: string;
  data: any[];
  columns: { key: string; label: string; width?: string }[];
}

const DataTable: React.FC<DataTableProps> = ({ title, data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">{title}</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 min-h-[200px] flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-600">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-2 px-3 text-gray-400 font-medium"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, index) => (
              <tr key={index} className="border-b border-gray-700">
                {columns.map((column) => (
                  <td key={column.key} className="py-2 px-3 text-gray-300">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 10 && (
          <p className="text-gray-500 text-xs mt-2 text-center">
            Showing first 10 of {data.length} rows
          </p>
        )}
      </div>
    </div>
  );
};

export default DataTable;
