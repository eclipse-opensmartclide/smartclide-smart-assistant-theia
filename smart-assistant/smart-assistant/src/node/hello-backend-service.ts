/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { injectable } from '@theia/core/shared/inversify';
import { HelloBackendService } from '../common/protocol';
import * as Configurations from '../browser/configuration';

// import * as vscode from 'vscode';

@injectable()
export class HelloBackendServiceImpl implements HelloBackendService {

    static cluster_endpoint = {
        host: Configurations.SMARTCLIDE_HOST,
        port: Configurations.SMARTCLIDE_PORT
    };
    static functinality_path = {
        acceptance: Configurations.FUNCTIONALITY_PATH_ACCEPTANCE,
        code_template: Configurations.FUNCTIONALITY_PATH_CODETEMPLATE
    };

    public static gettemplatefile_name() {
        return 'template.java'
    }

    public static gethomedir_path() {
        const os = require("os");
        // check the available memory
        const userHomeDir = os.homedir();

        return userHomeDir;
    }
    public static gettemplatedir_path() {
        const fs = require('fs');
        const path = require('path');
        const userHomeDir = HelloBackendServiceImpl.gethomedir_path();
        try {
            fs.mkdir(path.join(userHomeDir, 'template'), (err: any) => {
                console.log('Template Directory created successfully!');
            });
        } catch (e) {
            console.log(e)
        }
        var template_dir = path.join(__dirname, '../../src/node/template/');
        return template_dir;
    }

    gettemplafile_path() {
        const path = require('path');
        var filename ='';
        try {
            var template_dir = path.join(__dirname, '../../src/node/template/');
            filename = template_dir + '/' + HelloBackendServiceImpl.gettemplatefile_name();
        } catch (e) {
            console.log(e)
        }
        return filename;
    }
    public static getacceptancedir_path() {

        const path_ = require('path');
        var filename ='';
        try {
            var template_dir = path_.join(__dirname, '../../src/node/acceptance/');
            filename = template_dir + '/' + HelloBackendServiceImpl.gettemplatefile_name();
        } catch (e) {
            console.log(e)
        }
        return filename;

    }

    callSearch(content: string): Promise<any[]> {
        var fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../../src/node/data/popular_service_apis.txt');
        var items = fs.readFileSync(filePath).toString().split("\n");
        var suggested_url: any = []
        var i: any = 0
        for (i in items) {
            if (items[i].includes(content)) {
                suggested_url.push(items[i].toString());
            }
        }
        return suggested_url;
    }

    runAcceptance(content: string): Promise<string> {
        var fs = require("fs");
        var acceptance_dir = HelloBackendServiceImpl.getacceptancedir_path();
        let filename = acceptance_dir + "/acceptance.java";
        fs.writeFileSync(filename, content);
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': HelloBackendServiceImpl.cluster_endpoint.host + ":" +
                HelloBackendServiceImpl.cluster_endpoint.port +
                HelloBackendServiceImpl.functinality_path.acceptance
            ,
            'headers': {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "bpmn": content
            })
        };
        request(options, function (error: any, response: any) {
            if (error) throw new Error(error);
            let filename = acceptance_dir + "/acceptance.java";
            var code = JSON.parse(response.body);
            var clean = code.code.replace(/\['/i, "").replace(/'\]/i, "").split('\\t').join("    ");
            console.log("runAcceptance: ", clean)
            fs.writeFileSync(filename, clean.split('\\n').join("\n"));
        });
        return new Promise<string>(resolve => resolve('content ' + content));
    }

    sayHelloTo(content: string): Promise<string> {
        var fs = require("fs");
        var template_dir = HelloBackendServiceImpl.gettemplatedir_path();
        try {
            if (fs.existsSync(template_dir + '/' + HelloBackendServiceImpl.gettemplatefile_name())) {
                fs.writeFileSync(template_dir + '/' + HelloBackendServiceImpl.gettemplatefile_name(), "");
            }
        } catch (e) {
            console.log("An error occurred.")
        }

        var request = require('request');
        var options = {
            'method': 'POST',
            'url': 
            // 'http://vm-bisite-57.der.usal.es:5001/smartclide/v1/dle/templatecodegen'
            HelloBackendServiceImpl.cluster_endpoint.host + ":" +
            HelloBackendServiceImpl.cluster_endpoint.port +
            HelloBackendServiceImpl.functinality_path.code_template
            ,
            'headers': {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "bpmn_file": content
            })
        };
        request(options, function (error: any, response: any) {
            if (error) throw new Error(error);
            let filename = template_dir + '/' + HelloBackendServiceImpl.gettemplatefile_name();
            var code = JSON.parse(response.body);
            var clean = code.code.replace(/\['/i, "").replace(/'\]/i, "").split('\\t').join("    ");
            fs.writeFileSync(filename, clean.split('\\n').join("\n"));
        });
        return new Promise<string>(resolve => resolve('content ' + content));
    }
}
