const path = require('path');
const { promises: fs } = require("fs");

async function getFiles(path = "./") {
    if (path[path.length - 1] != '/') {
        path = `${path}/`;
    }
    const entries = await fs.readdir(path, { withFileTypes: true }, undefined);

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter((file: any) => !file.isDirectory())
        .map((file: any) => ({ ...file, path: path + file.name }));

    // Get folders within the current directory
    const folders = entries.filter((folder: any) => folder.isDirectory());

    for (const folder of folders)
        /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */
        files.push(...await getFiles(`${path}${folder.name}`));

    return files;
}

function resolveFiles(path: string, type: string, toPath: string) {
    return getFiles(path).then(files => {
        // console.log(files);
        return files.map((file: any) => `/${toPath}/${type}${file.name}`)
    });
}

export const LocalsMiddleware = async (req: any, res: any, next: Function) => {
    res.header({ 'Cache-Control': 'no-cache, max-age=0, must-revalidate, no-store' });
    const staticCssPath = path.join(__dirname, '..', '..', 'build', 'static', 'css');
    const staticJsPath = path.join(__dirname, '..', '..', 'build', 'static', 'js');
    res.locals.css = (await resolveFiles(staticCssPath, 'css/', 'static') || []);
    res.locals.js = (await resolveFiles(staticJsPath, 'js/', 'static') || [])
        .filter((fileName: any) => !fileName.includes(".map"));

    const { url } = req;

    if (req.signedCookies && req.signedCookies.r_code) {
        req.headers.access_token = req.signedCookies.r_code;

        if (url === '/auth/login') {
            res.redirect('/');
            return;
        }
    }

    if (url.includes("/api")) {
        next();
    } else {
        if ((!req.signedCookies || !req.signedCookies.r_code) && url !== '/auth/login'){
            res.redirect('/auth/login');
            return;
        }
        res.render('pages/main');
    }
};
