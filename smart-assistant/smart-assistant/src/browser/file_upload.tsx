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
import { ChangeEvent, useState } from 'react';

function FileUploadSingle() {
  console.log(React)
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <div>{file && `${file.name} - ${file.type}`}</div>

      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}

export default FileUploadSingle;



// retrieveDeployedServices(){
//   //ToDO : statisc services exported from DB
//   var i: any = 0
//   for (i in Services) {
//     if (Services[i].deployable) {
//       this.deployed_services.push({
//         label: Services[i].name,
//         value: Services[i].git_credentials_id,
//       });
//     }
//   }
// }