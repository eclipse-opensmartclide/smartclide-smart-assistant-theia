
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


function DiaplayWidgetDesc(module: string) {
  console.log(React)
  var widgetInfo =
  {
    name: "Smart Assistant",
    description: "The DLE has brought together the AI-based features within one package.  This component follows IDE goals which are to increase development speed and reduce errors while service development.  This component has exposed DLE functionality and data using REST API. Outputs of subcomponents, including proposed model results, some models running continuously in the background, and others using an interface to provide their functionality."
  }
  var tip = "Please Select a target functinality inorder get more detail on their usage."

  if (module == 'deploy_recomm') {
    widgetInfo =
    {
      name: "Service Deployments Recommendations",
      description: "The resource estimation system has been designed within the formal framework of fuzzy inference systems (FIS). In this case, the aim is to capture the common relationships, understandable to human experts in this field, in rules of a mathematical nature that take into account the uncertainty intrinsic to the natural language. In other words,  this functionality is responsible for giving suggestions to the user about the expected size of the deployment environment for the service being developed. "
    }
    var tip = ""

  } else if (module == "template_gen") {
    widgetInfo =
    {
      name: "Template based code generation",
      description: "This subcomponent is responsible for generating code based on internal templates. The API returns related code snippets based on templates to implement the workflow represented in BPMN in low code."
    }
    var tip = ""

  } else if (module == "code_repo") {
    var widgetInfo =
    {
      name: "Code repository suggestions",
      description: "This wizard is responsible for generating suggestions to the user to facilitate commits to the git repository. Receiving information from the Context Handling component, and with the help of the DLE, it will determine the best time to commit to the git repository. "
    }
    var tip = ""

  } else if (module == "search_url") {
    var widgetInfo =
    {
      name: "Search URLs",
      description: "This wizard is responsible for providing service URLs of well-known providers like Google. These URLs are extracted from open-source projects which have called these URLs with associated params. "
    }
    var tip = ""

  } else if (module == "search_packages") {
    var widgetInfo =
    {
      name: "Search Packages",
      description: "This feature is responsible for searching GitHub Packages, including containers and other dependencies."
    }
    var tip = ""

  }


  return (

    <div id="widget_desc">
      <h2>{widgetInfo.name}</h2>
      <p>{widgetInfo.description}</p>
      <div id="result_" >
        <p>{tip}</p>
      </div>
    </div>
  );
}


export default DiaplayWidgetDesc;