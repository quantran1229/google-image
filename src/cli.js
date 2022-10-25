import got from 'got';
import terminalImage from 'terminal-image';
import arg from "arg";
export async function cli(rawArgs) {
    const args = arg({
        "-n": Number,
    }, {
        argv: rawArgs.slice(2),
    });
    let n = 0;
    if (args['-n']) {
        if (args['-n'] < 1) {
            n = 0;
        } else if (args['-n'] > 20) {
            n = 20;
        } else {
            n = args['-n']
        }
    }
    const searchTerm = args['_'].join(' ');
    if (searchTerm) {
        console.log(`\x1b[94;1mSearching images for ${searchTerm}....\x1b[0m`);
        const data = await got.get(`https://www.google.com/search?tbm=isch&sclient=img&q=${searchTerm}`);
        const html = data.rawBody.toString('utf-8');
        const listBuffer = await Promise.all(html.match(/"https:\/\/encrypted-tbn0\.gstatic\.com\/images\?\S+"/g).slice(0,n + 1).map(e => e.substring(1, e.length - 1)).map(e => new Promise(async (res, rej) => {
            const body = await got(e).buffer();
            res(body)
        })));
        for (let img of listBuffer) {
            console.log(await terminalImage.buffer(img))
        }
    } else {
        console.log("Please input search text")
    }
}