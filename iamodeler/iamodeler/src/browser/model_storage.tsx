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

interface MLModelData {
  model_id: string;
  model_name: string;
  user_creator_id: string;
  model_category: string;
  model_description: string;
  model_file_uri: string;
  model_method: string;
  model_target: string;
  model_size: Number;
  model_extra: string[]; // json
  cluster_label_number: string;
  cluster_label_number_arr: string[];
}

class ModelsStorage {

  DB_API_PATH_INSERT: string = '';
  model_data: MLModelData;
  user_creator_id: string = ''
  keycloakToken: string = ''
  model_data_arr: any = [];
  model_categoris: string[] = ["classifier", "regressor", "cluster",]


  smartCLIDETargetHost: string = Configurations.SMARTCLIDE_URL;
  smartCLIDETargetPort: string = Configurations.SMARTCLIDE_PORT;
  smartCLIDEDBInsertModelPath: string = "smartclide-db/insert_ml_model";
  smartCLIDEDBReadModelModelPath: string = "smartclide-db/get_ml_model";
  smartCLIDEDBGETAllModelPath: string = "smartclide-db/get_all_ml_model";
  smartCLIDEDBDeleteModelPath: string = "smartclide-db/delet_ml_model";

  setModelData(model_data: MLModelData) {
    this.model_data.model_id = model_data.model_id;
    this.model_data.user_creator_id = model_data.user_creator_id;
    this.model_data.model_name = model_data.model_name;
    this.model_data.model_description = model_data.model_description;
    this.model_data.model_file_uri = model_data.model_file_uri;
    this.model_data.model_method = model_data.model_method;
    this.model_data.model_target = model_data.model_target;
    this.model_data.model_size = model_data.model_size;
    this.model_data.cluster_label_number = model_data.cluster_label_number;
  }

  insertMLModel() {
    try {
      if (this.model_data) {
        //call Save model API
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + this.keycloakToken);

        var raw = JSON.stringify({
          "model-id": this.model_data.model_id,
          "model_user_id": this.user_creator_id,
          "model_name": this.model_data.model_name,
          "model_description": this.model_data.model_description,
          "model_file_uri": this.model_data.model_file_uri,
          "model_method": this.model_data.model_method,
          "model_target": this.model_data.model_target,
          "model_size": this.model_data.model_size,
          "model_category": this.model_data.model_category,
          "cluster_label_number": this.model_data.model_name,
        }
        );
        //Create superviser model
        fetch(Configurations.SMARTCLIDE_URL + this.DB_API_PATH_INSERT, {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        })
          .then((response: any) => {
            return response.json()
          })
          .then((result: any) => {
            if (result.status === "ok") { console.log("The model is inserted successfully") }
          })
          .catch((error: any) => {

            console.log("Unable to insert model in the database.")

            console.log('error', error)
          });

      }
    } catch (e: any) {
      console.log(e)
    }

  }

  DeleteMLModel(model_id: string) {
    try {
      if (model_id) {
        //call delete model from API
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + this.keycloakToken);

        var raw = JSON.stringify({
          "model_id": model_id,
        }
        );
        //Create superviser model
        fetch(Configurations.SMARTCLIDE_URL + this.DB_API_PATH_INSERT, {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        })
          .then((response: any) => {
            return response.json()
          })
          .then((result: any) => {
            if (result.status === "ok") { console.log("The model is deleted successfully") }
          })
          .catch((error: any) => {

            console.log("Unable to delete model in the database.")
            console.log('error', error)
          });

      }
    } catch (e: any) {
      console.log(e)
    }

  }

  getMLModels(user_id: string) {
    try {
      if (user_id) {
        //call delete model from API
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + this.keycloakToken);

        var raw = JSON.stringify({
          "user_id": user_id,
        }
        );
        //Create superviser model
        fetch(Configurations.SMARTCLIDE_URL + this.DB_API_PATH_INSERT, {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        })
          .then((response: any) => {
            return response.json()
          })
          .then((result: any) => {
            if (result.status === "ok") { console.log("The model is deleted successfully") }
          })
          .catch((error: any) => {
            console.log("Unable to delete model in the database.")
            console.log('error', error)
          });

      }
    } catch (e: any) {

      console.log(e)

    }

  }
}

export default ModelsStorage;