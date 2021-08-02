import React, { useEffect, useState } from "react";
import {
  Button,
  Column,
  Content,
  Dropdown,
  Grid,
  Header,
  HeaderName,
  Row,
  TextArea,
  TextInput,
  Tile,
} from "carbon-components-react";
import { Translate24 } from "@carbon/icons-react";
import "./App.scss";

const App = () => {
  const url = "https://api.us-south.language-translator.watson.cloud.ibm.com/instances/14f4fd70-e199-4153-9e86-162839bda72b";
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [inputText, setInputText] = useState("");

  const detectLanguage = (text) => {
    if (text !== undefined && text !== null && String(text).length > 0 && inputText !== String(text)) {
      console.log("detecting language..."); // TODO: Use the IBM Watson API to detect the language of the given text.
      setInputText(String(text));
      setDetectedLanguage(""); // TODO: Set detected language from response.
    }
  };

  const translateText = () => {
    console.log("translating text..."); // TODO: Fetch translation from IBM Watson API.
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/translate-text/languages")
    .then((response) => response.json())
    .then((languages) => console.log(JSON.stringify(languages)));
    setAvailableLanguages(["English", "Spanish"]); // TODO: Use the IBM Watson API to retreive the available languages.
  }, []);

  return (
    <>
      <Header aria-label="text-translator" title="text-translator">
        <HeaderName
          href="#"
          prefix={
            <span>
              <Translate24 />
            </span>
          }
        >
          text-translator
        </HeaderName>
      </Header>
      <Content>
        <Grid>
          <Row>
            <Column>
              <Tile>
                <h1>Welcome to text-translator</h1>
                <p>A basic translator powered by IBM Watson.</p>
              </Tile>
            </Column>
          </Row>
          <br />
          <Row>
            <Column>
              <TextInput
                labelText="Detected language"
                title="Detected language"
                defaultValue={detectedLanguage}
                readOnly
              />
              <br />
              <TextArea onMouseLeave={(e) => detectLanguage(e.target.value)} />
            </Column>
            <Column>
              <Dropdown
                id="default"
                titleText="Language to translate"
                helperText=""
                label="Language"
                items={availableLanguages}
              />
              <br />
              <TextArea readOnly />
            </Column>
          </Row>
          <br />
          <Row>
            <Column>
              <Button onClick={() => translateText()}>Translate</Button>
            </Column>
          </Row>
        </Grid>
      </Content>
    </>
  );
};

export default App;
