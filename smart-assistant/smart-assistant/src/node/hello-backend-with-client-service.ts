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
import { BackendClient, HelloBackendWithClientService } from '../common/protocol';

@injectable()
export class HelloBackendWithClientServiceImpl implements HelloBackendWithClientService {
    private client?: BackendClient;
    greet(): Promise<string> {
        return new Promise<string>((resolve, reject) =>
            this.client ? this.client.getName().then(greet => resolve('Helloooooooooo ' + greet))
                : reject('No Client'));
                
    }
    dispose(): void {
        // do nothing
    }
    setClient(client: BackendClient): void {
        this.client = client;
    }

}
