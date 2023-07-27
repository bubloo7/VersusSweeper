import { Space, Button } from "antd";

export default function GameNotFound() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--main-black)"
        }}
      >
        <div className="space-align-container">
          <div className="space-align-block ">
            <Space align="center">
              <h1 className="mine-sweeper">Game not found! *</h1>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
}
