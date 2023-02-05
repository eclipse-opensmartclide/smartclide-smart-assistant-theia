/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/
// import * as React from 'react';
import * as Configurations from './configuration';

class ModelsStorage {

  model_data: any = [];

  smartCLIDETargetHost: string = Configurations.SMARTCLIDE_URL;
  smartCLIDETargetPort: string = Configurations.SMARTCLIDE_PORT;
  smartCLIDEDBInsertModelPath: string = "smartclide-db/insert_ml_model";
  smartCLIDEDBReadModelModelPath: string = "smartclide-db/get_ml_model";
  smartCLIDEDBGETAllModelPath: string = "smartclide-db/get_all_ml_model";
  smartCLIDEDBDeleteModelPath: string = "smartclide-db/delet_ml_model";

  insertMLModel() {
    try {
      if (this.model_data) {
        //call Save model API
      }
    } catch (e: any) {

    }

  }

  DeleteMLModel(id: string) {
    try {
      if (id) {
        //call delete model from API
      }
    } catch (e: any) {

    }

  }

  getMLModels(user_id: string) {
    try {
      if (user_id) {
        //Retrive users ML model from DB 
      }
    } catch (e: any) {

    }

  }
}

export default ModelsStorage;
