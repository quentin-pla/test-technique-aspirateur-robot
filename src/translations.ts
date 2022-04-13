/**
 * Translations
 */
const languageObject = {
    // Get string translation
    translate: (id: string, locale: string, parameters?: Record<string, string>): string => {
        const object = (languageObject as any)[locale] ?? (languageObject as any).en;
        let translation: string = object[id] ?? (languageObject as any).en[id] ?? "";
        if (!!parameters) {
            for (const param in parameters)
                translation = translation.replace("{" + param + "}", parameters[param]);
        }
        return translation;
    },
    en: {},
    fr: {},
}

export default languageObject;