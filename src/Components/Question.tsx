import React, { FC, useEffect } from "react";
import UpArrow from "../assets/up-arrow.png";
import "./Question.css";
import { upVote } from "../utils/fetchApi";
import { UserContext } from "../Context/UserContextProvider";
import { errorToast } from "../utils/toastHelper";
import { socket } from "../App";

interface QuestionProps {
  question: string;
  upVotes: string[];
  askedBy: any;
  questionId: string;
  sessionId: string;
  createdAt: any;
  session: any;
  setSession: any;
}

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

const Question: FC<QuestionProps> = ({
  question,
  upVotes,
  askedBy,
  questionId,
  sessionId,
  createdAt,
  session,
  setSession,
}) => {
  const [upVoted, setUpVoted] = React.useState(false);
  const [upVoteArray, setUpVoteArray] = React.useState<string[]>(upVotes);
  const { user } = React.useContext(UserContext);
  const date = new Date(createdAt);

  useEffect(() => {
    if (user) {
      setUpVoted(upVotes.includes(user._id));
    }
  }, []);

  useEffect(() => {
    socket.on("vote", (data) => {
      const question = data.session.questions.find(
        (question: any) => question._id == questionId
      );
      // upVotes = question?.upVotes;
      setSession(data.session);
      setUpVoteArray(question?.upVotes);
    });
  }, []);

  useEffect(() => {
    setUpVoteArray(upVotes);
    setUpVoted(upVotes.includes(user._id));
  }, [upVotes]);

  return (
    <div className="question">
      <div>
        <div className="questionText">{question}</div>
        <div className="author">
          <div>
            {askedBy?.name} :{" "}
            {`${ConvertTimeFormat(date.toLocaleTimeString())}`}
          </div>
          {/* <div>{askedBy?.email}</div> */}
        </div>
      </div>
      <div className="upVote">
        <div
          className={`${upVoted && "active"}`}
          onClick={() => {
            const oldSession = session;
            if (!upVoted) {
              setUpVoteArray((upVotes) => {
                upVotes = upVotes.filter((id) => id !== user._id);
                return [...upVotes, user._id];
              });
              setSession((session: any) => {
                if (session?.questions) {
                  const question = session.questions.find(
                    (question: any) => question._id === questionId
                  );
                  if (question) {
                    const newUpVotes =
                      question.upVotes.filter(
                        (id: string) => id !== user._id
                      ) || [];
                    question.upVotes = [...newUpVotes, user._id];
                  }
                  return {
                    ...session,
                    questions: [...session.questions],
                  };
                }
                return session;
              });
            } else {
              setUpVoteArray((upVotes) => {
                return upVotes.filter((id) => id !== user._id);
              });
              setSession((session: any) => {
                if (session?.questions) {
                  const question = session.questions.find(
                    (question: any) => question._id === questionId
                  );
                  if (question) {
                    question.upVotes = question.upVotes.filter(
                      (id: string) => id !== user._id
                    );
                  }
                  return {
                    ...session,
                    questions: [...session.questions],
                  };
                }
                return session;
              });
            }
            setUpVoted((upVoted) => !upVoted);
            upVote(sessionId, questionId)
              .then((res) => res.data)
              .then((data) => {
                setUpVoted(data.upVoted);
                setSession(data.session);
                const question = data.session.questions.find(
                  (question: any) => question._id === questionId
                );
                // upVotes = question?.upVotes;
                setUpVoteArray(question?.upVotes);
              })
              .catch((err) => {
                errorToast(
                  err?.response?.data?.message || "Something went wrong"
                );
                setSession(oldSession);
                if (upVoted) {
                  setUpVoteArray((upVotes) => {
                    return [...upVotes, user._id];
                  });
                } else {
                  setUpVoteArray((upVotes) => {
                    return upVotes.filter((id) => id !== user._id);
                  });
                }
                setUpVoted((upVoted) => !upVoted);
              });
          }}
        >
          <img src={UpArrow} />
        </div>
        <div>{upVoteArray?.length}</div>
      </div>
    </div>
  );
};

export default Question;
