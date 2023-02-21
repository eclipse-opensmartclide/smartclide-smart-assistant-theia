/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import axios from "axios";
import * as Configurations from './configuration';
//Add "dom" to "lib": ["dom"] to use window
import { messageTypes, buildMessage } from '@unparallel/smartclide-frontend-comm';

export class AICodeCompletion {
    inputCode: string;
    codeCompletionMethod: string;
    codeCompletionLanguage: string;
    accepted_prefix: string[] = ['import'];
    accepted_keywords: string[] = ['http', 'new'];

    static state = {
        stateKeycloakToken: ''
    }
    //Handle KEYCLOAK_TOKEN message from parent
    handleTokenInfo = ({ data }: any) => {
        switch (data.type) {
            case messageTypes.KEYCLOAK_TOKEN:
                console.log("Smartassistant: RECEIVED", JSON.stringify(data, undefined, 4));
                AICodeCompletion.state.stateKeycloakToken = data.content.token;
                break;
            case messageTypes.COMM_END:
                console.log("Smartassistant: RECEIVED", JSON.stringify(data, undefined, 4));
                window.removeEventListener("message", this.handleTokenInfo);
                break;
            case messageTypes.COMM_START_REPLY:
                console.log("Smartassistant: RECEIVED", JSON.stringify(data, undefined, 4));
                AICodeCompletion.state.stateKeycloakToken = data.content.token;
                break;
            default:
                break;
        }
    }

    constructor(
        inputCode = "",
        codeCompletionMethod = "ADVANCED",
        codeCompletionLanguage = "java"
    ) {
        this.inputCode = inputCode;
        this.codeCompletionMethod = codeCompletionMethod;
        this.codeCompletionLanguage = codeCompletionLanguage;

        //Add even listener to get the Keycloak Token
        window.addEventListener("message", this.handleTokenInfo);

        //Send a message to inform SmartCLIDE IDE
        let message = buildMessage(messageTypes.COMM_START);
        window.parent.postMessage(message, "*");

    }

    // protected onAfterDetach(msg: Message): void {
    //     window.removeEventListener("message", this.handleTokenInfo);
    //     super.onAfterDetach(msg);
    // }

    checkCodeStartsKeyword(str: string, accepted_prefix: string[]) {
        if (accepted_prefix.length == 0) {
            accepted_prefix = this.accepted_keywords;
        }
        return accepted_prefix.some((accepted_prefix) =>
            str.startsWith(accepted_prefix)
        );
    }

    static validateCodeinput(input: string) {
        const accepted_prefix: string[] = ['import'];
        const accepted_keywords: string[] = ['http', 'new'];

        const pref_check = accepted_prefix.some((accepted_prefix) =>
            input.startsWith(accepted_prefix)
        );
        const keyword_check = accepted_keywords.some((accepted_keywords) =>
            input.includes(accepted_keywords)
        );
        if (!keyword_check && !pref_check) { return false; }
        return true;
    }
    // Gets code AI code completion model prediction
    async getSuggestions(codeInput: string) {
        interface User {
            id: number;
            firstName: string;
        }

        // You can export the type TUserList to use as -
        // props type in your `UserList` component
        type TUserList = User[]
        const data = JSON.stringify({
            "code_input": codeInput,
            "method": "advanced",
            "language": "java",
            "code_sugg_len": 10,
            "code_sugg_lines": 2
        });

        const config = {
            method: 'post',
            url: Configurations.smartCLIDETargetHost + ':' + Configurations.smartCLIDETargetPort + Configurations.smartCLIDETargetPath,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AICodeCompletion.state.stateKeycloakToken
            },
            data: data
        };

        return axios(config)
            .then(function (response) {
                console.log('res:::', response.data.code_suggestions);
                return response.data.code_suggestions;
            });
    }
}
