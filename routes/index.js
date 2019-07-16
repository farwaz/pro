module.exports = function (app, addon) {

    // Root route. This route will serve the `atlassian-connect.json` unless the
    // documentation url inside `atlassian-connect.json` is set
    app.get('/', function (req, res) {
        res.format({
            // If the request content-type is text-html, it will decide which to serve up
            'text/html': function () {
                res.redirect('/atlassian-connect.json');
            },
            // This logic is here to make sure that the `atlassian-connect.json` is always
            // served up when requested by the host
            'application/json': function () {
                res.redirect('/atlassian-connect.json');
            }
        });
    });

    
    app.get('/configure', addon.authenticate(), function (req, res) {
        // Rendering a template is easy; the `render()` method takes two params: name of template
        // and a json object to pass the context in
        addon.settings.get('configuration', req.context.clientKey).then(function (configObject) {
            res.render('configure', configObject);
        });

    });

    app.post('/configure', addon.checkValidToken(), function (req, res) {
        var configObject = req.body;
        addon.settings.set('configuration', configObject, req.context.clientKey).then(function () {
            console.log("configObject:"+configObject);            
        });
    });


	app.get('/select-item', addon.authenticate(), function (req, res) {
            // Rendering a template is easy; the `render()` method takes two params: name of template
            // and a json object to pass the context in
        
        addon.settings.get('configuration', req.context.clientKey).then(function (configObject) {
            if (typeof (configObject) != 'undefined' && configObject != null) {
                res.render('select-item', configObject);
            }
            else { res.render('no-config'); }
        });

        }
    );

    // Add any additional route handlers you need for views or REST resources here...

    app.get('/prolconnect',function (req, res) {
        console.log("prolconnect checking...");
        console.log("server: " + req.query.server);
        console.log("port: " + req.query.port);
        console.log("proltoken: " + req.query.proltoken);
        console.log("Baseurl: " + req.query.baseURL);
          
        try {
            var proltoken = req.query.proltoken;
            var Baseurl = req.query.baseURL;
            var request = require('request');
            var r = request.get({
                url: req.query.protocol + '://' + req.query.server + ':' + req.query.port + '/API/Request.aspx/GetProlaborateRepositories',
                headers: {
                    'Content-Type': 'application/json',
                    'REFERER': Baseurl,
                    'proltoken': proltoken
                }
            }, function (error, response, body) {

                if (error) {
                    //throw new Error('Request failed')
                    res.end('error occured');
                    console.log(error);
                }
                else {
                    if (response.statusCode == 200) {
                        res.send(body);
                    }// 200

                    else if (response.statusCode == 403) {
                        res.status(403).json({ error: 'forbidden' });
                        res.end('forbidden');
                    }// 403

                    else {
                        res.status(500).json({ error: 'error occured' });
                        res.end('error occured');
                    }
                }
            })
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');
        }

        }
    );

    app.get('/getprolabrepositories', function (req, res) {
        console.log("getting repositories...");
        console.log("server: " + req.query.server);
        console.log("port: " + req.query.port);
        console.log("proltoken: " + req.query.proltoken);
        console.log("Baseurl: " + req.query.baseURL);

        try {
            var request = require('request');
            var Baseurl = req.query.baseURL;
            var r = request.get({
                url: req.query.protocol + '://' + req.query.server + ':' + req.query.port + '/API/Request.aspx/GetProlaborateRepositories',
                headers: {
                    'Content-Type': 'application/json',
                    'REFERER': Baseurl,
                    'proltoken': req.query.proltoken
                }
            }, function (error, response, body) {

                if (error) {
                    //throw new Error('Request failed')
                    res.end('error occured');
                    console.log(error);
                }
                else {
                    if (response.statusCode == 200) {
                        res.send(body);
                    }// 200

                    else if (response.statusCode == 403) {
                        res.status(403).json({ error: 'forbidden' });
                        res.end('forbidden');
                    }// 403

                    else {
                        res.status(500).json({ error: 'error occured' });
                        res.end('error occured');
                    }
                }
            })
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');
        }
    }
    );

    
    app.post('/getdiagramstreotype', function (req, res) {
        console.log('getting diagramstreotype');
        console.log('URL :'+ req.body.ProlURL);
        console.log('Baseurl :'+ req.body.baseURL);

        try {
            var URL = req.body.ProlURL;
            var Baseurl = req.body.baseURL;
            URL = URL + '/API/Request.aspx/GetDiagramStreotypes';
            req.headers['someHeader'] = 'someValue'
            var request = require('request');
            request.post(
                {
                    url: URL,
                    json: { "RepositoryId": req.body.RepositoryId, "FilterType": "ALL" },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');
        }
    }
    );

    app.post('/getelementstreotype', function (req, res) {
        console.log("getting elementstreotype...");

        try {
            var URL = req.body.ProlURL;
            var Baseurl = req.body.baseURL;
            URL = URL + '/API/Request.aspx/GetElementStreotypes';
            req.headers['someHeader'] = 'someValue'
            var request = require('request');
            request.post(
                {
                    url: URL,
                    json: { "repositoryId": req.body.RepositoryId, "FilterType": "ALL" },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');
        }
    }
    );

    app.post('/getdiagramlist', function (req, res) {
        console.log("getting Diagram list...");
        console.log('Baseurl :' + req.body.baseURL);
        var URL = req.body.ProlURL;
        URL = URL + '/API/Request.aspx/GetDiagramList';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: { "repositoryId": req.body.RepositoryId, "DiagramName": req.body.DiagramName, "Author": "", "Type": req.body.Type, "Stereotype": req.body.Stereotype, "limit": 10, "startIndex": req.body.startIndex, "SortBy": "Modified", "SortOrder": "DESC" },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');            
        }
    }
    );

    app.post('/getpackagelist', function (req, res) {
        console.log("getting Package list...");
        console.log('Baseurl :' + req.body.baseURL);
        var URL = req.body.ProlURL;
        URL = URL + '/API/Request.aspx/GetPackageList';
        try {

            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: { "repositoryId": req.body.RepositoryId, "PackageName": req.body.PackageName, "Author": "", "limit": 10, "startIndex": req.body.startIndex, "SortBy": "Modified", "SortOrder": "DESC" },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');  
        }
    }
    );

    app.post('/getelementlist', function (req, res) {
        console.log("getting Element list...");
        console.log('Baseurl :' + req.body.baseURL);
        var URL = req.body.ProlURL;
        URL = URL + '/API/Request.aspx/GetElementList';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: { "repositoryId": req.body.RepositoryId, "ElementName": req.body.ElementName, "Author": "", "Type": req.body.Type, "Stereotype": req.body.Stereotype, "limit": 10, "startIndex": req.body.startIndex, "SortBy": "Modified", "SortOrder": "DESC" },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured'); 
        }
    }
    );
    
    app.post('/getartifacts', function (req, res) {
        console.log("getting Artifacts ...");

        var URL = req.body.ProlURL;
        URL = URL + '/API/Request.aspx/GetArtifactsAPI';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: { "repositoryId": req.body.repositoryId, "ElementGuid": req.body.Guid, "ElementType": req.body.ElementType, "includeRecursive": req.body.IncludeRecursive },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');  
        }
    }
    );

    app.post('/gettabalecolumnsbygroupkey', function (req, res) {
        console.log("getting columns by groupkey ...");

        var URL = req.body.ProlURL;
        URL = URL + '/API/Request.aspx/GetTabaleColumnsByGroupKeyAPI';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: {
                        "repositoryId": req.body.repositoryId, "ElementGuid": req.body.Guid, "ElementType": req.body.ElementType, "includeRecursive": req.body.IncludeRecursive, "GroupKey": req.body.GroupKey
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');  
        }
    }
    );

    app.post('/getchildtablehtml', function (req, res) {
        console.log("getting children table ...");

        var URL = req.body.ProlURL;
        URL = URL + '/API/Request.aspx/GetChildTableHtmlAPI';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: {
                        "repositoryId": req.body.repositoryId, "ElementGuid": req.body.Guid, "ElementType": req.body.ElementType, "includeRecursive": req.body.IncludeRecursive, "GroupKey": req.body.GroupKey, "TableDraw": req.body.TableDraw, "StartIndex": req.body.StartIndex, "RowLength": req.body.RowLength, "SearchValue": req.body.SearchValue, "dtrepcolumns": req.body.dtrepcolumns
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured'); 
        }
    }
    );

    app.post('/prolabelementpropertieslimited', function (req, res) {
        console.log("getting element properties ...");

        var URL = req.body.ProlURL;
        URL = URL + '/API/Method.aspx/GetElementPropertiesLimited';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: {
                        "elementGuid": req.body.Guid, "RepositoryId": req.body.repositoryId, "UserId": ""
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured'); 
        }
    }
    );

    app.post('/prolabelementproperties', function (req, res) {
        console.log("getting element properties ...");

        var URL = req.body.ProlURL;
        URL = URL + '/API/Method.aspx/GetElementProperties';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: {
                        "elementGuid": req.body.Guid, "elementType": req.body.ElementType, "RepositoryId": req.body.repositoryId, "UserId": "", GetChildren: false
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');
        }
    }
    );

    app.post('/prolabeadocxpath', function (req, res) {
        console.log("getting element properties ...");

        var URL = req.body.ProlURL;
        URL = URL + '/API/Method.aspx/GetEADocxDocumentPathAPI';

        try {
            var request = require('request');
            var Baseurl = req.body.baseURL;
            request.post(
                {
                    url: URL,
                    json: {
                        "RepositoryId": req.body.repositoryId, "UserId": "", documentId: req.body.documentId
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'REFERER': Baseurl,
                        'proltoken': req.body.proltoken
                    }
                },
                function (error, response, body) {
                    if (error) {
                        //throw new Error('Request failed')
                        res.end('error occured');
                        console.log(error);
                    }
                    else {
                        if (response.statusCode == 200) {
                            res.send(body);
                        }// 200

                        else if (response.statusCode == 403) {
                            res.status(403).json({ error: 'forbidden' });
                            res.end('forbidden');
                        }// 403

                        else {
                            res.status(500).json({ error: 'error occured' });
                            res.end('error occured');
                        }
                    }
                    //res.send(body);
                });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'error occured' });
            res.end('error occured');
        }
    }
    );

    app.post('/prolopenlink', function (req, res) {
        try {
            console.log("opening link...");
            var URL = req.body.ProlURL;
            var open = require('open');
            open(URL, function (err) {
                if (err) console.log(err);
            });
            res.status(200).end();
        } catch (e) {
            console.log(e);
            res.status(200).end();
        }
    });

    app.get('/page-render', addon.authenticate(), function (req, res) {
        // Rendering a template is easy; the `render()` method takes two params: name of template
        // and a json object to pass the context in
        try {

            addon.settings.get('configuration', req.context.clientKey).then(function (configObject) {
                if (typeof (configObject) != 'undefined' && configObject != null) {
                    console.log("configObject available");
                    console.log("Baseurl: " + req.query.xdm_e);
                    //Check connection 
                    var Baseurl = req.query.xdm_e;
					var request = require('request');
                    var port = "";
                    if (typeof (configObject.port) != 'undefined' && configObject.port != null && configObject.port != "" && configObject.port != "80") {
                        port = ":" + configObject.port;
                    }
                    var r = request.get({
                        url: configObject.protocol + '://' + configObject.server + port + '/API/Request.aspx/GetProlaborateRepositories',
                        headers: {
                            'Content-Type': 'application/json',
                            'REFERER': Baseurl,
                            'proltoken': configObject.proltoken
                        }
                    }, function (error, response, body) {

                        if (error) {
                            //throw new Error('Request failed')
                            res.render('no-config');
                            console.log(error);
                        }
                        else {
                            if (response.statusCode == 200) {
                                //if connection works then proceed rendering
                                var MacroData = null

                                
                                try {
                                    MacroData = JSON.parse(req.query["prolMacro"]);
                                } catch (e) {
                                    //console.log('no saved macro found');
                                    //res.status(500).json({ error: 'no saved macro found' });
                                    //res.end('no saved macro found');
                                }

                                if (MacroData != null) {
                                    var ElementGuid = MacroData.Guid;
                                    var ShowChildren = MacroData.ShowChildren;
                                    var EnableLink = MacroData.EnableLink;
                                    var renderPage = 'element-render';
                                    var JSONObj = {
                                        "repositoryId": configObject.repository, "ElementGuid": "{" + ElementGuid + "}", "showTable": ShowChildren, "enablelink": EnableLink
                                    }


                                    var URL = configObject.protocol + '://' + configObject.server + port + '/Assets/Templates/ASP/Element/Element.aspx?' + 'repId=' + configObject.repository + '&procId=' + '{' + ElementGuid + '}' + '&showTable=' + ShowChildren + '&enablelink=' + EnableLink;
                                    if (MacroData.Type == 'Diagram') {
                                        URL = configObject.protocol + '://' + configObject.server + port + '/Assets/Templates/ASP/Diagram/Diagram.aspx?' + 'repId=' + configObject.repository + '&procId=' + '{' + ElementGuid + '}' + '&showTable=' + ShowChildren + '&enablelink=' + EnableLink;
                                        renderPage = 'diagram-render';
                                    }
                                    console.log(URL);
                                    console.log(JSONObj);
                                    console.log(renderPage);
                                    var request = require('request');
                                    request.post(
                                        {
                                            url: URL,
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'REFERER': Baseurl,
                                                'proltoken': configObject.proltoken
                                            }
                                        },
                                        function (error, response, Resbody) {
                                            if (error) {
                                                //throw new Error('Request failed')
                                                res.render('no-config');
                                                console.log(error);
                                            }
                                            else {
                                                //res.send(body);
                                                console.log("Rendering...")
                                                var htmlString = Resbody;
                                                //var renderObject = { "html": htmlString}
                                                res.render(renderPage, {
                                                    title: 'Macro Renderer',
                                                    htmlCon: htmlString,
                                                    config: configObject
                                                });
                                            }
                                            //res.send(body);
                                        });

                                }// Null Macro
                                else {
                                    console.log('no saved macro found');
                                    res.status(500).json({ error: 'no saved macro found' });
                                    res.end('no saved macro found');
                                }
                            }// 200

                            else if (response.statusCode == 403) {
                                res.status(403).json({ error: 'forbidden' });
                                res.end('forbidden');
                            }// 403

                            else {
                                res.status(500).json({ error: 'error occured' });
                                res.end('error occured');
                            }
                        }
                    })

                }
                else {
                    config = true;
                    console.log("configObject not found");
                    res.render('no-config');
                }
            });

        } catch (e) {
            res.end('error occured');
            console.log(e);
        }
    }
    );

    // load any additional files you have in routes and apply those to the app
    {
        var fs = require('fs');
        var path = require('path');
        var files = fs.readdirSync("routes");
        for(var index in files) {
            var file = files[index];
            if (file === "index.js") continue;
            // skip non-javascript files
            if (path.extname(file) != ".js") continue;

            var routes = require("./" + path.basename(file));

            if (typeof routes === "function") {
                routes(app, addon);
            }
        }
    }
};
