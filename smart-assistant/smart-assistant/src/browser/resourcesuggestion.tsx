/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

interface suggestionItem {
  user_volume: string;
  space: string;
  memory: string;
}
interface serviceInfo {
  id: string;
  name: string;
}

interface serviceSuggestionInfo {
  header: string;
  service: serviceInfo;
  environments: suggestionItem[];
}

export default class Resourcesuggestion {

  servicesuggestions: serviceSuggestionInfo;

  constructor(servicesuggestions: serviceSuggestionInfo) {
    this.servicesuggestions = servicesuggestions;
  }

  //Get Reusability for chart
  getSuggestions() {

    var table = '', rows = '', th = '', serviceName = '';
    th = "<tr><th>User Volume</th><th>Space</th><th>Memory</th></tr>"
    for (var json of this.servicesuggestions.environments) {
      rows += "<tr>" +
        "<td>" + json.user_volume + "</td>" +
        "<td>" + json.space + "</td>" +
        "<td>" + json.memory + "</td>" + "</tr>";
    }
    serviceName = '<center><div ><label>Service Name <b> ' + this.servicesuggestions.service.name + '</b> </label></div></center>'
    table = serviceName + '</br><center><table id="resource_info">' + th + rows + '</table></center>';
    return table;
  }

}