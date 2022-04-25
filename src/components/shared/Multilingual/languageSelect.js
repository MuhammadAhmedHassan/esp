import React from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { Form, Button } from 'react-bootstrap';

const languageMap = {
  en: { label: 'English', dir: 'ltr', active: true },
  ar: { label: 'العربية', dir: 'rtl', active: false },
  fr: { label: 'Français', dir: 'ltr', active: false },
};

const LanguageSelect = () => {
  const selected = localStorage.getItem('i18nextLng') || 'en';
  const { t } = useTranslation();

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  React.useEffect(() => {
    document.body.dir = languageMap[selected].dir;
  }, [menuAnchor, selected]);

  const changeLanguage = (event) => {
    i18next.changeLanguage(event.target.value);
  };
  return (
    <>
      <Form.Label className="language-selector lang--lab hidden ">{languageMap[selected].label}</Form.Label>
      <Form className="language-selector p-0 lang--dropdown" name="language" as="select" onChange={changeLanguage}>
        {Object.keys(languageMap).map(item => (
          <option key={item} value={item}>
            {languageMap[item].label}
          </option>
        ))}
      </Form>
    </>
  );
};

export default LanguageSelect;
