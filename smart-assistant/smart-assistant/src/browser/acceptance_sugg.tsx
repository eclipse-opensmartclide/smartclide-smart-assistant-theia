
/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/
export default class Acceptancesuggestion {

  acceptance_suggestions: string;
    
  constructor(acceptance_suggestions: string) {
      this.acceptance_suggestions = acceptance_suggestions;
  }

  //Get Reusability for chart
  getSuggestions(){

   var  table='' , rows = '', th='';
   th="<tr><th>Acceptance test</th></tr>"   ;
   var res_print=this.acceptance_suggestions.replace(/\n/g, "<br/>");
   rows += "<tr>"+"<td>"+res_print+"</td>"+"</tr>";
    table='</br><center><table id="resource_info">'+th+rows+'</table></center>';
    return table;
  }

}




