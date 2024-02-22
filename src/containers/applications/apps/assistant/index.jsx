import { useState } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "~/utils/general";
import "./style.scss";
import TextLoading from "~/components/TextLoading";

export const Assistant = () => {
  const app = useSelector((state) => state.apps.assistant);

  const [key, setKey] = useState(
    localStorage.getItem("xOS_OpenAI_API_KEY") || ""
  );
  const [view, setView] = useState(key ? "app" : "key"); // key || app
  const generateId = () => Date.now().toString(36);

  const [appState, setAppState] = useState({
    message: "",
    messages: [
      {
        role: "assistant",
        content: "Hello. How can I help you?",
      },
    ],
    id: generateId(),
  });

  const onKeySubmit = (e, value) => {
    e.preventDefault();
    if (value) {
      setKey(value);
      localStorage.setItem("xOS_OpenAI_API_KEY", value);
      setView("app");
    }
  };

  // const onSaveTranscript = () => {
  //   console.log("Saving transcript.");
  // };

  const onReset = () => {
    localStorage.removeItem("xOS_OpenAI_API_KEY");
    setView("key");
    setKey("");
    setAppState({
      message: "",
      messages: [
        {
          role: "assistant",
          content: "Hello. How can I help you?",
        },
      ],
      id: generateId(),
    });
  };

  const sendMessageToChatGPT = async (messages) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          body: JSON.stringify({ messages, model: "gpt-4-1106-preview" }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("xOS_OpenAI_API_KEY")}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      if (response.error) {
        if (response.error.code === "invalid_api_key") {
          throw new Error(response.error);
        }
      }
      return response.choices[0].message;
    } catch (error) {
      return {
        role: "assistant",
        content: `It appears that the API key you entered is not valid. Please click the "Reset" button and enter a correct API key.`,
      };
    }
  };

  const handleSubmit = (content) => {
    const newMessages = appState.messages.concat({ role: "user", content });
    setAppState((s) => ({
      ...s,
      loading: true,
      messages: newMessages,
    }));

    sendMessageToChatGPT(
      newMessages.map(({ role, content }) => ({ role, content }))
    ).then((message) => {
      setAppState((s) => ({
        ...s,
        loading: false,
        messages: [...s.messages, { id: Date.now(), ...message }],
      }));
    });
  };

  return (
    <div
      className="assistantApp floatTab dpShad"
      data-size={app.size}
      id={app.icon + "App"}
      data-max={app.max}
      style={{
        ...(app.size === "cstm" ? app.dim : null),
        zIndex: app.z,
      }}
      data-hide={app.hide}
    >
      <ToolBar
        app={app.action}
        icon={app.icon}
        size={app.size}
        name="Assistant"
      />

      {view === "key" ? <KeyScreen onSubmit={onKeySubmit} /> : <></>}
      {view === "app" ? (
        <AppScreen
          conversationID={appState.id}
          messages={appState.messages}
          loading={appState.loading}
          onSubmit={handleSubmit}
          onReset={onReset}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

const AppScreen = ({
  conversationID,
  messages,
  onSubmit,
  onSaveTranscript,
  onReset,
  loading,
}) => {
  const [value, setValue] = useState("");

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        onSubmit(value);
        setTimeout(() => {
          setValue("");
        }, 0);
        return false;
      }
    }
  };
  const onChange = (e) => setValue(e.target.value);

  return (
    <div className="app-screen">
      <main>
        <div className="conversation">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              {message.content.trim()}
            </div>
          ))}
          {loading ? (
            <div className="loading">
              <TextLoading />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="form">
          <textarea
            autoFocus
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Ask anything..."
          />
        </div>
      </main>
      <footer>
        <div>ID: {conversationID}</div>
        <div>
          {/* <button onClick={onSaveTranscript}>Save Transcript</button> */}
          <button onClick={onReset}>Reset</button>
        </div>
      </footer>
    </div>
  );
};

const KeyScreen = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  return (
    <div className="key-screen">
      <form onSubmit={(e) => onSubmit(e, value)}>
        <input
          type="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="Enter OpenAI API key"
        />
      </form>
    </div>
  );
};
