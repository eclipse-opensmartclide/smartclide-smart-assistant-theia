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

class ModelsInfo {
  suppervised_classifiers = ['bayes', 'random-forest', 'gradient-boosting', 'logistic', 'mlp', 'neighbors', 'sv', 'tree']

  supervised_model_list = [{
    method: "bayes",
    name: "Naive Bayes",
    Desc: "Naive Bayes classifiers are a family of simple 'probabilistic classifiers' based on applying Bayes' theorem with strong (naive) independence assumptions between the features."
  },
  {
    method: "random-forest",
    name: "Random forest",
    Desc: "Random forest, like its name implies, consists of a large number of individual decision trees that operate as an ensemble. Each individual tree in the random forest spits out a class prediction and the class with the most votes becomes our model’s prediction."
  },
  {
    method: "",
    name: "Gradient boosting",
    Desc: "Gradient boosting is a machine learning technique for regression and classification problems, which produces a prediction model in the form of an ensemble of weak prediction models, typically decision trees. It builds the model in a stage-wise fashion like other boosting methods do, and it generalizes them by allowing optimization of an arbitrary differentiable loss function."
  },
  {
    method: "",
    name: "Logistic regression",
    Desc: "The logistic model (or logit model) is used to model the probability of a certain class or event existing such as pass/fail, win/lose, alive/dead or healthy/sick. This can be extended to model several classes of events such as determining whether an image contains a cat, dog, lion, etc... Each object being detected in the image would be assigned a probability between 0 and 1 and the sum adding to one."
  },
  {
    method: "mlp",
    name: "Multi-layer perceptron",
    Desc: "A Multilayer perceptron (MLP) is a class of feedforward artificial neural network. An MLP consists of at least three layers of nodes: an input layer, a hidden layer and an output layer. Except for the input nodes, each node is a neuron that uses a nonlinear activation function. MLP utilizes a supervised learning technique called backpropagation for training. Its multiple layers and non-linear activation distinguish MLP from a linear perceptron. It can distinguish data that is not linearly separable."
  },
  {
    method: "neighbors",
    name: "K-nearest neighbors",
    Desc: "The k-nearest neighbors algorithm (k-NN) is a non-parametric method used for classification and regression. In both cases, the input consists of the k closest training examples in the feature space."
  },
  {
    method: "sv",
    name: "Support vector",
    Desc: "Support-vector machines (SVMs, also support-vector networks) are supervised learning models with associated learning algorithms that analyze data used for classification and regression analysis. Given a set of training examples, each marked as belonging to one or the other of two categories, an SVM training algorithm builds a model that assigns new examples to one category or the other, making it a non-probabilistic binary linear classifier."
  },
  {
    method: "tree",
    name: "Decision tree",
    Desc: "A decision tree is a decision support tool that uses a tree-like graph or model of decisions and their possible consequences, including chance event outcomes, resource costs, and utility. It is one way to display an algorithm that only contains conditional control statements."
  },
  {
    method: "gradient-boosting",
    name: "XGBoost",
    Desc: "XGBoost is an open-source software library which provides a gradient boosting framework."
  },
  {
    method: "linear",
    name: "Linear regression",
    Desc: "Linear regression is a linear approach to modeling the relationship between a scalar response (or dependent variable) and one or more explanatory variables (or independent variables).    "
  },
  {
    method: "extra-trees",
    name: "Extra trees regression",
    Desc: "Extra trees (short for extremely randomized trees) is an ensemble supervised machine learning method that uses decision trees and is used by the Train Using AutoML tool. This method is similar to random forests but can be faster.  The extra trees algorithm, like the random forests algorithm, creates many decision trees, but the sampling for each tree is random, without replacement."
  },
  ];

  unsupervised_model_list = [{
    method: "dbscan",
    name: "DB Scan",
    Desc: "Density-based spatial clustering of applications with noise (DBSCAN) is a data clustering algorithm proposed by Martin Ester, Hans-Peter Kriegel, Jörg Sander and Xiaowei Xu in 1996. It is a density-based clustering non-parametric algorithm: given a set of points in some space, it groups together points that are closely packed together (points with many nearby neighbors), marking as outliers points that lie alone in low-density regions (whose nearest neighbors are too far away). DBSCAN is one of the most common clustering algorithms and also most cited in scientific literature."
  },
  {
    method: "kmeans",
    name: "k-means",
    Desc: "k-means clustering is a method of vector quantization, originally from signal processing, that aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean (cluster centers or cluster centroid), serving as a prototype of the cluster. "
  },



  
  ];

  get_supervised_model_desc(input_method: string) {
    var def_obj = {
      method: "-",
      name: "-",
      Desc: "--"
    }

    var obj = this.supervised_model_list;
    for (var i = 0; i < this.supervised_model_list.length; i++) {
      if (obj[i].method === input_method) {
        def_obj = obj[i];
      }
    }
    return def_obj;
  }

  get_un_supervised_model_desc(input_method: string) {
    var def_obj = {
      method: "-",
      name: "-",
      Desc: "--"
    }

    var obj = this.unsupervised_model_list;
    for (var i = 0; i < this.unsupervised_model_list.length; i++) {
      if (obj[i].method === input_method) {
        def_obj = obj[i];
      }
    }
    return def_obj;
  }

  create_classifier_table() {
    var row = "";
    var obj = this.supervised_model_list;
    var table = '<table class="table border"><thead> <tr><th class="one-line">Name</th><th class="one-line">Description</th></tr></thead><tbody>';
    for (var i = 0; i < 4; i++) {
      row = '<tr class="clickable-row"><td class="bold one-line">' + obj[i].name + '</td><td> ' + obj[i].Desc + '</td></tr>';
      table = table + row;
    }
    table = table + "</tbody></table>";
    return table;
  }
}

export default ModelsInfo;
