import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomerRateChart = () => {
  const data = [
    { month: "Jan 2023", Registration: 130 },
    { month: "Feb 2023", Registration: 160 },
    { month: "Mar 2023", Registration: 240 },
    { month: "Apr 2023", Registration: 170 },
    { month: "May 2023", Registration: 250 },
    { month: "Jun 2023", Registration: 290 },
  ];

  return (
    <ResponsiveContainer width="100%" height={360}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          horizontal={true}
        />
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="Registration" stroke="green" fill="#0000" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomerRateChart;
