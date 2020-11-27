/**
 * @Description: 图表
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, { useImperativeHandle } from 'react';
import { ExtEcharts } from 'suid';
import { Form, Row, Col } from 'antd';

const TypeChart = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));

  const props = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              name: '准入',
              value: 10,
            },
            {
              name: '追加',
              value: 20,
            },
            {
              name: '监督',
              value: 70,
            },
          ],
        },
      ],
    },
  };

  const props2 = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              name: '联合',
              value: 10,
            },
            {
              name: '交叉',
              value: 20,
            },
            {
              name: '委托第三方',
              value: 70,
            },
            {
              name: '就近',
              value: 120,
            },
          ],
        },
      ],
    },
  };
  const props3 = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              name: 'A级',
              value: 1,
            },
            {
              name: 'B级',
              value: 20,
            },
            {
              name: 'C级',
              value: 70,
            },
            {
              name: 'D级',
              value: 120,
            },
          ],
        },
      ],
    },
  };
  const props4 = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              name: 'A级',
              value: 1,
            },
            {
              name: 'B级',
              value: 20,
            },
            {
              name: 'C级',
              value: 70,
            },
            {
              name: 'D级',
              value: 120,
            },
          ],
        },
      ],
    },
  };
  return (
    <Row>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props} />
      </Col>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props2} />
      </Col>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props3} />
      </Col>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props4} />
      </Col>
    </Row>
  );
});
export default Form.create()(TypeChart);
