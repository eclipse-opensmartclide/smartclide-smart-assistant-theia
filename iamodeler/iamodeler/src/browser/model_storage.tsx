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

  DB_API_PATH_INSERT: string = '/smartclide-db/models';
  model_data: MLModelData;
  user_creator_id: string = '628c87f6aa5a2857398a80a0'
  keycloakToken: string = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlMjNGc3kzRlI5dnRUZms3TGlkX1lQOGU0cDNoY0psM20wQTRnckIzNnJJIn0.eyJqdGkiOiIwOGFmMzFhMS04NjAwLTRjZGMtYTBmNy04Mzg0OTA5Y2U2MzAiLCJleHAiOjE2Nzg2ODcxNDAsIm5iZiI6MCwiaWF0IjoxNjc4Njg2ODQwLCJpc3MiOiJodHRwczovL2tleWNsb2FrLXNtYXJ0Y2xpZGUtY2hlLmNoZS5zbWFydGNsaWRlLmV1L2F1dGgvcmVhbG1zL2NoZSIsImF1ZCI6InNtYXJ0Y2xpZGUtdGVzdC1jbGllbnQtbmciLCJzdWIiOiJiZmFiNjBjMy0zOGNlLTQ5YmEtOTgzMC00NDUyNTZlZTk1NTUiLCJ0eXAiOiJJRCIsImF6cCI6InNtYXJ0Y2xpZGUtdGVzdC1jbGllbnQtbmciLCJub25jZSI6IjRjZjM3NDAxYmYwMmIxMmVlMDU4MmU0ODNlM2VkYTM0YmQ1UTFuU001IiwiYXV0aF90aW1lIjoxNjc4Njg2ODQwLCJzZXNzaW9uX3N0YXRlIjoiZmYyMDk5YmEtMjliZC00MGU5LWE3ZDMtNzZkZDIxNDRlZTNmIiwiYWNyIjoiMSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiWmFraWVoIGFsaXphZGVoIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiemFraWVoQHVzYWwuZXMiLCJnaXZlbl9uYW1lIjoiWmFraWVoIiwiZmFtaWx5X25hbWUiOiJhbGl6YWRlaCIsImVtYWlsIjoiemFraWVoQHVzYWwuZXMifQ.a-lATSBHoVCjqiTT6G-CPDhO6ZYdJYxNRYmXQ86cGn-ffeLQB1SyRWzTbuVMl437TJZvUir3gXON-Z6TPN2ZwFJ8z0x_5MZzxjV8p978Eo2uLnDIwu7U10GbIypUFkCgWIhacII2qDDwBOvQnAh0IGDPl_dGJryk0aZqT4GuAm-0QMQALvu6VRC702FRPh5T8_7iufxzFQunY5pdC10WznaayEjx_Co-WhDB2x9BzhW78uFZ3n6NutbcTL_YdSWEmyCdgFIyhhwt2ZB8LyaxClJMR6KdnUFhKGiv7C_8blRzLJBIYa_cc-r1Xexq22z4rXfWycpzG-Y9pTjzNRksng'
  model_data_arr: any = [];
  CLASSIFIER_CAT = "classifier"
  REGRESSOR_CAT = "regressor"
  CLUSTER_CAT = "cluster"


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
    console.log('model_data_arr: ', this.model_data_arr)
    try {
      if (this.model_data_arr) {
        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("Authorization", "Bearer " + this.keycloakToken);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "id": this.model_data_arr.model_id,
          "name": this.model_data_arr.model_name,
          "description": this.model_data_arr.model_description,
          "user_creator_id": this.user_creator_id,
          "category": this.model_data_arr.model_category,
          "file_uri": this.model_data_arr.model_file_uri,
          "method": this.model_data_arr.model_method,
          "target": this.model_data_arr.model_target,
          "size": this.model_data_arr.model_size
        });

        fetch('https://api.dev.smartclide.eu/smartclide-db/models', {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        })
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        //call Save model API
        // var myHeaders = new Headers();
        // myHeaders.append("accept", "application/json");
        // myHeaders.append("Authorization", "Bearer " + this.keycloakToken);

        // this.user_creator_id = "628c87f6aa5a2857398a80a0";
        // var raw = JSON.stringify({
        //   "model-id": this.model_data_arr.model_id,
        //   "model_user_id": this.user_creator_id,
        //   "model_name": this.model_data_arr.model_name,
        //   "model_description": this.model_data_arr.model_description,
        //   "model_file_uri": this.model_data_arr.model_file_uri,
        //   "model_method": this.model_data_arr.model_method,
        //   "model_target": this.model_data_arr.model_target,
        //   "model_size": this.model_data_arr.model_size,
        //   "model_category": this.model_data_arr.model_category,
        //   "cluster_label_number": this.model_data_arr.model_name,
        // }
        // );
        // //Create superviser model
        // fetch(Configurations.SMARTCLIDE_URL + this.DB_API_PATH_INSERT, {
        //   method: 'POST',
        //   headers: myHeaders,
        //   body: raw,
        //   redirect: 'follow'
        // })
        //   .then((response: any) => {
        //     return response.json()
        //   })
        //   .then((result: any) => {
        //     if (result.status === "ok") { console.log("The model is inserted successfully") }
        //   })
        //   .catch((error: any) => {

        //     console.log("Unable to insert model in the database.")

        //     console.log('error', error)
        //   });

      }
    } catch (e: any) {
      console.log(e)
    }

    return true;

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
    return true;

  }

  getMLModels() {
    try {
      if (this.user_creator_id) {
        //call delete model from API
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + this.keycloakToken);

        return fetch("https://api.dev.smartclide.eu/smartclide-db/models?user_id=" + this.user_creator_id, {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        })
          .then(response => {
            console.log('response: ', response)
            return response.json()
          })
          .then(result => {
            return result
          })
          .catch(error => console.log('error', error));
      }
    } catch (e: any) {
      console.log(e)
    }
    return []
  }
}

export default ModelsStorage;