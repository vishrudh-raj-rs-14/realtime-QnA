import React, { FC, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContextProvider";
import { Button, Select } from "@mantine/core";
import {
  createQuestion,
  getSession,
  logOut,
  toggleLock,
} from "../../utils/fetchApi";
import Send from "../../assets/send.png";
import { errorToast } from "../../utils/toastHelper";
import "./Session.css";
import Question from "../../Components/Question";
import { socket } from "../../App";

interface SessionProps {}

const Session: FC<SessionProps> = ({}) => {
  const { user, setUser } = useContext(UserContext);
  const [sortBy, setSortBy] = React.useState("First Asked"); // ["Most Recent", "Most Upvoted"
  const [session, setSession] = React.useState();
  const [locked, setLocked] = React.useState(true);
  const [question, setQuestion] = React.useState("");
  const [canAsk, setCanAsk] = React.useState(true);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  //   const tableData: TableData = {
  //     caption: 'Some elements from periodic table',
  //     head: ['Element position', 'Atomic mass', 'Symbol', 'Element name'],
  //     body: [
  //       [6, 12.011, 'C', 'Carbon'],
  //       [7, 14.007, 'N', 'Nitrogen'],
  //       [39, 88.906, 'Y', 'Yttrium'],
  //       [56, 137.33, 'Ba', 'Barium'],
  //       [58, 140.12, 'Ce', 'Cerium'],
  //     ],
  //   };

  useEffect(() => {
    socket.emit("joinSession", { sessionId });

    socket.on("question", (data) => {
      setSession(data);
    });

    socket.on("lock", (data) => {
      setLocked(data);
    });

    return () => {
      socket.emit("leaveSession", { sessionId });
      socket.off("question");
      socket.off("lock");
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }
    getSession(sessionId as string)
      .then((res) => res.data)
      .then((data) => {
        setSession(data.session);
        setLocked(data.session.locked);
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message || "Something went wrong");
      });
  }, []);

  //   useEffect(() => {
  //     setSession((session) => {
  //       if (session?.questions) {
  //         if (sortBy === "First Asked") {
  //           return {
  //             ...session,
  //             questions: session.questions.sort(
  //               (a: any, b: any) =>
  //                 new Date(a.createdAt).getTime() -
  //                 new Date(b.createdAt).getTime()
  //             ),
  //           };
  //         } else {
  //           return {
  //             ...session,
  //             questions: session.questions.sort(
  //               (a: any, b: any) => b.upVotes.length - a.upVotes.length
  //             ),
  //           };
  //         }
  //       }
  //       return session;
  //     });
  //   }, [sortBy]);

  return (
    <div className="session">
      <div className="sessionHeader">
        <div className="sessionHeaderText">Questions</div>
        <div className="sessionButtons">
          {user?.role == "ADMIN" && (
            <Button
              color={locked ? "blue" : "gray"}
              onClick={() => {
                setLocked((lock) => !lock);
                toggleLock(sessionId as string)
                  .then((res) => res.data)
                  .then((data) => {
                    setLocked(data.session.locked);
                    navigate(`/${data.session._id}`);
                  })
                  .catch((err: any) => {
                    setLocked(session?.locked || true);
                    errorToast(
                      err?.response?.data?.message || "Something went wrong"
                    );
                  });
              }}
            >
              {locked ? "Unlock" : "Lock"}
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
      <div className="filters">
        <div className="sort">
          <div>Sort By</div>
          <Select
            data={["First Asked", "Most Upvoted"]}
            value={sortBy}
            onChange={(val) => {
              setSortBy(val as string);
            }}
          />
        </div>
      </div>
      <div className="sessionBody">
        {session?.questions &&
          session?.questions
            .sort((a: any, b: any) => {
              if (sortBy === "First Asked") {
                return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
                );
              } else {
                return b.upVotes.length - a.upVotes.length;
              }
            })
            .map((question: any) => {
              return (
                <Question
                  question={question.question}
                  askedBy={question.askedBy}
                  upVotes={question.upVotes}
                  sessionId={sessionId as string}
                  questionId={question._id}
                  createdAt={question.createdAt}
                  session={session}
                  setSession={setSession}
                />
              );
            })}
        {session &&
          (!locked || user.role === "ADMIN") &&
          new Date().getTime() < new Date(session?.expiresAt).getTime() && (
            <div className="sessionInput">
              <div>
                <input
                  placeholder="Enter your question here"
                  value={question}
                  onChange={(e) => {
                    {
                      setQuestion(e.target.value);
                    }
                  }}
                />
                <div
                  onClick={() => {
                    if (!question) {
                      return;
                    }
                    if (!canAsk && user.role !== "ADMIN") {
                      errorToast("You can ask question only every 30 seconds");
                      return;
                    }
                    const oldQuestion = session;
                    setSession((session) => {
                      if (session?.questions) {
                        return {
                          ...session,
                          questions: [
                            ...session.questions,
                            {
                              question,
                              askedBy: user,
                              upVotes: [],
                              createdAt: new Date().toISOString(),
                              _id: Math.random().toString(),
                            },
                          ],
                        };
                      }
                      return session;
                    });
                    createQuestion(sessionId as string, question)
                      .then((res) => res.data)
                      .then((data) => {
                        setSession(data.session);
                      })
                      .catch((err) => {
                        setSession(oldQuestion);
                        errorToast(
                          err?.response?.data?.message || "Something went wrong"
                        );
                      });
                    setQuestion("");
                    setCanAsk(false);
                    setTimeout(() => {
                      setCanAsk(true);
                    }, 30000);
                  }}
                >
                  <img src={Send} />
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Session;
