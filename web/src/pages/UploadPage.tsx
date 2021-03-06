import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Message, Column, Columns } from "trunx";

import StoreContext from "../store/StoreContext";
import WarningMessage from "../components/WarningMessage";
import UploadForm from "../components/UploadForm";
import SettingsIcon from "../components/icons/SettingsIcon";
import SettingsModal from "../components/modals/SettingsModal";

import SUPPORTERS from "../Supporters";

// A custom hook that builds on useLocation to parse
// the query string for you.
// Reference: https://reactrouter.com/web/example/query-parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const UploadPage = () => {
  const isDevelopment = window.location.host !== "2anki.net";
  const query = useQuery();
  const view = query.get("view");

  const isUpload = view === "upload" || !view;
  const [isSettings, setShowSettings] = useState(
    view === "template" || view === "deck-options" || view === "card-options"
  );

  const store = useContext(StoreContext);
  const [imageHover, setImageHover] = useState("");

  // Make sure the defaults are set if not present to ensure backwards compatability
  useEffect(() => {
    store.loadDefaults();
  }, [store]);

  return (
    <div style={{ paddingTop: "4rem" }}>
      {isDevelopment ? <WarningMessage /> : null}
      <div className="tabs is-centered">
        <ul>
          <li className={`${isUpload ? "is-active" : null}`}>
            <Link to="upload?view=upload">Upload</Link>
          </li>
          <li onClick={() => setShowSettings(true)}>
            <Link to="upload?view=template">
              <SettingsIcon />
              Settings
            </Link>
          </li>
        </ul>
      </div>
      <div className="container">
        <UploadForm />
        <SettingsModal
          isActive={isSettings}
          onClickClose={() => setShowSettings(false)}
        />
      </div>
      <Message style={{ maxWidth: "480px", margin: "1rem auto" }} isInfo>
        <Message.Header>Thank you to my supporters!</Message.Header>
        <Message.Body>
          <p> This project is 100% free and will remain free ✌️ </p>
          <p>
            We only support<span> </span>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.notion.so/Export-as-HTML-bf3fe9e6920e4b9883cbd8a76b6128b7"
            >
              HTML
            </a>
            <span> </span>
            uploads from Notion. For tutorials checkout the official
            <span> </span>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.youtube.com/playlist?list=PLzOAzzqpDqukOtwH3IYWiOhr_sjBjfgCd"
            >
              playlist
            </a>
            . To receive support join the<span> </span>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://discord.com/invite/PSKC3uS"
            >
              Discord server
            </a>
            .
          </p>
          <div
            className="has-text-centered"
            style={{ color: "grey", fontWeight: "normal" }}
          >
            #stillfree
            <hr />
          </div>
          <Columns hasTextCentered>
            {SUPPORTERS.map((patreon) => (
              <Column key={patreon.link} isInlineFlexMobile>
                <figure className="image is-32x32">
                  <img
                    loading="lazy"
                    className="is-rounded"
                    alt={`${patreon.name} avatar`}
                    src={patreon.link}
                    onMouseEnter={() => setImageHover(patreon.name)}
                    onMouseLeave={() => setImageHover("")}
                  ></img>
                  {imageHover === patreon.name && (
                    <span className="tag is-black">{patreon.name}</span>
                  )}
                </figure>
              </Column>
            ))}
          </Columns>
          <p>
            {" "}
            Due to privacy only{" "}
            <a href="https://patreon.com/alemayhu">patrons</a> who have
            requested it or{" "}
            <a href="https://github.com/sponsors/alemayhu">GitHub sponsors</a>{" "}
            will be displayed above. This is to respect their privacy.
          </p>
        </Message.Body>
      </Message>
      <div className="has-text-centered">
        <hr />
        <h3 className="title is-3">
          Video Tutorial: Read Faster, Remember More
        </h3>
        <p className="subtitle">
          Incremental Reading with Anki, Notion and notion2anki
        </p>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/4PdhlNbBqXo"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default UploadPage;
