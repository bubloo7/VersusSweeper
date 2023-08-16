import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import {
  FieldTimeOutlined,
  AimOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";

function compare(a, b) {
  // Compare the finish time property.
  if (a.finishTime < b.finishTime) {
    return -1;
  } else if (a.finishTime > b.finishTime) {
    return 1;
  } else {
    // The finish times are equal, so compare the clears property.
    if (a.clears > b.clears) {
      return -1;
    } else if (a.clears < b.clears) {
      return 1;
    } else {
      // The clears are equal, so compare the misses property.
      if (a.misses < b.misses) {
        return -1;
      } else if (a.misses > b.misses) {
        return 1;
      } else {
        // The misses are equal, so the objects are equal.
        return 0;
      }
    }
  }
}
{
  /* <Leaderboard hits={hits} misses={misses} players={players} name={name} /> */
}

export default function Leaderboard(props) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {

    let temp_players = { ...props.players };
    temp_players[props.name].misses = props.misses;
    temp_players[props.name].clears = props.hits;
    temp_players[props.name].finishTime = Math.min(
      props.finishTime,
      temp_players[props.name].finishTime
    );

    let l = [...Object.values(temp_players)];
    l = l.sort(compare);


    setLeaderboard(
      l.map((player, index) => {
        return (
          // <div key={index}>
          //     {index + 1}. {player.name} - {player.clears} clears, {player.misses} misses{" "}
          //     {player.finishTime === 1682900908681 * 2
          //         ? ""
          //         : `in ${Math.floor((player.finishTime - props.startTime) / 1000)} seconds`}
          // </div>
          <Row
            justify="space-between"
            align="middle"
            key={index}
            style={{ marginTop: "10px", marginLeft: "20px" }}
            wrap={true}
          >
            <Col
              className="body-text"
              style={{ width: "40%", textAlign: "start" }}
            >
              {index + 1}.{player.name}
            </Col>
            <Col
              className="body-text"
              style={{
                width: "20%",
                textAlign: "center",
                color: "var(--main-green)",
              }}
            >
              {player.clears}
            </Col>
            <Col
              className="body-text"
              style={{
                width: "20%",
                textAlign: "center",
                color: "var(--main-red)",
              }}
            >
              {player.misses}
            </Col>
            <Col
              className="body-text"
              style={{ width: "20%", textAlign: "center" }}
            >
              {player.finishTime === 1682900908681 * 2
                ? "-"
                : `${Math.floor((player.finishTime - props.startTime) / 1000)}`}
            </Col>
          </Row>
        );
      })
    );
  }, [props.hits, props.misses, props.players, props.finishTime]);

  return (
    <>
      <Row
        justify="space-between"
        wrap={true}
        align="middle"
        style={{ marginTop: "20px" }}
      >
        <Col className="button-text" flex={8} style={{ textAlign: "center" }}>
          name
        </Col>
        <Col
          className="button-text"
          flex={4}
          style={{ textAlign: "center", color: "var(--main-green)" }}
        >
          <AimOutlined />
        </Col>
        <Col
          className="button-text"
          flex={4}
          style={{ textAlign: "center", color: "var(--main-red)" }}
        >
          <CloseSquareOutlined />
        </Col>
        <Col className="button-text" flex={4} style={{ textAlign: "center" }}>
          <FieldTimeOutlined />
        </Col>
      </Row>
      <Row justify="center" wrap={true} align="middle">
        <Col span={24}>{leaderboard}</Col>
      </Row>
    </>
  );
}
