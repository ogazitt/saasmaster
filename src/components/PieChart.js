import React from 'react'
import ReactMinimalPieChart from 'react-minimal-pie-chart'

const PieChart = ({
  data,
  onSelect
}) => {
  return (
    <ReactMinimalPieChart
      animate={false}
      animationDuration={500}
      animationEasing="ease-out"
      cx={50}
      cy={50}
      data={data}
      label
      labelPosition={60}
      labelStyle={{
        fontFamily: 'sans-serif',
        fontSize: '10px'
      }}
      lengthAngle={360}
      lineWidth={20}
      onClick={undefined}
      onMouseOut={undefined}
      onMouseOver={undefined}
      paddingAngle={18}
      radius={50}
      rounded
      startAngle={0}
      style={{
        height: '150px',
        width: '150px'
      }}
      viewBoxSize={[
        100,
        100
      ]}
    />
  )
}

export default PieChart
