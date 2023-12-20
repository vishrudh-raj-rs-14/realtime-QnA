import React, { FC, useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { Button, Table, TableData } from "@mantine/core";
import "./Main.css";
import { createSession, getSessions, logOut } from "../../utils/fetchApi";
import { errorToast, successToast } from "../../utils/toastHelper";
import { socket } from "../../App";

const ConvertTimeFormat = (time: string) => {
  const [hours, minutes] = time.split(":");
  let formattedTime = "";

  let hour = parseInt(hours);
  let suffix = "AM";

  if (hour >= 12) {
    hour = hour === 12 ? 12 : hour - 12;
    suffix = "PM";
  }

  formattedTime = `${hour}:${minutes} ${suffix}`;

  return formattedTime;
};

const Main: FC = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [tableData, setTableData] = React.useState<TableData>({});

  useEffect(() => {
    socket.emit("joinMain", {});

    socket.on("session", (data) => {
      setTableData((tableData) => {
        return {
          ...tableData,
          body: [
            [
              1,
              new Date(data.createdAt).toLocaleDateString(),
              ConvertTimeFormat(new Date(data.createdAt).toLocaleTimeString()),
              data.questions.length,
              "No",
              <Button
                onClick={() => {
                  navigate(`/${data._id}`);
                }}
              >
                Enter Session
              </Button>,
            ],
            ...(tableData.body?.map((row) => {
              return [row[0] + 1, ...row.slice(1)];
            }) || []),
          ],
        };
      });
    });

    // if (socket.disconnected) {
    //   console.log("reconnecting...");
    //   socket.connect();
    // }
    // console.log("emited");

    return () => {
      socket.off("session");
      socket.emit("leaveMain", {});
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
    getSessions()
      .then((res) => res.data)
      .then((data) => {
        setTableData(() => {
          return {
            head: [
              "Sno",
              "Session Date",
              "Session Time",
              "Number of Questions",
              "Expired",
              "Enter Session",
            ],
            body: data.sessions.map((session: any, i: number) => {
              const date = new Date(session.createdAt);
              const expireyDate = new Date(session.expiresAt);
              return [
                i + 1,
                date.toLocaleDateString(),
                ConvertTimeFormat(date.toLocaleTimeString()),
                session.questions.length,
                new Date().getTime() < expireyDate.getTime() ? "No" : "Yes",
                <Button
                  onClick={() => {
                    navigate(`/${session._id}`);
                  }}
                >
                  Enter Session
                </Button>,
              ];
            }),
          };
        });
      })
      .catch((err: any) => {
        errorToast(err?.response?.data?.message || "Something went wrong");
      });
  }, [user]);
  return (
    <div className="mainBody">
      <div className="mainHeader">
        <div className="mainHeaderText">QnA Sessions</div>
        <div className="newSession">
          {user?.role == "ADMIN" && (
            <Button
              onClick={() => {
                createSession()
                  .then((res) => res.data)
                  .then((data) => {
                    navigate(`/${data.session._id}`);
                    successToast("Session created successfully");
                  })
                  .catch((err: any) => {
                    errorToast(
                      err?.response?.data?.message || "Something went wrong"
                    );
                  });
              }}
            >
              Create new Session
            </Button>
          )}
          <Button
            color="red"
            onClick={() => {
              logOut()
                .then(() => {
                  setUser(null);
                  localStorage.removeItem("user");
                  navigate("/signup");
                })
                .catch((err) => {
                  errorToast(
                    err?.response?.data?.message || "Something went wrong"
                  );
                });
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
      <div>
        <Table data={tableData} horizontalSpacing="lg" />
      </div>
    </div>
  );
};

export default Main;
