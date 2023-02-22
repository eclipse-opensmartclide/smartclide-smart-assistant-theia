# Smart-assistant Theia extension
The Smart-assistant has brought together the AI-based features within one package using AI techniques. This component follows IDE goals which are to increase development speed and reduce errors while service development. The component features have exposed DLE functionality and data using REST API. Outputs of subcomponents, including proposed model results, This extension provide interface for using model and some models running continuously in the background as plugins.

## Featuers

- *Template-based code generation* :   This subcomponent is responsible for generating code based on internal templates. The API returns related code snippets based on templates to implement the workflow represented in BPMN in low code. To test the code generation functionality using BPMN, the BPMN sample file is located in the [sample_files/sample_template](https://github.com/eclipse-opensmartclide/smartclide-smart-assistant-theia/tree/main/smart-assistant/smart-assistant/sample_files), which can be uploaded in the template code generation section to generate sample code.  
- *Acceptance tests recommendation*: The acceptance test set suggestion system, based on collaborative filtering techniques, is responsible for providing the user with a set of tests defined in Gherkin format to be applied to the workflow defined in the BPMN and help verify if the expectations are met. To test the Acceptance tests recommendation functionality using BPMN, the BPMN sample file is located in the [sample_files/sample_acceptance](https://github.com/eclipse-opensmartclide/smartclide-smart-assistant-theia/tree/main/smart-assistant/smart-assistant/sample_files) directory, which can be uploaded in the Acceptance tests recommendation section to generate recommendation in genkens format. The resulting list may have no recommendations for all requests, depending on the DLE decision.
- *Service deployments recommendations* : The resource estimation system has been designed within the formal framework of fuzzy inference systems (FIS). In this case, the aim is to capture the common relationships, understandable to human experts in this field, in rules of a mathematical nature that take into account the uncertainty intrinsic to the natural language. In other words,  this functionality is responsible for giving suggestions to the user about the expected size of the deployment environment for the service being developed. If the selected service environment information has not been assigned, then the deployments recommendations argument will be the default deployments list information.
- *Search APIs of most common web service providers APIs(e.g., Google)* : This wizard is responsible for providing service URLs of well-known providers like Google(e.g.,  YouTube Data API, Google Maps ). These URLs are extracted from open-source projects using code-mining techniques. 
- *Search APIs of most common web service providers APIs(e.g., Google)* : This wizard is responsible for providing service URLs of well-known providers like Google(e.g.,  YouTube Data API, Google Maps ). These URLs are extracted from open-source projects using code-mining techniques. 
- *Search Packages* : This feature is responsible for searching GitHub Packages, including containers and other dependencies.
 



## Getting started

Please install all necessary [prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

## Running the browser example

    yarn start:browser

*or:*

    yarn rebuild:browser
    cd browser-app
    yarn start

*or:* launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.

## Running the Electron example

    yarn start:electron

*or:*

    yarn rebuild:electron
    cd electron-app
    yarn start

*or:* launch `Start Electron Backend` configuration from VS code.


## Running the tests

    yarn test

*or* run the tests of a specific package with

    cd smart-assistant
    yarn test


## Developing with the browser example

Start watching all packages, including `browser-app`, of your application with

    yarn watch

*or* watch only specific packages with

    cd smart-assistant
    yarn watch

and the browser example.

    cd browser-app
    yarn watch

Run the example as [described above](#Running-the-browser-example)
## Developing with the Electron example

Start watching all packages, including `electron-app`, of your application with

    yarn watch

*or* watch only specific packages with

    cd smart-assistant
    yarn watch

and the Electron example.

    cd electron-app
    yarn watch

Run the example as [described above](#Running-the-Electron-example)

## Publishing smart-assistant

Create a npm user and login to the npm registry, [more on npm publishing](https://docs.npmjs.com/getting-started/publishing-npm-packages).

    npm login

Publish packages with lerna to update versions properly across local packages, [more on publishing with lerna](https://github.com/lerna/lerna#publish).

    npx lerna publish
