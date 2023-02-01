import { withZod } from "@remix-validated-form/with-zod";
import { TFuncKey, t } from "i18next";
import { z, ZodIssueCode, ZodRawShape } from "zod";

const msg = (key: TFuncKey, substitutions?: Record<string, string>) => ({
  message: t(key, substitutions as {}) as string,
});

// We throw in several places here so that we can ensure all error messages get translated.
// These errors are like TODOs for future use-cases.
export const makeValidator = <T extends ZodRawShape>(schema: T) => {
  return withZod(z.object(schema), {
    errorMap: (issue, ctx) => {
      // Will eventually want to have an abstraction for overriding error messages
      switch (issue.code) {
        case ZodIssueCode.invalid_type: {
          if (issue.received === "undefined") return msg("validation.required");
          throw new Error("Untranslated invalid_type");
        }
        case ZodIssueCode.invalid_string: {
          switch (issue.validation) {
            case "email":
              return msg("validation.string.email");
            default:
              throw new Error("Untranslated invalid_string");
          }
        }
        case ZodIssueCode.too_small: {
          switch (issue.type) {
            case "string":
              return msg("validation.string.tooShort", {
                min: String(issue.minimum),
              });
            default:
              throw new Error("Untranslated too_small");
          }
        }
        case ZodIssueCode.custom: {
          if (issue.message && /instance of file/i.test(issue.message)) {
            return msg("validation.required");
          }

          throw new Error(`Untranslated custom issue: ${issue.message}`);
        }
        default:
          throw new Error(`Untranslated issue code: ${issue.code}`);
      }
    },
  });
};
