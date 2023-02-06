/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/
import * as React from "react";
import {
  injectable,
  postConstruct,
  inject,
} from "@theia/core/shared/inversify";
import { ChangeEvent } from 'react';
import Form from "react-bootstrap/Form";
import { MessageService } from "@theia/core";
import * as Configurations from './configuration';
import { Message } from "@theia/core/lib/browser";
import { renderToStaticMarkup } from "react-dom/server";
import { HelloBackendService } from '../common/protocol';
// Add widget desc in main container
import DiaplayWidgetDesc from "./display_desc";
import Resourcesuggestion from "./resourcesuggestion";
import Acceptancesuggestion from "./acceptance_sugg";
//validate XML file
import { XMLValidator } from 'fast-xml-parser';
// For opening file
import URI from '@theia/core/lib/common/uri';
import { EditorManager } from '@theia/editor/lib/browser';
import Services from '../browser/data_sample/services.json';
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
//Token managment
import { messageTypes, buildMessage } from '@unparallel/smartclide-frontend-comm';

@injectable()
export class SmartAssistantWidget extends ReactWidget {
  static readonly ID = "smart-assistant:widget";
  static readonly LABEL = "SmartAssistant Widget";
  static cluster_endpoint = {
    host: Configurations.SMARTCLIDE_HOST,
    port: Configurations.SMARTCLIDE_PORT
  };
  static functinality_path = {
    environment: Configurations.FUNCTIONALITY_PATH_ENVIROMENT,
    acceptance: Configurations.FUNCTIONALITY_PATH_ACCEPTANCE,
    code_template: Configurations.FUNCTIONALITY_PATH_CODETEMPLATE
  };

  static state = {
    service_name: "",
    service_id: "",
    file: "",
    file_acceptance: "",
    search: "",
    search_repo: "",
    stateKeycloakToken: ''
  };
  deployed_services: any = [];
  static res: string;
  NUMBER_VALIDATOR = /^[0-9]+$/;
  STRING_VALIDATOR = /^[a-zA-Z0-9\/&=._-]{2,120}$/;



  handleTokenInfo = ({ data }: any) => {
    switch (data.type) {
      case messageTypes.TOKEN_INFO:
        console.log("Smartassistant: RECEIVED", JSON.stringify(data, undefined, 4));
        SmartAssistantWidget.state.stateKeycloakToken = data.content;
        break;
      case messageTypes.TOKEN_REVOKE:
        console.log("Smartassistant: RECEIVED", JSON.stringify(data, undefined, 4));
        window.removeEventListener("message", this.handleTokenInfo);
        break;
      default:
        break;
    }
  }


  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @inject(HelloBackendService)
  protected readonly helloBackendService: HelloBackendService;

  @inject(EditorManager)
  protected readonly editorManager: EditorManager;

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = SmartAssistantWidget.ID;
    this.title.label = SmartAssistantWidget.LABEL;
    this.title.caption = SmartAssistantWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
    this.update();

    //Add event listener to get the Keycloak Token
    window.addEventListener("message", this.handleTokenInfo);

    //Send a message to inform SmartCLIDE IDE
    let message = buildMessage(messageTypes.COMPONENT_HELLO);
    window.parent.postMessage(message, "*");
  }

  protected onAfterDetach(msg: Message): void {
    window.removeEventListener("message", this.handleTokenInfo);
    super.onAfterDetach(msg);
  }


  render(): React.ReactElement {
    var options: any = []
    options = this.retrieveDeployedServices()

    //Add widget desc in main container
    const output_ = document.createElement("div");
    const staticElement = renderToStaticMarkup(DiaplayWidgetDesc("Smart Assistant"));
    output_.innerHTML = `${staticElement}`;
    (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = output_.innerHTML;

    //Template file upload
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = function () {
          var file_content = reader.result;
          if (file_content) {
            SmartAssistantWidget.state["file"] = file_content?.toString()
          }
        }
      }
    };

    //Template generation using API
    const handleUploadClick = () => {
      const result = XMLValidator.validate(SmartAssistantWidget.state["file"]);
      if (result === true) {
        //read file in backend
        this.runprocess(SmartAssistantWidget.state["file"]);
        //create editor for template file
        this.creatEditor();
      } else {
        console.log(`XML is invalid`);
        this.messageService.error(`XML format is invalid`);
        return false;
      }
    };

    //Acceptance file upload
    const handleAcceptanceFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        console.log("file_acceptance")
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = function () {
          var file_content = reader.result;
          if (file_content) {
            SmartAssistantWidget.state["file_acceptance"] = file_content?.toString()
          }
        }
      }
    };

    //Acceptance suggestion using API
    const handleAcceptanceUploadClick = () => {
      this.callAcceptanceProcess(SmartAssistantWidget.state["file_acceptance"]);
    };

    //Service URL search
    const handleSearchClick = () => {
      var items: any = this.callSearch(SmartAssistantWidget.state["search"]);
      console.log(items)
    };

    //Service Repo search
    const handleSearchRepoClick = async () => {
      await this.callRepoSearch(SmartAssistantWidget.state["search_repo"]);
    }
    //Render interface
    return (
      <div id="widget-container">
        <div className="tab">
          <button
            className="tablinks"
            value="templates_functionality"
            onClick={(e) => this.displayMenu(e)}
          >
            Templates
          </button>
          <button
            className="tablinks"
            value="enviroment_suggestion"
            onClick={(e) => this.displayMenu(e)}
          >
            Enviroments
          </button>
          <button
            className="tablinks"
            value="acceptance_suggestion"
            onClick={(e) => this.displayMenu(e)}
          >
            Acceptance
          </button>
          <button
            className="tablinks"
            value="search_repo_suggestion"
            onClick={(e) => this.displayMenu(e)}
          >
            Search URLs
          </button>
          <button
            className="tablinks"
            value="search_packages"
            onClick={(e) => this.displayMenu(e)}
          >
            Search Packages
          </button>
        </div>
        <div id="templates_functionality" className="tabcontent first">
          <AlertMessage type="INFO" header="Templates" />
          <p>Upload a BPMN file inorder to get the suggested template:</p>
          <div>
            <div>
              <input type="file" className="file" onChange={handleFileChange} />
              {/* <button className="btn">Select a file</button> */}
            </div>
            <div>
              <button onClick={handleUploadClick} className="btn btn-submit">Upload</button>
            </div>
          </div>
          <div id="temp_result"></div>
        </div>
        <div id="enviroment_suggestion" className="tabcontent">
          <AlertMessage type="INFO" header="Enviroment Suggestion" />
          <p>
            Select a target service in order get the environment suggestions:
          </p>
          <Form.Control
            as="select"
            aria-label="Default select example"
            onChange={(e: any) => {
              SmartAssistantWidget.state["service_id"] = e.target.value;
              this.suggestEnviroment();
            }}
          >
            <option>Open service list menu</option>
            {options.map((option: any) => (
              <option data-tokens={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        </div>
        <div id="acceptance_suggestion" className="tabcontent">
          <AlertMessage type="INFO" header="Acceptance Suggestion" />
          <p>Upload a BPMN file to get the acceptance test set suggestion:</p>
          <div>
            <div>
              <input type="file" className="file" onChange={handleAcceptanceFileChange} />
            </div>
            <div>
              <button onClick={handleAcceptanceUploadClick} className="btn btn-submit">
                Upload <span id='waitAnimation' className="lds-dual-ring"></span>
              </button>
            </div>
          </div>
          <div id="temp_result"></div>
        </div>
        <div id="search_repo_suggestion" className="tabcontent">
          <AlertMessage type="INFO" header="Providers Service URLs Search" />
          <p>Search well know web service URLs e.g., googleapis:</p>
          <div>
            <div>
              <input type="text" className="file" onChange={this.updateInput} name="search" placeholder="Search" />
            </div>
            <div>
              <button onClick={handleSearchClick} className="btn btn-submit">Search</button>
            </div>
          </div>
          <div id="temp_result"></div>
        </div>
        <div id="search_packages" className="tabcontent">
          <AlertMessage type="INFO" header="Providers Service Packages Search" />
          <p>Search Packages:</p>
          <div>
            <div>
              <input type="text" className="file" onChange={this.updateInput} name="search_repo" placeholder="Search" />
            </div>
            <div>
              <button onClick={handleSearchRepoClick} className="btn btn-submit">Search</button>
            </div>
          </div>
          <div id="temp_result"></div>
        </div>

      </div>
    );
  }

  public async runprocess(file_content: any): Promise<void> {
    SmartAssistantWidget.res = await this.helloBackendService.sayHelloTo(file_content);
  }

  public async runacceptance(file_content: any): Promise<void> {
    SmartAssistantWidget.res = await this.helloBackendService.runAcceptance(file_content);
  }

  validator(input: any, str_reg: any) {
    if (str_reg = 'string') {
      str_reg = this.STRING_VALIDATOR
    } else if (str_reg = 'number') {
      str_reg = this.NUMBER_VALIDATOR
    }
    if (input !== '' || !input.match(str_reg)) { return true; }
    return false;
  }

  public fetchData() {
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + SmartAssistantWidget.state.stateKeycloakToken);
    return fetch(Configurations.SMARTCLIDE_HOST + Configurations.DB_PATH_RETRIVESERVICES,
      {
        method: "GET",
        headers: myHeaders,
        redirect: 'follow'
      }
    )
      .then((res) => {
        return res.json();
      })
  };

  retrieveDeployedServices() {
    //ToDO : statisc services exported from DB
    var i: any = 0
    for (i in Services) {
      if (Services[i].deployable) {
        this.deployed_services.push({
          label: Services[i].name,
          value: Services[i].git_credentials_id,
        });
      }
    }
    return this.deployed_services;
  }

  public async creatEditor() {
    var u = new URI()
    var filename = await this.helloBackendService.gettemplafile_path()

    var new_u = u.withPath(filename);
    if (new_u) {
      this.editorManager.open(new_u);
      this.onScrollYReachEnd
    } else {
      console.log(new_u)
    }
  }


  public async callSearch(search: any): Promise<any[]> {
    if (!search.match(/^[a-zA-Z0-9\/&=._-]{0,120}$/)) {
      this.messageService.error('Invalid search input.Valid characters include "A-Za-z0-9 /&=._-", with 2-120 characters length');
      search = ''
    }
    var items = await this.helloBackendService.callSearch(search)
    var table = '', rows = '', th = '';
    th = "<tr><th>Urls</th></tr>"
    for (var item of items) {
      rows += "<tr>" +
        "<td>" + item + "</td>" + "</tr>";
    };
    table = '</br><center><table id="resource_info">' + th + rows + '</table></center>';
    (document.getElementById("result_") as HTMLElement).innerHTML =
      table;
    (document.getElementById("result_") as HTMLElement).style.display =
      "block";
    return items;
  }

  public async callRepoSearch(search: any): Promise<any[]> {
    if (!search.match(/^[a-zA-Z0-9\/&=._-]{0,120}$/)) {
      this.messageService.info('Invalid search input.Valid characters include A-Z,a-z, 0-9, and "/&=._-", with 2-120 characters length');
      search = ''
    }
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    // var res = await fetch('https://api.github.com/search/repositories?q=' + SmartAssistantWidget.state["search_repo"] + '&per_page=30&page=1&type=registrypackages', requestOptions);

    fetch('https://api.github.com/search/repositories?q=' + SmartAssistantWidget.state["search_repo"] + '&per_page=30&page=1&type=registrypackages', requestOptions)
      .then(response => {
        let res = response.json();
        return res
      }).then(res => {
        // if(res.items){
        //   var items = res.items
        var table = '', rows = '', th = '';
        th = "<tr><th>Urls</th></tr>"
        for (var item of res.items) {
          if (item.description !== null && item.description.match(/^[a-zA-Z1-9.?!:;\- ]+$/g) !== null) {
            rows += "<tr>" +
              "<td><a href='" + item.html_url + "' target='_blank' >" + item.full_name + "</a></td>" +
              "<td>" + item.description + "</td>" +
              "</tr>";
          }

        };
        table = '</br><center><table id="resource_info">' + th + rows + '</table></center>';
        (document.getElementById("result_") as HTMLElement).innerHTML =
          table;
        (document.getElementById("result_") as HTMLElement).style.display =
          "block";
        // }
      });

    return [];
  }
  protected callAcceptanceProcess(file_content: string): void {
    (document.getElementById("waitAnimation") as HTMLElement).style.display = "inline-block";
    fetch(
      SmartAssistantWidget.cluster_endpoint.host + ":" +
      SmartAssistantWidget.cluster_endpoint.port + SmartAssistantWidget.functinality_path.acceptance,
      {
        method: "post",
        headers: {
          Accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "bpmn": file_content
        }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((out) => {
        //get result
        if (out.statusCode === "500") {
          this.messageService.error(out.status);
          //remove animate
          (document.getElementById("waitAnimation") as HTMLElement).style.display = "none";

        } else {
          var obj = JSON.parse(JSON.stringify(out));
          var res = obj.recommended_gherkins[0];
          //provid result in table format and display
          let sugg = new Acceptancesuggestion(res);
          var res_print = sugg.getSuggestions();
          (document.getElementById("result_") as HTMLElement).innerHTML = res_print;
          (document.getElementById("result_") as HTMLElement).style.display = "block";

          (document.getElementById("waitAnimation") as HTMLElement).style.display = "none";
          this.messageService.info("Acceptance test Successfully Generated!");
        }
      })
      .catch((err) => {
        this.messageService.error("Please retry in a few seconds.");
        console.log("err: ", err);
      });
  }

  public createFile(): void {
    console.log('');
  }


  protected suggestEnviroment(): void {
    fetch(
      SmartAssistantWidget.cluster_endpoint.host +
      ":" +
      SmartAssistantWidget.cluster_endpoint.port +
      SmartAssistantWidget.functinality_path.environment,
      {
        method: "post",
        headers: {
          Accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + SmartAssistantWidget.state.stateKeycloakToken
        },
        body: JSON.stringify({
          header: "resource used",
          service: {
            id: SmartAssistantWidget.state["service_id"],
            name: "UserService",
          },
          current_memory: 8,
          current_space: 256,
          current_user_volume: 4,
          current_number_of_threads: 2,
        }),
      }
    )
      .then((res) => res.json())
      .then((out) => {
        var obj = JSON.parse(JSON.stringify(out));
        var func_result: any;
        let sugg = new Resourcesuggestion(obj);

        func_result = sugg.getSuggestions();
        (document.getElementById("result_") as HTMLElement).innerHTML =
          func_result;
        (document.getElementById("result_") as HTMLElement).style.display =
          "block";
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }

  protected displayMessage(): void {
    // console.log(SmartAssistantWidget.state.stateKeycloakToken)
  }

  protected onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    const htmlElement = document.getElementById("displayMessageButton");
    if (htmlElement) {
      htmlElement.focus();
    }
  }

  //update Input values
  updateInput(e: React.ChangeEvent<HTMLInputElement>) {
    const key = e.currentTarget.name as keyof typeof SmartAssistantWidget.state;
    SmartAssistantWidget.state[key] = e.currentTarget.value;
  }

  displayMenu(e: any) {
    // Declare all variables
    var i, tablinks, j = 0;
    var menuItem = e.target.value;
    var tab_ids = ["enviroment_suggestion", "acceptance_suggestion", "search_repo_suggestion", "templates_functionality", "search_packages"]
    // Get all elements with class="tabcontent" and hide them
    if (menuItem == "templates_functionality") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("template_gen"));

    } else if (menuItem == "enviroment_suggestion") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("deploy_recomm"));

    } else if (menuItem == "acceptance_suggestion") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("acceptance_test"));

    } else if (menuItem == "code_repo_suggestion") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("code_repo"));

    } else if (menuItem == "search_repo_suggestion") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("search_url"));
    } else if (menuItem == "search_packages") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("search_packages"));
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      if (tablinks[i].getAttribute("value") == menuItem) {
        tablinks[i].className = tablinks[i].className.replace("tablinks", "tablinks active");
      } else {
        tablinks[i].className = tablinks[i].className.replace("tablinks active", "tablinks");
      }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    (document.getElementById(menuItem) as HTMLElement).style.display = "block";

  }
}