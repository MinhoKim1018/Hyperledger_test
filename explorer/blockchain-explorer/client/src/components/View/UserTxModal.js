import React, { Component } from 'react';
// import { Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import ReactTable from '../Styled/Table'

class UserDataModal extends Component {

  
  render() {

    const columns =  [
        {
            Header: 'date',
            accessor: 'date',
            Cell:props=><span>{JSON.parse(props.original.Record).date}</span>,
            filterAll: true
        },
        {
            Header: 'merchant',
            accessor: 'merchant',
            Cell:props=><span>{JSON.parse(props.original.Record).merchant}</span>,
            filterAll: true
        },
        {
            Header: 'quantity',
            accessor: 'quantity',
            Cell:props=><span>{JSON.parse(props.original.Record).quantity}</span>,
            filterAll: true
        },
        {
            Header: 'symbol',
            accessor: 'symbol',
            Cell:props=><span>{JSON.parse(props.original.Record).symbol}</span>,
            filterAll: true
        },
        {
            Header: 'tx_id',
            accessor: 'tx_id',
            Cell:props=><span>{JSON.parse(props.original.Record).tx_id}</span>,
            filterAll: true
        }
    ];

    return (
        <div>
            <ReactTable
                    data={this.props.list}
					columns={columns}
					defaultPageSize={5}
                    minRows={0}
                    showPagination={!(this.props.list.length < 5)}
				/>            
        </div>
    );
  }
}

export default UserDataModal;
