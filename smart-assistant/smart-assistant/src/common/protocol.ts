/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/
import { JsonRpcServer } from '@theia/core/lib/common/messaging';

export const HelloBackendService = Symbol('HelloBackendService');
export const HELLO_BACKEND_PATH = '/services/helloBackend';

export interface HelloBackendService {
    sayHelloTo(name: string): Promise<string>;
    runAcceptance(name: string): Promise<string>;
    callSearch(name: string): Promise<any[]>;
}
export const HelloBackendWithClientService = Symbol('BackendWithClient');
export const HELLO_BACKEND_WITH_CLIENT_PATH = '/services/withClient';

export interface HelloBackendWithClientService extends JsonRpcServer<BackendClient> {
    greet(): Promise<string>
}
export const BackendClient = Symbol('BackendClient');
export interface BackendClient {
    getName(): Promise<string>;
}
