import { Header } from '../../../../components';
import { Button, Table } from 'antd';
import styles from './index.less';

function SelfAssessment () {
  return (
    <div>
      <Header
        left={
          <>
            <Button>导出打分项</Button>
            <Button>导入打分项</Button>
          </>
        }
      />
      <Table />
    </div>
  )
}
export default SelfAssessment;