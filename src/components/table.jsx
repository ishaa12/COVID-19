import React, { Component } from "react";
import * as Icon from "react-feather";
import CountUp from "react-countup";
import Updates from "./updates";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SortRoundedIcon from "@material-ui/icons/SortRounded";
import parse from "html-react-parser";
import Switch from "react-switch";
import MiniSparkline from "./miniSparkline";
import ReactGa from "react-ga";
import {
  commaSeperated,
  DeltaArrow,
  DeltaValue,
} from "../utils/common-functions";
import StateTable from "./stateTable";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      items: [],
      total: [],
      delta: [],
      data: [],
      sortConfirmed: true,
      sortActive: false,
      sortRecovered: false,
      sortDeceased: false,
      sortOrder: true,
      percentageToggleActive: false,
    };
    this.onPercentageToggle = this.onPercentageToggle.bind(this);
    this.onSortConfirmed = this.onSortConfirmed.bind(this);
    this.onSortActive = this.onSortActive.bind(this);
    this.onSortRecovered = this.onSortRecovered.bind(this);
    this.onSortDeceased = this.onSortDeceased.bind(this);
    this.handleSortOrder = this.handleSortOrder.bind(this);
  }

  onPercentageToggle(percentageToggleActive) {
    this.setState({ percentageToggleActive });
  }

  onSortConfirmed({ sortConfirmed }) {
    this.setState({ sortConfirmed });
  }

  onSortActive({ sortActive }) {
    this.setState({ sortActive });
  }

  onSortRecovered({ sortRecovered }) {
    this.setState({ sortRecovered });
  }

  onSortDeceased({ sortDeceased }) {
    this.setState({ sortDeceased });
  }

  handleSortOrder({ sortOrder }) {
    this.setState({ sortOrder });
  }

  componentDidMount() {
    fetch("https://api.covid19india.org/data.json").then((res) =>
      res.json().then((json) => {
        this.setState({
          isLoaded: true,
          items: json.statewise.filter(
            (item) => item.confirmed !== "0" && item.state !== "Total"
          ),
          total: json.statewise.filter((item) => item.state === "Total"),
          delta: json.statewise,
          data: json.cases_time_series,
        });
      })
    );
  }

  render() {
    const {
      isLoaded,
      items,
      total,
      delta,
      data,
      sortConfirmed,
      sortActive,
      sortRecovered,
      sortDeceased,
      sortOrder,
      percentageToggleActive,
    } = this.state;

    const dailyConfirmed = [];
    data.map((item) => dailyConfirmed.push(Number(item.dailyconfirmed)));

    const dailyActive = [];
    data.map((item) =>
      dailyActive.push(
        Number(item.dailyconfirmed) -
          Number(item.dailyrecovered) -
          Number(item.dailydeceased)
      )
    );

    const dailyRecovered = [];
    data.map((item) => dailyRecovered.push(Number(item.dailyrecovered)));

    const dailyDeceased = [];
    data.map((item) => dailyDeceased.push(Number(item.dailydeceased)));

    if (sortConfirmed) {
      items.sort(function (x, y) {
        return sortOrder
          ? Number(y.confirmed) - Number(x.confirmed)
          : Number(x.confirmed) - Number(y.confirmed);
      });
    }
    if (sortActive) {
      items.sort(function (x, y) {
        return !sortOrder
          ? Number(y.active) - Number(x.active)
          : Number(x.active) - Number(y.active);
      });
    }
    if (sortRecovered) {
      items.sort(function (x, y) {
        return !sortOrder
          ? Number(y.recovered) - Number(x.recovered)
          : Number(x.recovered) - Number(y.recovered);
      });
    }
    if (sortDeceased) {
      items.sort(function (x, y) {
        return !sortOrder
          ? Number(y.deaths) - Number(x.deaths)
          : Number(x.deaths) - Number(y.deaths);
      });
    }

    const sparklinedata = [];
    const sparklineconfirmed = [];
    const sparklineactive = [];
    const sparklinerecovered = [];
    const sparklinedeceased = [];

    // const allKeys = Object.keys(newItems);

    // console.log(newItems[allKeys.slice(allKeys.length - 1)]);

    data.slice(data.length - 20, data.length).map((item) =>
      sparklinedata.push({
        confirmed: Number(item.dailyconfirmed),
        active:
          Number(item.dailyconfirmed) -
          Number(item.dailyrecovered) -
          Number(item.dailydeceased),
        recovered: Number(item.dailyrecovered),
        deceased: Number(item.dailydeceased),
        date: item.date,
      })
    );

    data
      .slice(data.length - 20, data.length)
      .map((item) => sparklineconfirmed.push(Number(item.dailyconfirmed)));
    data
      .slice(data.length - 20, data.length)
      .map((item) =>
        sparklineactive.push(
          Number(item.dailyconfirmed) -
            Number(item.dailyrecovered) -
            Number(item.dailydeceased)
        )
      );
    data
      .slice(data.length - 20, data.length)
      .map((item) => sparklinerecovered.push(Number(item.dailyrecovered)));
    data
      .slice(data.length - 20, data.length)
      .map((item) => sparklinedeceased.push(Number(item.dailydeceased)));

    const min = Math.min(
      ...sparklineconfirmed.slice(
        sparklineconfirmed.length - 20,
        sparklineconfirmed.length
      ),
      ...sparklineactive.slice(
        sparklineactive.length - 20,
        sparklineactive.length
      ),
      ...sparklinerecovered.slice(
        sparklinerecovered.length - 20,
        sparklinerecovered.length
      ),
      ...sparklinedeceased.slice(
        sparklinedeceased.length - 20,
        sparklinedeceased.length
      )
    );

    const max = Math.max(
      ...sparklineconfirmed.slice(
        sparklineconfirmed.length - 20,
        sparklineconfirmed.length
      ),
      ...sparklineactive.slice(
        sparklineactive.length - 20,
        sparklineactive.length
      ),
      ...sparklinerecovered.slice(
        sparklinerecovered.length - 20,
        sparklinerecovered.length
      ),
      ...sparklinedeceased.slice(
        sparklinedeceased.length - 20,
        sparklinedeceased.length
      )
    );

    if (isLoaded) {
      return (
        <React.Fragment>
          <div className="containerHome">
            <div
              className="fadeInUp"
              style={{
                marginTop: window.innerWidth < 767 ? "" : "10px",
                marginBottom: "8px",
                animationDelay: "0.5s",
                boxShadow: "0 0 20px rgba(0,0,0,0.25)",
                borderRadius: "6px",
              }}
            >
              <table
                className="table table-sm table-borderless"
                style={{ marginBottom: "-1px" }}
              >
                <thead>
                  <tr>
                    <th
                      className="span delta graphWidth"
                      style={{
                        color: "rgb(66, 179, 244)",
                        background: "rgba(66, 179, 244, 0.1)",
                      }}
                    >
                      CONFIRMED
                    </th>
                    <th
                      className="delta span graphWidth"
                      style={{
                        background: "rgba(255, 7, 58, 0.125)",
                        color: "rgb(255, 80, 100)",
                      }}
                    >
                      ACTIVE
                    </th>
                    <th
                      className="text-success delta span graphWidth"
                      style={{ background: "rgba(88, 189, 88, 0.2)" }}
                    >
                      Recovered
                    </th>
                    <th
                      className="text-secondary delta span graphWidth"
                      style={{
                        background: "rgba(92, 87, 86, 0.2)",
                        fontWeight: 600,
                      }}
                    >
                      DECEASED
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  <td>
                    <h6
                      className="delta"
                      style={{ fontSize: 12, color: "rgb(66, 179, 244)" }}
                    >
                      {Number(delta[0].deltaconfirmed) > 0 ? (
                        ""
                      ) : (
                        <Icon.Meh
                          size={12}
                          strokeWidth={3}
                          fill="rgba(23, 162, 184, 0.2)"
                          style={{ verticalAlign: "-0.2rem" }}
                        />
                      )}

                      {Number(delta[0].deltaconfirmed) > 0
                        ? "+" + commaSeperated(delta[0].deltaconfirmed)
                        : ""}
                    </h6>
                    <h5
                      style={{
                        textAlign: "center",
                        color: "rgb(66, 179, 244)",
                      }}
                    >
                      <CountUp
                        start={0}
                        end={Number(total[0].confirmed)}
                        duration={2}
                        separator=","
                      />
                    </h5>
                    <section
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                      id="line1"
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={0}
                        min={min}
                        max={max}
                        type={sparklineconfirmed}
                        fill="#42b3f4"
                        stroke="rgba(66, 179, 244, 0.7)"
                        width={76}
                      />
                    </section>
                    <section
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                      id="line2"
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={0}
                        min={min}
                        max={max}
                        type={sparklineconfirmed}
                        fill="#42b3f4"
                        stroke="rgba(66, 179, 244, 0.7)"
                      />
                    </section>
                  </td>

                  <td>
                    <h6
                      className="delta"
                      style={{ color: "#ff446a", fontSize: 12 }}
                    >
                      <Icon.Heart
                        size={12}
                        strokeWidth={3}
                        fill="#ff446a"
                        style={{ verticalAlign: "-0.2rem" }}
                      />
                    </h6>
                    <h5 style={{ color: "#ff446a", textAlign: "center" }}>
                      {!percentageToggleActive ? (
                        <CountUp
                          start={0}
                          end={Number(total[0].active)}
                          duration={2}
                          separator=","
                        />
                      ) : (
                        (
                          (Number(total[0].active) /
                            Number(total[0].confirmed)) *
                          100
                        ).toFixed(1) + "%"
                      )}
                    </h5>
                    <section
                      id="line1"
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={1}
                        min={min}
                        max={max}
                        type={sparklineactive}
                        fill="#ff446a"
                        stroke="rgba(255, 68, 106, 0.7)"
                        width={76}
                      />
                    </section>
                    <section
                      id="line2"
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={1}
                        min={min}
                        max={max}
                        type={sparklineactive}
                        fill="#ff446a"
                        stroke="rgba(255, 68, 106, 0.7)"
                      />
                    </section>
                  </td>

                  <td>
                    <h5 className="text-success delta" style={{ fontSize: 12 }}>
                      {Number(delta[0].deltarecovered) > 0 ? (
                        ""
                      ) : (
                        <Icon.Smile
                          size={12}
                          strokeWidth={3}
                          fill="rgba(23, 162, 184, 0.2)"
                          style={{ verticalAlign: "-0.2rem" }}
                        />
                      )}
                      {Number(delta[0].deltarecovered) > 0
                        ? "+" + commaSeperated(delta[0].deltarecovered)
                        : ""}
                    </h5>
                    <h5
                      className="text-success"
                      style={{ textAlign: "center" }}
                    >
                      {!percentageToggleActive ? (
                        <CountUp
                          start={0}
                          end={Number(total[0].recovered)}
                          duration={2}
                          separator=","
                        />
                      ) : (
                        (
                          (Number(total[0].recovered) /
                            Number(total[0].confirmed)) *
                          100
                        ).toFixed(1) + "%"
                      )}
                    </h5>
                    <section
                      id="line1"
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={2}
                        min={min}
                        max={max}
                        type={sparklinerecovered}
                        fill="#58bd58"
                        stroke="rgba(88, 189, 88, 0.7)"
                        width={76}
                      />
                    </section>
                    <section
                      id="line2"
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={2}
                        min={min}
                        max={max}
                        type={sparklinerecovered}
                        fill="#58bd58"
                        stroke="rgba(88, 189, 88, 0.7)"
                      />
                    </section>
                  </td>

                  <td>
                    <h6
                      className="text-secondary delta"
                      style={{ fontSize: 12 }}
                    >
                      {Number(delta[0].deltadeaths) > 0 ? (
                        ""
                      ) : (
                        <Icon.Meh
                          size={12}
                          strokeWidth={3}
                          fill="rgba(40, 167, 69, 0.2)"
                          style={{ verticalAlign: "-0.2rem" }}
                        />
                      )}
                      {Number(delta[0].deltadeaths)
                        ? "+" + commaSeperated(delta[0].deltadeaths)
                        : ""}
                    </h6>
                    <h5
                      className="text-secondary"
                      style={{ textAlign: "center" }}
                    >
                      {!percentageToggleActive ? (
                        <CountUp
                          start={0}
                          end={Number(total[0].deaths)}
                          duration={2}
                          separator=","
                        />
                      ) : (
                        (
                          (Number(total[0].deaths) /
                            Number(total[0].confirmed)) *
                          100
                        ).toFixed(1) + "%"
                      )}
                    </h5>
                    <section
                      id="line1"
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={3}
                        min={min}
                        max={max}
                        type={sparklinedeceased}
                        fill="#5c5756"
                        stroke="rgba(92, 87, 86, 0.7)"
                        width={76}
                      />
                    </section>
                    <section
                      id="line2"
                      style={{
                        justifyContent: "center",
                        paddingBottom: "-10px",
                      }}
                    >
                      <MiniSparkline
                        sparklinedata={sparklinedata}
                        datakey={3}
                        min={min}
                        max={max}
                        type={sparklinedeceased}
                        fill="#5c5756"
                        stroke="rgba(92, 87, 86, 0.7)"
                      />
                    </section>
                  </td>
                </tbody>
              </table>
            </div>
            <div className="w-100"></div>
            <div className="container">
              <div className="row" id="line2">
                <Updates />
              </div>
            </div>
            <div className="w-100"></div>
            <div className="row" id="line1">
              <Updates />
            </div>
            <div className="w-100"></div>
            <div
              className="row fadeInUp"
              style={{
                textAlign: "center",
                animationDelay: "1.8s",
                marginTop: "-20px",
              }}
            >
              <h5 style={{ color: "#3e4da3" }}>
                INDIA - STATEWISE{" "}
                <OverlayTrigger
                  key={"bottom"}
                  placement={"bottom"}
                  overlay={
                    <Tooltip id={`tooltip-${"bottom"}`}>
                      <strong>
                        {"Data tallied with State bulletins and MoHFW"}
                      </strong>
                    </Tooltip>
                  }
                >
                  <span>
                    <InfoOutlined
                      color="inherit"
                      fontSize="small"
                      style={{ verticalAlign: "-0.15rem" }}
                    />
                  </span>
                </OverlayTrigger>
              </h5>
              <div
                className="col fadeInUp"
                style={{ animationDelay: "1.8s", alignItems: "right" }}
              >
                <div
                  className="home-toggle float-left"
                  style={{
                    marginTop: "3px",
                  }}
                >
                  <Switch
                    className="react-switch"
                    onChange={this.onPercentageToggle}
                    onClick={ReactGa.event({
                      category: "Switch %age",
                      action: "Switch %age clicked",
                    })}
                    checked={percentageToggleActive}
                    onColor="#6b7de4"
                    onHandleColor="#3e4da3"
                    handleDiameter={11}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0 0 5px rgba(0,0,0,0.2)"
                    activeBoxShadow="0 0 2px rgba(0,0,0,0.25)"
                    height={16}
                    width={35}
                  ></Switch>
                </div>
                <span
                  style={{
                    color: "#3e4da3",
                    fontWeight: "bold",
                  }}
                >
                  &nbsp;%age
                </span>
              </div>
            </div>
            <div className="w-100"></div>
            <div
              id="line1"
              style={{
                alignContent: "center",
                marginBottom: "20px",
                marginTop: "-15px",
              }}
            >
              <StateTable />
            </div>
            <div
              className="container"
              style={{
                width: "93.7%",
                marginBottom: "20px",
                marginTop: "-15px",
              }}
              id="line2"
            >
              <StateTable />
            </div>
            <div className="w-100"></div>
            <div className="row" id="line1">
              <table
                className="table table-sm fadeInUp table-borderless"
                style={{
                  animationDelay: "1.9s",
                  marginTop: "-15px",
                  marginBottom: "-10px",
                  fontFamily: "notosans",
                }}
                align="center"
              >
                <thead className="thead-dark">
                  <tr>
                    <th className="th sticky-top">State/UT</th>
                    <th
                      className="th text-info sticky-top"
                      onClick={() =>
                        this.setState({
                          sortConfirmed: true,
                          sortActive: false,
                          sortRecovered: false,
                          sortDeceased: false,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      C
                      {sortConfirmed && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                    <th
                      className="th sticky-top"
                      style={{ color: "#ff446a" }}
                      onClick={() =>
                        this.setState({
                          sortConfirmed: false,
                          sortActive: true,
                          sortRecovered: false,
                          sortDeceased: false,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      A
                      {sortActive && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                    <th
                      className="th text-success sticky-top"
                      onClick={() =>
                        this.setState({
                          sortConfirmed: false,
                          sortActive: false,
                          sortRecovered: true,
                          sortDeceased: false,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      R
                      {sortRecovered && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                    <th
                      className="th text-secondary sticky-top"
                      onClick={() =>
                        this.setState({
                          sortConfirmed: false,
                          sortActive: false,
                          sortRecovered: false,
                          sortDeceased: true,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      D
                      {sortDeceased && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody className="tbody">
                  {items.map((item, i) => (
                    <tr
                      className="tr"
                      key={item.statecode}
                      style={{
                        background: i % 2 === 0 ? "rgba(63, 63, 95, 0.2)" : "",
                      }}
                    >
                      <td className="td-md-left align-middle">
                        <h6 style={{ fontSize: 12, marginTop: "6px" }}>
                          {item.state} &nbsp;
                          {item.statenotes ? (
                            <OverlayTrigger
                              key={"right"}
                              placement={"right"}
                              overlay={
                                <Tooltip id={`tooltip-${"right"}`}>
                                  <strong>{parse(item.statenotes)}</strong>
                                </Tooltip>
                              }
                            >
                              <span>
                                <InfoOutlined
                                  color="inherit"
                                  fontSize="inherit"
                                  style={{ verticalAlign: "-0.08rem" }}
                                />
                              </span>
                            </OverlayTrigger>
                          ) : (
                            ""
                          )}
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 className="arrowup">
                          <DeltaArrow
                            deltaType={item.deltaconfirmed}
                            color={"#42b3f4"}
                          />
                          <DeltaValue
                            deltaType={item.deltaconfirmed}
                            color={"#42b3f4"}
                          />
                          <h6 className="delta td-md align-middle">
                            {commaSeperated(item.confirmed)}
                          </h6>
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 style={{ fontSize: 4 }}>
                          &nbsp;
                          <h6 className="delta td-md align-middle">
                            {percentageToggleActive
                              ? ((item.active * 100) / item.confirmed).toFixed(
                                  1
                                ) + "%"
                              : commaSeperated(item.active)}
                          </h6>
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 className="arrowup">
                          <DeltaArrow
                            deltaType={item.deltarecovered}
                            color={"#28a745"}
                          />
                          <DeltaValue
                            deltaType={item.deltarecovered}
                            color={"#28a745"}
                          />

                          <h6 className="delta td-md align-middle">
                            {percentageToggleActive
                              ? (
                                  (item.recovered * 100) /
                                  item.confirmed
                                ).toFixed(1) + "%"
                              : commaSeperated(item.recovered)}
                          </h6>
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 className="arrowup">
                          <DeltaArrow
                            deltaType={item.deltadeaths}
                            color={"#6c757d"}
                          />
                          <DeltaValue
                            deltaType={item.deltadeaths}
                            color={"#6c757d"}
                          />

                          <h6 className="delta td-md align-middle">
                            {percentageToggleActive
                              ? ((item.deaths * 100) / item.confirmed).toFixed(
                                  1
                                ) + "%"
                              : commaSeperated(item.deaths)}
                          </h6>
                        </h6>
                      </td>
                    </tr>
                  ))}
                  <tr
                    className="tr"
                    key={total[0].statecode}
                    style={{ background: "rgba(105, 90, 205, 0.2)" }}
                  >
                    <td className="align-middle td-md-left">
                      {total[0].state}
                    </td>
                    <td
                      className="delta td-md align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 className="arrowup text-info">
                        <DeltaArrow
                          deltaType={total[0].deltaconfirmed}
                          color={"#42b3f4"}
                        />
                        <DeltaValue
                          deltaType={total[0].deltaconfirmed}
                          color={"#42b3f4"}
                        />

                        <h6 className="delta td-md align-middle">
                          {commaSeperated(total[0].confirmed)}
                        </h6>
                      </h6>
                    </td>
                    <td
                      className="delta td-md align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 style={{ fontSize: 4 }}>
                        &nbsp;
                        <h6 className="align-middle">
                          {total[0].active === "0"
                            ? "-"
                            : commaSeperated(total[0].active)}
                        </h6>
                      </h6>
                    </td>
                    <td
                      className="delta td-md text-secondary align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 className="arrowup">
                        <DeltaArrow
                          deltaType={total[0].deltarecovered}
                          color={"#28a745"}
                        />
                        <DeltaValue
                          deltaType={total[0].deltarecovered}
                          color={"#28a745"}
                        />

                        <h6 className="delta td-md align-middle">
                          {total[0].recovered === "0"
                            ? "-"
                            : commaSeperated(total[0].recovered)}
                        </h6>
                      </h6>
                    </td>
                    <td
                      className="delta td-md align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 className="arrowup">
                        <DeltaArrow
                          deltaType={total[0].deltadeaths}
                          color={"#6c757d"}
                        />
                        <DeltaValue
                          deltaType={total[0].deltadeaths}
                          color={"#6c757d"}
                        />

                        <h6 className="delta td-md align-middle">
                          {commaSeperated(total[0].deaths)}
                        </h6>
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row container" id="line2">
              <table
                className="table table-sm fadeInUp table-borderless"
                style={{
                  animationDelay: "1.9s",
                  marginTop: "-15px",
                }}
                align="center"
              >
                <thead className="thead-dark">
                  <tr>
                    <th className="th-md sticky-top" style={{ width: "185px" }}>
                      State/UT
                    </th>
                    <th
                      className="th-md text-info sticky-top"
                      style={{ textAlign: "center" }}
                      onClick={() =>
                        this.setState({
                          sortConfirmed: true,
                          sortActive: false,
                          sortRecovered: false,
                          sortDeceased: false,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      Cnfrmd
                      {sortConfirmed && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                    <th
                      className="th-md sticky-top"
                      style={{ color: "#ff446a", textAlign: "center" }}
                      onClick={() =>
                        this.setState({
                          sortConfirmed: false,
                          sortActive: true,
                          sortRecovered: false,
                          sortDeceased: false,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      Actv
                      {sortActive && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                    <th
                      className="th-md text-success sticky-top"
                      style={{ textAlign: "center" }}
                      onClick={() =>
                        this.setState({
                          sortConfirmed: false,
                          sortActive: false,
                          sortRecovered: true,
                          sortDeceased: false,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      Rcvrd
                      {sortRecovered && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                    <th
                      className="th-md text-secondary sticky-top"
                      style={{ textAlign: "center" }}
                      onClick={() =>
                        this.setState({
                          sortConfirmed: false,
                          sortActive: false,
                          sortRecovered: false,
                          sortDeceased: true,
                          sortOrder: !sortOrder,
                        })
                      }
                    >
                      Dcsd
                      {sortDeceased && (
                        <SortRoundedIcon
                          style={{
                            color: "#ffc107",
                            height: "1rem",
                            width: "1rem",
                            verticalAlign: "-0.2rem",
                          }}
                        />
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody className="tbody">
                  {items.map((item, i) => (
                    <tr className="tr" key={item.statecode}>
                      <td
                        className="td-md-left align-middle"
                        style={{
                          backgroundColor: "rgba(63, 63, 95, 0.2)",
                        }}
                      >
                        <h6 style={{ marginTop: 6 }}>
                          {item.state} &nbsp;
                          {item.statenotes ? (
                            <OverlayTrigger
                              key={"right"}
                              placement={"right"}
                              overlay={
                                <Tooltip id={`tooltip-${"right"}`}>
                                  <strong>{parse(item.statenotes)}</strong>
                                </Tooltip>
                              }
                            >
                              <span>
                                <InfoOutlined
                                  color="inherit"
                                  fontSize="inherit"
                                  style={{ verticalAlign: "-0.15rem" }}
                                />
                              </span>
                            </OverlayTrigger>
                          ) : (
                            ""
                          )}
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 className="arrowup">
                          <DeltaArrow
                            deltaType={item.deltaconfirmed}
                            color={"#42b3f4"}
                          />
                          <DeltaValue
                            deltaType={item.deltaconfirmed}
                            color={"#42b3f4"}
                          />
                          <h6 className="align-middle ">
                            {commaSeperated(item.confirmed)}
                          </h6>
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 style={{ fontSize: 4 }}>
                          &nbsp;
                          <h6 className="align-middle">
                            {percentageToggleActive
                              ? ((item.active * 100) / item.confirmed).toFixed(
                                  1
                                ) + "%"
                              : item.active === "0"
                              ? "-"
                              : commaSeperated(item.active)}
                          </h6>
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 className="arrowup">
                          <DeltaArrow
                            deltaType={item.deltarecovered}
                            color={"#28a745"}
                          />
                          <DeltaValue
                            deltaType={item.deltarecovered}
                            color={"#28a745"}
                          />
                          <h6 className="align-middle">
                            {percentageToggleActive
                              ? (
                                  (item.recovered * 100) /
                                  item.confirmed
                                ).toFixed(1) + "%"
                              : commaSeperated(item.recovered)}
                          </h6>
                        </h6>
                      </td>
                      <td
                        className="delta td-md align-middle"
                        style={{ textAlign: "right" }}
                      >
                        <h6 className="arrowup">
                          <DeltaArrow
                            deltaType={item.deltadeaths}
                            color={"#6c757d"}
                          />
                          <DeltaValue
                            deltaType={item.deltadeaths}
                            color={"#6c757d"}
                          />

                          <h6 className="align-middle">
                            {percentageToggleActive
                              ? ((item.deaths * 100) / item.confirmed).toFixed(
                                  1
                                ) + "%"
                              : commaSeperated(item.deaths)}
                          </h6>
                        </h6>
                      </td>
                    </tr>
                  ))}
                  <tr
                    className="tr"
                    key={total[0].statecode}
                    style={{ background: "rgba(105, 90, 205, 0.2)" }}
                  >
                    <td className="td-md-left align-middle">
                      <h6 style={{ marginTop: "8px" }}>{total[0].state}</h6>
                    </td>
                    <td
                      className="delta td-md align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 className="arrowup">
                        <DeltaArrow
                          deltaType={total[0].deltaconfirmed}
                          color={"#42b3f4"}
                        />
                        <DeltaValue
                          deltaType={total[0].deltaconfirmed}
                          color={"#42b3f4"}
                        />

                        <h6 className="align-middle">
                          {commaSeperated(total[0].confirmed)}
                        </h6>
                      </h6>
                    </td>
                    <td
                      className="delta td-md align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 style={{ fontSize: 4 }}>
                        &nbsp;
                        <h6 className="align-middle">
                          {total[0].active === "0"
                            ? "-"
                            : commaSeperated(total[0].active)}
                        </h6>
                      </h6>
                    </td>
                    <td
                      className="delta td-md align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 className="arrowup">
                        <DeltaArrow
                          deltaType={total[0].deltarecovered}
                          color={"#28a745"}
                        />
                        <DeltaValue
                          deltaType={total[0].deltarecovered}
                          color={"#28a745"}
                        />

                        <h6 className="align-middle">
                          {total[0].recovered === "0"
                            ? "-"
                            : commaSeperated(total[0].recovered)}
                        </h6>
                      </h6>
                    </td>
                    <td
                      className="delta td-md align-middle"
                      style={{ textAlign: "right" }}
                    >
                      <h6 className="arrowup">
                        <DeltaArrow
                          deltaType={total[0].deltadeaths}
                          color={"#6c757d"}
                        />
                        <DeltaValue
                          deltaType={total[0].deltadeaths}
                          color={"#6c757d"}
                        />
                        <h6 className="align-middle">
                          {commaSeperated(total[0].deaths)}
                        </h6>
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default Table;
