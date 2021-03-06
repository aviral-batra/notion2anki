import { SyntheticEvent, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import DownloadModal from "./modals/DownloadModal";

const UploadForm = () => {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [deckName, setDeckName] = useState("");
  const [selectedFilename, setSelectedFilename] = useState("");

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setUploading(true);
    try {
      const storedFields = Object.entries(window.localStorage);
      const element = event.currentTarget as HTMLFormElement;
      const formData = new FormData(element);
      for (const sf of storedFields) {
        formData.append(sf[0], sf[1]);
      }
      const request = await window.fetch("/upload", {
        method: "post",
        body: formData,
      });
      const contentType = request.headers.get("Content-Type");
      const notOK = request.status !== 200;
      if (notOK) {
        const text = await request.text();
        return setErrorMessage(text);
      }
      const fileNameHeader = request.headers.get("File-Name".toLowerCase());
      if (fileNameHeader) {
        setDeckName(fileNameHeader);
      } else {
        let fallback =
          contentType === "application/zip"
            ? "Your Decks.zip"
            : "Your deck.apkg";
        setDeckName(fallback);
      }
      const blob = await request.blob();
      setDownloadLink(window.URL.createObjectURL(blob));
      setUploading(false);
    } catch (error) {
      setErrorMessage(
        `<h1 class='title is-4'>${error.message}</h1><pre>${error.stack}</pre>`
      );
      setUploading(false);
    }
  };

  const fileSelected = (event: { target: HTMLInputElement }) => {
    const filename = (() => {
      try {
        return event.target.value.split(/(\\|\/)/g).pop();
      } catch (err) {
        return "";
      }
    })();
    if (filename) setSelectedFilename(filename);
  };

  return (
    <form
      encType="multipart/form-data"
      method="post"
      onSubmit={(event) => {
        handleSubmit(event);
      }}
    >
      <h2 className="title has-text-centered">Notion to Anki</h2>

      {errorMessage && <ErrorMessage msg={errorMessage} />}
      <div className="field">
        <div className={`file is-centered is-boxed has-name`}>
          <div className="field">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                name="pakker"
                accept=".zip,.html"
                required
                multiple={true}
                onChange={(event) => fileSelected(event)}
              />
              <span className="file-cta">
                <span className="file-label">Click to Upload...</span>
              </span>
              <span className="file-name">
                {selectedFilename || "My Notion Export.zip"}
              </span>
            </label>
            <div className="has-text-centered">
              <button
                style={{ marginTop: "2rem" }}
                className={`button cta is-large is-primary ${
                  uploading ? "is-loading" : null
                }`}
                type="submit"
                disabled={!selectedFilename || uploading}
              >
                Convert
              </button>
            </div>
            {downloadLink && deckName && !errorMessage && (
              <DownloadModal
                title={"Download Ready 🥳"}
                downloadLink={downloadLink}
                deckName={deckName}
                onClickClose={() => {
                  setDownloadLink("");
                  setDeckName("");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default UploadForm;
