'use strict'

import path from 'path';
import express from 'express';
import { paths } from './gulp.constants.mjs'
import fs from 'fs'
// const mobileUrls = JSON.parse(fs.readFileSync('src/prototype/includes/components/menu/menu-mobile.json'));
// console.log(mobileUrls)
const app = express();
const __dirname = path.resolve();
const port = 4000;

// app.set('views', path.join(__dirname, '/dist/views'));
// app.set('view engine', 'html');
// app.use(express.static(__dirname + '/dist/public'));
//
// app.get('/', function(req, res) {
//     res.render('index');
// });
//
// app.listen(port, () => {
//     console.log(`App running at http://localhost:${port}`);
// });
// app.use('/project/mobile', express.static(`${__dirname}/${paths.base.dist}/mc-static-root`));
// app.use('/project/desktop', express.static(`${__dirname}/${paths.base.dist}/pc-static-root`));
app.set('views', path.join(`${__dirname}/${paths.base.dist}`));
// app.set('view engine', 'ejs');
app.use('/', express.static(`${__dirname}/${paths.base.dist}`));
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
