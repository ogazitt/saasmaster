import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const DataTable = ({data, columns, keyField}) => {
  return (
    <BootstrapTable 
      keyField={ keyField } 
      data={ data }
      columns={ columns }
      striped hover condensed
      bordered={ false }
      selectRow={ { mode: 'checkbox', clickToSelect: true } }
      />
  )
}

export default DataTable