// https://github.com/janispritzkau/mc-chat-format

/**
 * Converts a Minecraft chat component to a formatted string.
 * */
export function format(component, options = {}) {
    const text = formatString(convert(component, options), options.useAnsiCodes);
    if (options.maxLineLength) {
        let t = "", e = false, l = 0;
        for (let c of text) {
            if (c === "\x1b")
                e = true;
            else if (c === "m")
                e = false;
            else if (c === "\n")
                l = 0;
            t += c;
            if (l === options.maxLineLength)
                t += "\n", l = 0;
            if (!e)
                l += 1;
        }
        return t;
    } else
        return text;
}

/**
 * Applies translations to a [Chat component](https://wiki.vg/Chat) and converts
 * it to `StringComponent`.
 */
export function convert(component, options = {}) {
    if (typeof component == "string") {
        return options.keepOld ? {text: component} : convertOld(component);
    }
    if (component.extra) {
        component.extra = component.extra.map(x => convert(x, options));
    }
    if (options.stripNonText) {
        delete component.hoverEvent;
        delete component.clickEvent;
        delete component.insertion;
    }
    if (!options.keepOld) {
        const {text, extra} = convertOld(component.text);
        component.text = text;
        if (extra && component.extra)
            component.extra = [...extra, ...component.extra];
        else if (extra && !component.extra)
            component.extra = extra;
    }
    return component;
}

/**
 * Converts a string formatted using the old formatting scheme
 * to the current JSON chat system.
 */
export function convertOld(text) {
    let c = {text: ""};
    const extra = [];
    for (const [i, t] of text.split(/ยง(.)/).entries()) {
        if (i === 0) {
            c.text = t;
        } else if (i % 2 === 0) {
            if (t.length !== 0)
                extra.push({...c, text: t});
        } else
            switch (t) {
                case "k":
                    c.obfuscated = true;
                    break;
                case "l":
                    c.bold = true;
                    break;
                case "m":
                    c.strikethrough = true;
                    break;
                case "n":
                    c.underlined = true;
                    break;
                case "o":
                    c.bold = true;
                    break;
                case "r":
                    c = {text: c.text};
                    break;
                case "0":
                    c.color = "black";
                    break;
                case "1":
                    c.color = "dark_blue";
                    break;
                case "2":
                    c.color = "dark_green";
                    break;
                case "3":
                    c.color = "dark_aqua";
                    break;
                case "4":
                    c.color = "dark_red";
                    break;
                case "5":
                    c.color = "dark_purple";
                    break;
                case "6":
                    c.color = "gold";
                    break;
                case "7":
                    c.color = "gray";
                    break;
                case "8":
                    c.color = "dark_gray";
                    break;
                case "9":
                    c.color = "blue";
                    break;
                case "a":
                    c.color = "green";
                    break;
                case "b":
                    c.color = "aqua";
                    break;
                case "c":
                    c.color = "red";
                    break;
                case "d":
                    c.color = "light_purple";
                    break;
                case "e":
                    c.color = "yellow";
                    break;
                case "f":
                    c.color = "white";
                    break;
            }
    }
    c = {text: c.text};
    if (extra.length > 0)
        c.extra = extra;
    return c;
}

/** Flattens a nested `StringComponent`. */
export function flatten(component) {
    const {text, extra, ...rest} = component;
    const array = [{text, ...rest}];
    if (extra)
        array.push(...flattenArray(extra.map(c => {
            if (typeof c == "string")
                return [{text: c, ...rest}];
            if (!('text' in c))
                throw new Error("Not a StringComponent");
            return flatten(c).map(c => ({...c, ...rest, ...c}));
        })));
    return array;
}

/** Converts a `StringComponent` to plain text and can format it using ANSI codes. */
export function formatString(component) {
    return flatten(component).map((c) => {
        let codes = colorToAnsiCode(c.color);
        if (c.bold)
            codes += "\u00a7l";
        if (c.italic)
            codes += "\u00a7o";
        if (c.underlined)
            codes += "\u00a7n";
        if (c.strikethrough)
            codes += "\u00a7m";
        return codes ? codes + c.text + "\u00a7r" : c.text;
    }).join("");
}

function colorToAnsiCode(color) {
    let code = "";
    switch (color) {
        case "black":
            code += "0";
            break;
        case "dark_blue":
            code += "1";
            break;
        case "dark_green":
            code += "2";
            break;
        case "dark_aqua":
            code += "3";
            break;
        case "dark_red":
            code += "4";
            break;
        case "dark_purple":
            code += "5";
            break;
        case "gold":
            code += "6";
            break;
        case "gray":
            code += "7";
            break;
        case "dark_gray":
            code += "8";
            break;
        case "blue":
            code += "9";
            break;
        case "green":
            code += "a";
            break;
        case "aqua":
            code += "b";
            break;
        case "red":
            code += "c";
            break;
        case "light_purple":
            code += "d";
            break;
        case "yellow":
            code += "e";
            break;
        case "white":
            code += "f";
            break;
    }
    return code && "\u00a7" + code;
}

function flattenArray(array) {
    return [].concat(...array);
}

/** @deprecated Use `format(convert(component))` instead */
export function chatToText(component, translation) {
    return format(component, {translation});
}
