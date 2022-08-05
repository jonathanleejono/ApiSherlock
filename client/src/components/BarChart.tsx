import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  data: PropTypes.array.isRequired,
};

type BarChartComponentProps = InferProps<typeof propTypes>;

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data-testid="BarChart" data={data} margin={{ top: 50 }}>
      <CartesianGrid strokeDasharray="3 3 " />
      <XAxis dataKey="date" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="count" fill="#2cb1bc" barSize={75} />
    </BarChart>
  </ResponsiveContainer>
);

BarChartComponent.propTypes = propTypes;

export default BarChartComponent;
