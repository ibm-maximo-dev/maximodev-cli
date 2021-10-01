// Domain lang code available

exports.lang_codes = [
  { lang_id: "AR" },
  { lang_id: "CS" },
  { lang_id: "DA" },
  { lang_id: "DE" },
  { lang_id: "EN" },
  { lang_id: "ES" },
  { lang_id: "FI" },
  { lang_id: "FR" },
  { lang_id: "HE" },
  { lang_id: "HR" },
  { lang_id: "HU" },
  { lang_id: "IT" },
  { lang_id: "JA" },
  { lang_id: "KO" },
  { lang_id: "NO" },
  { lang_id: "PL" },
  { lang_id: "PT-BR" },
  { lang_id: "RU" },
  { lang_id: "SK" },
  { lang_id: "SL" },
  { lang_id: "SV" },
  { lang_id: "TR" },
  { lang_id: "ZH-CN" },
  { lang_id: "ZH-TW" },
];
exports.check = (v) => this.langCodePlain.includes(v);

/**
 * Return the lang code when called.
 */
exports.langCodePlain = exports.lang_codes.map(function (o) {
  return o.lang_id; // convert to one line
});
