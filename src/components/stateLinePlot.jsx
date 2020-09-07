import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ReactGa from "react-ga";
import { format } from "d3";

function commaSeperated(x) {
  if (x !== undefined || x !== 0) {
    x = x.toString();
    let lastThree = x.substring(x.length - 3);
    let otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  } else return x;
}

const StateLinePlot = ({
  stateName,
  bgColor,
  titleClass,
  type,
  date,
  total,
  daily,
  stroke,
  lineStroke,
  color1,
  color2,
  divideBy,
  interval,
}) => {
  return (
    <div className="col">
      <section
        className="graphsection"
        style={{
          backgroundColor: `${bgColor}`,
          borderRadius: "6px",
          paddingTop: "5px",
          marginTop: 10,
        }}
      >
        <h5
          className={titleClass}
          style={{
            paddingTop: "5px",
            marginBottom: "-80px",
            textAlign: "left",
            marginLeft: 10,
            fontSize: "0.8rem",
            textTransform: "uppercase",
          }}
        >
          {type}
          <h6
            style={{
              fontSize: "10px",
              color: `${color1}`,
              textTransform: "capitalize",
            }}
          >
            {date[date.length - 1]}

            <h5
              style={{
                fontSize: 14,
                color: `${color2}`,
                textTransform: "capitalize",
              }}
            >
              {commaSeperated(total[total.length - 1].stateid)}{" "}
              <span style={{ fontSize: 9 }}>
                {daily >= 0
                  ? "+" + commaSeperated(daily)
                  : "-" + commaSeperated(Math.abs(daily))}
              </span>
            </h5>
          </h6>
        </h5>
        <ResponsiveContainer width="100%" height="100%" aspect={2.3}>
          <LineChart
            data={total}
            margin={{
              top: 40,
              right: -20,
              left: 20,
              bottom: -8,
            }}
            syncId="linechart"
          >
            <XAxis
              dataKey="date"
              interval={interval}
              tick={{ stroke: stroke, strokeWidth: 0.2, fill: stroke }}
              style={{ fontSize: "0.62rem", fontFamily: "notosans" }}
              tickSize={5}
              tickLine={{ stroke: stroke }}
              tickCount={8}
              axisLine={{ stroke: stroke, strokeWidth: "1.5px" }}
            />
            <YAxis
              domain={[
                0,
                Math.ceil(
                  Math.max.apply(
                    Math,
                    total.map(function (item) {
                      return Number(item.stateid);
                    })
                  ) / divideBy
                ) * divideBy,
              ]}
              orientation="right"
              tick={{ stroke: stroke, strokeWidth: 0.2, fill: stroke }}
              tickFormatter={format("~s")}
              tickSize={5}
              style={{ fontSize: "0.62rem", fontFamily: "notosans" }}
              tickLine={{ stroke: stroke }}
              tickCount={8}
              axisLine={{ stroke: stroke, strokeWidth: "1.5px" }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0)",
                border: "none",
                borderRadius: "5px",
                fontSize: "0.7rem",
                fontFamily: "notosans",
                textTransform: "uppercase",
                textAlign: "left",
                lineHeight: 0.8,
              }}
              cursor={false}
              position={{ x: 120, y: 22 }}
            />
            <Line
              type="monotone"
              dataKey="stateid"
              stroke={lineStroke}
              strokeWidth="3"
              strokeLinecap="round"
              name={type}
              dot={{
                stroke: `${stroke}`,
                strokeWidth: 0.1,
                fill: `${stroke}`,
              }}
              onClick={() => {
                ReactGa.event({
                  category: `Graph state ${type} ${stateName}`,
                  action: `${type} state hover`,
                });
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default StateLinePlot;
