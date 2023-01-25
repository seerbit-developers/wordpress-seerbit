export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem("seerbit_state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};
export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("seerbit_state", serializedState);
  } catch (err) {
    //ignoring write erros
  }
};


export const AppLanguage = () => {
  try {
    return localStorage.getItem("i18nextLng");
  } catch (err) {
    return 'en'
  }
};

export const getLanguage = () => {
  try {
    let lang = 'en'
    switch (AppLanguage()) {
      case 'en' :
        lang = 'en'
            break;
      case 'en-US' :
        lang = 'en'
            break;
      case 'en-CA' :
        lang = 'en'
        break;
        case 'en-GB' :
        lang = 'en'
        break;
        case 'en-ZA' :
        lang = 'en'
        break;
        case 'en-AU' :
        lang = 'en'
        break;
        case 'en-IN' :
        lang = 'en'
        break;
        case 'fre' :
        lang = 'fre'
        break;
      case 'fre-BE' :
        lang = 'fre'
        break;
      case 'fre-CH' :
        lang = 'fre'
        break;
      case 'fre-CA' :
        lang = 'fre'
        break;
      case 'fre-LU' :
        lang = 'fre'
        break;
      default :
        lang = 'en'
    }
    return lang;
  } catch (err) {
    return 'en'
  }
};
