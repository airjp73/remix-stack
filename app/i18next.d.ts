import "i18next";
import type common from "../public/locales/en/common.json";

// react-i18next versions higher than 11.11.0
declare module "i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
    };
  }
}
