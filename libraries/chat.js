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
export function formatString(component, useAnsiCodes = false) {
    let text = flatten(component).map((c) => {
        if (!useAnsiCodes)
            return c.text;
        let codes = colorToAnsiCode(c.color);
        if (c.bold)
            codes += "\x1b[1m";
        if (c.italic)
            codes += "\x1b[3m";
        if (c.underlined)
            codes += "\x1b[4m";
        if (c.strikethrough)
            codes += "\x1b[9m";
        return codes ? codes + c.text + "\x1b[0m" : c.text;
    }).join("");
    if (!useAnsiCodes)
        return text;
    const resetCodes = new Set();
    text = text.split(/ยง(.)/).map((t, i) => {
        if (i % 2 === 0)
            return t;
        else
            switch (t) {
                case "l":
                    resetCodes.add("\x1b[22m");
                    return "\x1b[1m";
                case "m":
                    resetCodes.add("\x1b[29m");
                    return "\x1b[9m";
                case "n":
                    resetCodes.add("\x1b[24m");
                    return "\x1b[4m";
                case "o":
                    resetCodes.add("\x1b[23m");
                    return "\x1b[3m";
                case "r":
                    resetCodes.clear();
                    return "\x1b[0m";
                case "k":
                    t = "";
                    break;
                case "0":
                    t = "\x1b[38;2;0;0;0m";
                    break;
                case "1":
                    t = "\x1b[38;2;0;0;170m";
                    break;
                case "2":
                    t = "\x1b[38;2;0;170;0m";
                    break;
                case "3":
                    t = "\x1b[38;2;0;170;170m";
                    break;
                case "4":
                    t = "\x1b[38;2;170;0;0m";
                    break;
                case "5":
                    t = "\x1b[38;2;170;0;170m";
                    break;
                case "6":
                    t = "\x1b[38;2;255;170;0m";
                    break;
                case "7":
                    t = "\x1b[38;2;170;170;170m";
                    break;
                case "8":
                    t = "\x1b[38;2;85;85;85m";
                    break;
                case "9":
                    t = "\x1b[38;2;85;85;255m";
                    break;
                case "a":
                    t = "\x1b[38;2;85;255;85m";
                    break;
                case "b":
                    t = "\x1b[38;2;85;255;255m";
                    break;
                case "c":
                    t = "\x1b[38;2;255;85;85m";
                    break;
                case "d":
                    t = "\x1b[38;2;255;85;255m";
                    break;
                case "e":
                    t = "\x1b[38;2;255;255;85m";
                    break;
                case "f":
                    t = "\x1b[38;2;255;255;255m";
                    break;
            }
        return t + [...resetCodes.values()].join("");
    }).join("");
    const index = text.lastIndexOf("\x1b[");
    if (index === -1)
        return text;
    const code = text.slice(index + 2).match(/(.+)m/)[1];
    return code === "0" ? text : text + "\x1b[0m";
}

function colorToAnsiCode(color) {
    let code = "";
    switch (color) {
        case "black":
            code += "0;0;0";
            break;
        case "dark_blue":
            code += "0;0;170";
            break;
        case "dark_green":
            code += "0;170;0";
            break;
        case "dark_aqua":
            code += "0;170;170";
            break;
        case "dark_red":
            code += "170;0;0";
            break;
        case "dark_purple":
            code += "170;0;170";
            break;
        case "gold":
            code += "255;170;0";
            break;
        case "gray":
            code += "170;170;170";
            break;
        case "dark_gray":
            code += "85;85;85";
            break;
        case "blue":
            code += "85;85;255";
            break;
        case "green":
            code += "85;255;85";
            break;
        case "aqua":
            code += "85;255;255";
            break;
        case "red":
            code += "255;85;85";
            break;
        case "light_purple":
            code += "255;85;255";
            break;
        case "yellow":
            code += "255;255;85";
            break;
        case "white":
            code += "255;255;255";
            break;
    }
    return code && "\x1b[38;2;" + code + "m";
}

function flattenArray(array) {
    return [].concat(...array);
}

/** @deprecated Use `format(convert(component))` instead */
export function chatToText(component, translation) {
    return format(component, {translation});
}
