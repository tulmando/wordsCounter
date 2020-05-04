'use strict';

const SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-tools/middleware/swagger-ui');
const express = require('express');
// important to load the db data in advanced
require('../services/db');

const app = express();

let config = {
    appRoot: __dirname // required config
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) {
        throw err;
    }

    // Add swagger-ui (This must be before swaggerExpress.register)
    app.use(swaggerUi(swaggerExpress.runner.swagger));

    // TODO IDO needed?
    // Redirect to swagger page
    app.get('/', (req, res) => res.redirect('/docs'));

    // install middleware
    swaggerExpress.register(app);


    let port = process.env.PORT || 10010;
    app.listen(port, () => console.log(`Server is up and running on port ${port}!`));
});
