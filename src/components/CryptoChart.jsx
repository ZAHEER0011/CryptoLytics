import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

function CryptoChart({ data }) {
  const prices = data.prices;

  const chartData = {
    labels: prices.map((p) =>
      new Date(p[0]).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Price",
        data: prices.map((p) => p[1]),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return <Line data={chartData} options={options} />;
}

export default CryptoChart;