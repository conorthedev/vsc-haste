// node-fetch
const fetch = require("node-fetch");

module.exports = async (code) => {
    const res = await fetch(`https://psty.io/upload?code="${code}"&lang=plaintext&theme=default`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error(res.statusText)
    }

    return `${res.url}`
};
