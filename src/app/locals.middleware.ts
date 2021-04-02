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
    return getFiles(path).then(files => files.map((file: any) => `/${toPath}/${type}${file.name}`));
}

const encodeValue = (value: any) => {
    return encodeURIComponent(JSON.stringify(value))
}


export const LocalsMiddleware = async (req: any, res: any, next: Function) => {
    res.header({ 'Cache-Control': 'no-cache, max-age=0, must-revalidate, no-store' });
    const staticCssPath = path.join(__dirname, '..', '..', 'build', 'static', 'css');
    const staticJsPath = path.join(__dirname, '..', '..', 'build', 'static', 'js');
    res.locals.css = (await resolveFiles(staticCssPath, 'css/', 'static') || []);
    res.locals.js = (await resolveFiles(staticJsPath, 'js/', 'static') || [])
        .filter((fileName: any) => !fileName.includes(".map"));
    res.locals.permissionTypes = encodeValue(res.permissionTypes);

    const { url } = req;

    if (req.url.includes(".js")) {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/javascript');
    }

    if (req.url.includes(".css")) {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/css');
    }

    // if (req.url.includes('sockjs') && !req.url.includes('?t=')) {
    //     next();
    // }

    if (req.signedCookies && req.signedCookies.r_code) {
        req.headers.access_token = req.signedCookies.r_code;
        req.headers.user_id = req.signedCookies.id;

        if (url === '/auth/login') {
            res.redirect('/');
            return;
        }
    }

    if (url.includes("/api") || url.includes("/logout")) {
        next();
    } else {
        if ((!req.signedCookies || !req.signedCookies.r_code) && req.url !== '/auth/login') {
            res.redirect('/auth/login');
            return;
        }

        res.render('pages/main', {
            roles: res.parsedJWT ? encodeValue(res.parsedJWT.roles.map((role: any) => role.name)) : null,
            permissions: res.parsedJWT ? encodeValue(res.parsedJWT.permissions.
                map((permission: any) => permission.name)) : null,
        });
    }
};
