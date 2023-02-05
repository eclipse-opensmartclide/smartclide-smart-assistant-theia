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
// import DiaplayMLTABLE from "./models_info";


function DiaplayWidgetDesc(module: string, id: any) {
  var widgetInfo =
  {
    name: "IA Modeler",
    description: "This component tries to provide low-code concepts for creating machine learning models. It provides levels of abstraction to reduce complexity in building (ML) models. In this approach, the sequence of machine learning tasks can be defined by a developer via an interface. Afterward, the component will use computational algorithms to turn user data into supervised or unsupervised learning models. Hence, non-expert developers in scientific data fields can invest much more time into the problem domain rather than writing machine learning concepts."
  }
  var tip = ""
  if (module == 'classification') {
    widgetInfo =
    {
      name: "Supervised Learning",
      description: "This section allows developers to use artificial intelligence techniques to classify or predict depending on their requirements."
    }
    var tip = ""

    return (

      <div id="widget_desc">
        <h2>{widgetInfo.name}</h2>
        <p>{widgetInfo.description}</p>
        <div id="result_" >
          <p>{tip}</p>
          <table id="customers">
            <thead>
              <tr>
                <th >Name</th>
                <th >Description</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td >Random forest</td>
                <td>Random forest, like its name implies, consists of a large number of individual decision trees that operate as an ensemble. Each individual tree in the random forest spits out a class prediction and the class with the most votes becomes our model’s prediction.</td>
              </tr>
              <tr >
                <td >Gradient boosting</td>
                <td>Gradient boosting is a machine learning technique for regression and classification problems, which produces a prediction model in the form of an ensemble of weak prediction models, typically decision trees. It builds the model in a stage-wise fashion like other boosting methods do, and it generalizes them by allowing optimization of an arbitrary differentiable loss function.</td>
              </tr>
              <tr >
                <td >Logistic regression</td>
                <td>The logistic model (or logit model) is used to model the probability of a certain class or event existing such as pass/fail, win/lose, alive/dead or healthy/sick. This can be extended to model several classes of events such as determining whether an image contains a cat, dog, lion, etc... Each object being detected in the image would be assigned a probability between 0 and 1 and the sum adding to one.</td>
              </tr>
              <tr >
                <td >Multi-layer perceptron</td>
                <td>A multilayer perceptron (MLP) is a class of feedforward artificial neural network. An MLP consists of at least three layers of nodes: an input layer, a hidden layer and an output layer. Except for the input nodes, each node is a neuron that uses a nonlinear activation function. MLP utilizes a supervised learning technique called backpropagation for training. Its multiple layers and non-linear activation distinguish MLP from a linear perceptron. It can distinguish data that is not linearly separable.</td>
              </tr>
              <tr >
                <td >K-nearest neighbors</td>
                <td>The k-nearest neighbors algorithm (k-NN) is a non-parametric method used for classification and regression. In both cases, the input consists of the k closest training examples in the feature space.</td>
              </tr>
              <tr >
                <td >Support vector</td>
                <td>Support-vector machines (SVMs, also support-vector networks) are supervised learning models with associated learning algorithms that analyze data used for classification and regression analysis. Given a set of training examples, each marked as belonging to one or the other of two categories, an SVM training algorithm builds a model that assigns new examples to one category or the other, making it a non-probabilistic binary linear classifier.</td>
              </tr>
              <tr>
                <td >Decision tree</td>
                <td>A decision tree is a decision support tool that uses a tree-like graph or model of decisions and their possible consequences, including chance event outcomes, resource costs, and utility. It is one way to display an algorithm that only contains conditional control statements.</td>
              </tr>
              <tr >
                <td >XGBoost</td>
                <td>XGBoost is an open-source software library which provides a gradient boosting framework.</td>
              </tr>
              <tr >
                <td >Naive Bayes</td>
                <td>Naive Bayes classifiers are a family of simple "probabilistic classifiers" based on applying Bayes' theorem with strong (naive) independence assumptions between the features.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    );

  } else if (module == 'clustering') {
    widgetInfo =
    {
      name: "Unsupervised learning",
      description: "This section allows developers to use artificial intelligence techniques to analyze and cluster unlabeled datasets."
    }
    var tip = ""
    return (

      <div id="widget_desc">
        <h2>{widgetInfo.name}</h2>
        <p>{widgetInfo.description}</p>
        <div id="result_" >
          <p>{tip}</p>
          <table id="customers">
          <thead>
            <tr>
              <th >Method</th>
              <th >Description</th>
            </tr>
          </thead>
          <tbody>
            {/* <tr >
              <td >DB Scan</td>
              <td>Density-based spatial clustering of applications with noise (DBSCAN) is a data clustering algorithm proposed by Martin Ester, Hans-Peter Kriegel, Jörg Sander and Xiaowei Xu in 1996. It is a density-based clustering non-parametric algorithm: given a set of points in some space, it groups together points that are closely packed together (points with many nearby neighbors), marking as outliers points that lie alone in low-density regions (whose nearest neighbors are too far away). DBSCAN is one of the most common clustering algorithms and also most cited in scientific literature.</td>
            </tr> */}
            <tr >
              <td>K-Means</td>
              <td>k-means clustering is a method of vector quantization, originally from signal processing, that aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean (cluster centers or cluster centroid), serving as a prototype of the cluster. </td>
            </tr>
          </tbody>
        </table>
        </div>



      </div>
    );
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