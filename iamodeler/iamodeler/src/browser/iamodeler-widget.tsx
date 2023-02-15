/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ModelsInfo from "./models_info";
import { MessageService } from '@theia/core';
import DiaplayWidgetDesc from "./display_desc";
import { Message } from '@theia/core/lib/browser';
import * as Configurations from './configuration';
import { renderToStaticMarkup } from "react-dom/server";
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { messageTypes, buildMessage } from '@unparallel/smartclide-frontend-comm';


@injectable()
export class IamodelerWidget extends ReactWidget {

  static readonly ID = 'iamodeler:widget';
  static readonly LABEL = 'IA Modeler Widget';

  smartCLIDETargetHost: string = Configurations.SMARTCLIDE_URL;
  smartCLIDETargetPort: string = Configurations.SMARTCLIDE_PORT;
  // AUTHORIZATION_TOKEN: string = Configurations.AUTHORIZATION_TOKEN;
  smartCLIDETargetmodule: string = Configurations.SMARTCLIDE_TARGET_MODULE_PATH;

  static state = {
    model_id: "",
    classifier_name: "",
    classifier_description: "",
    classifier_file: "",
    classifier_method: "",
    classifier_target: "",
    classifier_size: "",
    regressor_name: "",
    regressor_description: "",
    regressor_file: "",
    regressor_method: "",
    regressor_target: "",
    regressor_size: "",
    cluster_name: "",
    cluster_description: "",
    cluster_file: "",
    cluster_method: "",
    cluster_target: "",
    cluster_label_number: "",
    stateKeycloakToken: ''
  };
  model_uuid = ''
  NUMBER_VALIDATOR = /^[0-9]+$/;
  STRING_VALIDATOR = /^[0-9a-zA-Z_-]{,200}$/;
  suppervised_classifiers = ['bayes', 'random-forest', 'gradient-boosting', 'logistic', 'mlp', 'neighbors', 'sv', 'tree']
  suppervised_regressor = ['sv', 'neighbors', 'mlp', 'linear', 'gradient-boosting', 'random-forest', 'extra-trees', 'tree']


  @inject(MessageService)
  protected readonly messageService!: MessageService;

  handleTokenInfo = ({ data }: any) => {
    switch (data.type) {
      case messageTypes.KEYCLOAK_TOKEN:
        console.log("Smartassistant: RECEIVED", JSON.stringify(data, undefined, 4));
        IamodelerWidget.state.stateKeycloakToken = data.content;
        break;
      case messageTypes.KEYCLOAK_TOKEN:
        console.log("Smartassistant: RECEIVED", JSON.stringify(data, undefined, 4));
        window.removeEventListener("message", this.handleTokenInfo);
        break;
      default:
        break;
    }
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = IamodelerWidget.ID;
    this.title.label = IamodelerWidget.LABEL;
    this.title.caption = IamodelerWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
    this.update();

    //Add event listener to get the Keycloak Token
    window.addEventListener("message", this.handleTokenInfo);

    //Send a message to inform SmartCLIDE IDE
    let message = buildMessage(messageTypes.COMM_START);
    window.parent.postMessage(message, "*");
  }
  protected onAfterDetach(msg: Message): void {
    window.removeEventListener("message", this.handleTokenInfo);
    super.onAfterDetach(msg);
  }

  render(): React.ReactElement {

    //Add widget desc in main container
    const output_ = document.createElement("div");
    const staticElement = renderToStaticMarkup(DiaplayWidgetDesc("Smart Assistant", ""));
    output_.innerHTML = `${staticElement}`;
    (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = output_.innerHTML;

    return (
      <div id="widget-container">
        <div className="tab">
          <button
            className="tablinks active"
            value="classification"
            onClick={(e) => this.displayMenu(e)}
          >
            Supervised
          </button>
          <button
            className="tablinks"
            value="clustering"
            onClick={(e) => this.displayMenu(e)}
          >
            Unsupervised
          </button>
        </div>
        <div id="classification" className="tabcontent first">
          <AlertMessage type="INFO" header="Supervised" />
          <p>
            <em>
              Please Select Classifier or Regressor:
            </em>
          </p>
          <div id="temp_result">
            <button value="Classifier" onClick={() => this.displayContent("classifier")} className='p-link'>Classifier</button>
            <div className='form-widget classifier hidden'>
              {this.classifierForm()}
            </div>
            <button value="Regressor" onClick={() => this.displayContent("regressor")} className='p-link'>Regressor</button>
            <div className='form-widget regressor hidden'>
              {this.regressorForm()}
            </div>
          </div>
        </div>
        <div id="clustering" className="tabcontent">
          <AlertMessage type="INFO" header="Unsupervised" />
          <p>
            <em>
              Please Select Unsupervised:
            </em>
          </p>
          <div>
          </div>
          <div id="temp_result">
            <button value="Clustering" onClick={() => this.displayContent("clustering")} className='p-link'>Clustering</button>
            <div className='form-widget clustering hidden'>
              {this.clusteringForm()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getHostURI(): string {
    var target_url = "";
    if (this.smartCLIDETargetPort === "") {
      target_url = this.smartCLIDETargetHost + this.smartCLIDETargetmodule
    } else {
      target_url = this.smartCLIDETargetHost + ":" + this.smartCLIDETargetPort + this.smartCLIDETargetmodule
    }
    return target_url;
  }


  // getAuthToken(): string {
  //   return this.AUTHORIZATION_TOKEN;
  // }

  protected displayMessage(): void {
    this.messageService.info('Congratulations: Iamodeler Widget Successfully Created!');
  }

  protected onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    const htmlElement = document.getElementById('displayMessageButton');
    if (htmlElement) {
      htmlElement.focus();
    }
  }

  classifierForm() {
    return (
      <div id="widget_form">
        <div id="result_" className='ia'>
          <>
            {/* <fieldset>
              <legend>Name</legend>
              <div className="tooltip">    <label htmlFor='name'>Name*:</label>
                <span className="tooltiptext">Allowed string characters includes [0-9a-zA-Z_-]</span>
              </div>
              <input id="name" name="classifier_name" onChange={this.updateInput} />

              <div className="tooltip">     <label htmlFor='description'>Description*:</label>
                <span className="tooltiptext">Allowed string characters includes [0-9a-zA-Z_-]</span>
              </div>
              <textarea id='description' name='classifier_description' onChange={this.updateInput} rows={4} cols={50} />
            </fieldset> */}
            <fieldset>
              <legend>Data Source</legend>

              <div className="tooltip">    <label htmlFor='file'>File*: <span className="hint__circle">?</span></label>
                <span className="tooltiptext">Allowed file URL, like iris dataset URL:'https://raw.githubusercontent.com/domoritz/maps/master/data/iris.json'</span>
              </div>

              <input type="text" onChange={this.updateInput} id="file" name="classifier_file" />
            </fieldset>
            <fieldset>
              <legend>Target</legend>
              <div className="tooltip">    <label htmlFor='target'>Target feature*: <span className="hint__circle">?</span></label>
                <span className="tooltiptext">Target field which is data label like: species in iris dataset'</span>
              </div>

              <input id="target" name="classifier_target" onChange={this.updateInput} />
            </fieldset>
            <fieldset>
              <legend>Method*</legend>
              <input type="radio" id="classifier_Naive_Bayes" name="classifier_method" value="bayes" onChange={this.updateInput} />
              <label htmlFor='classifier_Naive_Bayes'>Naive Bayes</label><br />
              <input type="radio" id="classifier_Random_forest" name="classifier_method" value="random-forest" onChange={this.updateInput} />
              <label htmlFor='classifier_Random_forest'>Random forest</label><br />
              <input type="radio" id="classifier_Gradient_boosting" name="classifier_method" value="gradient-boosting" onChange={this.updateInput} />
              <label htmlFor='classifier_Gradient_boosting'>Gradient boosting</label><br />
              <input type="radio" id="classifier_Logistic_regression" name="classifier_method" value="logistic" onChange={this.updateInput} />
              <label htmlFor='classifier_Logistic_regression'>Logistic regression</label><br />
              <input type="radio" id="classifier_Multi_layer_perceptron" name="classifier_method" value="mlp" onChange={this.updateInput} />
              <label htmlFor='classifier_Multi_layer_perceptron'>Multi-layer perceptron	</label><br />
              <input type="radio" id="classifier_K_nearest_neighbors" name="classifier_method" value="neighbors" onChange={this.updateInput} />
              <label htmlFor='classifier_K_nearest_neighbors'>K-nearest neighbors</label><br />
              <input type="radio" id="classifier_Support_vector" name="classifier_method" value="sv" onChange={this.updateInput} />
              <label htmlFor='classifier_Support_vector'>Support vector</label><br />
              <input type="radio" id="classifier_Decision_tree" name="classifier_method" value="tree" onChange={this.updateInput} />
              <label htmlFor='classifier_Decision_tree'>Decision tree</label>
            </fieldset>
            <fieldset>
              <div className="tooltip">    <label htmlFor='classifier_size'>Test size*: <span className="hint__circle">?</span></label>
                <span className="tooltiptext">The train-test input indicate test/train split for evaluating the model performance. It should be between 0.0 and 1.0 and represent the percentage of the dataset to test split. </span>
              </div>
              <input id="size" name="classifier_size" onChange={this.updateInput} placeholder="0.2" />
            </fieldset>

            <button onClick={() => this.classify()} className='button-model-large'>
              Submit <span id='waitAnimation' className="lds-dual-ring" ></span>
            </button>

            {/* <input type="submit" value="Submit" onClick={() => this.classify()}>
            <span id='waitAnimation' className="lds-dual-ring"></span>
            </input> */}
            <div className="hidden after-buttons">
              <input value="Dlete model" id='classify_delete' onClick={() => this.deleteModel(IamodelerWidget.state["model_id"], 'classify')} type="submit" className='button-model' />
              <input value="Download model" onClick={() => this.downloadModel(IamodelerWidget.state["model_id"])} type="submit" className='button-model' />
            </div>
          </>
        </div>
      </div>
    )
  }

  generate_uuid() {
    return (this.model_uuid = uuidv4());
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

  classify() {

    //add wait
    (document.getElementById("waitAnimation") as HTMLElement).style.display = "block";


    var selected = document.querySelectorAll('.after-buttons');
    selected[0].classList.add("hidden");
    selected[0].classList.remove("show");

    var err_msg = []
    //Input validation
    if (!this.validator(IamodelerWidget.state["classifier_size"], 'number') || Number(IamodelerWidget.state["classifier_size"]) < 0 || Number(IamodelerWidget.state["classifier_size"]) > 1) {
      err_msg.push("Training and Testing: must be float number between 0-1")
    }
    if (IamodelerWidget.state["classifier_name"] === '') {
      IamodelerWidget.state["classifier_name"] = 'classifer_model_' + this.getRandomInt(1, 100000)
      console.log(IamodelerWidget.state["classifier_name"])
    } else if (!this.validator(IamodelerWidget.state["classifier_name"], 'string')) {
      err_msg.push("Classifier Name: Allowed string characters includes [0-9a-zA-Z_-]  between 0-200")

    }
    if (IamodelerWidget.state["classifier_name"] !== '' && !this.validator(IamodelerWidget.state["classifier_description"], 'string')) {
      err_msg.push("Classifier Desc: Allowed string characters includes [0-9a-zA-Z_-]  between 0-200")
    }
    if (IamodelerWidget.state["classifier_target"] === '' || !this.validator(IamodelerWidget.state["classifier_target"], 'string')) {
      err_msg.push("Classifier Traget: Allowed string characters includes [0-9a-zA-Z_-]  between 2-200")
    }
    //validate method in array
    var accepted_keywords: string[] = this.suppervised_classifiers;
    var keyword_check = accepted_keywords.some((accepted_keywords) =>
      IamodelerWidget.state["classifier_method"].includes(accepted_keywords));
    if (!keyword_check) {
      err_msg.push("Classifier Method: Invalid method")
    }
    if (!this.isValidURL(IamodelerWidget.state["classifier_file"])) {
      err_msg.push("Data file URL:Invalid file URL")
    }
    if (err_msg.length > 0) {
      for (var i = 0; i < err_msg.length; i++) {
        this.messageService.error(err_msg[i]);
      }
      return false;
    }
    //Generate modelID 
    this.generate_uuid()
    IamodelerWidget.state["model_id"] = this.model_uuid

    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    if (Configurations.AUTHORIZATION_REQUIRED) {
      myHeaders.append("Authorization", "Bearer " + IamodelerWidget.state.stateKeycloakToken);
    }

    
    var raw = JSON.stringify({
      "model-id": IamodelerWidget.state["model_id"],
      "source": {
        "type": "json",
        "id": IamodelerWidget.state["classifier_file"]
      },
      "target": IamodelerWidget.state["classifier_target"],
      "method": IamodelerWidget.state["classifier_method"],
      "scaling": {
        "method": "standard",
        "pars": {}
      },
      "model-config": {},
      "train-test-config": {
        "test_size": Number(IamodelerWidget.state["classifier_size"]),
        "shuffle": true,
        "random_state": 5,
        "full_refit": true
      },
      "timeout": 0
    }
    );

    //Create superviser model
    fetch(this.getHostURI() + "/supervised/classification", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then((response: any) => {
        return response.json()
      })
      .then((result: any) => {
        if (result.status === "ok") { this.messageService.info("The Supervised model using " + IamodelerWidget.state["classifier_method"] + " is created successfully") }
      })
      .catch((error: any) => {

        this.messageService.error("Unable to process request please try again and please make sure all fields are filled in correctly.")

        console.log('error', error)
      });


    //Delay to creat model on server
    var seconds = 4
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) { }

    //Get Model detail info
    var evall_url = this.getHostURI() + "/supervised/" + this.model_uuid + "/evaluate";
    fetch(evall_url, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    })
      .then((response: any) => {
        return response.json()
      })
      .then((result: any) => {
        var classifier_method = IamodelerWidget.state["classifier_method"];
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(this.DiaplayTrainedMLDesc(result, classifier_method, this.model_uuid))

        var selected = document.querySelectorAll('.after-buttons');
        selected[0].classList.add("show")
        selected[0].classList.remove("hidden");
        var input = document.getElementById("classify_delete");
        if (input) {
          input.focus();
        }
      })
      .catch((error: any) => console.log('error', error));

    //remove animate
    (document.getElementById("waitAnimation") as HTMLElement).style.display = "none";
  }


  DiaplayTrainedMLDesc(data: any, classifier_method: any, model_uuid: any) {

    var modelsInfoObj = new ModelsInfo();
    var model_info = modelsInfoObj.get_supervised_model_desc(classifier_method)
    return (
      <div id="widget_desc">
        <h2>Model Description</h2>
        <p>
          <strong> {model_info?.name}</strong>:
          {model_info?.Desc}
        </p>
        <h2>evaluation</h2>
        <table id="customers">
          <tr>
            <th>Accuracy</th>
            <th>Cohen kappa</th>
            <th>Matthews Phi</th>
          </tr>
          <tr>
            <td>{data.evaluation.Accuracy}</td>
            <td>{data.evaluation["Cohen kappa"]}</td>
            <td>{data.evaluation["Matthews Phi"]}</td>
          </tr>
        </table>
        <table id="customers">
          <tr>
            <th>metric</th>
            <th>micro</th>
            <th>macro</th>
            <th>weighted</th>
          </tr>
          <tr>
            <td>Precision</td>
            <td>{data.evaluation.Precision.micro}</td>
            <td>{data.evaluation.Precision.macro}</td>
            <td>{data.evaluation.Precision.weighted}</td>
          </tr>
          <tr>
            <td>Recall</td>
            <td>{data.evaluation.Recall.micro}</td>
            <td>{data.evaluation.Recall.macro}</td>
            <td>{data.evaluation.Recall.weighted}</td>
          </tr>
          <tr>
            <td>F1</td>
            <td>{data.evaluation.F1.micro}</td>
            <td>{data.evaluation.F1.macro}</td>
            <td>{data.evaluation.F1.weighted}</td>
          </tr>
        </table>
        <h2>Model predictions</h2>
        <span style={{ border: '1px solid #fff', display: 'block', padding: '15px' }}>
          Make predictions using an existing model <br />
          model id is: {model_uuid} <br />
          <pre>
            &#x63;&#x75;&#x72;&#x6c;&#x20;&#x2d;&#x58;&#x20;&#x27;&#x50;&#x4f;&#x53;&#x54;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x27;&#x68;&#x74;&#x74;&#x70;&#x3a;&#x2f;&#x2f;&#x76;&#x6d;&#x2d;&#x62;&#x69;&#x73;&#x69;&#x74;&#x65;&#x2d;&#x35;&#x37;&#x2e;&#x64;&#x65;&#x72;&#x2e;&#x75;&#x73;&#x61;&#x6c;&#x2e;&#x65;&#x73;&#x3a;&#x35;&#x30;&#x30;&#x31;&#x2f;&#x73;&#x6d;&#x61;&#x72;&#x74;&#x63;&#x6c;&#x69;&#x64;&#x65;&#x2f;&#x76;&#x31;&#x2f;&#x69;&#x61;&#x6d;&#x6f;&#x64;&#x65;&#x6c;&#x65;&#x72;&#x2f;&#x73;&#x75;&#x70;&#x65;&#x72;&#x76;&#x69;&#x73;&#x65;&#x64;&#x2f;&#x5b;&#x4d;&#x4f;&#x44;&#x45;&#x4c;&#x5f;&#x49;&#x44;&#x5d;&#x2f;&#x70;&#x72;&#x65;&#x64;&#x69;&#x63;&#x74;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x2d;&#x48;&#x20;&#x27;&#x61;&#x63;&#x63;&#x65;&#x70;&#x74;&#x3a;&#x20;&#x61;&#x70;&#x70;&#x6c;&#x69;&#x63;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x2f;&#x6a;&#x73;&#x6f;&#x6e;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x2d;&#x48;&#x20;&#x27;&#x43;&#x6f;&#x6e;&#x74;&#x65;&#x6e;&#x74;&#x2d;&#x54;&#x79;&#x70;&#x65;&#x3a;&#x20;&#x61;&#x70;&#x70;&#x6c;&#x69;&#x63;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x2f;&#x6a;&#x73;&#x6f;&#x6e;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x2d;&#x64;&#x20;&#x27;&#x7b;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x22;&#x64;&#x61;&#x74;&#x61;&#x22;&#x3a;&#x20;&#x5b;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x5b;&#x20;&#x46;&#x31;&#x31;&#x2c;&#x20;&#x2e;&#x2e;&#x2e;&#x2c;&#x20;&#x46;&#x31;&#x6e;&#x5d;&#x2c;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x5b;&#x2e;&#x2e;&#x2e;&#x5d;&#x2c;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x5b;&#x20;&#x46;&#x6d;&#x31;&#x2c;&#x2e;&#x2e;&#x2e;&#x2c;&#x46;&#x6d;&#x6e;&#x5d;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x5d;&#xa;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x20;&#x7d;&#x27;
          </pre>
        </span>
      </div>
    );
  }


  deleteModel(model_uuid: any, ia_type: any) {
    let path = ''
    if (ia_type == 'cluster') {
      path = 'unsupervised/clustering'
    } else {
      path = 'supervised'
    }
    let text = "Are you sure to delete this item?";
    if (confirm(text) == true) {

      var myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      if (Configurations.AUTHORIZATION_REQUIRED) {
        myHeaders.append("Authorization", "Bearer " + IamodelerWidget.state.stateKeycloakToken);
      }

      fetch(this.getHostURI() + "/" + path + "/" + model_uuid, {
        headers: myHeaders,
        method: "DELETE"
      }).then((response: any) => {
        return response.json()
      })
        .then((result: any) => {
          if (result.status === "ok") { this.messageService.info("Model deleted successfully") }
          else { this.messageService.info(result.message) }
        })
        .catch((error: any) => {
          this.messageService.error("Unable to process delete request please try again.")
        });
    }
  }

  downloadModel(model_uuid: any) {
    let text = "Download Machine learning Model in zip format!";
    if (confirm(text) == true) {

      var myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      if (Configurations.AUTHORIZATION_REQUIRED) {
        myHeaders.append("Authorization", "Bearer " + IamodelerWidget.state.stateKeycloakToken);
      }

      fetch(this.getHostURI() + "/supervised/" + model_uuid + "/export", {
        headers: myHeaders

      }).then(res => res.blob())
        .then(blob => {
          var file = window.URL.createObjectURL(blob);
          window.location.assign(file);
        }).catch((error: any) => {
          this.messageService.error("Download failed please try again later.")
        });

    }
  }


  //Regression
  regressorForm() {
    return (
      <div id="widget_form">
        <div id="result_" className='ia'>
          {/* <fieldset>
            <legend>Name</legend>
            <div className="tooltip">    <label htmlFor='name'>Name*:</label>
              <span className="tooltiptext">Allowed string characters includes [0-9a-zA-Z_-]</span>
            </div>
            <input id="regressor_name" name="regressor_name" onChange={this.updateInput} />
            <div className="tooltip">     <label htmlFor='regressor_description'>Description*:</label>
              <span className="tooltiptext">Allowed string characters includes [0-9a-zA-Z_-]</span>
            </div>
            <textarea id='regressor_description' name='regressor_description' onChange={this.updateInput} rows={4} cols={50} />
          </fieldset> */}

          <fieldset>
            <legend>Data Source</legend>
            <div className="tooltip">    <label htmlFor='regressor_file'>File*: <span className="hint__circle">?</span></label>
              <span className="tooltiptext">Allowed file URL, like iris dataset URL:'https://raw.githubusercontent.com/domoritz/maps/master/data/iris.json'</span>
            </div>
            <input type="text" onChange={this.updateInput} id="regressor_file" name="regressor_file" />
          </fieldset>

          <fieldset>
            <legend>Target</legend>
            <div className="tooltip">    <label htmlFor='regressor_target'>Target feature*: <span className="hint__circle">?</span></label>
              <span className="tooltiptext">Target field which is data label like: species in iris dataset'</span>
            </div>
            <input id="regressor_target" name="regressor_target" onChange={this.updateInput} />
          </fieldset>

          <fieldset>
            <legend>Method*</legend>
            <input type="radio" id="regressor_extra_trees" name="regressor_method" value="extra-trees" onChange={this.updateInput} />
            <label htmlFor='regressor_extra_trees'>Extra trees</label><br />
            <input type="radio" id="regressor_Random_forest" name="regressor_method" value="random-forest" onChange={this.updateInput} />
            <label htmlFor='regressor_Random_forest'>Random forest</label><br />
            <input type="radio" id="regressor_Gradient_boosting" name="regressor_method" value="gradient-boosting" onChange={this.updateInput} />
            <label htmlFor='regressor_Gradient_boosting'>Gradient boosting</label><br />
            <input type="radio" id="regressor_linear" name="regressor_method" value="linear" onChange={this.updateInput} />
            <label htmlFor='regressor_linear'>Linear</label><br />
            <input type="radio" id="regressor_Multi_layer_perceptron" name="regressor_method" value="mlp" onChange={this.updateInput} />
            <label htmlFor='regressor_Multi_layer_perceptron'>Multi-layer perceptron	</label><br />
            <input type="radio" id="regressor_K_nearest_neighbors" name="regressor_method" value="neighbors" onChange={this.updateInput} />
            <label htmlFor='regressor_K_nearest_neighbors'>K-nearest neighbors</label><br />
            <input type="radio" id="regressor_Support_vector" name="regressor_method" value="sv" onChange={this.updateInput} />
            <label htmlFor='regressor_Support_vector'>Support vector</label><br />
            <input type="radio" id="regressor_Decision_tree" name="regressor_method" value="tree" onChange={this.updateInput} />
            <label htmlFor='regressor_Decision_tree'>Decision tree</label>
          </fieldset>

          <fieldset>
            <legend>Training and Testing</legend>
            <div className="tooltip">    <label htmlFor='classifier_size'>Test size*: <span className="hint__circle">?</span></label>
              <span className="tooltiptext">The train-test input indicate test/train split for evaluating the model performance. It should be between 0.0 and 1.0 and represent the percentage of the dataset to test split. </span>
            </div>
            <input id="size" name="regressor_size" onChange={this.updateInput} />
          </fieldset>
          <button onClick={() => this.regressoion()} className='button-model-large'>
            Submit <span id='waitAnimation' className="lds-dual-ring" ></span>
          </button>


          {/* <input type="submit" value="Submit" onClick={() => this.regressoion()}></input> */}
          <div className="hidden regressor-after-buttons">
            <input value="Dlete model" id='regressor_delete' onClick={() => this.deleteModel(IamodelerWidget.state["model_id"], 'regressor')} type="submit" className='button-model' />
            <input value="Download model" onClick={() => this.downloadModel(IamodelerWidget.state["model_id"])} type="submit" className='button-model' />
          </div>
        </div>
      </div>
    )
  }
  regressoion() {

    var err_msg = []
    //Input validation
    if (!this.validator(IamodelerWidget.state["regressor_size"], 'number') || Number(IamodelerWidget.state["regressor_size"]) < 0 || Number(IamodelerWidget.state["regressor_size"]) > 1) {
      err_msg.push("Training and Testing: must be float number between 0-1")
    }
    if (IamodelerWidget.state["regressor_name"] === '') {
      IamodelerWidget.state["regressor_name"] = 'regressor_model_' + this.getRandomInt(1, 100000)
    } else if (!this.validator(IamodelerWidget.state["regressor_name"], 'string')) {
      err_msg.push("Regressor Name: Allowed string characters includes [0-9a-zA-Z_-]  between 0-200")

    }
    if (IamodelerWidget.state["regressor_description"] !== '' && !this.validator(IamodelerWidget.state["regressor_description"], 'string')) {
      err_msg.push("Regressor Desc: Allowed string characters includes [0-9a-zA-Z_-]  between 2-200")
    }
    if (IamodelerWidget.state["regressor_target"] === '' || !this.validator(IamodelerWidget.state["regressor_target"], 'string')) {
      err_msg.push("Regressor Traget: Allowed string characters includes [0-9a-zA-Z_-]  between 2-200")
    }
    //validate method in array
    var accepted_keywords: string[] = this.suppervised_regressor;
    var keyword_check = accepted_keywords.some((accepted_keywords) =>
      IamodelerWidget.state["regressor_method"].includes(accepted_keywords));
    if (!keyword_check) {
      err_msg.push("Regressor Method: Invalid method")
    }
    //check file URL
    if (!this.isValidURL(IamodelerWidget.state["regressor_file"])) {
      err_msg.push("Data file URL:Invalid file URL")
    }
    if (err_msg.length > 0) {
      for (var i = 0; i < err_msg.length; i++) {
        this.messageService.error(err_msg[i]);
      }
      return false;
    }

    //Generate modelID and show the model INfO
    this.generate_uuid()

    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    if (Configurations.AUTHORIZATION_REQUIRED) {
      myHeaders.append("Authorization", "Bearer " + IamodelerWidget.state.stateKeycloakToken);
    }

    var raw = JSON.stringify({
      "model-id": this.model_uuid,
      "source": {
        "type": "json",
        "id": IamodelerWidget.state["regressor_file"]
      },
      "target": IamodelerWidget.state["regressor_target"],
      "method": IamodelerWidget.state["regressor_method"],
      "scaling": {
        "method": "standard",
        "pars": {}
      },
      "model-config": {},
      "train-test-config": {
        "test_size": Number(IamodelerWidget.state["regressor_size"]),
        "shuffle": true,
        "random_state": 5,
        "full_refit": true
      },
      "timeout": 0
    }

    );
    IamodelerWidget.state["model_id"] = this.model_uuid
    fetch(this.getHostURI() + "/supervised/regression", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then((response: any) => {
        return response.json()
      })
      .then((result: any) => {
        if (result.status === "ok") { this.messageService.info("The Supervised model using " + IamodelerWidget.state["regressor_method"] + " is created successfully") }
      })
      .catch((error: any) => {

        this.messageService.error("Unable to process request please try again and please make sure all fields are filled in correctly.")
        console.log('error', error)
      });


    //delay to creat model on server
    var seconds = 4
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) { }

    var evall_url = this.getHostURI() + "/supervised/" + this.model_uuid + "/evaluate";
    fetch(evall_url, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    })
      .then((response: any) => {
        return response.json()
      })
      .then((result: any) => {
        var classifier_method = IamodelerWidget.state["regressor_method"];
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(this.DiaplayTrainedMLDesc(result, classifier_method, this.model_uuid))

        var selected = document.querySelectorAll('.regressor-after-buttons');
        selected[0].classList.add("show")
        selected[0].classList.remove("hidden");
        var input = document.getElementById("regressor_delete");
        if (input) {
          input.focus();
        }
      })
      .catch((error: any) => console.log('error', error));

  }


  clusteringForm() {
    return (
      <div id="widget_form">
        <div id="result_" className='ia'>
          {/* <fieldset>
            <legend>Name</legend>
            <div className="tooltip">    <label htmlFor='cluster_name'>Name*:</label>
              <span className="tooltiptext">Allowed string characters includes [0-9a-zA-Z_-]</span>
            </div>
            <input id="cluster_name" name="cluster_name" onChange={this.updateInput} />
            <div className="tooltip">     <label htmlFor='cluster_description'>Description*:</label>
              <span className="tooltiptext">Allowed string characters includes [0-9a-zA-Z_-]</span>
            </div>
            <textarea id='cluster_description' name='cluster_description' onChange={this.updateInput} rows={4} cols={50} />
          </fieldset> */}
          <fieldset>
            <legend>Data Source</legend>

            <div className="tooltip"> <label htmlFor='cluster_file'>File*: <span className="hint__circle">?</span></label>
              <span className="tooltiptext">Allowed file URL, like iris dataset URL:'https://raw.githubusercontent.com/domoritz/maps/master/data/iris.json'</span>
            </div>

            <input type="text" id="cluster_file" name="cluster_file" onChange={this.updateInput} />
          </fieldset>
          <fieldset>
            <legend>Method</legend>
            {/* <input type="radio" id="DB_Scan" name="cluster_method" value="dbscan" onChange={this.updateInput} />
            <label htmlFor='DB_Scan'>DB Scan</label><br /> */}
            <input type="radio" id="K_Means" name="cluster_method" value="kmeans" onChange={this.updateInput} />
            <label htmlFor='K_Means'>K-Means</label><br />
          </fieldset>

          <fieldset>
            <legend>Cluster number</legend>
            <div className="tooltip">    <label htmlFor='cluster_label_number'>Clusters*: <span className="hint__circle">?</span></label>
              <span className="tooltiptext">K-Means aims to partition data with  n data row into k (≤ n) clusters. This field indicate k which is number of clusters.</span>
            </div>
            <input id="cluster_label_number" name="cluster_label_number" onChange={this.updateInput} />
          </fieldset>
          {/* <input type="submit" value="Submit" onClick={() => this.cluster()}></input> */}
          <button onClick={() => this.classify()} className='button-model-large'>
            Submit <span id='waitAnimation' className="lds-dual-ring" ></span>
          </button>

          <div className="hidden cluster-after-buttons">
            <input value="Dlete model" id='cluster_delete' onClick={() => this.deleteModel(IamodelerWidget.state["model_id"], 'cluster')} type="submit" className='button-model' />
            {/* <input value="Download model" onClick={() => this.downloadModel(IamodelerWidget.state["model_id"])} type="submit" className='button-model' /> */}
          </div>
        </div>
      </div >
    );
  }

  cluster() {

    var err_msg = []
    ////Input validation
    if (IamodelerWidget.state["cluster_name"] === '') {
      IamodelerWidget.state["cluster_name"] = 'cluster_model_' + this.getRandomInt(1, 100000)
    } else if (!this.validator(IamodelerWidget.state["cluster_name"], 'string')) {
      err_msg.push("Classifier Name: Allowed string characters includes [0-9a-zA-Z_-]  between 0-200")
    }

    if (IamodelerWidget.state["cluster_description"] !== '' && !this.validator(IamodelerWidget.state["cluster_description"], 'string')) {
      err_msg.push("Classifier Desc: Allowed string characters includes [0-9a-zA-Z_-]  between 0-200")
    }

    var accepted_keywords: string[] = ['kmeans', 'dbscan'];
    var keyword_check = accepted_keywords.some((accepted_keywords) =>
      IamodelerWidget.state["cluster_method"].includes(accepted_keywords));
    if (!keyword_check) {
      err_msg.push("Clustering Method: Invalid method")
    }
    if (!this.isValidURL(IamodelerWidget.state["cluster_file"])) {
      err_msg.push("Data file URL:Invalid file URL")
    }
    if (!this.validator(IamodelerWidget.state["cluster_label_number"], 'number')) {
      err_msg.push("Clusters: must be number")
    }
    if (err_msg.length > 0) {
      for (var i = 0; i < err_msg.length; i++) {
        this.messageService.error(err_msg[i]);
      }
      return false;
    }

    //Generate modelID and show the model INfO
    this.generate_uuid()
    IamodelerWidget.state["model_id"] = this.model_uuid


    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    if (Configurations.AUTHORIZATION_REQUIRED) {
      myHeaders.append("Authorization", "Bearer " + IamodelerWidget.state.stateKeycloakToken);
    }

    var raw = JSON.stringify({
      "model-id": IamodelerWidget.state["model_id"],
      "source": {
        "type": "json",
        "id": IamodelerWidget.state["cluster_file"]
      },
      "method": IamodelerWidget.state["cluster_method"],
      "config": {
        "n_clusters": Number(IamodelerWidget.state["cluster_label_number"]),
        "init": "k-means++",
        "n_init": 10,
        "max_iter": 300,
        "tol": 0.0001,
        "random_state": 5
      },
      "knn-pars": {
        "n_neighbors": 5,
        "weight": "5",
        "algorithm": "5",
        "leaf_size": 30,
        "p": 2,
        "metric": "minkowski"
      }

    }
    );
    //Create model
    fetch(this.getHostURI() + "/unsupervised/clustering", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then((response: any) => {
        return response.json()
      })
      .then((result: any) => {
        if (result.status === "ok") { this.messageService.info("The Unupervised model using " + IamodelerWidget.state["cluster_method"] + " is created successfully.") }
        var selected = document.querySelectorAll('.cluster-after-buttons');
        selected[0].classList.add("show")
        selected[0].classList.remove("hidden");
        var input = document.getElementById("cluster_delete");
        if (input) {
          input.focus();
        }

      })
      .catch((error: any) => {

        this.messageService.error("Unable to process request please try again and please make sure all fields are filled in correctly.")

        console.log('error', error)
      });


    //Delay to creat model on server
    var seconds = 4
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) { }

    //Get Model info
    var evall_url = this.getHostURI() + "/unsupervised/clustering/" + this.model_uuid + "/labels";
    fetch(evall_url, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    })
      .then((response: any) => {
        return response.json()
      })
      .then((result: any) => {
        var cluster_method = IamodelerWidget.state["cluster_method"]
        console.log(IamodelerWidget.state["cluster_method"]);
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(this.DiaplayTrainedclusterMLDesc(result, cluster_method, this.model_uuid, Number(IamodelerWidget.state["cluster_label_number"])))

        var selected = document.querySelectorAll('.after-buttons');
        selected[0].classList.add("show")
        selected[0].classList.remove("hidden");
        var input = document.getElementById("classify_delete");
        if (input) {
          input.focus();
        }
      })
      .catch((error: any) => console.log('error', error));
  }


  DiaplayTrainedclusterMLDesc(data: any, cluster_method: any, model_uuid: any, cluster_number: any) {
    var labels: any;
    var cluster_labeles = ''
    var modelsInfoObj = new ModelsInfo();
    var model_info = modelsInfoObj.get_un_supervised_model_desc(cluster_method)
    try {
      if (data.labels) {
        cluster_labeles = "The cluster model provided folowing labels for data which is clustered in " + String(cluster_number) + " cluster."
      }
    } catch (e: any) {
      console.log(e)
      cluster_labeles = ''
      labels = ''
      // code that handles the error

    }
    console.log(labels)
    return (
      <div id="widget_desc">
        <h2>Model Description</h2>
        <p>
          <strong> {model_info?.name}</strong>:
          {model_info?.Desc}
        </p>
        <h2>Cluster Information</h2>
        {cluster_labeles}
        <h2>Batch Predictions</h2>
        <span style={{ border: '1px solid #fff', display: 'block', padding: '15px' }}>
          Make batch predictions using an existing clustering <br />
          model id is: {model_uuid} <br />
          <pre>
            &#x63;&#x75;&#x72;&#x6c;&#x20;&#x2d;&#x58;&#x20;&#x27;&#x50;&#x4f;&#x53;&#x54;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x27;&#x68;&#x74;&#x74;&#x70;&#x3a;&#x2f;&#x2f;&#x76;&#x6d;&#x2d;&#x62;&#x69;&#x73;&#x69;&#x74;&#x65;&#x2d;&#x35;&#x37;&#x2e;&#x64;&#x65;&#x72;&#x2e;&#x75;&#x73;&#x61;&#x6c;&#x2e;&#x65;&#x73;&#x3a;&#x35;&#x30;&#x30;&#x31;&#x2f;&#x73;&#x6d;&#x61;&#x72;&#x74;&#x63;&#x6c;&#x69;&#x64;&#x65;&#x2f;&#x76;&#x31;&#x2f;&#x69;&#x61;&#x6d;&#x6f;&#x64;&#x65;&#x6c;&#x65;&#x72;&#x2f;&#x75;&#x6e;&#x73;&#x75;&#x70;&#x65;&#x72;&#x76;&#x69;&#x73;&#x65;&#x64;&#x2f;&#x63;&#x6c;&#x75;&#x73;&#x74;&#x65;&#x72;&#x69;&#x6e;&#x67;&#x2f;&#x5b;&#x4d;&#x4f;&#x44;&#x45;&#x4c;&#x5f;&#x49;&#x44;&#x5d;&#x2f;&#x62;&#x61;&#x74;&#x63;&#x68;&#x2d;&#x70;&#x72;&#x65;&#x64;&#x69;&#x63;&#x74;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x2d;&#x48;&#x20;&#x27;&#x61;&#x63;&#x63;&#x65;&#x70;&#x74;&#x3a;&#x20;&#x61;&#x70;&#x70;&#x6c;&#x69;&#x63;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x2f;&#x6a;&#x73;&#x6f;&#x6e;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x2d;&#x48;&#x20;&#x27;&#x43;&#x6f;&#x6e;&#x74;&#x65;&#x6e;&#x74;&#x2d;&#x54;&#x79;&#x70;&#x65;&#x3a;&#x20;&#x61;&#x70;&#x70;&#x6c;&#x69;&#x63;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x2f;&#x6a;&#x73;&#x6f;&#x6e;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x2d;&#x64;&#x20;&#x27;&#x7b;&#xa;&#x20;&#x20;&#x22;&#x73;&#x6f;&#x75;&#x72;&#x63;&#x65;&#x22;&#x3a;&#x20;&#x7b;&#xa;&#x20;&#x20;&#x20;&#x20;&#x22;&#x74;&#x79;&#x70;&#x65;&#x22;&#x3a;&#x20;&#x22;&#x6a;&#x73;&#x6f;&#x6e;&#x22;&#x2c;&#xa;&#x20;&#x20;&#x20;&#x20;&#x22;&#x69;&#x64;&#x22;&#x3a;&#x20;&#x22;&#x5b;&#x46;&#x49;&#x4c;&#x45;&#x5d;&#x22;&#xa;&#x20;&#x20;&#x7d;&#x2c;&#xa;&#x20;&#x20;&#x22;&#x66;&#x65;&#x61;&#x74;&#x75;&#x72;&#x65;&#x2d;&#x6d;&#x61;&#x70;&#x70;&#x69;&#x6e;&#x67;&#x22;&#x3a;&#x20;&#x5b;&#xa;&#x20;&#x20;&#x20;&#x20;&#x66;&#x31;&#x2c;&#x20;&#x2e;&#x2e;&#x2e;&#x2c;&#x20;&#x66;&#x6e;&#x20;&#x20;&#x5d;&#xa;&#x7d;&#x27;
          </pre>
        </span>
        <h2>Get the labels</h2>
        <span style={{ border: '1px solid #fff', display: 'block', padding: '15px' }}>
          Get the labels of a clustering<br />
          model id is: {model_uuid} <br />
          <pre>
            &#x63;&#x75;&#x72;&#x6c;&#x20;&#x2d;&#x58;&#x20;&#x27;&#x47;&#x45;&#x54;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x27;&#x68;&#x74;&#x74;&#x70;&#x3a;&#x2f;&#x2f;&#x76;&#x6d;&#x2d;&#x62;&#x69;&#x73;&#x69;&#x74;&#x65;&#x2d;&#x35;&#x37;&#x2e;&#x64;&#x65;&#x72;&#x2e;&#x75;&#x73;&#x61;&#x6c;&#x2e;&#x65;&#x73;&#x3a;&#x35;&#x30;&#x30;&#x31;&#x2f;&#x73;&#x6d;&#x61;&#x72;&#x74;&#x63;&#x6c;&#x69;&#x64;&#x65;&#x2f;&#x76;&#x31;&#x2f;&#x69;&#x61;&#x6d;&#x6f;&#x64;&#x65;&#x6c;&#x65;&#x72;&#x2f;&#x75;&#x6e;&#x73;&#x75;&#x70;&#x65;&#x72;&#x76;&#x69;&#x73;&#x65;&#x64;&#x2f;&#x63;&#x6c;&#x75;&#x73;&#x74;&#x65;&#x72;&#x69;&#x6e;&#x67;&#x2f;&#x5b;&#x4d;&#x4f;&#x44;&#x45;&#x4c;&#x5f;&#x49;&#x44;&#x5d;&#x2f;&#x6c;&#x61;&#x62;&#x65;&#x6c;&#x73;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x2d;&#x48;&#x20;&#x27;&#x61;&#x63;&#x63;&#x65;&#x70;&#x74;&#x3a;&#x20;&#x61;&#x70;&#x70;&#x6c;&#x69;&#x63;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x2f;&#x6a;&#x73;&#x6f;&#x6e;&#x27;
          </pre>
        </span>
        <h2>predictions</h2>
        <span style={{ border: '1px solid #fff', display: 'block', padding: '15px' }}>
          Make predictions using an existing clustering<br />
          model id is: {model_uuid} <br />
          <pre>
            &#x63;&#x75;&#x72;&#x6c;&#x20;&#x2d;&#x58;&#x20;&#x27;&#x50;&#x4f;&#x53;&#x54;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x27;&#x68;&#x74;&#x74;&#x70;&#x3a;&#x2f;&#x2f;&#x76;&#x6d;&#x2d;&#x62;&#x69;&#x73;&#x69;&#x74;&#x65;&#x2d;&#x35;&#x37;&#x2e;&#x64;&#x65;&#x72;&#x2e;&#x75;&#x73;&#x61;&#x6c;&#x2e;&#x65;&#x73;&#x3a;&#x35;&#x30;&#x30;&#x31;&#x2f;&#x73;&#x6d;&#x61;&#x72;&#x74;&#x63;&#x6c;&#x69;&#x64;&#x65;&#x2f;&#x76;&#x31;&#x2f;&#x69;&#x61;&#x6d;&#x6f;&#x64;&#x65;&#x6c;&#x65;&#x72;&#x2f;&#x75;&#x6e;&#x73;&#x75;&#x70;&#x65;&#x72;&#x76;&#x69;&#x73;&#x65;&#x64;&#x2f;&#x63;&#x6c;&#x75;&#x73;&#x74;&#x65;&#x72;&#x69;&#x6e;&#x67;&#x2f;&#x5b;&#x4d;&#x4f;&#x44;&#x45;&#x4c;&#x5f;&#x49;&#x44;&#x5d;&#x2f;&#x70;&#x72;&#x65;&#x64;&#x69;&#x63;&#x74;&#x73;&#x27;&#x20;&#x5c;&#xa;&#x20;&#x20;&#x2d;&#x48;&#x20;&#x27;&#x61;&#x63;&#x63;&#x65;&#x70;&#x74;&#x3a;&#x20;&#x61;&#x70;&#x70;&#x6c;&#x69;&#x63;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x2f;&#x6a;&#x73;&#x6f;&#x6e;&#x27;
          </pre>
        </span>
      </div>
    )
  }



  updateInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const key = e.currentTarget.name as keyof typeof IamodelerWidget.state;
    IamodelerWidget.state[key] = e.currentTarget.value;
  }
  displayContent(item: string) {
    var items = document.querySelectorAll(".form-widget");
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add("hidden")
    }
    var selected = document.querySelectorAll('.form-widget.' + item);
    if (selected) {
      if (selected[0].classList.contains("show")) {
        selected[0].classList.add("hidden");
        selected[0].classList.remove("show");
      } else {
        selected[0].classList.add("show")
        selected[0].classList.remove("hidden");
      }
    }
  }

  displayContents(item: string) {
    return (
      <button
        onClick={() => {
          console.log("test");
        }}
      >
        Button
      </button>
    );
  }

  displayMenu(e: any) {
    // Declare all variables
    var i, tablinks, j = 0;
    var menuItem = e.target.value;
    var tab_ids = ["classification", "clustering"]
    // Get all elements with class="tabcontent" and hide them
    if (menuItem == "classification") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("classification", ""));

    } else if (menuItem == "clustering") {
      for (j = 0; j < tab_ids.length; j++) {
        (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
      }
      (document.getElementById("widget_desc") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("clustering", ""));

    }

    // Get all elements with class="tablinks" and remove the class "active"
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

  isValidURL(url: any) {
    var regex = "((http|https)://)(www.)?" +
      "[a-zA-Z0-9@:%._\\+~#?&//=]" +
      "{2,256}\\.[a-z]" +
      "{2,6}\\b([-a-zA-Z0-9@:%" +
      "._\\+~#?&//=]*)";

    if (!url.match(regex)) {
      return false;
    }
    return true;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }


}
