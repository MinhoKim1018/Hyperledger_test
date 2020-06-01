/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import View from '../Styled/View';
import UserTx from '../Lists/UserTx';

export const UserTxView = ({ userTx }) => (
  <View>
      <UserTx userTx ={userTx}/>
  </View>
);



export default UserTxView;
