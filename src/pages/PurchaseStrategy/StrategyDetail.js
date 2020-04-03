import React, { createRef } from 'react';
import { connect } from 'dva';
import StrategyForm from './StrategyForm';
function StrategyDetail({state}) {
  const formRef = createRef()
  // function click () {
  //   const { validateFieldsAndScroll } = formRef.current.form;
  //   validateFieldsAndScroll((err, val)=> {
  //     console.log(err, val)
  //   })
  // }
  return (
    <div>
      <StrategyForm 
        wrappedComponentRef={formRef}
      />
    </div>
  )
}

export default connect(({ strategyDetail }) => ({ state: strategyDetail }))(StrategyDetail);