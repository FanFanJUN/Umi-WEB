import React, { useState } from 'react';
import { ExtTable } from 'suid';

function ChangeStrategyHistory() {
  const [loading, triggerLoading] = useState(false);
  const tableProps = {
    store: {},
    columns: [
      {
        title: ''
      }
    ]
  }
  return (
    <div>
      <ExtTable {...tableProps}/>
    </div>
  )
}

export default ChangeStrategyHistory;