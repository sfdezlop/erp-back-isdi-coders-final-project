export type TranslationOutputText = {
  isoCode: string;
  outputText: string;
};

export type Translation = {
  id: string;
  inputText: string;
  outputTexts: TranslationOutputText[];
};
