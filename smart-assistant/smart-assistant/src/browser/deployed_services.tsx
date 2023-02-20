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

interface deployment {
  deploy_id: string;
  deploy_name: string;
  deploy_user_id: string;
  deploy_user: string;
  deploy_project: string;
  deploy_git_credentials_id: string;
  deploy_service_url: string;
  deploy_k8s_url: string;
  deploy_port: string;
  deploy_replicas: Number;
  deploy_workflow_id: string;
  deploy_service_id: string;
  deploy_state: boolean;
}

interface service {
  service_id: string;
  service_name: string;
  service_description: string;
  service_user_id: string;
  service_registry_id: string;
  service_url: string;
  service_is_public: string;
  service_licence: string;
  service_framework: string;
}

class DeployedServices {

  service_data: service;
  services_arr: service[];
  service_id: string = '';
  keycloakToken: string = '';
  deployment_data: deployment;
  cluster_deployments_arr: [];
  Public_service_deployed_arr: any;
  user_service_creator_id: string = '';
  user_deployment_creator_id: string = '';

  smartCLIDETargetHost: string = Configurations.SMARTCLIDE_Cluster;
  smartCLIDETargetPort: string = Configurations.SMARTCLIDE_PORT;
  smartCLIDEDBGetDeploymentsPath: string = "/smartclide-db/deployments";
  smartCLIDEDBGetServicesPath: string = "/smartclide-db/services";

  public async fetchDeploymentData() {
    // var cluster_deployments_arr: any = []
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + this.keycloakToken);
    //call Service API model API
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + this.keycloakToken);
    var deployed_services = await fetch(this.smartCLIDETargetHost + this.smartCLIDEDBGetDeploymentsPath,
      {
        method: "GET",
        headers: myHeaders,
        redirect: 'follow'
      }
    );
    const json = await deployed_services.json();
    this.cluster_deployments_arr = json;
    console.log(json)
    return json;
  }

  public async fetchDeployedPublicServices() {
    //Get deployed services
    await this.fetchDeploymentData();
    //Get public deployed services
    if (this.cluster_deployments_arr) {
      var deployed: any = this.cluster_deployments_arr;
      console.log('deployed: ', deployed)
      var i: any = 0
      for (i in deployed) {
        if (deployed[i].service_id) {
          //call get service
          var myHeaders = new Headers();
          myHeaders.append("accept", "application/json");
          myHeaders.append("Authorization", "Bearer " + this.keycloakToken);
          //call Service API model API
          var myHeaders = new Headers();
          myHeaders.append("accept", "application/json");
          myHeaders.append("Authorization", "Bearer " + this.keycloakToken);
          //Use API get service by ID
          console.log('i:', i, 'path:', this.smartCLIDETargetHost + this.smartCLIDEDBGetServicesPath + '/' + deployed[i].service_id)
          var services = await fetch(this.smartCLIDETargetHost + this.smartCLIDEDBGetServicesPath + '/' + deployed[i].service_id,
            {
              method: "GET",
              headers: myHeaders,
              redirect: 'follow'
            }
          );
          const json = await services.json();
          if (json !== null) {
            console.log('json:', json)
            if (this.Public_service_deployed_arr === undefined){
              this.Public_service_deployed_arr = [{
                name: json.name,
                is_public: json.is_public,
                service_id: json.id,
              }];
            }else{
              this.Public_service_deployed_arr.push([{
                name: json.name,
                is_public: json.is_public,
                service_id: json.id,
              }])
            }
          }
        }
      }
    }
    return this.Public_service_deployed_arr;
  }

  getDeployedPublicServices() {
    this.fetchDeployedPublicServices()
    //beter to have json object
    return this.Public_service_deployed_arr;

  }


}

export default DeployedServices;