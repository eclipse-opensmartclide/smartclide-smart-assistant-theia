/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/
import 'reflect-metadata';
import { MessageService } from '@theia/core';
import { ContainerModule, Container } from '@theia/core/shared/inversify';
import { SmartAssistantWidget } from './smart-assistant-widget';
import { render } from '@testing-library/react'

describe('SmartAssistantWidget', () => {

    let widget: SmartAssistantWidget;

    beforeEach(async () => {
        const module = new ContainerModule( bind => {
            bind(MessageService).toConstantValue({
                info(message: string): void {
                    console.log(message);
                }
            } as MessageService);
            bind(SmartAssistantWidget).toSelf();
        });
        const container = new Container();
        container.load(module);
        widget = container.resolve<SmartAssistantWidget>(SmartAssistantWidget);
    });

    it('should render react node correctly', async () => {
        const element = render(widget.render());
        expect(element.queryByText('Display Message')).toBeTruthy();
    });

    it('should inject \'MessageService\'', () => {
        const spy = jest.spyOn(widget as any, 'displayMessage')
        widget['displayMessage']();
        expect(spy).toBeCalled();
    });

});
