/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from '../Styled/Table';
import axios from 'axios';
import Modal from 'react-awesome-modal';
import UserTxModal from '../View/UserTxModal'

const styles = theme => ({
	hash: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: 60,
		letterSpacing: '2px'
	}
});



export class UserTx extends Component {
	constructor(props) {
		super(props);
		this.state = {
        list:[],
        usertxlist:[],
        visibleTxData:false,
		};
    }
    
    componentWillMount=()=>{
        axios.post("http://127.0.0.1:3010/api/query/selectAllUser",{symbol:"h3c"})
        .then(res=>res.data)
        .then(data=>data.response)
        .then(info=>{
            this.setState({
                list:JSON.parse(info)
            })
        })
    }
    
    openTxDataModal=async(key)=>{
        var id = key.substring(4,key.length)

        axios.post('http://127.0.0.1:3010/api/query/selectUserTx',{symbol:"h3c",id:id})
        .then(res=>res.data)
        .then(data=>{
          this.setState({
            usertxlist:data,
            visibleTxData:true
          })
        })
    }
  
    closeTxDataModal=()=>{
        this.setState({
          visibleTxData:false
        })
    }
  

	

	render() {

        const columns =  [
            {
                Header: 'USER',
                accessor: 'Key',
                Cell:props=><span>{props.original.Key}</span>,
                filterAll: true
            },{
                Header: 'Login_ID',
                accessor: 'Key',
                Cell:props=><span>{JSON.parse(props.original.Record).init}</span>,
                filterAll: true
            },{
                Header: 'TxInfo',
                accessor: 'path',
                Cell:props=><button onClick={()=>this.openTxDataModal(props.original.Key)}>클릭</button>,
                filterAll: true
            }
        ];

		return (
			<div>
				
				<ReactTable
                    data={this.state.list}
					          columns={columns}
					          defaultPageSize={10}
                    minRows={0}
                    showPagination={!(this.state.list.length < 5)}
				/>

			    <div>
        <Modal
          visible={this.state.visibleTxData}
          width="1200"
          height="400"
          effect="fadeInUp"
          onClickAway={this.closeTxDataModal}
        >
          <div>
            <div>
              <UserTxModal list={this.state.usertxlist}/>
            </div>
            <a onClick={this.closeTxDataModal}>Close</a>
          </div>
        </Modal>
                </div>
			
			</div>
		);
	}
}

// Chaincodes.propTypes = {
// 	chaincodeList: chaincodeListType.isRequired
// };

export default withStyles(styles)(UserTx);
