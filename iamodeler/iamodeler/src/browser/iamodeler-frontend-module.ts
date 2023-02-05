/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { ContainerModule } from '@theia/core/shared/inversify';
import { IamodelerWidget } from './iamodeler-widget';
import { IamodelerContribution } from './iamodeler-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, IamodelerContribution);
    bind(FrontendApplicationContribution).toService(IamodelerContribution);
    bind(IamodelerWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: IamodelerWidget.ID,
        createWidget: () => ctx.container.get<IamodelerWidget>(IamodelerWidget)
    })).inSingletonScope();
});
