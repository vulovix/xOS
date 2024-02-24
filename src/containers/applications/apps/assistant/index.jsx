import { useState } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "~/utils/general";
import "./style.scss";
import TextLoading from "~/components/TextLoading";

const generateId = () => Date.now().toString(36).toUpperCase();

const getDefaultConversation = () => ({
  message: "",
  messages: [
    {
      role: "system",
      content: `You are helpful assistant, You should always be truthful and if you are unsure be honest and tell that you are unsure. You shoul never be lazy and you should should like a human instead of a robot. If someone asks you for code samples don't be lazy and generate full snipets of code with minimal explanation via comments if needed. You can offer to the user to write him more detailed answer but don't explain everything right away. Always be concise in your answers for any topic user asks, answer more detailed only if user asks you to do so.`,
    },
    {
      role: "assistant",
      content: "Hello. How can I help you?",
    },
  ],
  id: generateId(),
});

export const Assistant = () => {
  const app = useSelector((state) => state.apps.assistant);

  const [key, setKey] = useState(
    localStorage.getItem("xOS_OpenAI_API_KEY") || ""
  );
  const [view, setView] = useState(key ? "app" : "key"); // key || app

  const [appState, setAppState] = useState(getDefaultConversation());

  const onKeySubmit = (e, value) => {
    e.preventDefault();
    if (value) {
      setKey(value);
      localStorage.setItem("xOS_OpenAI_API_KEY", value);
      setView("app");
    }
  };

  const onNewConversation = () => {
    setAppState(getDefaultConversation());
  };

  const onReset = () => {
    localStorage.removeItem("xOS_OpenAI_API_KEY");
    setView("key");
    setKey("");
    onNewConversation();
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
          onNewConversation={onNewConversation}
          conversationID={appState.id}
          messages={appState.messages.filter(
            (message) => message.role !== "system"
          )}
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
  onNewConversation,
  onReset,
  loading,
}) => {
  const [value, setValue] = useState("");

  // const ;
  const files = useSelector((state) => state.files);

  const onSaveTranscript = () => {
    const documents = files.data.special["%documents%"];
    const documentsFolder = files.data.getId(documents);
    let assistantFolder = documentsFolder.data.find(
      (x) => x.name === "Assistant"
    );
    if (!assistantFolder) {
      const documentsPath = files.data.getPath(documentsFolder.id);
      assistantFolder = files.data.addByPath(documentsPath, {
        type: "folder",
        name: "Assistant",
      });
    }
    const assistantPath = files.data.getPath(assistantFolder.id);
    const fileName = `Conversation - ${conversationID}`;
    const existingFile = assistantFolder.data.find(
      (file) => file.name === fileName
    );
    if (existingFile) {
      files.data.removeItem(existingFile.id);
    }
    files.data.addByPath(assistantPath, {
      type: "file",
      name: fileName,
      info: { icon: "file" },
      data: {
        content: {
          value: messages
            .filter((message) => message.role !== "system")
            .map(
              (message) => `${message.role.toUpperCase()}: ${message.content}`
            )
            .join("\n"),
        },
      },
    });
  };

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
          <button onClick={onNewConversation}>New Conversation</button>
          <button onClick={onSaveTranscript}>Save Transcript</button>
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
