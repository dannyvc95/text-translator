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
  const [availableLanguagesMap, setAvailableLanguagesMap] = useState();
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("");

  const detectLanguage = (text) => {
    if (typeof text === "string" && text.length > 0 && inputText !== text) {
      fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/v1/translate-text/detect-language`, {
        method: "POST",
        body: text
      })
      .then(response => response.json())
      .then(({ languages }) => {
        setDetectedLanguage(availableLanguagesMap[languages[0].language]);
        setSourceLang(languages[0].language);
      })
      .catch(error => console.log(error));
      setInputText(text);
    }
  };

  const translateText = () => {
    if (inputText.length > 0 && targetLang.length !== "") {
      const translateParams = {
        text: inputText,
        source: sourceLang,
        target: targetLang,
      };
      fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/v1/translate-text/translate`, {
        method: "POST",
        body: JSON.stringify(translateParams),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(translations => setTranslatedText(translations[0].translation))
      .catch(error => console.log(error));
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/v1/translate-text/languages`)
    .then((response) => response.json())
    .then(({ languages} ) => {
      if (!Array.isArray(languages)) return; // Error handling should be done here

      // Define languages list for dropdown
      setAvailableLanguages(languages.map(lang => ({ language: lang.language, language_name: lang.language_name })));

      // Define available languages for optimized search in language detection
      let languageMap = {};
      languages.forEach(lang => languageMap[lang.language] = lang.language_name);
      setAvailableLanguagesMap(languageMap);
    });
  }, []);

  return (
    <>
      <Header aria-label="text-translator" title="text-translator">
        <HeaderName
          href="/"
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
                itemToString={item => item.language_name}
                onChange={({ selectedItem }) => setTargetLang(selectedItem.language)}
              />
              <br />
              <TextArea readOnly value={translatedText} />
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
