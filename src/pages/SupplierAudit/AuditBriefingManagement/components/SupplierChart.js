/**
 * @Description: 图表
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, { useImperativeHandle } from 'react';
import { ExtEcharts } from 'suid';
import { Form } from 'antd';

const SupplierChart = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const props = {
    option: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      xAxis: [
        {
          type: 'category',
          data: editData.abAreaNames || [],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量',
          axisLabel: {
            formatter: '{value} 家',
          },
        },
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          data: editData.abAreaValues || [],
          itemStyle: {
            normal: {
              color: function(params) {
                const colorList = ['#cca272', '#74608f', '#d7a02b', '#c8ba23'];
                return colorList[params.dataIndex % colorList.length];
              },
            },
          },
        },
      ],
    },
  };

  return (
    <div style={{ height: 300 }}>
      <ExtEcharts {...props} />
    </div>
  );
});
export default Form.create()(SupplierChart);
