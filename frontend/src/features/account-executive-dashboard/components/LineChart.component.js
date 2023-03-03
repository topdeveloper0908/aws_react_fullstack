import React, { useState, useContext } from "react";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./line-chart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Yearly Referrals And Sales",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const LineChart = () => {
  const { user } = useContext(AuthenticationContext);
  const [dataToShow, setDataToShow] = useState("referrals");

  const referralData = {
    labels,
    datasets: [
      {
        label: "New Referrals (All)",
        data: labels.map((label) => {
          return user.salesRecord[label].totalReferredUsers;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "New Referrals (Monthly)",
        data: labels.map((label) => {
          return user.salesRecord[label].totalMonthlyUsers;
        }),
        borderColor: "yellow",
        backgroundColor: "yellow",
      },
      {
        label: "New Referrals (Yearly)",
        data: labels.map((label) => {
          return user.salesRecord[label].totalYearlyUsers;
        }),
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: "New Referrals (Lifetime)",
        data: labels.map((label) => {
          return user.salesRecord[label].totalLifetimeUsers;
        }),
        borderColor: "red",
        backgroundColor: "red",
      },
    ],
  };

  const salesData = {
    labels,
    datasets: [
      {
        label: "Sales (All)",
        data: labels.map((label) => {
          return user.salesRecord[label].totalSales / 100;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Sales (New)",
        data: labels.map((label) => {
          return user.salesRecord[label].totalNewSales / 100;
        }),
        borderColor: "yellow",
        backgroundColor: "yellow",
      },
      {
        label: "Sales (Residual)",
        data: labels.map((label) => {
          return user.salesRecord[label].totalResidualSales / 100;
        }),
        borderColor: "blue",
        backgroundColor: "blue",
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <select
        value={dataToShow}
        onChange={(e) => {
          setDataToShow(e.target.value);
        }}
      >
        <option value="referrals">Referrals</option>
        <option value="sales">Sales (in USD)</option>
      </select>
      <Line
        options={options}
        data={dataToShow === "referrals" ? referralData : salesData}
      />
    </div>
  );
};
