# SmartCLIDE Theia Extension/Plugins
The Smart-assistant has brought together the AI-based features within one package using AI techniques.

- [ Smart-assistant Theia Extension](#smart-assistant-theia-extension-featuers)
- [AIModeler Theia Extension](#iamodeler-theia-extension)


# Smart-assistant Theia Extension
 This component follows IDE goals which are to increase development speed and reduce errors while servicing development. The component features have exposed DLE functionality and data using REST API. Outputs of subcomponents, including proposed model results; these extensions provide interfaces for using a model and some models running continuously in the background as plugins.
 
 ### Features
 
- *Template-based code generation* :   This subcomponent is responsible for generating code based on internal templates. The API returns related code snippets based on templates to implement the workflow represented in BPMN in low code. To test the code generation functionality using BPMN, the BPMN sample file is located in the file_sample directory, which can be uploaded in the template code generation section to generate sample code.  
- *Service deployments recommendations* : The resource estimation system has been designed within the formal framework of fuzzy inference systems (FIS). In this case, the aim is to capture the common relationships, understandable to human experts in this field, in rules of a mathematical nature that take into account the uncertainty intrinsic to the natural language. In other words,  this functionality is responsible for giving suggestions to the user about the expected size of the deployment environment for the service being developed. If the selected service environment information has not been assigned, then the deployments recommendations argument will be the default deployments list information.
- *Search APIs of most common web service providers APIs(e.g., Google)* : This wizard is responsible for providing service URLs of well-known providers like Google(e.g.,  YouTube Data API, Google Maps ). These URLs are extracted from open-source projects using code-mining techniques. 
- *Search APIs of most common web service providers APIs(e.g., Google)* : This wizard is responsible for providing service URLs of well-known providers like Google(e.g.,  YouTube Data API, Google Maps ). These URLs are extracted from open-source projects using code-mining techniques. 
- *Search Packages* : This feature is responsible for searching GitHub Packages, including containers and other dependencies.

# IAModeler Theia Extension 
This subcomponent tries to provide low-code concepts in creating machine learning models. Therefore, it provides levels of abstraction to reduce complexity in building Machine Learning (ML) models. In this approach, the sequence of machine learning tasks can be defined by a developer via an interface. Afterward, the subcomponent will use computational algorithms to turn user data into usable learning supervised or unsupervised models. Therefore, non-expert developers in scientific data fields can invest much more time into their domain problem and software business logic rather than writing machine learning concepts. The provided subtasks in these subcomponents are:1) Importing and preprocessing data, 2) Creating a supervised model based on regression or classification Model, 3) Performing prediction based on user input, and 4) Providing validation metrics results which can be used for visualization. These abilities are available on “http://<SmartCLIDE-host>/iamodeler”.

 ### Features
 
- *Supervised Learning* :  This section allows developers to use artificial intelligence techniques to classify or predict depending on their requirements.
- *Unsupervised learning* : This section allows developers to use artificial intelligence techniques to analyze and cluster unlabeled datasets.

# Autocomplete VS Extension 
AI-based autocomplete-code VS code extension is a functionality that provides SmartCLIDE service code completion using API Restful interface that handles the Auto-complete model's input and output. The auto-complete model is one of the trained models in the DLE component. This VS code extension is configured to suggest on the '.' character pressed. Moreover, code suggestions can be offered by pressing ctrl + space.


