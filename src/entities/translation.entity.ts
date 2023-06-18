export type TranslationOutputText = {
  isoCode: string;
  outputText: string;
};

export type Translation = {
  id: string;
  inputText: string;
  inputContext: string;
  outputTexts: TranslationOutputText[];
};
